const sequelize = require("../config/db");
const User = require("./tables/Users");
const Book = require("./tables/Book");
const Order = require("./tables/Order");
const OrderItem = require("./tables/OrderItem");
const Cart = require("./tables/Cart");
const UserLanguages = require("./tables/UserLanguages");
const UserGenres = require("./tables/UserGenres");

const GenresLK = require("./Lookups/GenresLK");
const LanguagesLK = require("./Lookups/LanguagesLK");
const LocationsLK = require("./Lookups/LocationsLK");
const BookConditionsLK = require("./Lookups/BookConditionsLK");


 //RELACIJE ZA KORISNIKE I KNJIGE

// Jedan korisnik može objaviti mnogo knjiga 
User.hasMany(Book, { foreignKey: 'sellerId', as: 'ownedBooks' });
Book.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

// LOOKUP TABELE
// Povezujemo knjige sa njihovim karakteristikama iz LK tabela 

// Žanrovi 
GenresLK.hasMany(Book, { foreignKey: 'genreId' });
Book.belongsTo(GenresLK, { foreignKey: 'genre' });

// Jezici 
LanguagesLK.hasMany(Book, { foreignKey: 'languageId' });
Book.belongsTo(LanguagesLK, { foreignKey: 'language' });

// Stanje knjige 
BookConditionsLK.hasMany(Book, { foreignKey: 'conditionId' });
Book.belongsTo(BookConditionsLK, { foreignKey: 'condition' });

// Lokacije 
LocationsLK.hasMany(Book, { foreignKey: 'locationId' });
Book.belongsTo(LocationsLK, { foreignKey: 'location' });

// Povezivanje korisnika sa gradom
LocationsLK.hasMany(User, { foreignKey: 'locationId' });
User.belongsTo(LocationsLK, { foreignKey: 'location' });


 // INTERESI KORISNIKA (Many-to-Many)
 // Kupci pri registraciji biraju žanrove i jezike koji ih zanimaju 
User.belongsToMany(GenresLK, { through: UserGenres, foreignKey: 'userId' });
GenresLK.belongsToMany(User, { through: UserGenres, foreignKey: 'genreId' });

User.belongsToMany(LanguagesLK, { through: UserLanguages, foreignKey: 'userId' });
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

Book.hasMany(OrderItem, { foreignKey: 'bookId' });
OrderItem.belongsTo(Book, { foreignKey: 'bookId' });

module.exports = {
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