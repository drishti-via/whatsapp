import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const chats = [
  {
    name: 'Ava Thompson',
    lastMessage: 'Can you send the deck before 3?',
    timeLabel: '2:14 PM',
    unreadCount: 2,
    avatarColor: '#7F66FF',
    status: 'online',
    phone: '+1 (415) 555-0142',
    messages: [
      { body: 'Morning! Are we still on for the client review?', sentAt: new Date('2026-03-19T13:58:00Z'), isOwn: false, status: 'read' },
      { body: 'Yep, polishing the last two slides now.', sentAt: new Date('2026-03-19T14:02:00Z'), isOwn: true, status: 'read' },
      { body: 'Can you send the deck before 3?', sentAt: new Date('2026-03-19T14:14:00Z'), isOwn: false, status: 'delivered' }
    ]
  },
  {
    name: 'Design Crew',
    lastMessage: 'Mina: The new icons are in Figma ✨',
    timeLabel: '1:02 PM',
    unreadCount: 5,
    avatarColor: '#00A884',
    status: '23 participants',
    phone: 'Group chat',
    messages: [
      { body: 'Quick pulse check on the onboarding flow?', sentAt: new Date('2026-03-19T12:40:00Z'), isOwn: true, status: 'read' },
      { body: 'The new icons are in Figma ✨', sentAt: new Date('2026-03-19T13:02:00Z'), isOwn: false, status: 'delivered' }
    ]
  },
  {
    name: 'Mom',
    lastMessage: 'Dinner at 7. Don’t be late ❤️',
    timeLabel: 'Yesterday',
    unreadCount: 0,
    avatarColor: '#F15C6D',
    status: 'last seen today at 11:48 AM',
    phone: '+1 (212) 555-0188',
    messages: [
      { body: 'Can you pick up bread on your way?', sentAt: new Date('2026-03-18T22:10:00Z'), isOwn: false, status: 'read' },
      { body: 'Yep, got it.', sentAt: new Date('2026-03-18T22:12:00Z'), isOwn: true, status: 'read' },
      { body: 'Dinner at 7. Don’t be late ❤️', sentAt: new Date('2026-03-18T22:15:00Z'), isOwn: false, status: 'read' }
    ]
  },
  {
    name: 'Noah',
    lastMessage: 'Voice call missed',
    timeLabel: 'Tuesday',
    unreadCount: 0,
    avatarColor: '#FF9F0A',
    status: 'last seen yesterday at 9:03 PM',
    phone: '+1 (646) 555-0111',
    messages: [
      { body: 'Tried calling you after the game.', sentAt: new Date('2026-03-17T03:10:00Z'), isOwn: false, status: 'read' },
      { body: 'Sorry, phone died. Catch up tomorrow?', sentAt: new Date('2026-03-17T03:18:00Z'), isOwn: true, status: 'read' }
    ]
  }
];

async function main() {
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();

  for (const chat of chats) {
    const { messages, ...chatData } = chat;
    await prisma.chat.create({
      data: {
        ...chatData,
        messages: {
          create: messages,
        },
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
