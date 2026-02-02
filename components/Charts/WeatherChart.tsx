
import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

interface WeatherChartProps {
  data: any[];
  dataKey: string;
  color: string;
  label: string;
  type?: 'area' | 'bar' | 'line';
}

export const WeatherChart: React.FC<WeatherChartProps> = ({ data, dataKey, color, label, type = 'area' }) => {
  return (
    <div className="h-48 w-full">
      <h4 className="text-xs font-semibold text-white/40 mb-4 uppercase tracking-wider">{label}</h4>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
              itemStyle={{ color }}
            />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#gradient-${dataKey})`} />
          </AreaChart>
        ) : type === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="label" stroke="rgba(255,255,255,0.2)" fontSize={10} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px' }} />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px' }} />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
