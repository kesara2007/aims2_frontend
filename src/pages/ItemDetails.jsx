import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("token");
      axios
        .get(`http://localhost:5000/api/items/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setFormData({
            name: res.data.name,
            price: res.data.price,
          });
          setExistingImage(res.data.image);
        })
        .catch((err) => {
          console.error("Error fetching item", err);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      if (id) {
        await axios.put(`http://localhost:5000/api/items/${id}`, data, config);
        console.log(formData);
      } else {
        await axios.post("http://localhost:5000/api/items", data, config);
      }

      navigate("/dashboard/items");
    } catch (err) {
      setError("Failed to save item. Please try again.");
      console.error(err);
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
        {id ? "Edit Item" : "Add New Item"}
      </h2>

      {error && (
        <p style={{
          color: "red",
          textAlign: "center",
          marginBottom: "20px"
        }}>{error}</p>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        {/* Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#5d4037", fontWeight: "500" }}>Item Name:</label>
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

        {/* Price */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#5d4037", fontWeight: "500" }}>Price (LKR):</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              fontSize: "16px"
            }}
          />
        </div>

        {/* Upload Image */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#5d4037", fontWeight: "500" }}>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ fontSize: "16px" }}
          />
          {existingImage && !imageFile && (
            <img
              src={`http://localhost:5000/${existingImage}`}
              alt="Current item"
              style={{ marginTop: "10px", maxHeight: "150px", borderRadius: "8px", objectFit: "cover" }}
            />
          )}
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
              cursor: "pointer"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#3e2723"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#5d4037"}
          >
            {id ? "Update Item" : "Create Item"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard/items", { state: { updated: true } })}
            style={{
              padding: "12px 25px",
              borderRadius: "5px",
              border: "1px solid #5d4037",
              backgroundColor: "transparent",
              color: "#5d4037",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer"
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
};

export default ItemDetails;
