import React from 'react';
import { PieChart, Pie, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const ApuestasChart: React.FC = () => {
  const data = [
    { name: 'Ganadas', value: 6, fill: '#2ecc71' },
    { name: 'Perdidas', value: 4, fill: '#e74c3c' },
  ];

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            
            paddingAngle={5}
            dataKey="value"
          />
          <Tooltip formatter={(value) => [`${value} apuestas`, 'Cantidad']} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

