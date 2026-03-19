import { Archive, CircleDashed, MessageCircleMore, MoreVertical, Search } from 'lucide-react';
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
      className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

export default function Sidebar({ chats, activeChatId, onSelectChat }) {
  return (
    <aside className="flex h-full w-full flex-col bg-chat-100 md:max-w-[420px] md:border-r md:border-[#d1d7db]">
      <div className="flex items-center justify-between bg-[#f0f2f5] px-4 py-3">
        <Avatar name="You" color="#dfe5e7" />
        <div className="flex items-center gap-5 text-ink-500">
          <CircleDashed className="h-5 w-5" />
          <MessageCircleMore className="h-5 w-5" />
          <MoreVertical className="h-5 w-5" />
        </div>
      </div>

      <div className="border-b border-[#e9edef] bg-chat-100 px-3 py-2">
        <div className="flex min-h-[44px] items-center gap-3 rounded-lg bg-[#f0f2f5] px-4 text-ink-300">
          <Search className="h-4 w-4" />
          <span className="text-sm">Search or start new chat</span>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-[#e9edef] px-4 py-3 text-sm text-ink-500">
        <Archive className="h-4 w-4" /> Archived
      </div>

      <div className="overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            type="button"
            onClick={() => onSelectChat(chat.id)}
            className={clsx(
              'flex min-h-[72px] w-full items-center gap-3 border-b border-[#e9edef] px-4 py-3 text-left transition-colors',
              activeChatId === chat.id ? 'bg-[#f0f2f5]' : 'bg-chat-100 hover:bg-[#f5f6f6]'
            )}
          >
            <Avatar name={chat.name} color={chat.avatarColor} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="truncate text-base text-ink-700">{chat.name}</p>
                <span className="shrink-0 text-xs text-ink-300">{chat.timeLabel}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="truncate text-sm text-ink-500">{chat.lastMessage}</p>
                {chat.unreadCount > 0 ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-xs text-white">
                    {chat.unreadCount}
                  </span>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
