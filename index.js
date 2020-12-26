const express = require('express');
const app = express();

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const { books } = require('./data.json');
// console.log(books);
const schema = buildSchema(`
    type Query {
        book(id: Int!): Book
        books(topic: String): [Book]
    }
    type Mutation {
        updateBookTopic(id: Int!, topic: String!): Book
    }

    type Book {
        id: Int
        title: String
        published: Int
        author: String
        cover: String
        website: String
        topic: String
    }
`);

let getBook = (args) => {
    let id = args.id;
    return books.filter(book => {
        return book.id === id;
    })[0]
}

let getBooks = (args) => {
    if (args.topic) {
        let topic = args.topic;
        return books.filter( book => book.topic === topic);
    } else {
        return books;
    }
}

let updateBookTopic = ({ id, topic}) => {
    books.map( book => {
       if(book.id === id) {
           book.topic = topic;
           return book;
       } 
    })
    return books.filter( book => book.id === id)[0]
}

const root = {
    // message: () => 'hello world'
    book: getBook,
    books: getBooks,
    updateBookTopic: updateBookTopic
}

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(3000,() => console.log('server on port 3000'));