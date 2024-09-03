import express from 'express';
import { MentorChat } from '../models/MentorChat.model.js';



const router = express.Router();
export default (io) => {
  router.get('/student/:studentId', async (req, res) => {
    try {
      const chats = await MentorChat.find({ studentId: req.params.studentId });
      res.json(chats);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/mentor/:mentorId', async (req, res) => {
    try {
      const chats = await MentorChat.find({ mentorId: req.params.mentorId });
      res.json(chats);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/mentor/:mentorId/student/:studentId', async (req, res) => {
    const { mentorId, studentId } = req.params;
    try {
      let chat = await MentorChat.findOne({ mentorId, studentId });
      if (!chat) {
        chat = new MentorChat({ mentorId, studentId, messages: [] });
        await chat.save();
      }
      res.json(chat);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/send', async (req, res) => {
    const { mentorId, studentId, text, sender } = req.body;
    try {
      let chat = await MentorChat.findOne({ mentorId, studentId });
      if (!chat) {
        chat = new MentorChat({ mentorId, studentId, messages: [] });
      }
      chat.messages.push({ text, sender });
      await chat.save();

      const room = `${mentorId}-${studentId}`;
      io.to(room).emit('receiveMessage', { chat });

      res.json(chat);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};