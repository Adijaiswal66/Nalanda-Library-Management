import { gql } from 'apollo-server-express';

const bookType = gql`

    type BorrowHistory {
        borrowedBy: User
        borrowedAt: String
    }

    type Book {
        id: ID!
        title: String!
        author: String!
        publishedYear: Int
        addedBy: User
        isAvailable: Boolean!
        borrowedBy: User
        borrowedAt: String
        borrowHistory: [BorrowHistory]
    }

    extend type Query {
        books: [Book]
        book(id: ID!): Book
        borrowedBooks: [Book]
        availableBooks: [Book]
        borrowHistory: [Book]
    }

    extend type Mutation {
        addBook(title: String!, author: String!, publishedYear: Int): Book
        updateBook(id: ID!, title: String, author: String, publishedYear: Int): Book
        deleteBook(id: ID!): String
        borrowBook(id: ID!): Book
        returnBook(id: ID!): Book
    }
`;

export default bookType;
