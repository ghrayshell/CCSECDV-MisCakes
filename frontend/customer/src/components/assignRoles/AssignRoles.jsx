import { useState, useEffect } from "react";
import axios from "axios";

const AssignRoles = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newRole, setNewRole] = useState("product manager");

  // Fetch users from the backend
  useEffect(() => {
    axios.get("http://localhost:4000/getAllUsers")
      .then(response => {
        setUsers(response.data);
      })
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  // Update the user's role
  const handleRoleChange = () => {
    console.log('ROLE: ', newRole);
    axios.put(`http://localhost:4000/users/${selectedUserId}/role`, { role: newRole } , { withCredentials: true })
      .then(response => {
        alert("Role updated successfully!");
      })
      .catch(err => {
        console.error("Error updating role:", err);
        alert("Failed to update role.");
      });
  };

  return (
    <div>
      <h3>Assign Roles</h3>
      <select onChange={(e) => setSelectedUserId(e.target.value)}>
        <option value="">Select User</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>{user.email}</option>
        ))}
      </select>

      {selectedUserId && (
        <>
          <select onChange={(e) => setNewRole(e.target.value)} value={newRole}>
            <option value="product_manager">Product Manager</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
          <button onClick={handleRoleChange} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Assign Role
          </button>
        </>
      )}
    </div>
  );
};

export default AssignRoles;