// Navbar.jsx
import React, { useState } from "react";
import SearchBar from "./SearchBar/SearchBar"; // Assuming this path is correct
import ProfileInfo from "./Cards/ProfileInfo"; // Assuming this path is correct
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  signInSuccess,
  signoutFailure,
  signoutStart,
} from "../redux/user/userSlice";
import axios from "axios";
import { useTheme } from "../pages/Home/ThemeContext"; // Import useTheme hook
import { MdLightMode, MdDarkMode, MdMenu, MdClose } from "react-icons/md"; // Import icons for theme toggle and menu

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const { theme, toggleTheme } = useTheme(); // Use the theme context

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const onLogout = async () => {
    try {
      dispatch(signoutStart());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(signInSuccess());
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      dispatch(signoutFailure(error.message));
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-white dark:bg-gray-800 flex items-center justify-between px-4 py-2 drop-shadow relative md:px-6">
      <Link to={"/"}>
        <h2 className="text-xl font-medium text-black dark:text-white py-2">
          <span className="text-slate-500">Good</span>
          <span className="text-slate-900 dark:text-gray-200">Notes</span>
        </h2>
      </Link>

      {/* Hamburger menu icon for mobile */}
      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <MdDarkMode className="text-2xl" />
          ) : (
            <MdLightMode className="text-2xl" />
          )}
        </button>
        <button
          onClick={toggleMobileMenu}
          className="text-slate-600 dark:text-white text-2xl focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <MdClose /> : <MdMenu />}
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        <SearchBar
          value={searchQuery}
          onChange={({ target }) => setSearchQuery(target.value)}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <MdDarkMode className="text-2xl" />
          ) : (
            <MdLightMode className="text-2xl" />
          )}
        </button>

        {localStorage.getItem("user") ? (
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        ) : (
          ""
        )}
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-4 md:hidden z-50">
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
          {localStorage.getItem("user") ? (
            <div className="mt-4">
              <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;