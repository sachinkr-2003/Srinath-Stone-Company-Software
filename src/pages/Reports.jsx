import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { IndianRupee, Factory, Wallet } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Reports</h2>
        <p className="text-slate-500 mt-1">Simple aggregated reports for daily operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-t-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="text-green-600" size={20} />
              Daily Sale Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-600">Total Invoices</span>
                <span className="font-semibold text-slate-800">12</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-600">Total Tonnage Sold</span>
                <span className="font-semibold text-slate-800">450 Tons</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-800 font-bold">Total Amount</span>
                <span className="font-bold text-green-600 text-lg">₹1,85,000</span>
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Detailed Sale Register &rarr;
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="text-blue-600" size={20} />
              Daily Production Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-600">Total Entries</span>
                <span className="font-semibold text-slate-800">8</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-600">Highest Production</span>
                <span className="font-semibold text-slate-800">20 MM (120 Tons)</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-800 font-bold">Total Production</span>
                <span className="font-bold text-blue-600 text-lg">380 Tons</span>
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Production Register &rarr;
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-rose-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="text-rose-600" size={20} />
              Daily Expense Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-600">Total Entries</span>
                <span className="font-semibold text-slate-800">4</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-600">Highest Expense</span>
                <span className="font-semibold text-slate-800">Diesel</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-800 font-bold">Total Expense</span>
                <span className="font-bold text-rose-600 text-lg">₹14,500</span>
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Expense Register &rarr;
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
