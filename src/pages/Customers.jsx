import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    }
  };

  const deleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/customers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchCustomers();
      } catch (err) {
        console.error("Delete error", err);
      }
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer[filterBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      padding: "30px",
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      margin: "20px"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        borderBottom: "2px solid #8d6e63",
        paddingBottom: "15px"
      }}>
        <h2 style={{ color: "#5d4037", margin: 0 }}>Customer Management</h2>
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
            <option value="address">Address</option>
            <option value="telephone">Phone</option>
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

      {/* Table */}
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
              <th style={{ padding: "12px 15px", textAlign: "left" }}>ID</th>
              <th style={{ padding: "12px 15px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "12px 15px", textAlign: "left" }}>Address</th>
              <th style={{ padding: "12px 15px", textAlign: "left" }}>DOB</th>
              <th style={{ padding: "12px 15px", textAlign: "left" }}>Phone</th>
              <th style={{ padding: "12px 15px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.customerId} style={{ borderBottom: "1px solid #d7ccc8" }}>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{customer.customerId}</td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{customer.name}</td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{customer.address}</td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>
                    {customer.dob ? new Date(customer.dob).toLocaleDateString() : "-"}
                  </td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{customer.telephone}</td>
                  <td style={{ padding: "12px 15px", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                      <button
                        onClick={() => navigate(`/dashboard/customers/${customer.customerId}`)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#8d6e63",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px",
                          cursor: "pointer"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#6d4c41"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#8d6e63"}
                      >
                        <Pencil size={18} color="white" />
                      </button>
                      <button
                        onClick={() => deleteCustomer(customer.customerId)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#d32f2f",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px",
                          cursor: "pointer"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#b71c1c"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#d32f2f"}
                      >
                        <Trash2 size={18} color="white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: "20px", textAlign: "center", color: "#5d4037" }}>
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => navigate("/dashboard/customers/new")}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          backgroundColor: "#5d4037",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.3s"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#3e2723";
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#5d4037";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <Plus size={28} color="white" />
      </button>
    </div>
  );
}

export default Customers;
