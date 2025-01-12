import React, { useState, useEffect, useRef } from "react";
import { analyzeSmartContract } from "../parser/treeSitterAll";
import { AnalysisView, type ContractAnalysis } from "./analysis/analysisTypes";
import { MainContentProps, ChatMessage } from "./types";
import { removeLineNumbers, formatString } from "../utils/stringUtils";
import Header from "./header/Header";
import ExplainButton from "./explainButton/ExplainButton";
import ChatBox from "./chatbox/ChatBox";
import CodeViewer from "./codeViewer/CodeViewer";
import ExplanationSection from "./explanationViewer/ExplanationViewer";

const MainContent: React.FC<MainContentProps> = ({
  contract,
  isDarkMode,
  isCollapsed,
}) => {
  const [leftWidth, setLeftWidth] = useState(50);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : true
  );
  const [showAbout, setShowAbout] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);

  // Chat states
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your AI assistant. Ask me anything about the contract!",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedCode, setSelectedCode] = useState("");
  const [showAddButton, setShowAddButton] = useState(false);
  const [addButtonPos, setAddButtonPos] = useState({ top: 0, left: 0 });

  // Analysis states
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [analysisView, setAnalysisView] = useState<AnalysisView>(
    AnalysisView.SyntaxTree
  );

  useEffect(() => {
    setAnalysis(null);
  }, [contract]);

  // On mobile resize detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Draggable splitter
  const handleDrag = (e: React.MouseEvent) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setLeftWidth(newWidth);
    }
  };
  const handleMouseDown = () => {
    document.addEventListener("mousemove", handleDrag as any);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", handleDrag as any);
    });
  };

  // "About" text
  const aboutText = (
    <div className="p-4 text-sm">
      <p>
        The AI Smart Contract Explainer provides a user-friendly way to
        understand and analyze smart contract code using LM-generated
        explanations.
      </p>
    </div>
  );
  const toggleAbout = () => {
    setShowAbout(!showAbout);
  };

  const language = contract.name.endsWith(".hs")
    ? "haskell"
    : contract.name.endsWith(".py")
    ? "python"
    : contract.name.endsWith(".ak")
    ? "haskell"
    : "javascript";

  // Mouse-based code selection
  const handleCodeSelection = () => {
    const selection = window.getSelection();
    if (!selection) return;

    const text = selection.toString().trim();
    if (text.length === 0) {
      setSelectedCode("");
      setShowAddButton(false);
      return;
    }
    const formattedString = formatString(
      "Explain the following smart contract code:",
      removeLineNumbers(text)
    );
    setSelectedCode(formattedString);
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const top = rect.top + window.scrollY - 30;
      const left = rect.left + rect.width + window.scrollX + 10;
      setAddButtonPos({ top, left });
      setShowAddButton(true);
    }
  };
  const handleAddCodeToChat = () => {
    if (!selectedCode) return;
    setCurrentMessage((prev) =>
      prev ? `${prev}\n\n${selectedCode}` : selectedCode
    );
    setSelectedCode("");
    setShowAddButton(false);
  };

  // Chat
  const handleSend = async () => {
    if (!currentMessage.trim()) return;
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: currentMessage.trim() },
    ];
    setMessages(newMessages);
    setCurrentMessage("");

    try {
      // Dummy endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentMessage.trim(),
          history: newMessages,
        }),
      });
      const data = await response.json();
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.answer || "No response found.",
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "There was an error processing your request.",
        },
      ]);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleAnalyze = async () => {
    try {
      const { analysis } = await analyzeSmartContract(
        contract.code,
        contract.name
      );
      setAnalysis(analysis);
      setAnalysisView(AnalysisView.SyntaxTree);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex flex-col h-screen space-y-4 max-w-[90%] mx-auto overflow-x-hidden">
      {/* Header */}
      <header
        className={`w-full p-4 mt-4 backdrop-blur-lg rounded-lg shadow-lg text-center transition-colors duration-300 ${
          isDarkMode
            ? "bg-[#141414]/70 text-white"
            : "bg-[#ffffff]/70 text-gray-900"
        } relative`}
      >
        <Header
          isMobile={isMobile}
          iconRef={iconRef}
          isDarkMode={isDarkMode}
          toggleAbout={toggleAbout}
        />
        {showAbout && (
          <div
            className={`mt-4 rounded-lg ${
              isDarkMode
                ? "bg-[#141414]/70 text-white"
                : "bg-[#ffffff]/70 text-gray-900"
            }`}
          >
            {aboutText}
          </div>
        )}
      </header>

      <main
        className={`flex ${
          isMobile ? "flex-col" : "flex-row"
        } h-full w-full overflow-hidden gap-4`}
      >
        {/* Left panel (code) */}
        <CodeViewer
          isDarkMode={isDarkMode}
          isMobile={isMobile}
          leftWidth={leftWidth}
          handleCodeSelection={handleCodeSelection}
          contract={contract}
          language={language}
        />

        {/* Draggable handle (desktop only) */}
        {!isMobile && (
          <div
            className="bg-gray-300 cursor-col-resize"
            style={{ width: "8px" }}
            onMouseDown={handleMouseDown}
          />
        )}

        {/* right panel: Explanation + Analysis UI */}
        <ExplanationSection
          isDarkMode={isDarkMode}
          isMobile={isMobile}
          leftWidth={leftWidth}
          contract={contract}
          handleAnalyze={handleAnalyze}
          analysis={analysis}
          analysisView={analysisView}
          setAnalysisView={setAnalysisView}
          AnalysisView={AnalysisView}
        />
      </main>

      {/* The "Explain" floating button for selected code */}
      <ExplainButton
        showAddButton={showAddButton}
        selectedCode={selectedCode}
        addButtonPos={addButtonPos}
        isDarkMode={isDarkMode}
        handleAddCodeToChat={handleAddCodeToChat}
      />

      {/* Chat area */}
      <ChatBox
        isDarkMode={isDarkMode}
        messages={messages}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        handleKeyDown={handleKeyDown}
        handleSend={handleSend}
      />
    </div>
  );
};

export default MainContent;
