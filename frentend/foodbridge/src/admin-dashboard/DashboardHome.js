import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
} from "recharts";
import axios from "axios";

const DashboardHome = () => {
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [ngoStats, setNgoStats] = useState({
    totalNGOs: 0,
    verifiedNGOs: 0,
    unverifiedNGOs: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/admin/analytics/overview", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOverview(res.data))
      .catch((err) => console.error("Overview fetch error:", err));

    axios
      .get("http://localhost:5000/api/admin/analytics/trends?days=14", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTrend(res.data.data || []))
      .catch((err) => console.error("Trends fetch error:", err));

    axios
      .get("http://localhost:5000/api/users/ngo-stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNgoStats(res.data))
      .catch((err) => console.error("NGO stats error:", err));
  }, []);

  const statusData =
    overview?.donationsByStatus?.map((s) => ({ name: s.status, value: s.count })) || [];

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">📊 Admin Dashboard</h2>

      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total NGOs" value={ngoStats.totalNGOs} color="blue" />
        <StatCard title="Verified NGOs" value={ngoStats.verifiedNGOs} color="green" />
        <StatCard title="Unverified NGOs" value={ngoStats.unverifiedNGOs} color="red" />
      </div>

      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SmallStat label="Total Users" value={overview?.totalUsers} />
        <SmallStat label="Donors" value={overview?.totalDonors} />
        <SmallStat label="Blocked Users" value={overview?.blockedUsers} />
        <SmallStat label="Total Donations" value={overview?.totalDonations} />
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Donations by Status</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                  fill="#8884d8"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

       
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Daily Donations (Last 14 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => {
  const bg = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  }[color];

  return (
    <div className={`p-6 rounded-lg shadow ${bg}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl mt-2 font-bold">{value ?? 0}</p>
    </div>
  );
};

const SmallStat = ({ label, value }) => (
  <div className="bg-white shadow p-4 rounded-lg text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-800">{value ?? "—"}</p>
  </div>
);

export default DashboardHome;
