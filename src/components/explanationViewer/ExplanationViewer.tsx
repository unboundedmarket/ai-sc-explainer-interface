import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AnalysisResults from "../analysis/AnalysisResults";
import { AnalysisView } from "../analysis/analysisTypes";

interface ExplanationSectionProps {
  isDarkMode: boolean;
  isMobile: boolean;
  leftWidth: number;
  contract: {
    name: string;
    model?: string;
    explanation: string;
  };
  handleAnalyze: () => void;
  analysis: any;
  analysisView: AnalysisView;
  setAnalysisView: React.Dispatch<React.SetStateAction<AnalysisView>>;
  AnalysisView: { [key: string]: string };
}

const ExplanationSection: React.FC<ExplanationSectionProps> = ({
  isDarkMode,
  isMobile,
  leftWidth,
  contract,
  handleAnalyze,
  analysis,
  analysisView,
  setAnalysisView,
  AnalysisView,
}) => {
  return (
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

      {/* Explanation Markdown */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {contract.explanation}
      </ReactMarkdown>

      {/* Analysis Section */}
      <div className="mt-4">
        <button
          onClick={handleAnalyze}
          className={`px-3 py-2 mr-2 rounded ${
            isDarkMode
              ? "bg-[#334155] hover:bg-[#475569] text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          Analyze Code with Tree-Sitter
        </button>

        {analysis && (
          <>
            <span className="text-sm ml-2 mr-2">View: </span>
            <select
              value={analysisView}
              onChange={(e) => setAnalysisView(e.target.value as AnalysisView)}
              className={`p-1 rounded ${
                isDarkMode
                  ? "bg-[#334155] hover:bg-[#475569] text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {Object.values(AnalysisView).map((view) => (
                <option key={view} value={view}>
                  {view}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="mt-4 space-y-4">
          <AnalysisResults
            analysis={analysis}
            analysisView={analysisView}
            isDarkMode={isDarkMode}
          />
        </div>
      )}
    </div>
  );
};

export default ExplanationSection;
