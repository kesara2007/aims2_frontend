import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    item: "",
    customerId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      const token = localStorage.getItem("token");

      axios
        .get(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const { item, customerId } = res.data;
          setFormData({ item: item || "", customerId: customerId || "" });
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load order data.");
          setLoading(false);
          if (err.response?.status === 401) {
            navigate("/login");
          }
        });
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.item.trim() || !formData.customerId.trim()) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (id) {
        await axios.put(
          `http://localhost:5000/api/orders/${id}`,
          formData,
          config
        );
      } else {
        await axios.post("http://localhost:5000/api/orders", formData, config);
      }
      navigate("/dashboard/orders");
    } catch (err) {
      setError("Failed to save order. Please try again.");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>;

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
        {id ? "Edit Order" : "Add New Order"}
      </h2>

      {error && (
        <p style={{
          color: "red",
          textAlign: "center",
          marginBottom: "20px",
          fontWeight: "500"
        }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        {/* Item */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#5d4037", fontWeight: "500" }}>Item:</label>
          <input
            name="item"
            value={formData.item}
            onChange={handleChange}
            required
            placeholder="Enter item name"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              fontSize: "16px"
            }}
          />
        </div>

        {/* Customer ID */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#5d4037", fontWeight: "500" }}>Customer ID:</label>
          <input
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
            placeholder="Enter customer ID"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              fontSize: "16px"
            }}
          />
        </div>

        {/* Buttons */}
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
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#3e2723"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#5d4037"}
          >
            {id ? "Update Order" : "Create Order"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard/orders")}
            style={{
              padding: "12px 25px",
              borderRadius: "5px",
              border: "1px solid #5d4037",
              backgroundColor: "transparent",
              color: "#5d4037",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#efebe9"}
            onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default OrderDetails;
