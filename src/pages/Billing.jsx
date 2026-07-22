import { useState, useEffect } from 'react';
import { Printer, Save, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui/Table';
import Swal from 'sweetalert2';
import { api } from '../lib/api';

export default function Billing() {
  const today = new Date().toISOString().split('T')[0];
  const [invoices, setInvoices] = useState([]);
  const [billNumber, setBillNumber] = useState(`INV-2026-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`);
  
  const [customersOptions, setCustomersOptions] = useState([{ value: '', label: 'Select Customer' }]);
  const [vehiclesOptions, setVehiclesOptions] = useState([{ value: '', label: 'Select Vehicle' }]);
  const [materialsOptions, setMaterialsOptions] = useState([{ value: '', label: 'Select Material' }]);
  
  const [formData, setFormData] = useState({
    date: today,
    customer: '',
    vehicle: '',
    material: '',
    quantity: '',
    rate: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      const [billsRes, custRes, vehRes, matRes] = await Promise.all([
        api.get('/billing'),
        api.get('/customers'),
        api.get('/vehicles'),
        api.get('/materials')
      ]);
      setInvoices(billsRes);
      setCustomersOptions([{ value: '', label: 'Select Customer' }, ...custRes.map(c => ({ value: c.id, label: c.name }))]);
      setVehiclesOptions([{ value: '', label: 'Select Vehicle' }, ...vehRes.map(v => ({ value: v.id, label: `${v.number} (${v.owner})` }))]);
      setMaterialsOptions([{ value: '', label: 'Select Material' }, ...matRes.map(m => ({ value: m.id, label: m.name }))]);
    } catch (error) {
      console.error('Failed to fetch initial data', error);
    }
  }

  const totalAmount = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.rate) || 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Auto-fill rate when material is selected
    if (e.target.name === 'material') {
      const selectedMat = materialsOptions.find(m => m.value == e.target.value);
      if (selectedMat && selectedMat.label.includes('₹')) {
        const rateMatch = selectedMat.label.match(/₹(\d+)/);
        if (rateMatch) {
          setFormData(prev => ({ ...prev, rate: rateMatch[1] }));
        }
      }
    }
  };

  const handleGenerate = async () => {
    if (!formData.customer || !formData.vehicle || !formData.material || !formData.quantity || !formData.rate) {
      Swal.fire({ title: 'Error', text: 'All fields are required to generate an invoice!', icon: 'error', customClass: { popup: 'rounded-2xl' }});
      return;
    }

    try {
      const payload = {
        invoice_number: billNumber,
        customer_id: formData.customer,
        vehicle_id: formData.vehicle,
        material_id: formData.material,
        quantity: formData.quantity,
        rate: formData.rate,
        total_amount: totalAmount,
        status: 'Paid'
      };
      
      const newInvoice = await api.post('/billing', payload);
      // Fetch latest to get joined names
      fetchInitialData();
      
      Swal.fire({ 
        title: 'Success!', 
        text: `Invoice ${billNumber} generated successfully.`, 
        icon: 'success', 
        confirmButtonText: 'Print Invoice',
        customClass: { popup: 'rounded-2xl' }
      }).then(() => {
        // Reset form
        setFormData({ date: today, customer: '', vehicle: '', material: '', quantity: '', rate: '' });
        setBillNumber(`INV-2026-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`);
      });
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Failed to generate invoice', icon: 'error', customClass: { popup: 'rounded-2xl' }});
    }
  };

  const handlePrint = (billNo) => {
    Swal.fire({ title: 'Printing...', text: `Printing invoice ${billNo}`, icon: 'info', timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-2xl' } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Billing / Invoice Generation</h2>
        <p className="text-slate-500 mt-1">Create new sale invoices and print them instantly.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 h-fit">
          <CardHeader className="bg-slate-50 flex flex-row items-center justify-between border-b border-slate-200">
            <CardTitle>New Invoice</CardTitle>
            <span className="text-sm font-semibold text-slate-500 bg-slate-200 px-3 py-1 rounded-md">
              Bill No: {billNumber}
            </span>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input type="date" label="Date" name="date" value={formData.date} onChange={handleChange} />
              <Select label="Select Customer" name="customer" options={customersOptions} value={formData.customer} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Select Vehicle" name="vehicle" options={vehiclesOptions} value={formData.vehicle} onChange={handleChange} />
              <Select label="Select Material" name="material" options={materialsOptions} value={formData.material} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input 
                type="number" 
                label="Quantity (Tons)" 
                name="quantity"
                placeholder="e.g. 40" 
                value={formData.quantity}
                onChange={handleChange}
              />
              <Input 
                type="number" 
                label="Rate (per Ton)" 
                name="rate"
                placeholder="e.g. 450" 
                value={formData.rate}
                onChange={handleChange}
              />
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount</label>
                <div className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-xl font-bold text-slate-800 h-[42px] flex items-center">
                  ₹{totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => setFormData({...formData, quantity: '', rate: '', customer: '', vehicle: '', material: ''})}>
                Clear
              </Button>
              <Button className="flex items-center gap-2 px-8 py-2.5 text-base" onClick={handleGenerate}>
                <Printer size={18} />
                Generate & Print Invoice
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill No.</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {invoices.length > 0 ? (
                  invoices.map(inv => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-semibold text-slate-800 text-xs">{inv.invoice_number}</TableCell>
                      <TableCell className="text-xs truncate max-w-[120px]">{inv.customer_name || inv.customer_id}</TableCell>
                      <TableCell className="text-right font-bold text-slate-700 text-xs">
                        ₹{(inv.total_amount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <button 
                          onClick={() => handlePrint(inv.invoice_number)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Print Duplicate"
                        >
                          <Printer size={16} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                      No recent invoices.
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
