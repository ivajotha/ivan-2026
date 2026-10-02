import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';


export const CarrerasChart: React.FC = () => {
  
  const data = [
    { name: 'Juan', victorias: 200, color: '#e74c3c' },
    { name: 'Miguel', victorias: 2, color: '#3498db' },
    
    { name: 'Angela', victorias: 40, color: '#2ecc71' },
    { name: 'Arnulfo', victorias: 46, color: '#f1c40f' },
    { name: 'Esteban', victorias: 3, color: '#9b59b6' },
    { name: 'Maria', victorias: 200, color: '#95a5a6' },
  ];

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} domain={[0, 3]} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => [`${value} victorias`, 'Resultado']} />
          <Bar dataKey="victorias">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
