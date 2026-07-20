import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import Swal from 'sweetalert2';
import { api } from '../lib/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    gst: '',
    pending: 0
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/customers');
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      Swal.fire({ title: 'Error', text: 'Failed to load customers', icon: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.mobile.includes(search)
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
      customClass: { popup: 'rounded-2xl font-sans' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/customers/${id}`);
          setCustomers(customers.filter(c => c.id !== id));
          Swal.fire({ title: 'Deleted!', text: 'Customer has been deleted.', icon: 'success', customClass: { popup: 'rounded-2xl font-sans' } });
        } catch (error) {
          Swal.fire({ title: 'Error', text: 'Failed to delete customer.', icon: 'error', customClass: { popup: 'rounded-2xl font-sans' } });
        }
      }
    });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', mobile: '', address: '', gst: '', pending: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingId(customer.id);
    setFormData(customer);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      Swal.fire({ title: 'Error', text: 'Name and Mobile are required!', icon: 'error', customClass: { popup: 'rounded-2xl' } });
      return;
    }

    try {
      if (editingId) {
        await api.put(`/customers/${editingId}`, formData);
        setCustomers(customers.map(c => c.id === editingId ? { ...formData, id: editingId, pending: Number(formData.pending) } : c));
        Swal.fire({ title: 'Updated!', text: 'Customer updated successfully.', icon: 'success', customClass: { popup: 'rounded-2xl' } });
      } else {
        const response = await api.post('/customers', formData);
        const newCustomer = { ...formData, id: response.id || Date.now(), pending: Number(formData.pending) };
        setCustomers([newCustomer, ...customers]);
        Swal.fire({ title: 'Added!', text: 'Customer added successfully.', icon: 'success', customClass: { popup: 'rounded-2xl' } });
      }
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Failed to save customer.', icon: 'error', customClass: { popup: 'rounded-2xl' } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Customers</h2>
          <p className="text-slate-500 mt-1">Manage your customer database and pending balances.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={openAddModal}>
          <Plus size={18} />
          Add Customer
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search by name or mobile..." 
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
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>GST No.</TableHead>
                <TableHead className="text-right">Pending</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-semibold text-slate-800">{customer.name}</TableCell>
                    <TableCell>{customer.mobile}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{customer.address || '-'}</TableCell>
                    <TableCell>{customer.gst || <span className="text-slate-400 text-sm">N/A</span>}</TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={customer.pending > 0 ? 'text-red-600' : 'text-slate-600'}>
                        ₹{customer.pending.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Edit"
                          onClick={() => openEditModal(customer)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Delete"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No customers found.
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
        title={editingId ? "Edit Customer" : "Add New Customer"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Customer Name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            autoFocus
          />
          <Input 
            label="Mobile Number" 
            name="mobile" 
            value={formData.mobile} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Address" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="GST Number (Optional)" 
              name="gst" 
              value={formData.gst} 
              onChange={handleChange} 
            />
            <Input 
              label="Pending Amount (₹)" 
              name="pending" 
              type="number"
              value={formData.pending} 
              onChange={handleChange} 
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save size={18} />
              {editingId ? "Update" : "Save"} Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
