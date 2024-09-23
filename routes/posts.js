var express = require('express');
var router = express.Router();
const Post = require('../models/post');
const Chat = require('../models/chat');
const User = require('../models/users');
const checkAuth = require('../middleware/checkAuth'); // Мидлвер
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

/* GET users listing. */
router.get('/getAllAds', async function(req, res, next) {
  try {
    //Вернуть все посты, где юзер не хозяин, и на которые он еще не откликнулся. И которые актуальны (datetime_from < now < datetime_to)

    //Добавить секционную (по 10) загрузку

    //Добавить на которые он еще не откликнулся


    //Добавить разделение по типам постов в гет параметре (ok)
    const type = req.query.type;
    //Добавить где юзер не хозяин
    let ownerId;
    const token = req.headers['authorization'];
    
    if (!token){
      ownerId = null;
    } else {
      let decoded;
      try{
        decoded = jwt.verify(token, jwtSecret);
        ownerId = decoded?.id;
      } catch(err){
        ownerId = null;
      }
    }
    const posts = await Post.findAll({ 
      include: [
        {
          model: User,
          as: 'followedUsers', // название ассоциации, если вы явно её задавали
          where: {
            id: ownerId,
          },
          required: false, // Важно: это позволит вернуть посты без связи с пользователем
          through: {
            attributes: [], // Исключаем атрибуты из таблицы соединения
          }
        }
      ],
      where: {
        datetime_from : { [Op.lte] : new Date() },
        datetime_to: { [Op.gte] : new Date() },
        type,
        ownerId: {
          [Op.ne] : ownerId
        },
        '$followedUsers.id$': {
          [Op.is]: null, // Только посты без откликов от этого пользователя
        }
      }

     });
    //Для каждого поста получить owner'a
    const processedPosts = []
    for (const post of posts){

      const owner = await User.findByPk(post.ownerId)

      processedPosts.push({
        owner_of_post: {
          name: owner.name,
          login: owner.username
          },
        ...post.dataValues,
        signed: false
      })
    }

    res.json(processedPosts)
    
  } catch (err) {
    console.error('Ошибка получения всех постов :', err);
    res.send("Ошибка получения всех постов")
  }
});

router.get('/getAllUserAds', async function(req, res, next) {
  try {
    
    const user = await User.findByPk(req.query.creatorId);

    //Посты юзера
    let posts = await user.getPosts({joinTableAttributes: []});
    //Для каждого поста добавить owner'a
    const processedPosts = []
    for (const post of posts){

      processedPosts.push({
        owner_of_post: {
          name: user.name,
          login: user.username
          },
        ...post.dataValues,
        signed: true
      })
    }

    res.json(processedPosts);
    
  } catch (err) {
    console.error('Ошибка получения постов пользователя:', err);
    res.send("Ошибка получения постов пользователя")
  }
});

router.post('/createAd', checkAuth, async function(req, res, next) {
    try {
        
      const { name, type, desc, place, datetime_from, datetime_to, has_chat, max_people } = req.body;

      //Создать чат поста
      const newChat = await Chat.create({type: 1});

      const newPost = await Post.create({name, type, desc, place, datetime_from, datetime_to, has_chat, max_people, chatId: newChat.id});
      //можно будет сразу добавлять ownerId при создании интересов (оптимизация)
      ownerId = req.id;

      await newPost.setOwner(ownerId);

      res.status(201).send();
    } catch (err) {
      
      console.error('Ошибка создания поста:', err);
      res.send("Ошибка создания поста")

    }
});

router.put('/signUser', async (req, res, next) => {

  try{

    //Взять id пользователя
    const token = req.headers['authorization'];
    let userId;
    if (!token){
      userId = null;
    } else{
      const decode = jwt.verify(token, jwtSecret);
      userId = decode.id;
    }

    const user = await User.findByPk(userId);

    //Взять id поста
    const postId = req.query.adId;

    //Проверить, не откликнулся ли пользователь уже

    //Добавить отклик
    await user.addFollowedPost(postId);

    res.status(201).send();

  } catch (err){
    console.error('Ошибка отклика', err);
    res.status(401).send('Ошибка отклика');
  }
});

module.exports = router;