import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import Swal from 'sweetalert2';
import { api } from '../lib/api';

export default function Production() {
  const [entries, setEntries] = useState([]);
  const [materialsOptions, setMaterialsOptions] = useState([{ value: '', label: 'Select Material' }]);
  const today = new Date().toISOString().split('T')[0];
  
  // Add Form State
  const [addFormData, setAddFormData] = useState({
    date: today,
    material: '',
    quantity: ''
  });

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    material: '',
    quantity: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [logs, materials] = await Promise.all([
        api.get('/production'),
        api.get('/materials')
      ]);
      setEntries(logs);
      setMaterialsOptions([{ value: '', label: 'Select Material' }, ...materials.map(m => ({ value: m.name, label: m.name }))]);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  }

  const handleAddChange = (e) => {
    setAddFormData({ ...addFormData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addFormData.material || !addFormData.quantity || !addFormData.date) {
      Swal.fire({ title: 'Error', text: 'All fields are required!', icon: 'error', customClass: { popup: 'rounded-2xl' }});
      return;
    }
    
    try {
      const payload = {
        date: addFormData.date,
        material: addFormData.material,
        quantity: Number(addFormData.quantity)
      };
      
      const newEntry = await api.post('/production', payload);
      setEntries([newEntry, ...entries]);
      setAddFormData({ date: today, material: '', quantity: '' });
      Swal.fire({ title: 'Added!', text: 'Production logged successfully.', icon: 'success', customClass: { popup: 'rounded-2xl' }});
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Failed to log production.', icon: 'error', customClass: { popup: 'rounded-2xl' }});
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.material || !editFormData.quantity || !editFormData.date) {
      Swal.fire({ title: 'Error', text: 'All fields are required!', icon: 'error', customClass: { popup: 'rounded-2xl' }});
      return;
    }

    try {
      const payload = {
        date: editFormData.date,
        material: editFormData.material,
        quantity: Number(editFormData.quantity)
      };

      await api.put(`/production/${editingId}`, payload);
      setEntries(entries.map(entry => entry.id === editingId ? { ...payload, id: editingId } : entry));
      
      setIsModalOpen(false);
      Swal.fire({ title: 'Updated!', text: 'Production log updated successfully.', icon: 'success', customClass: { popup: 'rounded-2xl' }});
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Failed to update production log.', icon: 'error', customClass: { popup: 'rounded-2xl' }});
    }
  };

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
          await api.delete(`/production/${id}`);
          setEntries(entries.filter(e => e.id !== id));
          Swal.fire({ title: 'Deleted!', text: 'Entry has been deleted.', icon: 'success', customClass: { popup: 'rounded-2xl' }});
        } catch (error) {
          Swal.fire({ title: 'Error', text: 'Failed to delete entry.', icon: 'error', customClass: { popup: 'rounded-2xl' }});
        }
      }
    });
  };

  const openEditModal = (entry) => {
    setEditingId(entry.id);
    setEditFormData({
      date: entry.date,
      material: entry.material,
      quantity: entry.quantity
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Production Entry</h2>
        <p className="text-slate-500 mt-1">Log daily material production. Stock will update automatically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>New Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <Input 
                type="date" 
                label="Date" 
                name="date"
                value={addFormData.date}
                onChange={handleAddChange}
                required
              />
              <Select 
                label="Material" 
                name="material"
                options={materialsOptions} 
                value={addFormData.material}
                onChange={handleAddChange}
                required
              />
              <Input 
                type="number" 
                label="Quantity (Tons)" 
                name="quantity"
                placeholder="e.g. 150" 
                value={addFormData.quantity}
                onChange={handleAddChange}
                required
              />
              <Button type="submit" className="w-full mt-2 flex justify-center gap-2">
                <Plus size={18} />
                Add Production
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Production Logs</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead className="text-right">Quantity Produced</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {entries.length > 0 ? (
                  entries.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.date).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell className="font-medium text-slate-800">{entry.material}</TableCell>
                      <TableCell className="text-right font-semibold text-blue-700">
                        +{entry.quantity} Tons
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Edit"
                            onClick={() => openEditModal(entry)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Delete"
                            onClick={() => handleDelete(entry.id)}
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
                      No production logs found.
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Edit Production Log"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input 
            type="date" 
            label="Date" 
            name="date"
            value={editFormData.date}
            onChange={handleEditChange}
            required
          />
          <Select 
            label="Material" 
            name="material"
            options={materialsOptions} 
            value={editFormData.material}
            onChange={handleEditChange}
            required
          />
          <Input 
            type="number" 
            label="Quantity (Tons)" 
            name="quantity"
            value={editFormData.quantity}
            onChange={handleEditChange}
            required
          />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save size={18} />
              Update Log
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
