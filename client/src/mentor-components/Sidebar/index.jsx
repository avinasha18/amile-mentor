import React, { useState } from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
import { GiBookshelf } from "react-icons/gi";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { FaMailchimp, FaEnvelope } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { PiListChecks } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const MentorSidebar = () => {
  const [activeItem, setActiveItem] = useState(); // Default active item
  const { isDarkMode } = useTheme();
  const nav = useNavigate();

  const handleItemClick = (text) => {
    setActiveItem(text);
  };

  return (
    <main className={`${isDarkMode ? "bg-black" : "bg-white"} z-50`}>
      <Sidebar>
        <div className="flex-1">
          <SidebarItem
            text="Profile"
            active={activeItem === "Profile"}
            icon={<CgProfile />}
            onClick={() => {
              handleItemClick("Profile");
              nav("/profile");
            }}
          />
          <SidebarItem
            text="Students"
            icon={<PiListChecks />}
            active={activeItem === "Students"}
            onClick={() => {
              handleItemClick("Students");
              nav("/students");
            }}
          />
          <SidebarItem
            text="Chats"
            icon={<FaEnvelope />}
            active={activeItem === "Messages"}
            onClick={() => {
              handleItemClick("Messages");
              nav("/messages");
            }}
          />
          <SidebarItem
            text="AI Interviewer"
            icon={<FaMailchimp />}
            active={activeItem === "Interview"}
            onClick={() => {
              handleItemClick("Interview");
              nav("/aimock");
            }}
          />
          <SidebarItem
            text="Inventory"
            icon={<GiBookshelf />}
            active={activeItem === "Inventory"}
            alert
            onClick={() => {
              handleItemClick("Inventory");
              nav("/courses");
            }}
          />
          <SidebarItem
            text="Help"
            icon={<IoIosHelpCircleOutline />}
            active={activeItem === "Help"}
            onClick={() => handleItemClick("Help")}
          />
        </div>

        <div className="absolute bottom-2">
          {" "}
          {/* Ensures this section is at the bottom */}
          <SidebarItem
            text="Settings"
            icon={<IoSettingsOutline />}
            active={activeItem === "Settings"}
            onClick={() => handleItemClick("Settings")}
          />
        </div>
      </Sidebar>
    </main>
  );
};

export default MentorSidebar;
