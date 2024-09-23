const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Message = require('../models/message');

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Присоединение пользователя ко всем его чатам
      socket.on('joinUserChats', (chatIds) => {
        chatIds.forEach(chatId => {
          socket.join(chatId); // Добавляем пользователя в каждую комнату
          console.log(`Пользователь ${socket.id} присоединился к чату ${chatId}`);
        });
      });
  
      // Обработчик для сообщения
      socket.on('sendMessage', async (msg) => {
        console.log('message received:', msg);

        const token = socket.handshake.query.token;
        let decoded;
        try{
          decoded = jwt.verify(token, jwtSecret)
        } catch(err){
          console.log('Юзер не прошел verify')
          return null;
        }
        const userId = decoded.id;
        console.log('from userId: ', userId);

        const message = await Message.create({
          text: msg.text,
          chatId: msg.chatId,
          userId
        })

        const user = await User.findByPk(userId);

        // Логируем все комнаты, к которым присоединён socket
        console.log('Комнаты, к которым подключен сокет:', socket.rooms);

        // Отправка сообщения всем пользователям
        io.to(+msg.chatId).emit('newMessage', {
          ...msg,
          senderId: user.id,
          senderName: user.name,
          date: message.createdAt
        });
        console.log('Сообщение отправлено в чат с chatId: ' + msg.chatId)
      });
  
      // Обработчик отключения
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
};