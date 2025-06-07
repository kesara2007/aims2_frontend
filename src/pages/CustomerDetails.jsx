import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    dob: "",
    telephone: "",
  });

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("token");
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/customers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const customer = res.data;
          setFormData({
            name: customer.name,
            address: customer.address || "",
            dob: customer.dob ? customer.dob.substring(0, 10) : "",
            telephone: customer.telephone || "",
          });
        })
        .catch((err) => {
          console.error("Error fetching customer", err);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (id) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/customers/${id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/customers`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate("/dashboard/customers");
    } catch (err) {
      console.error("Failed to save customer", err);
    }
  };

  return (
    <div style={{
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      padding: "30px",
      maxWidth: "600px",
      margin: "30px auto"
    }}>
      <h2 style={{
        color: "#5d4037",
        textAlign: "center",
        marginBottom: "25px",
        borderBottom: "2px solid #8d6e63",
        paddingBottom: "10px"
      }}>
        {id ? "Edit Customer" : "Add New Customer"}
      </h2>

      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#5d4037", fontWeight: "500" }}>Name:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#5d4037", fontWeight: "500" }}>Address:</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#5d4037", fontWeight: "500" }}>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              fontSize: "16px",
              color: "#5d4037"
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#5d4037", fontWeight: "500" }}>Telephone:</label>
          <input
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
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
              "&:hover": {
                backgroundColor: "#3e2723"
              }
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#3e2723"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#5d4037"}
          >
            {id ? "Update Customer" : "Create Customer"}
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/dashboard/customers")}
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
              "&:hover": {
                backgroundColor: "#efebe9"
              }
            }}
            onMouseOver={(e) => e.target.backgroundColor = "#efebe9"}
            onMouseOut={(e) => e.target.backgroundColor = "transparent"}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerDetails;