import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      alert("Failed to fetch users: " + err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      fetchUsers();
    } catch (err) {
      alert("Delete failed: " + err.response?.data?.message);
    }
  };

  const filteredUsers = users.filter((user) =>
    user[filterBy].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      padding: "30px",
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      margin: "20px"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        borderBottom: "2px solid #8d6e63",
        paddingBottom: "15px"
      }}>
        <h2 style={{ color: "#5d4037", margin: 0 }}>Users Management</h2>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <select 
            onChange={(e) => setFilterBy(e.target.value)} 
            value={filterBy}
            style={{
              padding: "8px 12px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              backgroundColor: "white",
              color: "#5d4037",
              cursor: "pointer"
            }}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
          </select>
          
          <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center"
          }}>
            <FaSearch style={{
              position: "absolute",
              left: "10px",
              color: "#8d6e63"
            }} />
            <input
              type="text"
              placeholder={`Search by ${filterBy}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "8px 12px 8px 35px",
                borderRadius: "5px",
                border: "1px solid #bcaaa4",
                width: "250px",
                color: "#5d4037"
              }}
            />
          </div>
        </div>
      </div>

      <div style={{
        overflowX: "auto",
        borderRadius: "5px",
        border: "1px solid #d7ccc8"
      }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white"
        }}>
          <thead>
            <tr style={{
              backgroundColor: "#5d4037",
              color: "white"
            }}>
              <th style={{ padding: "12px 15px", textAlign: "left" }}>#</th>
              <th style={{ padding: "12px 15px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "12px 15px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "12px 15px", textAlign: "left" }}>Role</th>
              <th style={{ padding: "12px 15px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => (
                <tr key={user._id} style={{
                  borderBottom: "1px solid #d7ccc8",
                  "&:hover": {
                    backgroundColor: "#efebe9"
                  }
                }}>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{idx + 1}</td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{user.name}</td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{user.email}</td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      backgroundColor: user.role === "admin" ? "#8d6e63" : "#bcaaa4",
                      color: "white",
                      fontSize: "12px"
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 15px", textAlign: "center" }}>
                    <button
                      onClick={() => navigate(`/dashboard/users/edit/${user._id}`)}
                      style={{
                        backgroundColor: "#8d6e63",
                        border: "none",
                        color: "white",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        marginRight: "8px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                        "&:hover": {
                          backgroundColor: "#6d4c41"
                        }
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#6d4c41"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "#8d6e63"}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      style={{
                        backgroundColor: "#d32f2f",
                        border: "none",
                        color: "white",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                        "&:hover": {
                          backgroundColor: "#b71c1c"
                        }
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = "#b71c1c"}
                      onMouseOut={(e) => e.target.style.backgroundColor = "#d32f2f"}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: "20px", textAlign: "center", color: "#5d4037" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate("/dashboard/users/add")}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          backgroundColor: "#5d4037",
          color: "white",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s",
          "&:hover": {
            backgroundColor: "#3e2723",
            transform: "scale(1.1)"
          }
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#3e2723";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#5d4037";
          e.target.style.transform = "scale(1)";
        }}
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default Users;