// components/Sidebar.jsx
import { NavLink } from "react-router-dom";

const Sidebar = () => (
  <div style={{
    backgroundColor: "#5d4037", // Dark brown
    width: "250px",
    minHeight: "80vh",
    padding: "20px 0",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  }}>
    <NavLink 
      to="users"
      style={({ isActive }) => ({
        color: "white",
        textDecoration: "none",
        padding: "12px 20px",
        margin: "0 10px",
        borderRadius: "5px",
        backgroundColor: isActive ? "#8d6e63" : "transparent",
        transition: "all 0.3s ease",
        fontWeight: "500",
        fontSize: "16px",
        '&:hover': {
          backgroundColor: "#8d6e63"
        }
      })}
    >
      Users
    </NavLink>
    <NavLink 
      to="customers"
      style={({ isActive }) => ({
        color: "white",
        textDecoration: "none",
        padding: "12px 20px",
        margin: "0 10px",
        borderRadius: "5px",
        backgroundColor: isActive ? "#8d6e63" : "transparent",
        transition: "all 0.3s ease",
        fontWeight: "500",
        fontSize: "16px"
      })}
    >
      Customers
    </NavLink>
    <NavLink 
      to="appointments"
      style={({ isActive }) => ({
        color: "white",
        textDecoration: "none",
        padding: "12px 20px",
        margin: "0 10px",
        borderRadius: "5px",
        backgroundColor: isActive ? "#8d6e63" : "transparent",
        transition: "all 0.3s ease",
        fontWeight: "500",
        fontSize: "16px"
      })}
    >
      Appointments
    </NavLink>
    <NavLink 
      to="orders"
      style={({ isActive }) => ({
        color: "white",
        textDecoration: "none",
        padding: "12px 20px",
        margin: "0 10px",
        borderRadius: "5px",
        backgroundColor: isActive ? "#8d6e63" : "transparent",
        transition: "all 0.3s ease",
        fontWeight: "500",
        fontSize: "16px"
      })}
    >
      Orders
    </NavLink>
    <NavLink 
      to="items"
      style={({ isActive }) => ({
        color: "white",
        textDecoration: "none",
        padding: "12px 20px",
        margin: "0 10px",
        borderRadius: "5px",
        backgroundColor: isActive ? "#8d6e63" : "transparent",
        transition: "all 0.3s ease",
        fontWeight: "500",
        fontSize: "16px"
      })}
    >
      Items
    </NavLink>
    <NavLink 
      to="/"
      onClick={() => localStorage.clear()}
      style={{
        color: "white",
        textDecoration: "none",
        padding: "12px 20px",
        margin: "0 10px",
        borderRadius: "5px",
        backgroundColor: "#3e2723",
        transition: "all 0.3s ease",
        fontWeight: "500",
        fontSize: "16px",
        marginTop: "auto",
        '&:hover': {
          backgroundColor: "#4e342e"
        }
      }}
    >
      Logout
    </NavLink>
  </div>
);

export default Sidebar;