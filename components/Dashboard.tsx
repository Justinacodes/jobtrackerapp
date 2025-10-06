"use client";

import React from 'react';
import { JobApplication, ApplicationStatus } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  applications: JobApplication[];
}

const COLORS: { [key in ApplicationStatus]: string } = {
  [ApplicationStatus.Applied]: '#60a5fa', // blue-400
  [ApplicationStatus.Interviewing]: '#facc15', // yellow-400
  [ApplicationStatus.Offer]: '#4ade80', // green-400
  [ApplicationStatus.Rejected]: '#f87171', // red-400
};

const Dashboard: React.FC<DashboardProps> = ({ applications }) => {
  const statusCounts = Object.values(ApplicationStatus).map(status => ({
    name: status,
    count: applications.filter(app => app.status === status).length,
  }));

  const totalApplications = applications.length;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statusCounts.map(({ name, count }) => (
          <div key={name} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">{name}</h3>
            <p className="text-3xl font-bold text-slate-900">{count}</p>
          </div>
        ))}
      </div>
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={statusCounts} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
                cursor={{fill: 'rgba(226, 232, 240, 0.5)'}}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ color: '#334155' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {statusCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as ApplicationStatus]} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
