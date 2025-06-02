import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    profilePicture: null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        })
        .then((res) => {
          const { name, email, role, profilePicture } = res.data;
          setFormData((prev) => ({ ...prev, name, email, role }));
          setPreview(`http://localhost:5000/${profilePicture}`);
        })
        .catch((err) => {
          alert("Failed to load user data");
        });
    }
  }, [id, auth.token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setFormData((prev) => ({ ...prev, profilePicture: files[0] }));
      setPreview(files && files[0] ? URL.createObjectURL(files[0]) : preview);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = new FormData();
    userData.append("name", formData.name);
    userData.append("email", formData.email);
    if (!id) userData.append("password", formData.password);
    userData.append("role", formData.role);
    if (formData.profilePicture) {
      userData.append("profilePicture", formData.profilePicture);
    }

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/users/${id}`, userData, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("User updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/users", userData, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("User created successfully");
      }
      navigate("/dashboard/users");
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "20px auto",
      padding: "30px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    }}>
      <h2 style={{
        color: "#5d4037",
        textAlign: "center",
        marginBottom: "25px",
        borderBottom: "2px solid #8d6e63",
        paddingBottom: "10px"
      }}>
        {id ? "Edit User" : "Add User"}
      </h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#5d4037", fontWeight: "500" }}>Name:</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
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
          <label style={{ color: "#5d4037", fontWeight: "500" }}>Email:</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              fontSize: "16px"
            }}
          />
        </div>

        {!id && (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ color: "#5d4037", fontWeight: "500" }}>Password:</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #bcaaa4",
                fontSize: "16px"
              }}
            />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#5d4037", fontWeight: "500" }}>Role:</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              fontSize: "16px",
              backgroundColor: "white",
              cursor: "pointer"
            }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#5d4037", fontWeight: "500" }}>Profile Picture:</label>
          <input 
            type="file" 
            name="profilePicture" 
            onChange={handleChange}
            style={{
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #bcaaa4",
              fontSize: "16px"
            }}
          />
          {preview && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={preview}
                alt="Preview"
                style={{ 
                  height: "100px", 
                  borderRadius: "5px",
                  border: "1px solid #bcaaa4",
                  objectFit: "cover"
                }}
              />
            </div>
          )}
        </div>

        <button 
          type="submit"
          style={{
            padding: "12px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#5d4037",
            color: "white",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.3s",
            marginTop: "10px",
            "&:hover": {
              backgroundColor: "#3e2723"
            }
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#3e2723"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#5d4037"}
        >
          {id ? "Update User" : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;