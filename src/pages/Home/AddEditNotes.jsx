// AddEditNotes.jsx
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import TagInput from "../../components/Input/TagInput "; // Assuming this path is correct
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext"; // Import useTheme hook

const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { theme } = useTheme(); // Use the theme context

  // Edit Note
  const editNote = async () => {
    const noteId = noteData._id;
    console.log(noteId);
    const user_mail = localStorage.getItem("user");
    if (!user_mail) {
      toast.error("Not authorised"); // Using toast instead of alert
      navigate("/login");
      return; // Added return
    } else {
      console.log(user_mail);
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/note/edit/" + noteId,
        { title, content, tags, user_mail }
      );

      console.log(res.data);

      if (res.data.success === false) {
        console.log(res.data.message);
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
      setError(error.message);
    }
  };

  // Add Note
  const addNewNote = async () => {
    const user_mail = localStorage.getItem("user");
    if (!user_mail) {
      toast.error("Not authorised"); // Using toast instead of alert
      navigate("/login");
      return; // Added return
    } else {
      console.log(user_mail);
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/note/add",
        { title, content, tags, user_mail }
      );

      if (res.data.success === false) {
        console.log(res.data.message);
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
      setError(error.message);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    // Apply theme-based background and text colors to the modal content
    <div className={`relative ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-950'}`}>
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50 dark:hover:bg-gray-600"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400 dark:text-gray-300" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label text-red-400 uppercase">Title</label>

        <input
          type="text"
          className="text-2xl outline-none bg-transparent border-b border-slate-200 dark:border-gray-600 text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-gray-400"
          placeholder="Wake up at 6 a.m."
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label text-red-400 uppercase">Content</label>

        <textarea
          type="text"
          className="text-sm outline-none bg-slate-50 dark:bg-gray-600 p-2 rounded text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-gray-400"
          placeholder="Content..."
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label text-red-400 uppercase">tags</label>
        {/* Assuming TagInput handles its own styling or is compatible */}
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3 bg-[#2B85FF] hover:bg-blue-600 text-white rounded transition-colors duration-200 w-full"
        onClick={handleAddNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
