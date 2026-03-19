import { Mic, MoreVertical, Paperclip, Phone, Search, Send, Smile, Video } from 'lucide-react';
import { useMemo, useState } from 'react';
import clsx from 'clsx';

function Avatar({ name, color }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

export default function ChatWindow({ chat, onSendMessage }) {
  const [draft, setDraft] = useState('');

  const groupedMessages = useMemo(() => chat?.messages ?? [], [chat]);

  if (!chat) {
    return <div className="hidden flex-1 bg-[#222e35] md:flex" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    await onSendMessage(draft);
    setDraft('');
  };

  return (
    <section className="flex h-full flex-1 flex-col bg-[#efeae2] bg-[url('https://www.transparenttextures.com/patterns/45-degree-fabric-light.png')]">
      <header className="flex items-center justify-between bg-[#f0f2f5] px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar name={chat.name} color={chat.avatarColor} />
          <div>
            <h2 className="text-base font-medium text-ink-700">{chat.name}</h2>
            <p className="text-xs text-ink-500">{chat.status}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-ink-500">
          <Video className="h-5 w-5" />
          <Phone className="h-5 w-5" />
          <Search className="h-5 w-5" />
          <MoreVertical className="h-5 w-5" />
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4 md:px-10">
        <div className="mx-auto w-fit rounded-lg bg-[#fff3c4] px-3 py-1 text-center text-xs text-[#54656f] shadow-sm">
          Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen.
        </div>
        {groupedMessages.map((message) => (
          <div
            key={message.id}
            className={clsx('flex', message.isOwn ? 'justify-end' : 'justify-start')}
          >
            <div
              className={clsx(
                'max-w-[85%] rounded-lg px-3 py-2 text-[15px] leading-relaxed shadow-sm md:max-w-[65%]',
                message.isOwn ? 'bg-chat-300 text-ink-700' : 'bg-chat-100 text-ink-700'
              )}
            >
              <p>{message.body}</p>
              <div className="mt-1 flex justify-end gap-1 text-[11px] text-ink-300">
                <span>{new Date(message.sentAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                {message.isOwn ? <span>{message.status === 'read' ? '✓✓' : '✓'}</span> : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-[#f0f2f5] px-3 py-3 md:px-6">
        <button type="button" className="min-h-[44px] min-w-[44px] text-ink-500" aria-label="Emoji picker">
          <Smile className="h-6 w-6" />
        </button>
        <button type="button" className="min-h-[44px] min-w-[44px] text-ink-500" aria-label="Attach file">
          <Paperclip className="h-6 w-6" />
        </button>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message"
          className="min-h-[44px] flex-1 rounded-lg border-none bg-chat-100 px-4 text-base text-ink-700 outline-none"
        />
        <button
          type={draft.trim() ? 'submit' : 'button'}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-ink-500"
          aria-label={draft.trim() ? 'Send message' : 'Record voice note'}
        >
          {draft.trim() ? <Send className="h-5 w-5" /> : <Mic className="h-6 w-6" />}
        </button>
      </form>
    </section>
  );
}
