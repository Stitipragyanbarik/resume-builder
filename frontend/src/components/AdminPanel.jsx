import { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // fetch all resumes
  
  const fetchData = async () => {
    const res = await axios.get("https://resume-builder-bmtd.onrender.com/api/resume");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // delete
  const deleteResume = async (id) => {
    await axios.delete(`https://resume-builder-bmtd.onrender.com/api/resume/${id}`);
    fetchData();
  };

  // update
  const updateResume = async (id) => {
    await axios.put(`https://resume-builder-bmtd.onrender.com/api/resume/${id}`,  {
      name: editName,
    });
    setEditId(null);
    fetchData();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

      {data.map((item) => (
        <div key={item._id} className="border p-4 mb-3">

          <p><b>ID:</b> {item.resumeId}</p>

          {editId === item._id ? (
            <>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border p-1"
              />
              <button
                onClick={() => updateResume(item._id)}
                className="bg-green-500 text-white px-2 ml-2"
              >
                Save
              </button>
            </>
          ) : (
            <p><b>Name:</b> {item.name}</p>
          )}

          <p><b>Skills:</b> {item.skills ? item.skills.join(", ") : "No skills"}</p>
          <p><b>Downloads:</b> {item.downloads}</p>

          {/* ACTION BUTTONS */}
          <button
            onClick={() => {
              setEditId(item._id);
              setEditName(item.name);
            }}
            className="bg-yellow-500 text-white px-2 mr-2 mt-2"
          >
            Edit
          </button>

          <button
            onClick={() => deleteResume(item._id)}
            className="bg-red-500 text-white px-2 mt-2"
          >
            Delete
          </button>

          {/* LOGS */}
          {item.logs && (
            <div className="mt-2">
              <b>Activity Logs:</b>
              <ul className="list-disc ml-5">
                {item.logs.map((log, i) => (
                  <li key={i}>
                    {log.action} - {new Date(log.time).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;