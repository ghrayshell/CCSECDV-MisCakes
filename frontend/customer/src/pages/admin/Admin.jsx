import { useState } from "react";
import {
  Home,
  Users,
  ClipboardList,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Add useNavigate for routing
import AssignRolesPage from '../../components/assignRoles/AssignRoles.jsx';
import { useAuth } from "../../context/AuthProvider.jsx"; 

const navItems = [
  { name: "View Dashboard", icon: Home },
  { name: "Manage Users", icon: Users },
  { name: "View All Orders", icon: ClipboardList },
  { name: "Assign Roles", icon: ShieldCheck },
];

const Dashboard = () => <div className="p-4">📊 Orders, Users, Activity</div>;
const ManageUsers = () => <div className="p-4">👥 List, Suspend/Delete Users</div>;
const AllOrders = () => <div className="p-4">📦 All Customer Orders</div>;
const AssignRoles = () => <div className="p-4"><AssignRolesPage></AssignRolesPage></div>;

export default function AdminDashboard() {
  const [active, setActive] = useState("View Dashboard");
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate(); // Hook to navigate

  const renderContent = () => {
    switch (active) {
      case "View Dashboard":
        return <Dashboard />;
      case "Manage Users":
        return <ManageUsers />;
      case "View All Orders":
        return <AllOrders />;
      case "Assign Roles":
        return <AssignRoles />;
      default:
        return null;
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:4000/logout', { 
        method: 'GET', 
        credentials: 'include' // to send the session cookie
      });
  
      if (res.ok) {
        // Redirect to home or login page after logging out
        navigate('/'); // Or use React Router's navigate() if needed
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-pink-100 p-4 shadow-lg">
        <h2 className="text-xl font-bold text-pink-800 mb-6">🍰 Cake Admin</h2>
        <nav className="space-y-2">
          {navItems.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActive(name)}
              className={`flex items-center gap-2 px-3 py-2 w-full text-left rounded-lg hover:bg-pink-200 transition ${
                active === name ? "bg-pink-300 font-semibold" : ""
              }`}
            >
              <Icon className="w-5 h-5" /> {name}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 w-full text-left mt-6 text-red-600 hover:bg-pink-200 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" /> Log Out
        </button>
      </aside>
      <main className="flex-1 bg-white p-6">
        <h1 className="text-2xl font-bold text-pink-700 mb-4">{active}</h1>
        <div className="rounded-xl bg-pink-50 p-4 shadow-inner">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}