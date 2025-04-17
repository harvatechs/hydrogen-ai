
import React, { useEffect, useRef } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface DiagramData {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  xAxisKey?: string;
  series: Array<{
    name: string;
    dataKey: string;
    color: string;
  }>;
  title?: string;
  subtitle?: string;
}

interface DiagramRendererProps {
  data: DiagramData;
  height?: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28', '#FF8042'];

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ data, height = 300 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate chart on mount
    if (containerRef.current) {
      containerRef.current.style.opacity = '0';
      containerRef.current.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.opacity = '1';
          containerRef.current.style.transform = 'translateY(0)';
        }
      }, 100);
    }
  }, []);

  const renderChart = () => {
    switch (data.type) {
      case 'line':
        return (
          <LineChart data={data.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey={data.xAxisKey} stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            {data.series.map((s, index) => (
              <Line 
                key={s.name} 
                type="monotone" 
                dataKey={s.dataKey} 
                name={s.name} 
                stroke={s.color || COLORS[index % COLORS.length]} 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );
        
      case 'bar':
        return (
          <BarChart data={data.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey={data.xAxisKey} stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            {data.series.map((s, index) => (
              <Bar 
                key={s.name} 
                dataKey={s.dataKey} 
                name={s.name} 
                fill={s.color || COLORS[index % COLORS.length]} 
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
        
      case 'pie':
        return (
          <PieChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Pie
              data={data.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={data.series[0].dataKey}
              nameKey={data.xAxisKey}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={data.series[0].color || COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
          </PieChart>
        );
        
      case 'area':
        return (
          <AreaChart data={data.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey={data.xAxisKey} stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            {data.series.map((s, index) => (
              <Area 
                key={s.name} 
                type="monotone" 
                dataKey={s.dataKey} 
                name={s.name} 
                stroke={s.color || COLORS[index % COLORS.length]} 
                fill={s.color || COLORS[index % COLORS.length]}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );
        
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="chat-diagram" 
      style={{
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      {(data.title || data.subtitle) && (
        <div className="text-center mb-4">
          {data.title && <h4 className="text-lg font-medium text-gemini-yellow mb-1">{data.title}</h4>}
          {data.subtitle && <p className="text-sm text-muted-foreground">{data.subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
