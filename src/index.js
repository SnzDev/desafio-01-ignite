const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

//MIDDLEWARE
function checksExistsUserAccount(request, response, next) {
  const { username } = request.header;

  const user = users.find((user) => users.username === username);
  if (!user) {
    return response.status(400).json({ error: "User not found!" })
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const verifyIfUserExists = users.some((user) => user.username === username);
  if (verifyIfUserExists) {
    return response.status(400).json({ error: "User already exists!" });
  }

  users.push({
    name,
    username,
    id: uuidv4,
    todos: []
  })

  return response.status(201).send();

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

    return response.status(200).json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;