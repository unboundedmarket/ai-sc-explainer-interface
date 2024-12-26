import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BsLightbulb } from "react-icons/bs";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface MainContentProps {
  contract: {
    model: string;
    name: string;
    source: string;
    code: string;
    explanation: string;
  };
  isDarkMode: boolean;
  isCollapsed: boolean;
}

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

  const aboutText = (
    <div className="p-4 text-sm">
      <p>
        The AI Smart Contract Explainer provides a user-friendly way to
        understand and analyze smart contract code using LM-generated
        explanations.
      </p>
    </div>
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const toggleAbout = () => {
    setShowAbout(!showAbout);
  };

  function removeLineNumbers(text: string): string {
    // Remove line numbers
    return text.replace(/^[0-9]+/gm, "");
  }

  const formatString = (instruction: string, input_str: string): string => {
    return `### Instruction:\n${instruction}\n\n### Input:\n${input_str}\n\n### Response:\n`;
  };

  const language = contract.name.endsWith(".hs")
    ? "haskell"
    : contract.name.endsWith(".py")
    ? "python"
    : contract.name.endsWith(".ak")
    ? "haskell"
    : "javascript";

  const handleCodeSelection = () => {
    const selection = window.getSelection();
    if (!selection) return;

    const text = selection.toString().trim();
    if (text.length === 0) {
      // empty selection
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
  return (
    <div className="flex flex-col h-screen space-y-4 max-w-[90%] mx-auto overflow-x-hidden">
      <header
        className={`w-full p-4 mt-4 backdrop-blur-lg rounded-lg shadow-lg text-center transition-colors duration-300 ${
          isDarkMode
            ? "bg-[#141414]/70 text-white"
            : "bg-[#ffffff]/70 text-gray-900"
        } relative`}
      >
        {isMobile ? (
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-2xl font-bold mb-1">
              AI Smart Contract Explainer
            </h1>
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
              <h1 className="text-2xl font-bold mb-1">
                AI Smart Contract Explainer
              </h1>
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
        )}
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
        <div
          className={`p-4 overflow-auto backdrop-blur-lg rounded-lg mb-4 shadow-lg transition-colors duration-300 relative ${
            isDarkMode
              ? "bg-[#141414]/70 text-white"
              : "bg-[#ffffff]/70 text-gray-900"
          }`}
          style={{
            width: isMobile ? "100%" : `${leftWidth}%`,
          }}
          onMouseUp={handleCodeSelection}
        >
          {isMobile ? (
            <>
              <h2 className="text-xl font-bold mb-1 break-all">
                {contract.name} Code
              </h2>
              {contract.source && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 break-all">
                  {contract.source}
                </p>
              )}
            </>
          ) : (
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 break-all">
              <span>{contract.name} Code</span>
              {contract.source && (
                <span className="text-sm text-gray-600 dark:text-gray-300 break-all">
                  ({contract.source})
                </span>
              )}
            </h2>
          )}

          <div className="overflow-auto max-h-[70vh] rounded-md">
            <SyntaxHighlighter
              language={language}
              style={isDarkMode ? vscDarkPlus : vs}
              showLineNumbers
              customStyle={{
                background: "transparent",
                fontSize: "0.9rem",
                lineHeight: "1.4em",
                borderRadius: "0.5rem",
                padding: "1em",
              }}
            >
              {contract.code}
            </SyntaxHighlighter>
          </div>
        </div>
        {!isMobile && (
          <div
            className="bg-gray-300 cursor-col-resize"
            style={{ width: "8px" }}
            onMouseDown={handleMouseDown}
          />
        )}
        <div
          className={`p-4 overflow-auto backdrop-blur-lg mb-4 rounded-lg shadow-lg transition-colors duration-300 ${
            isDarkMode
              ? "bg-[#141414]/70 text-white"
              : "bg-[#ffffff]/70 text-gray-900"
          }`}
          style={{
            width: isMobile ? "100%" : `${100 - leftWidth}%`,
          }}
        >
          {isMobile ? (
            <>
              <h2 className="text-xl font-bold mb-1 break-all">
                {contract.name} Explanation
              </h2>
              {contract.model && (
                <p className="text-sm text-blue-500 underline mb-4 break-all">
                  <a
                    href={contract.model}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Model
                  </a>
                </p>
              )}
            </>
          ) : (
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2 break-all">
              <span>{contract.name} Explanation</span>
              {contract.model && (
                <span className="text-sm break-all">
                  (
                  <a
                    href={contract.model}
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Model
                  </a>
                  )
                </span>
              )}
            </h2>
          )}

          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {contract.explanation}
          </ReactMarkdown>
        </div>
      </main>
      {showAddButton && selectedCode && (
        <button
          onClick={handleAddCodeToChat}
          style={{
            position: "fixed",
            top: addButtonPos.top,
            left: addButtonPos.left,
            zIndex: 9999,
          }}
          className={`px-3 py-2 text-sm rounded shadow transition-colors ${
            isDarkMode
              ? "bg-[#334155] hover:bg-[#475569] text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          Explain
        </button>
      )}

      <div
        className={`p-4 backdrop-blur-lg rounded-lg shadow-lg transition-colors duration-300 mb-4 ${
          isDarkMode
            ? "bg-[#141414]/70 text-white"
            : "bg-[#ffffff]/70 text-gray-900"
        }`}
      >
        <h2 className="text-xl font-bold mb-2">Chat</h2>
        <div className="border rounded p-2 mb-4 max-h-60 overflow-auto space-y-2">
          {messages.map((msg, idx) => (
            <div key={idx} className="whitespace-pre-wrap">
              <strong className="mr-2">
                {msg.role === "assistant" ? "Assistant:" : "You:"}
              </strong>
              <span>{msg.content}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            className={`flex-1 p-2 rounded border ${
              isDarkMode
                ? "bg-[#0f0f0f] border-gray-600 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
            placeholder="Ask a follow-up question..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            className={`px-4 py-2 rounded ${
              isDarkMode
                ? "bg-[#334155] hover:bg-[#475569] text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
