
import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("/default-avatar.png");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        gender: user.gender || "",
        dob: user.dob ? user.dob.split("T")[0] : "",
      });
      setPreview(user.profilePic || "/default-avatar.png");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file)); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (image) data.append("image", image);

      const res = await API.put("/users/profile", data, {
        headers: { "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem('token')}` 
         },
        withCredentials: true,
      });

      const updatedUser = res.data;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (updatedUser.profilePic) setPreview(updatedUser.profilePic);

      toast.success("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Profile update error:", err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4 shadow-sm">
            <div className="text-center mb-4">
              <img
                src={preview}
                alt="Profile"
                className="rounded-circle"
                width="120"
                height="120"
                style={{ objectFit: "cover" }}
              />
              <h4 className="mt-3">{formData.name || "Your Name"}</h4>
              <p className="text-muted">Personal Profile</p>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <h5 className="text-primary">Contact Information</h5>
              <div className="mb-2">
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="form-control"
                />
              </div>

              <div className="mb-2">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="form-control"
                />
              </div>

              <h5 className="text-primary">Basic Information</h5>
              <div className="mb-2">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-2">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                />
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary px-4">
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
