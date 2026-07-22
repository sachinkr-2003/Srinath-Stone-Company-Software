import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import Swal from 'sweetalert2';
import { api } from '../lib/api';

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    stock: ''
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  async function fetchMaterials() {
    try {
      setLoading(true);
      const data = await api.get('/materials');
      setMaterials(data);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
      Swal.fire({ title: 'Error', text: 'Failed to load materials', icon: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      customClass: { popup: 'rounded-2xl' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/materials/${id}`);
          setMaterials(materials.filter(m => m.id !== id));
          Swal.fire({ title: 'Deleted!', text: 'Material has been deleted.', icon: 'success', customClass: { popup: 'rounded-2xl' }});
        } catch (error) {
          Swal.fire({ title: 'Error', text: 'Failed to delete material.', icon: 'error', customClass: { popup: 'rounded-2xl' }});
        }
      }
    });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', rate: '', stock: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (material) => {
    setEditingId(material.id);
    setFormData({
      name: material.name,
      rate: material.rate,
      stock: material.stock
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rate) {
      Swal.fire({ title: 'Error', text: 'Material Name and Rate are required!', icon: 'error', customClass: { popup: 'rounded-2xl' }});
      return;
    }

    try {
      if (editingId) {
        await api.put(`/materials/${editingId}`, formData);
        setMaterials(materials.map(m => m.id === editingId ? { 
          ...m, 
          name: formData.name, 
          rate: Number(formData.rate), 
          stock: Number(formData.stock) 
        } : m));
        Swal.fire({ title: 'Updated!', text: 'Material updated successfully.', icon: 'success', customClass: { popup: 'rounded-2xl' }});
      } else {
        const response = await api.post('/materials', formData);
        const newMaterial = { 
          id: response.id || Date.now(), 
          name: formData.name, 
          rate: Number(formData.rate), 
          stock: Number(formData.stock || 0) 
        };
        setMaterials([...materials, newMaterial]);
        Swal.fire({ title: 'Added!', text: 'Material added successfully.', icon: 'success', customClass: { popup: 'rounded-2xl' }});
      }
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Failed to save material.', icon: 'error', customClass: { popup: 'rounded-2xl' }});
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Materials</h2>
          <p className="text-slate-500 mt-1">Manage company products, rates, and current stock.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={openAddModal}>
          <Plus size={18} />
          Add Material
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material Name</TableHead>
                <TableHead className="text-right">Rate (per Ton)</TableHead>
                <TableHead className="text-right">Current Stock (Tons)</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {materials.length > 0 ? (
                materials.map(material => (
                  <TableRow key={material.id}>
                    <TableCell className="font-semibold text-slate-800">{material.name}</TableCell>
                    <TableCell className="text-right font-medium text-slate-700">₹{material.rate.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        material.stock < 50 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {material.stock} Tons
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Edit"
                          onClick={() => openEditModal(material)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Delete"
                          onClick={() => handleDelete(material.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    No materials found.
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Edit Material" : "Add New Material"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Material Name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="e.g. 20 MM"
            required 
            autoFocus
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Rate (₹ per Ton)" 
              name="rate" 
              type="number"
              value={formData.rate} 
              onChange={handleChange} 
              required 
            />
            <Input 
              label="Current Stock (Tons)" 
              name="stock" 
              type="number"
              value={formData.stock} 
              onChange={handleChange} 
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save size={18} />
              {editingId ? "Update" : "Save"} Material
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
