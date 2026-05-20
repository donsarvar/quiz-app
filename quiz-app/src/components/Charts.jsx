import React from 'react';
import { PieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const DoughnutChart = ({ data, percentage }) => {
  return (
    <div style={{ width: '100%', height: '220px', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2rem', color: percentage >= 60 ? 'hsl(var(--success))' : 'hsl(var(--destructive))', margin: 0 }}>
          {percentage}%
        </h2>
      </div>
    </div>
  );
};

export const BarChart = ({ data }) => {
  return (
    <div style={{ width: '100%', height: '220px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
          />
          <Bar dataKey="Togri" name="To'g'ri (%)" stackId="a" fill="hsl(var(--success))" radius={[0, 0, 4, 4]} />
          <Bar dataKey="Xato" name="Xato (%)" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
