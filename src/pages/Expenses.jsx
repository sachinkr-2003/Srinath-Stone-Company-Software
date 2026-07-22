

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import Swal from 'sweetalert2';
import { api } from '../lib/api';

const expenseCategories = [
  { value: '', label: 'Select Category' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Labour', label: 'Labour' },
  { value: 'Machine Repair', label: 'Machine Repair' },
  { value: 'Electricity', label: 'Electricity' },
  { value: 'Miscellaneous', label: 'Miscellaneous' },
];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  const [addFormData, setAddFormData] = useState({
    date: today,
    category: '',
    amount: '',
    description: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    category: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    try {
      const data = await api.get('/expenses');
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
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
    if (!addFormData.category || !addFormData.amount || !addFormData.date) {
      Swal.fire({ title: 'Error', text: 'Date, Category, and Amount are required!', icon: 'error', customClass: { popup: 'rounded-2xl' }});
      return;
    }
    
    try {
      const payload = {
        date: addFormData.date,
        category: addFormData.category,
        amount: Number(addFormData.amount),
        description: addFormData.description
      };
      
      const newExpense = await api.post('/expenses', payload);
      setExpenses([newExpense, ...expenses]);
      setAddFormData({ date: today, category: '', amount: '', description: '' });
      Swal.fire({ title: 'Added!', text: 'Expense logged successfully.', icon: 'success', customClass: { popup: 'rounded-2xl' }});
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Failed to add expense.', icon: 'error', customClass: { popup: 'rounded-2xl' }});
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.category || !editFormData.amount || !editFormData.date) {
      Swal.fire({ title: 'Error', text: 'Date, Category, and Amount are required!', icon: 'error', customClass: { popup: 'rounded-2xl' }});
      return;
    }

    try {
      const payload = {
        date: editFormData.date,
        category: editFormData.category,
        amount: Number(editFormData.amount),
        description: editFormData.description
      };

      await api.put(`/expenses/${editingId}`, payload);
      setExpenses(expenses.map(exp => exp.id === editingId ? { ...payload, id: editingId } : exp));
      
      setIsModalOpen(false);
      Swal.fire({ title: 'Updated!', text: 'Expense log updated successfully.', icon: 'success', customClass: { popup: 'rounded-2xl' }});
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Failed to update expense.', icon: 'error', customClass: { popup: 'rounded-2xl' }});
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
          await api.delete(`/expenses/${id}`);
          setExpenses(expenses.filter(e => e.id !== id));
          Swal.fire({ title: 'Deleted!', text: 'Expense has been deleted.', icon: 'success', customClass: { popup: 'rounded-2xl' }});
        } catch (error) {
          Swal.fire({ title: 'Error', text: 'Failed to delete expense.', icon: 'error', customClass: { popup: 'rounded-2xl' }});
        }
      }
    });
  };

  const openEditModal = (exp) => {
    setEditingId(exp.id);
    setEditFormData({
      date: exp.date,
      category: exp.category,
      amount: exp.amount,
      description: exp.description
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Expense Management</h2>
        <p className="text-slate-500 mt-1">Track and log all daily expenses of the plant.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Add Expense</CardTitle>
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
                label="Category" 
                name="category"
                options={expenseCategories} 
                value={addFormData.category}
                onChange={handleAddChange}
                required
              />
              <Input 
                type="number" 
                label="Amount (₹)" 
                name="amount"
                placeholder="e.g. 5000" 
                value={addFormData.amount}
                onChange={handleAddChange}
                required
              />
              <Input 
                type="text" 
                label="Description" 
                name="description"
                placeholder="Brief note about the expense" 
                value={addFormData.description}
                onChange={handleAddChange}
              />
              <Button type="submit" className="w-full mt-2 flex justify-center gap-2">
                <Plus size={18} />
                Save Expense
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map(exp => (
                    <TableRow key={exp.id}>
                      <TableCell>{new Date(exp.date).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell>
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-sm font-medium">
                          {exp.category}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">{exp.description || '-'}</TableCell>
                      <TableCell className="text-right font-semibold text-rose-600">
                        -₹{exp.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Edit"
                            onClick={() => openEditModal(exp)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Delete"
                            onClick={() => handleDelete(exp.id)}
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
                      No expenses found.
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
        title="Edit Expense"
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
            label="Category" 
            name="category"
            options={expenseCategories} 
            value={editFormData.category}
            onChange={handleEditChange}
            required
          />
          <Input 
            type="number" 
            label="Amount (₹)" 
            name="amount"
            value={editFormData.amount}
            onChange={handleEditChange}
            required
          />
          <Input 
            type="text" 
            label="Description" 
            name="description"
            value={editFormData.description}
            onChange={handleEditChange}
          />
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save size={18} />
              Update Expense
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
