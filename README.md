# Library Management GraphQL API

This is a GraphQL-based API for managing a library system, allowing users to add, update, borrow, and return books. The API also supports user registration, login, and borrowing history tracking.

## Features

- User registration and login with JWT authentication.
- Add, update, delete, borrow, and return books.
- Track borrow history.
- Query books by availability.
- Secure endpoints using JWT authentication.

## Technologies Used

- **Node.js** - Backend runtime environment.
- **Express.js** - Web framework for Node.js.
- **Apollo Server** - GraphQL server for Express.
- **GraphQL** - Query language for APIs.
- **MongoDB** - Database for storing books, users, and borrow history.
- **Mongoose** - MongoDB object modeling tool.
- **jsonwebtoken** - For JWT authentication.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (version 14.x or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or on a server)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/library-management.git
    cd library-management
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

### Environment Variables

Create a `.env` file in the root directory and configure the following environment variables:

