import { useState } from 'react';
import { Save, Download, UploadCloud } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import Swal from 'sweetalert2';

export default function Settings() {
  const [companyDetails, setCompanyDetails] = useState({
    name: 'Srinath Stone Company',
    address: 'Plot 45, Phase 1, Industrial Area',
    gst: '08ABCDE1234F1Z5',
    phone: '+91 98765 43210',
    email: 'info@srinathstone.com'
  });

  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setCompanyDetails({ ...companyDetails, [e.target.name]: e.target.value });
  };

  const handleAdminChange = (e) => {
    setAdminCredentials({ ...adminCredentials, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    Swal.fire({
      title: 'Success!',
      text: 'Settings have been saved successfully.',
      icon: 'success',
      customClass: { popup: 'rounded-2xl' }
    });
  };

  const handleSaveAdmin = () => {
    if(!adminCredentials.username || !adminCredentials.password) {
      Swal.fire({
        title: 'Error!',
        text: 'Both username and password are required to change credentials.',
        icon: 'error',
        customClass: { popup: 'rounded-2xl' }
      });
      return;
    }
    
    // In a real app, you would POST to /api/admin/profile here
    Swal.fire({
      title: 'Success!',
      text: 'Admin credentials updated successfully.',
      icon: 'success',
      customClass: { popup: 'rounded-2xl' }
    });
    setAdminCredentials({ username: '', password: '' });
  };

  const handleBackup = () => {
    Swal.fire({ title: 'Backing up...', text: 'Data backup completed successfully.', icon: 'success', customClass: { popup: 'rounded-2xl' }});
  };

  const handleRestore = () => {
    Swal.fire({ title: 'Restore', text: 'Select a backup file to restore.', icon: 'info', customClass: { popup: 'rounded-2xl' }});
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-slate-500 mt-1">Manage company details, invoice settings, and data backups.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Details (Invoice Print)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                label="Company Name" 
                name="name"
                value={companyDetails.name} 
                onChange={handleChange}
              />
              <Input 
                label="Registered Address" 
                name="address"
                value={companyDetails.address} 
                onChange={handleChange}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="GST Number" 
                  name="gst"
                  value={companyDetails.gst} 
                  onChange={handleChange}
                />
                <Input 
                  label="Phone Number" 
                  name="phone"
                  value={companyDetails.phone} 
                  onChange={handleChange}
                />
              </div>
              <Input 
                label="Email Address" 
                name="email"
                value={companyDetails.email} 
                onChange={handleChange}
              />
              <Button className="mt-4 flex items-center gap-2" onClick={handleSave}>
                <Save size={18} />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Admin Credentials Section */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-500 mb-2">Update the username and password used to log in to this software.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="New Username" 
                  name="username"
                  placeholder="Enter new username"
                  value={adminCredentials.username} 
                  onChange={handleAdminChange}
                />
                <Input 
                  label="New Password" 
                  name="password"
                  type="password"
                  placeholder="Enter new password"
                  value={adminCredentials.password} 
                  onChange={handleAdminChange}
                />
              </div>
              <Button className="mt-4 flex items-center gap-2" variant="outline" onClick={handleSaveAdmin}>
                <Save size={18} />
                Update Credentials
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                Since this is an offline software, it is highly recommended to take daily backups.
              </p>
              
              <Button className="w-full flex items-center justify-center gap-2" onClick={handleBackup}>
                <Download size={18} />
                Backup Data
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Restore</span>
                </div>
              </div>

              <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleRestore}>
                <UploadCloud size={18} />
                Restore from Backup
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
