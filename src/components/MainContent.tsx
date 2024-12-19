import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BsLightbulb } from "react-icons/bs";

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

  const language = contract.name.endsWith(".hs")
    ? "haskell"
    : contract.name.endsWith(".py")
    ? "python"
    : contract.name.endsWith(".ak")
    ? "haskell"
    : "javascript";

  const toggleAbout = () => {
    setShowAbout(!showAbout);
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
          className={`p-4 overflow-auto backdrop-blur-lg rounded-lg mb-4 shadow-lg transition-colors duration-300 ${
            isDarkMode
              ? "bg-[#141414]/70 text-white"
              : "bg-[#ffffff]/70 text-gray-900"
          }`}
          style={{
            width: isMobile ? "100%" : `${leftWidth}%`,
          }}
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
    </div>
  );
};

export default MainContent;
