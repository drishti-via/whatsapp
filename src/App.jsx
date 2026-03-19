import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, LoaderCircle, MessageSquareWarning, Smartphone } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

export default function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileView, setMobileView] = useState('list');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/chats');
        setChats(response.data);
        setActiveChatId(response.data[0]?.id ?? null);
        setMobileView('list');
        setError('');
      } catch (fetchError) {
        setError('Unable to load chats right now. Try again in a moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? null,
    [activeChatId, chats]
  );

  const handleSendMessage = async (body) => {
    if (!activeChat) return;
    const response = await axios.post(`/api/chats/${activeChat.id}/messages`, { body });
    setChats((currentChats) =>
      currentChats.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              lastMessage: response.data.body,
              timeLabel: 'now',
              messages: [...chat.messages, response.data],
            }
          : chat
      )
    );
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setMobileView('chat');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111b21] px-4">
        <div className="flex items-center gap-3 rounded-2xl bg-[#202c33] px-6 py-4 text-white shadow-2xl">
          <LoaderCircle className="h-6 w-6 animate-spin text-brand-500" />
          Loading chats…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111b21] px-4">
        <div className="max-w-sm rounded-3xl bg-[#202c33] p-6 text-center text-white shadow-2xl">
          <MessageSquareWarning className="mx-auto mb-4 h-10 w-10 text-brand-500" />
          <p className="text-lg font-semibold">Couldn’t open WhatsApp mock</p>
          <p className="mt-2 text-sm text-[#aebac1]">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 min-h-[44px] rounded-full bg-brand-500 px-5 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b141a] md:p-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col overflow-hidden bg-[#f0f2f5] shadow-[0_6px_18px_rgba(11,20,26,0.35)] md:min-h-[calc(100vh-40px)] md:flex-row md:rounded-sm"
      >
        <div className="hidden bg-[#00a884] md:block md:h-[127px] md:w-full md:absolute md:top-0 md:left-0 md:-z-10" />
        <div className="flex h-screen w-full flex-col md:h-auto md:flex-row">
          <div className={`h-full w-full flex-col md:flex md:max-w-[420px] ${mobileView === 'list' ? 'flex' : 'hidden'}`}>
            <Sidebar chats={chats} activeChatId={activeChatId} onSelectChat={handleSelectChat} />
          </div>
          <div className="hidden md:flex md:flex-1">
            <ChatWindow chat={activeChat} onSendMessage={handleSendMessage} />
          </div>
          <div className={`flex flex-1 md:hidden ${mobileView === 'chat' ? 'flex' : 'hidden'}`}>
            {activeChat ? (
              <div className="flex w-full flex-col">
                <div className="flex items-center gap-3 bg-[#f0f2f5] px-3 py-2 text-ink-500 shadow-sm">
                  <button
                    type="button"
                    aria-label="Back to chats"
                    onClick={() => setMobileView('list')}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-medium">Chats</span>
                </div>
                <ChatWindow chat={activeChat} onSendMessage={handleSendMessage} />
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center bg-[#111b21] px-6 text-center text-white">
                <Smartphone className="mb-4 h-12 w-12 text-brand-500" />
                <p className="text-xl font-semibold">Select a chat</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
