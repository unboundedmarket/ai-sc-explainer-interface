import React from "react";
import { BsLightbulb } from "react-icons/bs";

interface HeaderProps {
  isMobile: boolean;
  iconRef: React.RefObject<HTMLButtonElement>;
  isDarkMode: boolean;
  toggleAbout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isMobile,
  iconRef,
  isDarkMode,
  toggleAbout,
}) => {
  return isMobile ? (
    <div className="flex flex-col items-center space-y-2">
      <h1 className="text-2xl font-bold mb-1">AI Smart Contract Explainer</h1>
      <button
        ref={iconRef}
        className={`
          ${isDarkMode ? "text-white" : "text-gray-900"}
          p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#334155] transition-colors duration-200
        `}
        onClick={toggleAbout}
      >
        <BsLightbulb size={20} />
      </button>
      <p className="text-sm">Powered by UnboundedMarket</p>
    </div>
  ) : (
    <>
      <div className="inline-flex items-center justify-center space-x-2">
        <h1 className="text-2xl font-bold mb-1">AI Smart Contract Explainer</h1>
        <button
          ref={iconRef}
          className={`
            ${isDarkMode ? "text-white" : "text-gray-900"}
            p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#334155] transition-colors duration-200
          `}
          onClick={toggleAbout}
        >
          <BsLightbulb size={20} />
        </button>
      </div>
      <p className="text-sm">Powered by UnboundedMarket</p>
    </>
  );
};

export default Header;
