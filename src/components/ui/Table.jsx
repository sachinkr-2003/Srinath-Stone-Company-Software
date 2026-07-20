export function Table({ children, className = '' }) {
  return (
    <div className={`w-full overflow-x-auto rounded-lg border border-slate-200 ${className}`}>
      <table className="w-full text-sm text-left text-slate-500">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
      {children}
    </thead>
  );
}

export function TableRow({ children, className = '' }) {
  return (
    <tr className={`bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors ${className}`}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }) {
  return (
    <th scope="col" className={`px-6 py-3 font-semibold ${className}`}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }) {
  return (
    <td className={`px-6 py-4 ${className}`}>
      {children}
    </td>
  );
}
