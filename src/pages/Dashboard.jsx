
import api from '../api/apiClient.js';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [state, setState] = useState({ users: 0, roles: 0, permissions: 0, loading: true, error: null });
  const navigate = useNavigate();

  async function load() {
    try {
      setState(s => ({ ...s, loading: true }));
      const [u, r, p] = await Promise.all([api.get('/user'), api.get('/role'), api.get('/permission')]);
      setState({
        users: Array.isArray(u.data) ? u.data.length : (u.data.total || 0),
        roles: Array.isArray(r.data) ? r.data.length : (r.data.total || 0),
        permissions: Array.isArray(p.data) ? p.data.length : (p.data.total || 0),
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('dashboard', err);
      if (err?.response?.status === 403) {
        navigate('/user-profile', { replace: true });
        return;
      }
      setState(s => ({ ...s, loading: false, error: 'Failed to load counts' }));
    }
  }

  useEffect(() => { load() }, []);

  // Data for charts
  const chartData = [
    { name: 'Users', value: state.users },
    { name: 'Roles', value: state.roles },
    { name: 'Permissions', value: state.permissions }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {state.loading ? (
        <div>Loading…</div>
      ) : state.error ? (
        <div className="text-red-600">{state.error}</div>
      ) : (
   
<>
<div className="grid grid-cols-3 gap-6 mb-8">
  {/* Users Box */}
  <div className="p-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center">
    <div className="text-sm opacity-80">Users</div>
    <div className="text-3xl font-bold mb-2 text-yellow-300">{state.users}</div>
    <img
      src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      alt="Users"
      className="w-16 h-16"
    />
  </div>

  {/* Roles Box */}
  <div className="p-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center">
    <div className="text-sm opacity-80">Roles</div>
    <div className="text-3xl font-bold mb-2 text-yellow-300">{state.roles}</div>
    <img
      src="https://cdn-icons-png.flaticon.com/512/3065/3065260.png"
      alt="Roles"
      className="w-16 h-16"
    />
  </div>

  {/* Permissions Box */}
  <div className="p-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center">
    <div className="text-sm opacity-80">Permissions</div>
    <div className="text-3xl font-bold mb-2 text-yellow-300">{state.permissions}</div>
    <img
      src="https://cdn-icons-png.flaticon.com/512/1828/1828490.png"
      alt="Permissions"
      className="w-16 h-16"
    />
  </div>
</div>
{/* Charts */}
<div className="grid grid-cols-2 gap-6">
  {/* Bar Chart */}
  <div className="p-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
    <h2 className="text-lg font-semibold mb-4 text-center text-yellow-300">
      Counts Bar Chart
    </h2>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip
          contentStyle={{ backgroundColor: "#1f2937", borderRadius: "8px", color: "#fff" }}
        />
        <Bar dataKey="value" fill="#facc15" /> {/* yellow bars to pop against gradient */}
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Pie Chart */}
  <div className="p-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
    <h2 className="text-lg font-semibold mb-4 text-center text-yellow-300">
      Counts Pie Chart
    </h2>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={["#facc15", "#38bdf8", "#a78bfa"][index % 3]} // yellow, sky-blue, violet
            />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: "white" }} />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

        </>
      )}
    </div>
  );
}
