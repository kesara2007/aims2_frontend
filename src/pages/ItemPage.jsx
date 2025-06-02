import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";

const ItemPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await fetchItems();
        if (data) {
          setItems(data);
        }
      } catch (err) {
        setError("Failed to fetch items");
        console.error("Failed to fetch items: ", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/items/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(items.filter((item) => item.itemId !== itemId));
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  };

  const filteredItems = items.filter(item => 
    item[filterBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{
        padding: "30px",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderRadius: "10px",
        margin: "20px",
        textAlign: "center",
        color: "#5d4037"
      }}>
        <h2 style={{
          color: "#5d4037",
          borderBottom: "2px solid #8d6e63",
          paddingBottom: "15px",
          marginBottom: "20px"
        }}>
          Item Management
        </h2>
        <p style={{ padding: "40px 0" }}>Loading items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: "30px",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderRadius: "10px",
        margin: "20px"
      }}>
        <h2 style={{
          color: "#5d4037",
          borderBottom: "2px solid #8d6e63",
          paddingBottom: "15px",
          marginBottom: "20px"
        }}>
          Item Management
        </h2>
        <div style={{
          padding: "15px",
          backgroundColor: "#ffebee",
          color: "#c62828",
          borderRadius: "5px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          {error}
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 16px",
              backgroundColor: "#c62828",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "#b71c1c"
              }
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#b71c1c"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#c62828"}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        <h2 style={{ color: "#5d4037", margin: 0 }}>Item Management</h2>
        
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
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
            <option value="itemId">Item ID</option>
            <option value="price">Price</option>
          </select>
          
          <input
            type="text"
            placeholder={`Search by ${filterBy}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              width: "250px",
              color: "#5d4037"
            }}
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "40px 0",
          color: "#5d4037",
          backgroundColor: "rgba(239, 235, 233, 0.5)",
          borderRadius: "5px"
        }}>
          No items found. Create your first item.
        </div>
      ) : (
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
                <th style={{ padding: "12px 15px", textAlign: "left" }}>Image</th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>Item ID</th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>Price (LKR)</th>
                <th style={{ padding: "12px 15px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.itemId} style={{
                  borderBottom: "1px solid #d7ccc8",
                  "&:hover": {
                    backgroundColor: "#efebe9"
                  }
                }}>
                  <td style={{ padding: "12px 15px", textAlign: "center" }}>
                    {item.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.name}
                        style={{ 
                          width: "50px", 
                          height: "50px", 
                          objectFit: "cover",
                          borderRadius: "5px",
                          border: "1px solid #d7ccc8"
                        }}
                      />
                    ) : (
                      <div style={{
                        color: "#5d4037",
                        fontStyle: "italic"
                      }}>
                        No Image
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{item.itemId}</td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{item.name}</td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>
                    {item.price.toFixed(2)}
                  </td>
                  <td style={{ padding: "12px 15px", textAlign: "center" }}>
                    <button
                      onClick={() => navigate(`/dashboard/items/edit/${item.itemId}`)}
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
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.itemId)}
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
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => navigate("/dashboard/items/add")}
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
        <Plus size={24} />
      </button>
    </div>
  );
};

export default ItemPage;