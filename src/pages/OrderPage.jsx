import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("orderId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedOrders = Array.isArray(response.data)
          ? response.data
          : response.data.orders || response.data.data || [];

        setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
        setLoading(false);
      } catch (err) {
        console.error("Order fetch error:", err);
        setError("Failed to fetch orders. Please log in again.");
        setLoading(false);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
      } catch (err) {
        alert("Failed to delete order. Please try again.");
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    }
  };

  const filteredOrders = orders.filter(order => 
    order[filterBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
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
          Order Management
        </h2>
        <p style={{ padding: "40px 0" }}>Loading orders...</p>
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
          Order Management
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
        <h2 style={{ color: "#5d4037", margin: 0 }}>Order Management</h2>
        
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
            <option value="orderId">Order ID</option>
            <option value="item">Item</option>
            <option value="customerId">Customer ID</option>
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

      {filteredOrders.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "40px 0",
          color: "#5d4037",
          backgroundColor: "rgba(239, 235, 233, 0.5)",
          borderRadius: "5px"
        }}>
          No orders found. Create your first order.
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
                <th style={{ padding: "12px 15px", textAlign: "left" }}>Order ID</th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>Item</th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>Customer ID</th>
                <th style={{ padding: "12px 15px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderId} style={{
                  borderBottom: "1px solid #d7ccc8",
                  "&:hover": {
                    backgroundColor: "#efebe9"
                  }
                }}>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{order.orderId}</td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{order.item}</td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{order.customerId}</td>
                  <td style={{ padding: "12px 15px", textAlign: "center" }}>
                    <button
                      onClick={() => navigate(`/dashboard/orders/edit/${order.orderId}`)}
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
                      onClick={() => handleDelete(order.orderId)}
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

      {/* Floating Add Button - Matches Customer Page Style */}
      <button
        onClick={() => navigate("/dashboard/orders/add")}
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
}

export default OrderPage;