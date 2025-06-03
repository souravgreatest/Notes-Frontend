// NoteCard.jsx
import React from "react";
import { FaTags } from "react-icons/fa6"; // Assuming this is used elsewhere or for future use
import { MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md";
import moment from "moment";
import { useTheme } from "../../pages/Home/ThemeContext"; // Import useTheme hook

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onPinNote,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme(); // Use the theme context

  return (
    // Apply theme-based background, text, and border colors
    <div className="border rounded p-4 bg-white dark:bg-gray-700 hover:shadow-xl transition-all ease-in-out dark:border-gray-600">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium text-black dark:text-white">{title}</h6>
          <span className="text-xs text-green-700 dark:text-green-400">
            {moment(date).format("Do MMMYYYY")}
          </span>
        </div>

        {/* Pin icon with added transition and hover/active effects */}
        <MdOutlinePushPin
          className={`icon-btn transition-all duration-200 ${
            isPinned ? "text-[#2B85FF] " : "text-slate-300 dark:text-gray-400"
          } hover:text-[#2B85FF] dark:hover:text-blue-400 hover:scale-110 active:scale-90`}
          onClick={onPinNote}
        />
      </div>

      <p className="text-xs text-slate-600 dark:text-gray-300 mt-2">{content?.slice(0, 60)}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500 dark:text-gray-400">
          {tags.map((item) => `#${item} `)}
        </div>

        <div className="flex items-center gap-2">
          {/* Edit icon with added transition and hover effect */}
          <MdCreate
            className="icon-btn transition-all duration-200 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 hover:scale-110 active:scale-90"
            onClick={onEdit}
          />

          {/* Delete icon with added transition and hover effect */}
          <MdDelete
            className="icon-btn transition-all duration-200 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 hover:scale-110 active:scale-90"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
