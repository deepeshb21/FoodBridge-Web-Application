import React, { useEffect, useState } from "react";

const ManageNGOs = () => {
  const [ngos, setNgos] = useState([]);

  
  const fetchNGOs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/all-ngos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setNgos(data);
    } catch (error) {
      console.error("Error fetching NGOs:", error);
    }
  };

  useEffect(() => {
    fetchNGOs();
  }, []);

  const toggleVerification = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/verify-ngo/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      console.log(data.message);
      fetchNGOs(); 
    } catch (error) {
      console.error("Error toggling verification:", error);
    }
  };

  const toggleBlock = async (id, isBlocked) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/block-user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ isBlocked: !isBlocked }),
      });

      const data = await res.json();
      console.log(data.message);
      fetchNGOs(); 
    } catch (error) {
      console.error("Error toggling block:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage NGOs</h2>

      {ngos.length === 0 ? (
        <p>No NGOs found</p>
      ) : (
        ngos.map((ngo) => (
          <div
            key={ngo._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h4>{ngo.name}</h4>
            <p>Email: {ngo.email}</p>
            <p>Status: {ngo.isVerified ? "✅ Verified" : "❌ Not Verified"}</p>
            <p>Block Status: {ngo.isBlocked ? "❌ Blocked" : "✅ Active"}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                onClick={() => toggleVerification(ngo._id)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: ngo.isVerified ? "#f87171" : "#4ade80",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {ngo.isVerified ? "Unverify" : "Verify"}
              </button>

              <button
                onClick={() => toggleBlock(ngo._id, ngo.isBlocked)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: ngo.isBlocked ? "#f59e0b" : "#1f2937",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {ngo.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageNGOs;
