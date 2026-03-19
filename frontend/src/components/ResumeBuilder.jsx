import { useState, useEffect } from "react";
import axios from "axios";

const ResumeBuilder = () => {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState([""]);
  const [lastEdited, setLastEdited] = useState("");
  const [resumeId, setResumeId] = useState("");
  const [email, setEmail] = useState("");
  const [expired, setExpired] = useState(false);

  // ⏳ 20 min timer
  useEffect(() => {
    const startTime = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();
      if (now - startTime > 20 * 60 * 1000) {
        setExpired(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // add skill
  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  // update skill
  const handleSkillChange = (value, index) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
    updateTime();
  };

  const updateTime = () => {
    setLastEdited(new Date().toLocaleString());
  };

  // capitalize
  const capitalize = (text) => {
    return text
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // analytics
  const fullText = (name || "") + " " + skills.join(" ");
  const words = fullText.trim() ? fullText.trim().split(/\s+/) : [];

  const wordCount = words.length;
  const charCount = fullText.length;
  const paragraphCount = skills.filter(s => s.trim() !== "").length;
  const readingTime = Math.ceil(wordCount / 200);

  const hasDuplicate =
    new Set(skills.filter(s => s.trim() !== "")).size !==
    skills.filter(s => s.trim() !== "").length;

  // save
  const saveResume = async () => {
    if (expired) return alert("⛔ Time expired!");

    if (!name) return alert("Enter name!");

    try {
      const res = await axios.post(
       "https://resume-builder-bmtd.onrender.com/api/resume/create",
        { name, skills }
      );

      setResumeId(res.data._id);
      alert("✅ Saved!");
    } catch (err) {
      console.log(err);
      alert("❌ Error saving");
    }
  };

  // download
  const downloadResume = () => {
    if (!resumeId) return alert("Save first!");
    window.open(
      `https://resume-builder-bmtd.onrender.com/api/resume/download/${resumeId}`
    );
  };

  // email
  const sendEmail = async () => {
    if (!email) return alert("Enter email!");

    await axios.post(
      `https://resume-builder-bmtd.onrender.com/api/resume/email/${resumeId}`,
      { email }
    );

    alert("📧 Email sent!");
  };

  // whatsapp
  const sendWhatsApp = () => {
    if (!resumeId) return alert("Save first!");

    const link = `https://resume-builder-bmtd.onrender.com/api/resume/download/${resumeId}`;
    const msg = `Download Resume: ${link}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  };

  // print
  const printResume = () => {
    window.print();
  };

  if (expired) {
    return (
      <h1 className="text-red-500 text-xl">
        ⛔ Resume submission time has expired
      </h1>
    );
  }

  return (
    <div className="p-6 grid grid-cols-2 gap-6">

      {/* LEFT */}
      <div>
        <h1 className="text-xl font-bold mb-4">Resume Builder</h1>

        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full mb-3"
          value={name}
          onChange={(e) => {
            setName(capitalize(e.target.value));
            updateTime();
          }}
        />

        <h2>Skills</h2>
        {skills.map((skill, index) => (
          <input
            key={index}
            value={skill}
            onChange={(e) =>
              handleSkillChange(e.target.value, index)
            }
            className="border p-2 w-full mb-2"
          />
        ))}

        <button onClick={addSkill} className="bg-blue-500 text-white px-2">
          Add Skill
        </button>

        <button onClick={saveResume} className="bg-green-500 text-white px-2 ml-2">
          Save
        </button>

        <button onClick={downloadResume} className="bg-purple-500 text-white px-2 ml-2">
          Download
        </button>

        <button onClick={printResume} className="bg-gray-500 text-white px-2 ml-2">
          Print
        </button>

        {/* email */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mt-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={sendEmail} className="bg-red-500 text-white px-2 mt-2">
          Send Email
        </button>

        <button onClick={sendWhatsApp} className="bg-green-700 text-white px-2 mt-2 ml-2">
          WhatsApp
        </button>

        {/* analytics */}
        <div className="mt-4 border p-3">
          <p>Words: {wordCount}</p>
          <p>Characters: {charCount}</p>
          <p>Paragraphs: {paragraphCount}</p>
          <p>Reading Time: {readingTime} min</p>

          {wordCount > 700 && (
            <p className="text-red-500">
              Resume should be under 700 words
            </p>
          )}

          {hasDuplicate && (
            <p className="text-red-500">
              Duplicate skill detected!
            </p>
          )}

          <p>Last Edited: {lastEdited}</p>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="border p-4">
        <h1 className="text-2xl font-bold">{name}</h1>
        <ul className="list-disc ml-5">
          {skills.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResumeBuilder;