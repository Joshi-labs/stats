"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TempChart() {
  const { data } = useSWR('/api/metrics/temp', fetcher, { refreshInterval: 30000 });

  return (
    <div className="h-[250px] w-[50%] bg-[#22252b] p-4 border border-zinc-800 rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#81818bff" 
            fontSize={12} 
            tickLine={true} 
            axisLine={false}
            interval={25}
          />
          <YAxis 
            stroke="#81818bff" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '4px' }}
            itemStyle={{ color: '#22c55e', fontSize: '12px' }}
            labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
          />
          <Area 
            type="linear"  
            dataKey="temp" 
            stroke="#22c55e" 
            strokeWidth={1.5}
            fillOpacity={1} 
            fill="url(#colorTemp)" 
            isAnimationActive={false} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}