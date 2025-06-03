// Home.jsx
import React, { useEffect, useState } from "react";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditNotes from "./AddEditNotes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import "./home.css"; // Assuming this CSS file exists and is relevant
import { useTheme } from "./ThemeContext"; // Import useTheme

// Set app element for react-modal
Modal.setAppElement('#root'); // Make sure your root HTML element has id="root"

const Home = () => {
  const { theme } = useTheme(); // Get the current theme
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const getAllNotes = async () => {
    const user_mail = localStorage.getItem("user");
    if (!user_mail) {
      // Using a custom message box instead of alert()
      toast.error("First, Authorise yourself!");
      navigate("/login");
      return; // Added return to prevent further execution
    }
    try {
      const res = await axios.get("https://notes-backend-1-2umi.onrender.com/api/note/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: user_mail,
        },
      });

      if (res.data.success === false) {
        console.log(res.data);
        return;
      }

      setAllNotes(res.data.notes);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch notes: " + error.message); // Added error toast
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      setUserInfo(currentUser?.rest);
      getAllNotes();
    }
  }, [currentUser]); // Added currentUser to dependency array

  useEffect(() => {
    if (!isSearch || searchQuery.trim() === "") {
      setFilteredNotes(allNotes);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = allNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(lowerQuery) ||
          note.content.toLowerCase().includes(lowerQuery)
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, allNotes, isSearch]);

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const res = await axios.delete(
        "https://notes-backend-1-2umi.onrender.com/api/note/delete/" + noteId
      );

      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      toast.error(error.message); // Changed to toast.error
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const res = await axios.put(
        "https://notes-backend-1-2umi.onrender.com/api/note/update-note-pinned/" + noteId,
        { isPinned: !noteData.isPinned }
      );

      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to update pin status: " + error.message); // Added error toast
    }
  };

  const onSearchNote = (query) => {
    setSearchQuery(query.toLowerCase());
    setIsSearch(true);
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    setSearchQuery("");
    setFilteredNotes(allNotes);
  };

  return (
    // Apply theme-based background to the main content area
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <main className="container mx-auto px-4 pt-6 pb-20">
        {filteredNotes.length > 0 ? (
          <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdAt}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => deleteNote(note)}
                onPinNote={() => updateIsPinned(note)}
              />
            ))}
          </section>
        ) : (
          <div className="flex justify-center items-center min-h-[60vh]">
            <EmptyCard
              imgSrc={
                isSearch
                  ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtakcQoMFXwFwnlochk9fQSBkNYkO5rSyY9A&s"
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDCtZLuixBFGTqGKdWGLaSKiO3qyhW782aZA&s"
              }
              message={
                isSearch
                  ? "Oops! No Notes found matching your search"
                  : `Ready to capture your ideas? Click the 'Add' button to start noting down your thoughts, inspiration and reminders. Let's get started!`
              }
            />
          </div>
        )}
      </main>

      <button
        className="fixed bottom-6 right-6 z-50 w-16 h-16 flex items-center justify-center bg-[#2B85FF] hover:bg-blue-600 text-white text-3xl rounded-full shadow-lg transition-all duration-200"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 40,
          },
          content: {
            // Apply theme-based background for the modal content
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#1f2937',
            maxWidth: '40rem', // Use relative units for max-width
            width: '90%', // Use relative units for width
            margin: '5rem auto', // Use relative units for margin
            borderRadius: '0.5rem', // Use relative units for border-radius
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Use relative units for box-shadow
            padding: '1.5rem', // Use relative units for padding
            maxHeight: '80vh', // Use relative units for max-height
            overflowY: 'auto', // Use relative units for overflow-y
          },
        }}
        contentLabel="Note Modal"
      >
        <AddEditNotes
          onClose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          noteData={openAddEditModal.data}
          type={openAddEditModal.type}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </div>
  );
};

export default Home;
