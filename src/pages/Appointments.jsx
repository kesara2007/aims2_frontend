import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("appointmentId");

  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [searchTerm, filterType, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(res.data);
      setFilteredAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
      setError(err.response?.data?.error || "Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!searchTerm) {
      setFilteredAppointments(appointments);
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();
    const filtered = appointments.filter((a) =>
      a[filterType]?.toLowerCase().includes(lowerTerm)
    );
    setFilteredAppointments(filtered);
  };

  const deleteAppointment = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/appointments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchAppointments();
      } catch (err) {
        console.error("Delete error", err);
        setError(err.response?.data?.error || "Failed to delete appointment.");
      }
    }
  };

  return (
    <div style={{
      padding: "30px",
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      margin: "20px",
      position: "relative"
    }}>
      {/* Heading & Filter */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h2 style={{
          color: "#5d4037",
          borderBottom: "2px solid #8d6e63",
          paddingBottom: "10px",
          margin: 0
        }}>Appointment Management</h2>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          >
            <option value="appointmentId">Appointment ID</option>
            <option value="customerId">Customer ID</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${filterType}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "200px"
            }}
          />
        </div>
      </div>

      {/* Error / Loading / Table */}
      {loading ? (
        <p style={{ textAlign: "center", padding: "20px", color: "#5d4037" }}>Loading appointments...</p>
      ) : error ? (
        <div style={{ padding: "15px", backgroundColor: "#ffcdd2", color: "#c62828", borderRadius: "5px" }}>
          {error}
          <button
            onClick={fetchAppointments}
            style={{
              marginLeft: "20px",
              backgroundColor: "#c62828",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px", color: "#5d4037" }}>No appointments found.</p>
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
                <th style={{ padding: "12px 15px", textAlign: "left" }}>ID</th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>Date</th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>Customer ID</th>
                <th style={{ padding: "12px 15px", textAlign: "left" }}>Details</th>
                <th style={{ padding: "12px 15px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((a) => (
                <tr key={a.appointmentId} style={{ borderBottom: "1px solid #d7ccc8" }}>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{a.appointmentId}</td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{new Date(a.date).toLocaleString()}</td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{a.customerId}</td>
                  <td style={{ padding: "12px 15px", color: "#5d4037" }}>{a.details}</td>
                  <td style={{ padding: "12px 15px", textAlign: "center" }}>
                    <button
                      onClick={() => navigate(`/dashboard/appointments/${a.appointmentId}`)}
                      style={{
                        backgroundColor: "#8d6e63",
                        border: "none",
                        color: "white",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        marginRight: "8px",
                        cursor: "pointer"
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteAppointment(a.appointmentId)}
                      style={{
                        backgroundColor: "#d32f2f",
                        border: "none",
                        color: "white",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
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
        onClick={() => navigate("/dashboard/appointments/new")}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#5d4037",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "56px",
          height: "56px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}
      >
        <Plus size={28} />
      </button>
    </div>
  );
}

export default Appointments;
