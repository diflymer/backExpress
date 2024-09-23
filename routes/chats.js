var express = require('express');
var router = express.Router();
const Post = require('../models/post');
const Chat = require('../models/chat');
const User = require('../models/users');
const Interest = require('../models/interest');
const Message = require('../models/message');
const checkAuth = require('../middleware/checkAuth'); // Мидлвер
const { Op, Sequelize } = require('sequelize')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

router.get('/getAllUserChats', async (req, res, next) => {
    try {

        //Получить юзера
        const token = req.headers['authorization'];
        let userId;
        if (!token){
            throw new Error();
        } else{
            const decode = jwt.verify(token, jwtSecret);
            userId = decode.id;
        }

        //Получить чаты интересов (интересы пользователя и их чаты)
        let chats = await Chat.findAll({
          include: [
            {
              model: Interest,
              as: 'interest',
              required: true,
              include: [
                {
                  model: User,
                  as: 'followedUsers',  // alias для связи interest -> user
                  where: { id: userId }, // Условие для получения только чатов пользователя
                  through: { attributes: [] }, // Исключаем промежуточные данные из users_interests
                  attributes: [], // Исключаем данные пользователя из результата
                  required: true,
                }
              ],
              attributes: ['name'],
            }
          ],
          where: {
            type: 0, // Ваше условие для фильтрации чатов
          },
          attributes: ['id']
        });

        const chats_interests = chats.map( chat => ({
          id: chat.id,
          name: chat.interest.name
        }))

        //Получить чаты постов (Актуальные на которые он откликнулся и которыми владеет)
        chats = await Chat.findAll({
          attributes: ['id'], // Возвращаем только id чатов
          include: [
            {
              model: Post,
              as: 'post',
              attributes: ['name'], // Не возвращаем данные постов
              where: {
                [Op.or]: [
                  { ownerId: userId }, // Пользователь является хозяином поста
                  {
                    id: {
                      [Op.in]: Sequelize.literal(`(
                        SELECT "postId" FROM "users_posts" WHERE "userId" = ${userId}
                      )`) // Пользователь откликнулся на пост
                    }
                  }
                ],
                datetime_from : { [Op.lte] : new Date() },
                datetime_to: { [Op.gte] : new Date() }
              }
            }
          ]
        });

        const chats_posts = chats.map( chat => ({
          id: chat.id,
          name: chat.post.name
        }))

        //Объединение чатов
        chats = [...chats_interests, ...chats_posts].map( chat => chat.id)

        let messages = await Message.findAll({
          where: {
            chatId: {
              [Op.in]: chats, // Ищем сообщения только для указанных чатов
            }
          },
          attributes: ['id', 'text', 'userId', 'chatId', 'createdAt'], // Укажите нужные поля сообщений
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name']
            }
          ]
        });

        messages = messages.map( message => ({
          messageId: message.id,
          chatId: message.chatId,
          text: message.text,
          senderId: message.userId,
          senderName: message.user.name,
          date: message.createdAt
        }))

        res.json({
          chats_interests,
          chats_posts, 
          messages
        });

    } catch (err) {
        console.error('Ошибка получения чатов пользователя:', err);
        res.send("Ошибка получения чатов пользователя")
    }
});

router.get('/getChatById', async (req, res, next) => {
  try {

      const chatId = req.query.chatId;

      const chat = await Chat.findByPk(chatId)

      if (chat.type === 0){
        //Для чата интереса
        const interest = await Interest.findOne({where: {chatId}})
        res.json({interest, post: null})
      } else {
        //Для чата поста
        const post = await Post.findOne({where: {chatId}})
    
        const owner = await User.findByPk(post.ownerId)
  
        res.json({
          post: {
            owner_of_post: {
              name: owner.name,
              login: owner.username
              },
            ...post.dataValues
          },
          interest: null
        })
      }


  } catch (err) {
      console.error('Ошибка получения чата:', err);
      res.send("Ошибка получения чата")
  }
});


module.exports = router;