import React, { useState } from "react";
import { FaFileContract } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsSun, BsMoon } from "react-icons/bs";
import XBlack from "./logos/XBlack.svg";
import XWhite from "./logos/XWhite.svg";

interface Contract {
  source: string;
  name: string;
}

interface SidebarProps {
  contracts: Contract[];
  selected: string;
  onSelect: (source: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  contracts,
  selected,
  onSelect,
  isDarkMode,
  toggleDarkMode,
  isCollapsed,
  setIsCollapsed,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContracts = contracts.filter((contract) =>
    contract.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } h-[calc(100%-2rem)] mt-4 mb-4 transition-all duration-300 flex flex-col
    backdrop-blur-lg rounded-lg shadow-lg ${
      isDarkMode
        ? "bg-[#141414]/70 text-white"
        : "bg-[#ffffff]/70 text-gray-900"
    }`}
    >
      <button
        className={`p-4 fixed top-3 ${isCollapsed ? "left-2" : "left-4"} z-50 ${
          isDarkMode
            ? "bg-[#334155] hover:bg-[#475569] text-white"
            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
        } flex items-center justify-center rounded-full shadow-md border ${
          isDarkMode ? "border-[#475569]" : "border-gray-400"
        }`}
        style={{
          borderWidth: "1px",
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <FiChevronRight size={20} />
        ) : (
          <FiChevronLeft size={20} />
        )}
      </button>
      <div className="p-4 flex items-center justify-center mt-16">
        {isCollapsed ? (
          <button
            className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md ${
              isDarkMode ? "bg-[#1e293b]" : "bg-white"
            }`}
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <BsMoon className="text-[#f8f9fa]" size={20} />
            ) : (
              <BsSun size={20} />
            )}
          </button>
        ) : (
          <div
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer relative ${
              isDarkMode ? "bg-[#94a3b8]" : "bg-gray-300"
            }`}
            onClick={toggleDarkMode}
          >
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full shadow-md transform transition-transform duration-300 ${
                isDarkMode
                  ? "translate-x-6 bg-[#1e293b]"
                  : "translate-x-0 bg-white"
              }`}
            >
              {isDarkMode ? (
                <BsMoon className="text-[#f8f9fa]" size={14} />
              ) : (
                <BsSun size={14} />
              )}
            </div>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <>
          <h2 className="text-lg font-bold mb-2 px-4">Smart Contracts</h2>
          <div className="px-4 mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-2 rounded ${
                isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
              }`}
            />
          </div>
        </>
      )}
      <ul className="flex-1 overflow-auto">
        {filteredContracts.map((contract) => (
          <li
            key={contract.source}
            onClick={() => onSelect(contract.source)}
            className={`flex items-center p-4 cursor-pointer ${
              selected === contract.source
                ? isDarkMode
                  ? "bg-[#475569]"
                  : "bg-gray-400"
                : isDarkMode
                ? "hover:bg-[#334155]"
                : "hover:bg-gray-300"
            }`}
          >
            <FaFileContract size={20} className="mr-2" />
            {!isCollapsed && (
              <span className="truncate" style={{ maxWidth: "100%" }}>
                {contract.name}
              </span>
            )}
          </li>
        ))}
        {filteredContracts.length === 0 && (
          <p className="text-gray-400 px-4">No contracts found</p>
        )}
      </ul>
      <footer className="p-4 flex justify-center items-center">
        <a
          href="https://twitter.com/unboundedmarket"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={isDarkMode ? XWhite : XBlack} alt="X" className="h-6 w-6" />
        </a>
      </footer>
    </aside>
  );
};

export default Sidebar;
