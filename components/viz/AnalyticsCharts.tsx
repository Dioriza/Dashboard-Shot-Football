import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    PieChart, Pie, Cell
} from 'recharts';

export interface TeamComparisonData { label: string; home: number | string; away: number | string; }
export const TeamComparisonChart = ({ data }: { data: TeamComparisonData[] }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ left: 40, right: 40, top: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide />
                <YAxis
                    dataKey="label"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                    width={100}
                />
                <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{
                        backgroundColor: '#1C1C21',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff'
                    }}
                    itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}
                    labelStyle={{ color: '#94A3B8', fontSize: '10px', marginBottom: '4px', fontWeight: 800, textTransform: 'uppercase' }}
                />
                <Bar dataKey="home" fill="#E90052" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="away" fill="#38003C" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export interface XGTimelineData { name: string; home: number; away: number; }
export const XGTimeline = ({ data }: { data: XGTimelineData[] }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorHome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E90052" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#E90052" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAway" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF85" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00FF85" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 10 }}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 10 }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1C1C21',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                    }}
                    itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}
                    labelStyle={{ color: '#94A3B8', fontSize: '10px', fontWeight: 800 }}
                />
                <Area
                    type="stepAfter"
                    dataKey="home"
                    stroke="#E90052"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorHome)"
                />
                <Area
                    type="stepAfter"
                    dataKey="away"
                    stroke="#00FF85"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAway)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export interface RadarData { subject: string; value: number; compareValue?: number; }
export const PlayerRadar = ({ data, comparisonData }: { data: RadarData[], comparisonData?: RadarData[] }) => {
    if (!data || data.length === 0) return null;

    return (
        <ResponsiveContainer width="100%" height={350}>
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 800 }}
                />
                <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                />

                {/* Primary Player (Teal) */}
                <Radar
                    name="Player 1"
                    dataKey="value"
                    stroke="#00FF85"
                    fill="#00FF85"
                    fillOpacity={0.3}
                    strokeWidth={3}
                    animationDuration={1500}
                />

                {/* Comparison Player (Pink) */}
                {comparisonData && (
                    <Radar
                        name="Player 2"
                        dataKey="compareValue"
                        stroke="#E90052"
                        fill="#E90052"
                        fillOpacity={0.4}
                        strokeWidth={3}
                        animationDuration={1500}
                    />
                )}

                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1C1C21',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                    itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}
                    labelStyle={{ color: '#94A3B8', fontSize: '10px', paddingBottom: '4px' }}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export interface BreakdownData { name: string; value: number; }
export const BreakdownChart = ({ data }: { data: BreakdownData[] }) => {
    const COLORS = ['#E90052', '#38003C', '#0070F3', '#00FF85', '#FFA500', '#888888'];

    return (
        <ResponsiveContainer width="100%" height={300}>
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
                    {data.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1C1C21',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                    }}
                    itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}
                    labelStyle={{ color: '#94A3B8', fontSize: '10px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
            </PieChart>
        </ResponsiveContainer>
    );
};
