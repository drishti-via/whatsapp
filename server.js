import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/chats', async (req, res) => {
  try {
    const chats = await prisma.chat.findMany({
      include: {
        messages: {
          orderBy: { sentAt: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });
    res.json(chats);
  } catch (error) {
    console.error('Failed to fetch chats', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

app.post('/api/chats/:id/messages', async (req, res) => {
  const chatId = Number(req.params.id);
  const { body } = req.body;

  if (!body?.trim()) {
    return res.status(400).json({ error: 'Message body is required' });
  }

  try {
    const message = await prisma.message.create({
      data: {
        chatId,
        body: body.trim(),
        sentAt: new Date(),
        isOwn: true,
        status: 'sent',
      },
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastMessage: message.body,
        timeLabel: 'now',
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Failed to send message', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(process.env.PORT || 3001, () => {
  console.log('Server listening on port 3001');
});
