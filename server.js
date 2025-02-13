// server.js

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema');

const app = express();

// MongoDB connection (replace with your MongoDB URI)
const mongoURI = 'mongodb://localhost:27017/employeeDB';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));

// GraphQL middleware configuration
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true // Enables the GraphiQL interface for testing via the browser
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
