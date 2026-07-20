import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, Factory, Package, Users, Truck, AlertCircle, Wallet } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { api } from '../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    todaysSale: 0,
    todaysProduction: 0,
    currentStock: 0,
    totalCustomers: 0,
    totalVehicles: 0,
    pendingPayments: 0,
    todaysExpense: 0,
    recentSales: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.get('/admin/dashboard');
      if (data) setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    }
  };

  const topStats = [
    { title: "Today's Sale", value: `₹${stats.todaysSale.toLocaleString()}`, icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Today's Production", value: `${stats.todaysProduction} Tons`, icon: Factory, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Current Stock", value: `${stats.currentStock} Tons`, icon: Package, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  const otherStats = [
    { title: "Total Customers", value: stats.totalCustomers, icon: Users, color: "text-slate-600", bg: "bg-slate-50" },
    { title: "Total Vehicles", value: stats.totalVehicles, icon: Truck, color: "text-slate-600", bg: "bg-slate-50" },
    { title: "Pending Payments", value: `₹${stats.pendingPayments.toLocaleString()}`, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
    { title: "Today's Expense", value: `₹${stats.todaysExpense.toLocaleString()}`, icon: Wallet, color: "text-rose-600", bg: "bg-rose-50" },
  ];
  return (
    <div className="space-y-8 max-w-6xl -mt-[20px] relative z-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 mt-1">Daily overview of plant operations.</p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="border-slate-200 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                  <h4 className="text-3xl font-bold text-slate-800">{stat.value}</h4>
                </div>
                <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon size={28} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {otherStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="border-slate-200 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <h4 className="text-xl font-semibold text-slate-800">{stat.value}</h4>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        <Card className="border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Recent Sales</h3>
          </div>
          <div className="p-0">
            <div className="divide-y divide-slate-100">
              {stats.recentSales.length > 0 ? stats.recentSales.map((sale, i) => (
                <div key={i} className="p-4 px-6 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{sale.customer_name}</p>
                    <p className="text-slate-500">{sale.invoice_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">₹{(sale.total_amount || 0).toLocaleString()}</p>
                    <p className="text-slate-500">Today</p>
                  </div>
                </div>
              )) : (
                <div className="p-4 px-6 text-slate-500 text-sm">No recent sales</div>
              )}
            </div>
          </div>
        </Card>
        
        <Card className="border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Quick Actions</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
             <Link to="/billing" className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors group">
               <IndianRupee className="text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" size={24} />
               <span className="text-sm font-medium">New Invoice</span>
             </Link>
             <Link to="/production" className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors group">
               <Factory className="text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" size={24} />
               <span className="text-sm font-medium">Add Production</span>
             </Link>
             <Link to="/customers" className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors group">
               <Users className="text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" size={24} />
               <span className="text-sm font-medium">Add Customer</span>
             </Link>
             <Link to="/expenses" className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors group">
               <Wallet className="text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" size={24} />
               <span className="text-sm font-medium">Add Expense</span>
             </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
