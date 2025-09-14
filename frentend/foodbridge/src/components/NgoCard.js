import React from "react";

const NgoCard = ({ ngo, updateNgo }) => {
  const token = localStorage.getItem("token");

  const handleVerifyToggle = async () => {
    const res = await fetch(
      `http://localhost:5000/api/users/verify-ngo/${ngo._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isVerified: !ngo.isVerified }),
      }
    );

    const data = await res.json();
    if (res.ok) {
      updateNgo(ngo._id, { isVerified: data.ngo.isVerified });
    }
  };

  const handleBlockToggle = async () => {
    const res = await fetch(
      `http://localhost:5000/api/users/block-user/${ngo._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isBlocked: !ngo.isBlocked }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      updateNgo(ngo._id, { isBlocked: data.user.isBlocked });
    } else {
      alert("Block/Unblock failed");
    }
  };

  return (
    <div className="p-4 border rounded shadow bg-white dark:bg-gray-800">
      <h3 className="text-xl font-semibold">{ngo.name}</h3>
      <p>Email: {ngo.email}</p>
      <p>
        Status:{" "}
        {ngo.isVerified ? "✅ Verified" : "❌ Not Verified"} |{" "}
        {ngo.isBlocked ? "⛔ Blocked" : "🟢 Active"}
      </p>

      <div className="flex gap-3 mt-2">
        <button
          className={`px-4 py-2 rounded ${
            ngo.isVerified ? "bg-red-500" : "bg-green-500"
          } text-white`}
          onClick={handleVerifyToggle}
        >
          {ngo.isVerified ? "Unverify" : "Verify"}
        </button>

        <button
          className={`px-4 py-2 rounded ${
            ngo.isBlocked ? "bg-yellow-600" : "bg-blue-600"
          } text-white`}
          onClick={handleBlockToggle}
        >
          {ngo.isBlocked ? "Unblock" : "Block"}
        </button>
      </div>
    </div>
  );
};

export default NgoCard;

