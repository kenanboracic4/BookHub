const sequelize = require("../config/db");
const User = require("./tables/Users");
const Book = require("./tables/Book");
const Order = require("./tables/Order");
const OrderItem = require("./tables/OrderItem");
const Cart = require("./tables/Cart");
const UserLanguages = require("./tables/UserLanguages");
const UserGenres = require("./tables/UserGenres");
const BookRating = require("./tables/BookRating");
const UserRating = require("./tables/UserRating");
const Notification = require("./tables/Notification");
const Conversation = require("./tables/Conversation");
const Messages = require("./tables/Messages");
const Report = require("./tables/Report");

const GenresLK = require("./Lookups/GenresLK");
const LanguagesLK = require("./Lookups/LanguageLK");
const LocationsLK = require("./Lookups/LocationsLK");
const BookConditionsLK = require("./Lookups/BookConditionsLK");
const { Sequelize } = require("sequelize");

// ==========================================
// 1. KORISNICI I KNJIGE
// ==========================================
User.hasMany(Book, { foreignKey: 'sellerId', as: 'ownedBooks' });
Book.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

// ==========================================
// 2. LOOKUP TABELE (Karakteristike knjiga)
// ==========================================
GenresLK.hasMany(Book, { foreignKey: 'genreId' });
Book.belongsTo(GenresLK, { foreignKey: 'genreId', as: 'genre' }); 

LanguagesLK.hasMany(Book, { foreignKey: 'languageId' });
Book.belongsTo(LanguagesLK, { foreignKey: 'languageId', as: 'language' });

BookConditionsLK.hasMany(Book, { foreignKey: 'conditionId' });
Book.belongsTo(BookConditionsLK, { foreignKey: 'conditionId', as: 'condition' });

LocationsLK.hasMany(Book, { foreignKey: 'locationId' });
Book.belongsTo(LocationsLK, { foreignKey: 'locationId', as: 'location' });

LocationsLK.hasMany(User, { foreignKey: 'locationId' });
User.belongsTo(LocationsLK, { foreignKey: 'locationId', as: 'location' });

// ==========================================
// 3. INTERESI KORISNIKA (Many-to-Many)
// ==========================================
User.belongsToMany(GenresLK, { 
    through: UserGenres, 
    foreignKey: 'userId', 
    otherKey: 'genreId', 
    as: 'Genres' 
});
GenresLK.belongsToMany(User, { through: UserGenres, foreignKey: 'genreId' });

User.belongsToMany(LanguagesLK, { 
    through: UserLanguages, 
    foreignKey: 'userId', 
    otherKey: 'languageId',
    as: 'Languages' 
});
LanguagesLK.belongsToMany(User, { through: UserLanguages, foreignKey: 'languageId' });

// ==========================================
// 4. KORPA I NARUDŽBE
// ==========================================
User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });
Book.hasMany(Cart, { foreignKey: 'bookId' });
Cart.belongsTo(Book, { foreignKey: 'bookId' });

User.hasMany(Order, { foreignKey: 'buyerId', as: 'purchases' });
Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

User.hasMany(Order, { foreignKey: 'sellerId', as: 'sales' });
Order.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });


Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Book.hasMany(OrderItem, { foreignKey: 'bookId', as: 'orderItems' });
OrderItem.belongsTo(Book, { foreignKey: 'bookId' , as: 'book' });

// ==========================================
// 5. OCJENJIVANJE (Ratings)
// ==========================================

User.hasMany(UserRating, { foreignKey: 'raterId', as: 'givenUserRatings' });
UserRating.belongsTo(User, { foreignKey: 'raterId', as: 'rater' });

User.hasMany(UserRating, { foreignKey: 'userId', as: 'receivedUserRatings' });
UserRating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(BookRating, { foreignKey: 'userId', as: 'bookRatings' });
BookRating.belongsTo(User, { foreignKey: 'userId', as: 'reviewer' });

Book.hasMany(BookRating, { foreignKey: 'bookId', as: 'bookReviews' });
BookRating.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });


User.belongsToMany(Book, { 
    through: BookRating, 
    foreignKey: 'userId', 
    otherKey: 'bookId', 
    as: 'ratedBooks' 
});
Book.belongsToMany(User, { 
    through: BookRating, 
    foreignKey: 'bookId', 
    otherKey: 'userId', 
    as: 'ratedByUsers' 
});

// ==========================================
// 6. NOTIFIKACIJE
// ==========================================
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'recipient' });

User.hasMany(Notification, { foreignKey: 'senderId', as: 'sentNotifications' });
Notification.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// ==========================================
// 7. CHAT SISTEM
// ==========================================



User.hasMany(Conversation, { foreignKey: 'buyerId', as: 'buyerConversations' });
Conversation.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });


User.hasMany(Conversation, { foreignKey: 'sellerId', as: 'sellerConversations' });
Conversation.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });


Book.hasMany(Conversation, { foreignKey: 'bookId' });
Conversation.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

// --- Relacije za Messages ---

Conversation.hasMany(Messages, { foreignKey: 'conversationId', as: 'messages' });
Messages.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });


User.hasMany(Messages, { foreignKey: 'senderId', as: 'sentMessages' });
Messages.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });


// ==========================================
// 8. SISTEM PRIJAVA (Reports)
// ==========================================


User.hasMany(Report, { foreignKey: 'reporterId', as: 'reportsSent' });
Report.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });




Report.belongsTo(User, { foreignKey: 'targetId', as: 'reportedUser', constraints: false });


Report.belongsTo(Book, { foreignKey: 'targetId', as: 'reportedBook', constraints: false });
module.exports = {
    Sequelize,
    User,
    UserRating,
    Book,
    BookRating,
    Order,
    OrderItem,
    Cart,
    GenresLK,
    LanguagesLK,
    BookConditionsLK,
    LocationsLK,
    UserGenres,
    UserLanguages,
    Notification,
    Messages,
    Conversation,
    Report
};