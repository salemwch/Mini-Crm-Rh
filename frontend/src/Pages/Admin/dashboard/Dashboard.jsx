import { useEffect, useState } from 'react';
import { FaUsers, FaBuilding, FaUserTie } from 'react-icons/fa';
import { MdFeedback, MdHowToVote } from 'react-icons/md';
import { getGlobalStatistics } from '../../../service/Dashboard';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { getRecentUsers } from '../../../service/user';
import { getAverageEnterpriseRating, getRecentEnterprises } from '../../../service/interprise';
import { getRecentAuditLogs } from '../../../service/auditLog';
import { getLastFiveJobOffers } from '../../../service/jobOffer';
import AuthHealthStatus from '../Health/AuthHealthStatus';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [jobOffers, setJobOffers] = useState([]);
  const [error, setError] = useState(null);
  const [errorRating, setErrorRating] = useState(null);
const [average, setAverage] = useState(null);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getGlobalStatistics();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  useEffect(() => {
  const fetchRecent = async () => {
    try {
      const recentUsers = await getRecentUsers();
      setRecentUsers(recentUsers);
    } catch (err) {
      console.error("Failed to fetch recent users", err);
    }
  };

  fetchRecent();
}, []);

const [recentEnterprises, setRecentEnterprises] = useState([]);

useEffect(() => {
  const fetchRecentEnterprises = async () => {
    try {
      const data = await getRecentEnterprises(5);
      setRecentEnterprises(data);
    } catch (error) {
      console.error("Failed to fetch recent enterprises:", error);
    }
  };

  fetchRecentEnterprises();
}, []);
const fetchAuditLogs = async () => {
  try {
    const data = await getRecentAuditLogs(5);
    setAuditLogs(data);
  } catch (error) {
    console.error("Failed to fetch recent audit logs", error);
  }
};
useEffect(() => {
  fetchAuditLogs();
}, []);
  const statCards = [
    { key: "totalUsers", title: "Total Users", icon: <FaUsers />, bg: "bg-blue-500" },
    { key: "activeUsers", title: "Active Users", icon: <FaUserTie />, bg: "bg-green-500" },
    { key: "inactiveUsers", title: "Inactive Users", icon: <FaUserTie />, bg: "bg-gray-500" },
    { key: "rhUsers", title: "RH Users", icon: <FaUserTie />, bg: "bg-purple-500" },
    { key: "adminUsers", title: "Admin Users", icon: <FaUserTie />, bg: "bg-indigo-500" },
    { key: "totalEnterprises", title: "Enterprises", icon: <FaBuilding />, bg: "bg-orange-500" },
    { key: "totalContacts", title: "Contacts", icon: <MdFeedback />, bg: "bg-rose-500" },
    { key: "totalFeedbacks", title: "Feedbacks", icon: <MdHowToVote />, bg: "bg-teal-500" },
  ];
 const barData = stats && {
  labels: [
    "Total Users",
    "Active Users",
    "Inactive Users",
    "RH Users",
    "Admin Users",
    "Enterprises",
    "Contacts",
    "Feedbacks"
  ],
  datasets: [
    {
      label: "Dashboard Metrics",
      data: [
        stats.totalUsers,
        stats.activeUsers,
        stats.inactiveUsers,
        stats.rhUsers,
        stats.adminUsers,
        stats.totalEnterprises,
        stats.totalContacts,
        stats.totalFeedbacks
      ],
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "#4f46e5"); 
        gradient.addColorStop(1, "#3b82f6");
        return gradient;
      },
      borderRadius: 12,
      barThickness: 40
    }
  ]
};
const barOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: "#1f2937",
      titleColor: "#fff",
      bodyColor: "#d1d5db",
      borderColor: "#4b5563",
      borderWidth: 1
    }
  },
  scales: {
    x: {
      ticks: {
        color: "#374151",
        font: { size: 12, weight: "500" },
        callback: function (value) {
          const label = this.getLabelForValue(value);
          return label.length > 12 ? label.slice(0, 12) + "…" : label;
        }
      },
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: "#4b5563",
        font: { size: 12 }
      },
      grid: {
        color: "#e5e7eb"
      }
    }
  }
};
  useEffect(() => {
    const fetchJobOffers = async () => {
      try{
        const data = await getLastFiveJobOffers();
        setJobOffers(data);
      }catch(error){
        setError('failed  to load job Offers');
        console.error(error);
      }finally{
        setLoading(false);
      }
    }
    fetchJobOffers();
  }, []);

  useEffect(() => {
    const fetchAverage = async () => {
      try{
        const data = await getAverageEnterpriseRating();
        console.log(data);
        setAverage(data?.average || 0);
      }catch(error){
        console.log("error:", error )
        setErrorRating("failed to fetch average rating");
      }finally{
        setLoading(false);
      }
    }
    fetchAverage();
  }, [])

  return (
    <div className="p-6 space-y-8 min-h-screen bg-zinc-100">
      {stats && (
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 p-3 rounded-lg shadow-sm text-white ${card.bg}`}
          >
            <div className="text-xl">{card.icon}</div>
            <div>
              <h3 className="text-xs opacity-80">{card.title}</h3>
              <p className="text-lg font-semibold">
                {loading ? "..." : stats?.[card.key] ?? "--"}
              </p>
            </div>
          </div>
        ))}
      </section>
)}

<section className="bg-white rounded-xl shadow p-6 w-full overflow-x-auto">
  <h2 className="text-lg font-semibold mb-6">📊 User & Enterprise Insights</h2>
  <div className="overflow-x-auto w-full">
    <div className="min-w-[720px] h-[380px] px-2">
      {barData ? (
        <Bar data={barData} options={barOptions} />
      ) : (
        <div className="flex justify-center items-center h-full text-zinc-400">
          Loading Chart...
        </div>
      )}
    </div>
  </div>
</section>



      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Last 5 Created Users</h2>
          <ul className="space-y-3">
            { recentUsers.length === 0 ? ( [...Array(5)].map((_, i) => (
              <li key={i} className="flex justify-between text-sm text-zinc-700">
                <span>User #{i + 1}</span>
                <span className="text-zinc-400">-- date --</span>
              </li>
            )) 
          ): (
            recentUsers.map((user, i) =>(
               <li key={user._id} className="flex justify-between text-sm text-zinc-700">
          <span>{user.name || `User ${i + 1}`}</span>
          <span className="text-zinc-400">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </li>
            ))
          ) }
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
  <h2 className="text-lg font-semibold mb-4">Last 5 Created Enterprises</h2>
  <ul className="space-y-3">
    {recentEnterprises.length === 0 ? (
      [...Array(5)].map((_, i) => (
        <li key={i} className="text-zinc-400 text-sm">Loading enterprise #{i + 1}...</li>
      ))
    ) : (
      recentEnterprises.map((enterprise) => (
        <li key={enterprise._id} className="flex justify-between text-sm text-zinc-700">
          <span>{enterprise.name}</span>
          <span className="text-zinc-400">
            {new Date(enterprise.createdAt).toLocaleDateString()}
          </span>
        </li>
      ))
    )}
  </ul>
</div>


         <div className="bg-white p-6 rounded-xl shadow text-center">
      <h2 className="text-lg font-semibold mb-2">Health Status</h2>
      <AuthHealthStatus/> 
    </div>

         <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Job Offers</h2>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : jobOffers.length === 0 ? (
        <p className="text-sm text-zinc-400">No job offers available.</p>
      ) : (
        <ul className="space-y-3">
          {jobOffers.map((job, i) => (
            <li
              key={job._id || i}
              className="flex justify-between text-sm text-zinc-700"
            >
              <span>{job.title || `Job #${i + 1}`}</span>
              <span className="text-zinc-400">
                {job.status || "Pending"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>

        <div className="bg-white p-6 rounded-xl shadow">
  <h2 className="text-lg font-semibold mb-4">Recent Audit Logs</h2>
  <ul className="space-y-3 text-sm text-zinc-700">
    {auditLogs.length === 0 ? (
      <p className="text-zinc-400">No audit logs found.</p>
    ) : (
      auditLogs.map((log, i) => (
        <li key={log._id || i} className="flex flex-col space-y-1">
          <span>
            <strong>{log.action}</strong> by{' '}
            <span className="font-semibold">
              {log.userId?.name || 'Unknown User'}
            </span>{' '}
            ({log.userId?.role || 'No role'}) - {log.userId?.email || 'No email'}
          </span>
          <span className="text-zinc-400 text-xs">
            {new Date(log.createdAt).toLocaleString()}
          </span>
        </li>
      ))
    )}
  </ul>
</div>


      </section>
    </div>
  );
};

export default Dashboard;
