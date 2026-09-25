"use client";

import { useRequestPlaygroundStore } from "../store/useRequestStore";
import RequestBar from "./request-bar";
import RequestEditorArea from "./request-editor-area";
import ResponseViewer from "./response-viewer";

export default function RequestEditor() {
  const { tabs, activeTabId, updateTab, responseViewerData } =
    useRequestPlaygroundStore();

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  if (!activeTab) {
    return null;
  }

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-start px-4 py-4">
      {/* Request URL + Method + Send */}
      <RequestBar tab={activeTab} updateTab={updateTab} />

      {/* Request Editor */}
      <div className="mt-4 flex w-full flex-1 flex-col items-center justify-start">
        <RequestEditorArea tab={activeTab} updateTab={updateTab} />
      </div>

      {/* Response */}
      {responseViewerData && (
        <div className="mt-6 w-full">
          <ResponseViewer responseData={responseViewerData} />
        </div>
      )}
    </div>
  );
}
