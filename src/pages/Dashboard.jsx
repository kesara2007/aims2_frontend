// pages/Dashboard.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div style={{ 
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(to right, #d7ccc8, #efebe9)"
    }}>
      <Sidebar />
      <div style={{ 
        flex: 1,
        padding: "30px",
        backgroundImage: "url('https://cdn.pixabay.com/photo/2016/10/22/01/54/wood-1759566_1280.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}>
        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: "10px",
          padding: "25px",
          minHeight: "calc(100vh - 110px)",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;