const User  = require('./users');
const Interest = require('./interest');
const Message = require('./message')
const Chat = require('./chat')
const Post = require('./post')
const UsersInterests = require('./usersInterests')
const UsersPosts = require('./usersPosts')

const setupAssociations = () => {
  //У пользователей много интересов
  User.belongsToMany(Interest, { through: UsersInterests, foreignKey: 'userId', otherKey: 'interestId', as: 'interests'});
  Interest.belongsToMany(User, { through: UsersInterests, foreignKey: 'interestId', otherKey: 'userId', as: 'followedUsers'});

  //У чата есть сообщения
  Chat.hasMany(Message, { foreignKey: 'chatId', as: 'messages'});
  Message.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat'});

  //У пользователя есть сообщения
  User.hasMany(Message, { foreignKey: 'userId', as: 'messages'});
  Message.belongsTo(User, { foreignKey: 'userId', as: 'user'});

  //У пользователя есть посты
  User.hasMany(Post, { foreignKey: 'ownerId', as: 'posts'});
  Post.belongsTo(User, { foreignKey: 'ownerId', as: 'owner'});

  //Пользователи откликаются на посты
  User.belongsToMany(Post, { through: UsersPosts, foreignKey: 'userId', otherKey: 'postId', as: 'followedPosts'});
  Post.belongsToMany(User, { through: UsersPosts, foreignKey: 'postId', otherKey: 'userId', as: 'followedUsers'});

  //У интересов и постов есть чат
  Chat.hasOne(Interest, { foreignKey: 'chatId', as: 'interest' });
  Interest.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });
  Chat.hasOne(Post, { foreignKey: 'chatId', as: 'post' });
  Post.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });
  
  console.log("Ассоциации выполнены");
};

module.exports = setupAssociations;