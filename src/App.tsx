import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import smartContracts from "./data/smart_contract_explanations.json";

const App: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState(smartContracts[0]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSelectContract = (source: string) => {
    const contract = smartContracts.find((c) => c.source === source);
    if (contract) setSelectedContract(contract);
  };

  return (
    <div
      className={`h-screen w-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
      style={{
        backgroundColor: isDarkMode ? "#000000" : "#F0F8FF",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex h-screen">
        <Sidebar
          contracts={smartContracts}
          selected={selectedContract.source}
          onSelect={handleSelectContract}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <MainContent
          contract={selectedContract}
          isDarkMode={isDarkMode}
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
};

export default App;
