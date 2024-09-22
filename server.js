import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import auth from './middleware/auth.js';
import userType from './schemas/user.js';
import bookType from './schemas/book.js';
import User from './models/User.js';
import Book from './models/Book.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const server = new ApolloServer({
    typeDefs: [userType, bookType],
    resolvers: {
        Query: {
            users: async () => await User.find(),
            books: async () => await Book.find().populate('addedBy').populate('borrowedBy'),
            book: async (_, { id }) => await Book.findById(id).populate('addedBy').populate('borrowedBy'),
            borrowedBooks: async (_, __, { user }) => {
                return await Book.find({ borrowedBy: user.id }).populate('addedBy');
            },
            availableBooks: async () => {
                return await Book.find({ isAvailable: true }).populate('addedBy');
            },
            borrowHistory: async (_, __, { user }) => {
                return await Book.find({ borrowedBy: user.id }).populate('addedBy');
            }
        },
        Mutation: {
            register: async (_, { username, password, role }) => {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = new User({ username, password: hashedPassword, role });
                await user.save();
                return user;
            },
            login: async (_, { username, password }) => {
                const user = await User.findOne({ username });
                if (!user) throw new Error('User not found');
    
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) throw new Error('Invalid credentials');
    
                const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
                return token;
            },
            addBook: async (_, { title, author, publishedYear }, { user }) => {
                if (!user) {
                    throw new Error('Authentication required');
                }
                const book = new Book({ title, author, publishedYear, addedBy: user.id });
                await book.save();
                return book;
            },
            updateBook: async (_, { id, title, author, publishedYear }, { user }) => {
                if (!user) {
                    throw new Error('Authentication required');
                }
                const book = await Book.findByIdAndUpdate(id, { title, author, publishedYear }, { new: true });
                return book;
            },
            deleteBook: async (_, { id }, { user }) => {
                if (!user) {
                    throw new Error('Authentication required');
                }
                await Book.findByIdAndDelete(id);
                return "Book deleted successfully.";
            },
            borrowBook: async (_, { id }, { user }) => {
                if (!user) {
                    throw new Error('Authentication required');
                }
                const book = await Book.findById(id);
                if (!book.isAvailable) throw new Error('Book is not available.');
    
                book.isAvailable = false;
                book.borrowedBy = user.id;
                book.borrowedAt = new Date();
                await book.save();
    
                return book;
            },
            returnBook: async (_, { id }, { user }) => {
                if (!user) {
                    throw new Error('Authentication required');
                }
                const book = await Book.findById(id);
                if (book.borrowedBy.toString() !== user.id) throw new Error('You did not borrow this book.');
    
                book.isAvailable = true;
                book.borrowedBy = null;
                book.borrowedAt = null;
                await book.save();
    
                return book;
            },
        },
    },
    context: async ({ req }) => {
        const token = req.headers.authorization || '';
        let user = null;

        // Check if the request is for a protected route
        if (req.body.operationName && req.body.operationName !== 'register' && req.body.operationName !== 'login') {
            if (token) {
                try {
                    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
                    user = await User.findById(decoded.id);
                } catch (err) {
                    console.error(err);
                }
            }
        }

        return { user };
    },
},console.log("Server Running..."));

app.use(express.json());

await server.start()
server.applyMiddleware({ app });

mongoose.connect(process.env.MONGODB_URI,console.log("Database connected successfully..."))
    .then(() => {
        app.listen({ port: 4000 }, () => {
            console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
        });
    })
    .catch(err => console.error(err));
