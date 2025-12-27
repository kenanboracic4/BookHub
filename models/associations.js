const sequelize = require("../config/db");
const User = require("./tables/Users");
const Book = require("./tables/Book");
const Order = require("./tables/Order");
const OrderItem = require("./tables/OrderItem");
const Cart = require("./tables/Cart");
const UserLanguages = require("./tables/UserLanguages");
const UserGenres = require("./tables/UserGenres");

const GenresLK = require("./Lookups/GenresLK");
const LanguagesLK = require("./Lookups/LanguageLK");
const LocationsLK = require("./Lookups/LocationsLK");
const BookConditionsLK = require("./Lookups/BookConditionsLK");
const { Sequelize } = require("sequelize");


 //RELACIJE ZA KORISNIKE I KNJIGE

// Jedan korisnik može objaviti mnogo knjiga 
User.hasMany(Book, { foreignKey: 'sellerId', as: 'ownedBooks' });
Book.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

// LOOKUP TABELE
// Povezujemo knjige sa njihovim karakteristikama iz LK tabela 

// Žanrovi 
GenresLK.hasMany(Book, { foreignKey: 'genreId' });
Book.belongsTo(GenresLK, { foreignKey: 'genreId', as: 'genre' }); 

// Jezici 
LanguagesLK.hasMany(Book, { foreignKey: 'languageId' });
Book.belongsTo(LanguagesLK, { foreignKey: 'languageId', as: 'language' });

// Stanje knjige 
BookConditionsLK.hasMany(Book, { foreignKey: 'conditionId' });
Book.belongsTo(BookConditionsLK, { foreignKey: 'conditionId', as: 'condition' });

// Lokacije 
LocationsLK.hasMany(Book, { foreignKey: 'locationId' });
Book.belongsTo(LocationsLK, { foreignKey: 'locationId', as: 'location' });

// Povezivanje korisnika sa gradom
// Napomena: Proveri da li User model ima kolonu 'locationId'. 
// Ako u User modelu imaš kolonu 'locationId', koristi nju ovde:
LocationsLK.hasMany(User, { foreignKey: 'locationId' });
User.belongsTo(LocationsLK, { foreignKey: 'locationId', as: 'location' });

 // INTERESI KORISNIKA (Many-to-Many)
 // Kupci pri registraciji biraju žanrove i jezike koji ih zanimaju 
User.belongsToMany(GenresLK, { 
    through: UserGenres, 
    foreignKey: 'userId', 
    otherKey: 'genreId', // Dobra praksa je dodati i otherKey
    as: 'Genres' // Ovo stvara metodu setGenres
});
GenresLK.belongsToMany(User, { through: UserGenres, foreignKey: 'genreId' });

User.belongsToMany(LanguagesLK, { 
    through: UserLanguages, 
    foreignKey: 'userId', 
    otherKey: 'languageId',
    as: 'Languages' // Ovo stvara metodu setLanguages
});
LanguagesLK.belongsToMany(User, { through: UserLanguages, foreignKey: 'languageId' });
// NARUDŽBE, STAVKE I KORPA

// Korpa povezuje kupca sa knjigama koje planira naručiti 
User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });
Book.hasMany(Cart, { foreignKey: 'bookId' });
Cart.belongsTo(Book, { foreignKey: 'bookId' });

// Narudžba povezuje kupca  i prodavača  
User.hasMany(Order, { foreignKey: 'buyerId', as: 'purchases' });
Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

User.hasMany(Order, { foreignKey: 'sellerId', as: 'sales' });
Order.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

// Stavke narudžbe - omogućavaju narudžbu više knjiga odjednom 
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Book.hasMany(OrderItem, { foreignKey: 'bookId', as: 'orderItems' });
OrderItem.belongsTo(Book, { foreignKey: 'bookId' , as: 'book' });

module.exports = {
    Sequelize,
    User,
    Book,
    Order,
    OrderItem,
    Cart,
    GenresLK,
    LanguagesLK,
    BookConditionsLK,
    LocationsLK,
    UserGenres,
    UserLanguages
};