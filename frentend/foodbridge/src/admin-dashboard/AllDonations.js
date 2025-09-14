import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; 
import { toast } from "react-toastify";

const AllDonations = () => {
  const { userRole } = useAuth(); 
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/donations", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setDonations(res.data.donations || []);
      } catch (error) {
        console.error("Failed to fetch donations:", error);
        setDonations([]);
      }
    };

    fetchDonations();
  }, []);

  const [statusMap, setStatusMap] = useState({}); 

  const updateStatus = (id, status) => {
    setStatusMap((prev) => ({ ...prev, [id]: status }));
  };

  const handleAdminUpdate = async (id, currentStatus, note) => {
    const updatedStatus = statusMap[id] || currentStatus;
    try {
      await axios.put(
        `http://localhost:5000/api/donations/${id}/admin-status`,
        { status: updatedStatus, note },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Donation status updated");

      
      setDonations((prev) =>
        prev.map((don) =>
          don._id === id ? { ...don, status: updatedStatus } : don
        )
      );
    } catch (error) {
      console.error("Error updating donation status:", error);
      toast.error("Failed to update status");
    }
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Donations</h2>
      {donations.length === 0 ? (
        <p>No donations available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-2 px-4 text-left">Donor</th>
                <th className="py-2 px-4 text-left">NGO</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Date</th>
                {userRole === "admin" && <th className="py-2 px-4 text-left">Admin Action</th>}
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id} className="border-t">
                  <td className="py-2 px-4">{donation.donorId?.name || "—"}</td>
                  <td className="py-2 px-4">{donation.ngoId?.name || "—"}</td>
                  <td className="py-2 px-4">{donation.quantity}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor[donation.status] || "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </td>

                 
                  {userRole === "admin" && (
                    <td className="py-2 px-4">
                      <select
                        value={statusMap[donation._id] || donation.status}
                        onChange={(e) =>
                          updateStatus(donation._id, e.target.value)
                        }
                        className="border rounded p-1"
                      >
                        {["pending", "accepted", "rejected", "completed"].map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          const note = prompt("Enter reason for status change (optional):");
                          handleAdminUpdate(donation._id, donation.status, note);
                        }}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#4ade80", 
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}

                      >
                        Save
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllDonations;
