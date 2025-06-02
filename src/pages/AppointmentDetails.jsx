import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AppointmentDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    customerId: "",
    details: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      const token = localStorage.getItem("token");
      axios
        .get(`http://localhost:5000/api/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const { date, customerId, details } = res.data;
          setFormData({
            date: date ? new Date(date).toISOString().slice(0, 16) : "", // datetime-local format
            customerId: customerId || "",
            details: details || "",
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load appointment", err);
          setError(
            err.response?.data?.error || "Failed to load appointment data."
          );
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate customer ID like CUS001 format
  const validateCustomerId = (customerId) => /^CUS\d{3}$/.test(customerId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.date || !formData.customerId || !formData.details) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateCustomerId(formData.customerId)) {
      setError("Customer ID must be in format CUS001 (CUS followed by 3 digits)");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const appointmentData = {
        date: new Date(formData.date).toISOString(),
        customerId: formData.customerId,
        details: formData.details,
      };

      if (id) {
        await axios.put(
          `http://localhost:5000/api/appointments/${id}`,
          appointmentData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/appointments",
          appointmentData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate("/dashboard/appointments");
    } catch (err) {
      console.error("Failed to save appointment", err);
      setError(err.response?.data?.error || "Failed to save appointment. Please try again.");
    }
  };

  if (loading)
    return (
      <p
        style={{
          textAlign: "center",
          padding: "20px",
          color: "#5d4037",
          fontWeight: "500",
        }}
      >
        Loading appointment data...
      </p>
    );

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        padding: "30px",
        maxWidth: "600px",
        margin: "30px auto",
        color: "#5d4037",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
          borderBottom: "2px solid #8d6e63",
          paddingBottom: "10px",
          fontWeight: "600",
        }}
      >
        {id ? "Edit Appointment" : "Add New Appointment"}
      </h2>

      {error && (
        <p
          role="alert"
          style={{
            backgroundColor: "#f8d7da",
            color: "#842029",
            padding: "12px",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #f5c2c7",
          }}
        >
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* Date & Time */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label
            htmlFor="date"
            style={{ fontWeight: "500", color: "#5d4037" }}
          >
            Date & Time:
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              fontSize: "16px",
              color: "#5d4037",
            }}
          />
        </div>

        {/* Customer ID */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label
            htmlFor="customerId"
            style={{ fontWeight: "500", color: "#5d4037" }}
          >
            Customer ID:
          </label>
          <input
            type="text"
            id="customerId"
            name="customerId"
            placeholder="Enter Customer ID (e.g., CUS001)"
            value={formData.customerId}
            onChange={handleChange}
            required
            pattern="CUS\d{3}"
            title="Must be in format CUS001 (CUS followed by 3 digits)"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              fontSize: "16px",
              color: "#5d4037",
            }}
          />
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label
            htmlFor="details"
            style={{ fontWeight: "500", color: "#5d4037" }}
          >
            Details:
          </label>
          <textarea
            id="details"
            name="details"
            rows="4"
            value={formData.details}
            onChange={handleChange}
            placeholder="Enter appointment details"
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              fontSize: "16px",
              color: "#5d4037",
              resize: "vertical",
            }}
          ></textarea>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <button
            type="submit"
            style={{
              padding: "12px 25px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#5d4037",
              color: "white",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#3e2723")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#5d4037")}
          >
            {id ? "Update Appointment" : "Create Appointment"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard/appointments")}
            style={{
              padding: "12px 25px",
              borderRadius: "5px",
              border: "1px solid #5d4037",
              backgroundColor: "transparent",
              color: "#5d4037",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#efebe9")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentDetails;
