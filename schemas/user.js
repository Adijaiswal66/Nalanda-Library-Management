import { gql } from 'apollo-server-express';

const userType = gql`
    type User {
        id: ID!
        username: String!
        role: String!
    }

    type Query {
        users: [User]
    }

    type Mutation {
        register(username: String!, password: String!, role: String): User
        login(username: String!, password: String!): String
    }
`;

export default userType;
