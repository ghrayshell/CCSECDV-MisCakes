import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllLogs = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = () => {
    axios.get('http://localhost:4000/logs', { withCredentials: true })
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Failed to fetch logs:", err));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all logs?')) {
      axios.delete('http://localhost:4000/logs', { withCredentials: true })
        .then(() => {
          alert('All logs deleted successfully.');
          fetchLogs(); // Refresh logs
        })
        .catch(err => {
          console.error("Failed to delete logs:", err);
          alert("Failed to delete logs.");
        });
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">📦 Authentication Logs</h2>
        <button
          onClick={handleDeleteAll}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete All Logs
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Message</th>
              <th className="py-2 px-4 border">IP</th>
              <th className="py-2 px-4 border">User Agent</th>
              <th className="py-2 px-4 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No logs found.</td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4 border">{log.email || '-'}</td>
                  <td className="py-2 px-4 border">{log.status}</td>
                  <td className="py-2 px-4 border">{log.message}</td>
                  <td className="py-2 px-4 border">{log.ip}</td>
                  <td className="py-2 px-4 border">{log.userAgent}</td>
                  <td className="py-2 px-4 border">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllLogs;
