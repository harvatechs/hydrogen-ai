
import { ChatProvider } from "@/context/ChatContext";
import { Header } from "@/components/Header";
import { ChatHistory } from "@/components/ChatHistory";
import { ChatInput } from "@/components/ChatInput";

const Index = () => {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <div className="flex-1 overflow-hidden">
          <ChatHistory />
        </div>
        <div className="p-4 border-t bg-white">
          <ChatInput />
        </div>
      </div>
    </ChatProvider>
  );
};

export default Index;
