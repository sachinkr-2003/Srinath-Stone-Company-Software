import { Card, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui/Table';

const stockData = [
  { id: 1, material: 'Stone Dust', production: 500, sale: 380, currentStock: 120 },
  { id: 2, material: 'M Sand', production: 300, sale: 255, currentStock: 45 },
  { id: 3, material: '6 MM', production: 200, sale: 120, currentStock: 80 },
  { id: 4, material: '10 MM', production: 400, sale: 250, currentStock: 150 },
  { id: 5, material: '20 MM', production: 600, sale: 400, currentStock: 200 },
  { id: 6, material: '40 MM', production: 150, sale: 85, currentStock: 65 },
];

export default function Stock() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Stock Inventory</h2>
        <p className="text-slate-500 mt-1">Real-time view of current stock based on production and sales.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material Name</TableHead>
                <TableHead className="text-right">Total Production (Tons)</TableHead>
                <TableHead className="text-right">Total Sale (Tons)</TableHead>
                <TableHead className="text-right">Current Stock (Tons)</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {stockData.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-semibold text-slate-800">{item.material}</TableCell>
                  <TableCell className="text-right text-blue-600 font-medium">+{item.production}</TableCell>
                  <TableCell className="text-right text-orange-600 font-medium">-{item.sale}</TableCell>
                  <TableCell className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      item.currentStock < 50 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {item.currentStock} Tons
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
        <div className="text-blue-500 mt-0.5">ℹ️</div>
        <div>
          <h4 className="font-semibold text-blue-800 text-sm">How stock is calculated</h4>
          <p className="text-sm text-blue-700 mt-1">
            Current stock is automatically calculated in real-time. Whenever you add a new entry in <b>Production</b>, the stock increases. Whenever you generate an invoice in <b>Billing</b>, the stock decreases. Manual adjustment is not required.
          </p>
        </div>
      </div>
    </div>
  );
}
