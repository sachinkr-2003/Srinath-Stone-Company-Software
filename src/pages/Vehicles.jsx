import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import Swal from 'sweetalert2';
import { api } from '../lib/api';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    number: '',
    owner: '',
    driver: '',
    mobile: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await api.get('/vehicles');
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      Swal.fire({ title: 'Error', text: 'Failed to load vehicles', icon: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.number?.toLowerCase().includes(search.toLowerCase()) || 
    v.owner?.toLowerCase().includes(search.toLowerCase()) ||
    v.driver?.toLowerCase().includes(search.toLowerCase())
  );

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
          await api.delete(`/vehicles/${id}`);
          setVehicles(vehicles.filter(v => v.id !== id));
          Swal.fire({ title: 'Deleted!', text: 'Vehicle has been deleted.', icon: 'success', customClass: { popup: 'rounded-2xl' }});
        } catch (error) {
          Swal.fire({ title: 'Error', text: 'Failed to delete vehicle.', icon: 'error', customClass: { popup: 'rounded-2xl' }});
        }
      }
    });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ number: '', owner: '', driver: '', mobile: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingId(vehicle.id);
    setFormData(vehicle);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.number || !formData.owner) {
      Swal.fire({ title: 'Error', text: 'Vehicle Number and Owner are required!', icon: 'error', customClass: { popup: 'rounded-2xl' }});
      return;
    }

    try {
      if (editingId) {
        await api.put(`/vehicles/${editingId}`, formData);
        setVehicles(vehicles.map(v => v.id === editingId ? { ...formData, id: editingId } : v));
        Swal.fire({ title: 'Updated!', text: 'Vehicle updated successfully.', icon: 'success', customClass: { popup: 'rounded-2xl' }});
      } else {
        const response = await api.post('/vehicles', formData);
        const newVehicle = { ...formData, id: response.id || Date.now() };
        setVehicles([newVehicle, ...vehicles]);
        Swal.fire({ title: 'Added!', text: 'Vehicle added successfully.', icon: 'success', customClass: { popup: 'rounded-2xl' }});
      }
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Failed to save vehicle.', icon: 'error', customClass: { popup: 'rounded-2xl' }});
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Vehicles</h2>
          <p className="text-slate-500 mt-1">Manage transport vehicles, owners, and drivers.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={openAddModal}>
          <Plus size={18} />
          Add Vehicle
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search by vehicle number, owner or driver..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Owner Name</TableHead>
                <TableHead>Driver Name</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map(vehicle => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-bold text-slate-800 uppercase">{vehicle.number}</TableCell>
                    <TableCell>{vehicle.owner}</TableCell>
                    <TableCell>{vehicle.driver}</TableCell>
                    <TableCell>{vehicle.mobile || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Edit"
                          onClick={() => openEditModal(vehicle)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Delete"
                          onClick={() => handleDelete(vehicle.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    No vehicles found.
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
        title={editingId ? "Edit Vehicle" : "Add New Vehicle"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Vehicle Number" 
            name="number" 
            value={formData.number} 
            onChange={handleChange} 
            placeholder="e.g. RJ 14 GC 1234"
            required 
            autoFocus
          />
          <Input 
            label="Owner Name" 
            name="owner" 
            value={formData.owner} 
            onChange={handleChange} 
            required 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Driver Name" 
              name="driver" 
              value={formData.driver} 
              onChange={handleChange} 
            />
            <Input 
              label="Driver Mobile" 
              name="mobile" 
              value={formData.mobile} 
              onChange={handleChange} 
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save size={18} />
              {editingId ? "Update" : "Save"} Vehicle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
