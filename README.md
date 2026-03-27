# BookHub



BookHub is a full-stack web application designed as an online marketplace for buying, selling, and exchanging used books. It connects book lovers by providing a platform to list their books, discover new ones, and communicate directly with other users. The application features a robust backend, a dynamic frontend, and real-time capabilities for chat and notifications.

## Features

-   **User Authentication & Profiles**: Secure user registration and login using JWT. Users can create and edit their profiles, including personal information, profile pictures, and preferences for genres and languages.
-   **Book Marketplace**: Users with a "Seller" role can post books for sale or exchange. Listings include comprehensive details like title, author, description, price, condition, images, and more.
-   **Advanced Search & Filtering**: A powerful search engine allows users to find books by keyword, and refine results by price range, location, genre, condition, and language. Sorting options are also available.
-   **Shopping Cart**: A persistent shopping cart for authenticated users to add or remove books before purchasing.
-   **Ordering System**: A streamlined checkout process that intelligently groups cart items by seller into distinct orders. Both buyers and sellers can track and manage their orders through dedicated dashboards.
-   **Real-time Chat**: Integrated chat system using Socket.IO allows buyers to initiate conversations with sellers directly from a book's detail page.
-   **Rating & Review System**: After completing an order, buyers can rate the seller and the book, and leave a comment. Average ratings are displayed on user profiles and book pages.
-   **Notification System**: Users receive real-time notifications for new orders, ratings, and system-wide announcements from administrators.
-   **Admin Dashboard**: A comprehensive control panel for administrators to:
    -   Manage all users (view, archive, ban).
    -   Manage system-wide catalogs (genres, languages, locations, etc.).
    -   View application statistics with charts (e.g., user roles, book status, popular genres).
    -   Moderate user and book reports.
    -   Broadcast system messages to all users.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: PostgreSQL with Sequelize as the ORM
-   **Frontend**: EJS (Embedded JavaScript) for server-side rendering, CSS3, and client-side JavaScript (jQuery)
-   **Real-time Communication**: Socket.IO
-   **Authentication**: JSON Web Tokens (JWT), bcrypt for password hashing
-   **File Uploads**: Multer for handling image uploads
-   **Development**: Nodemon for automatic server restarts

## Project Structure

The project follows a modified MVC (Model-View-Controller) architecture to separate concerns and maintain a clean codebase.

```
.
├── /bin/          # Server startup script
├── /config/       # Database configuration (db.js)
├── /controllers/  # Handles request logic and interacts with services
├── /dao/          # Data Access Objects - direct database interactions
├── /middleware/   # Express middleware for auth, caching, uploads, etc.
├── /models/       # Sequelize model definitions and associations
├── /public/       # Static assets (CSS, JS, images, uploads)
├── /routes/       # Express route definitions
├── /services/     # Business logic layer
├── /sockets/      # Socket.IO connection and event handling
├── /views/        # EJS templates for the user interface
├── app.js         # Main Express application setup
└── package.json   # Project dependencies and scripts
```

## Setup and Installation

Follow these steps to get the BookHub application running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14.x or later)
-   [PostgreSQL](https://www.postgresql.org/)

### 1. Clone the Repository

```bash
git clone https://github.com/kenanboracic4/BookHub.git
cd BookHub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add the following configuration variables. Replace the placeholder values with your PostgreSQL database credentials.

```env
# Database Configuration
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_db_password
DB_HOST=localhost

# Application Port
PORT=3000

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Database Setup

1.  Make sure your PostgreSQL server is running.
2.  Create a new database with the name you specified in the `.env` file (`your_db_name`).
3.  The application uses `sequelize.sync({ alter: true })` which will automatically create and update tables in your database based on the Sequelize models when the server starts.

### 5. Run the Application

You can run the server in two modes:

**Development Mode** (with hot-reloading via Nodemon):

```bash
npm run dev
```

**Production Mode**:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## API Routes

The application's functionality is exposed through a set of RESTful routes.

-   `GET /`: Home page with featured books.
-   `GET /books`: Displays all books with search and filtering.
-   `GET /books/details/:id`: Shows the details for a specific book.
-   `POST /books/add-book`: Adds a new book to the marketplace.
-   `GET /user/register`: User registration page.
-   `POST /user/login`: Authenticates a user.
-   `GET /user/profile/:id`: Displays a user's profile.
-   `POST /cart/add/:bookId`: Adds a book to the user's shopping cart.
-   `DELETE /cart/delete/:bookId`: Removes a book from the cart.
-   `POST /orders/checkout`: Creates orders from the items in the cart.
-   `GET /orders`: Shows a user's purchase history.
-   `GET /orders/sales`: Shows a seller's sales history.
-   `GET /chat`: Main chat interface.
-   `GET /admin`: Admin dashboard for site management.
