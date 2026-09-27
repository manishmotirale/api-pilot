"use client";

import RealtimeConnectionBar from "@/modules/realtime/components/realtime-connection-bar";
import RealtimeMessageEditor from "@/modules/realtime/components/realtime-message-editor";

const RealtimePage = () => {
  return (
    <div className="flex h-full flex-col bg-zinc-950">
      {/* Header */}
      <div className="space-y-2 px-6 py-6">
        <h1 className="text-2xl font-bold text-white">WebSocket</h1>

        <p className="text-sm text-muted-foreground">
          Connect to a websocket server and start testing!
        </p>

        {/* Connection Bar */}
        <RealtimeConnectionBar />
      </div>

      {/* Message Editor */}
      <div className="flex flex-1 flex-col overflow-auto px-6 pb-6">
        <RealtimeMessageEditor />
      </div>
    </div>
  );
};

export default RealtimePage;
