const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

//MIDDLEWARES
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "User not found!" })
  }

  request.user = user;

  return next();
}

function checkExistsIdTodo(request, response, next) {
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find(todo => todo.id === id);
  if (!todo) {
    return response.status(404).json({ error: "Not Found" });
  }

  request.todo = todo;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const verifyIfUserExists = users.some((user) => user.username === username);

  if (verifyIfUserExists) {
    return response.status(400).json({ error: "User already exists!" });
  }

  const usersOperation = {
    id: uuidv4(),
    name,
    username,    
    todos: []
  }

  users.push(usersOperation)

  return response.status(201).json(usersOperation);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todosOperation = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date(),
  }

  user.todos.push(todosOperation);

  return response.status(201).json(todosOperation);
});

app.put('/todos/:id', checksExistsUserAccount, checkExistsIdTodo, (request, response) => {
  const { todo } = request;
  const { title, deadline } = request.body;


  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, checkExistsIdTodo, (request, response) => {
  const { todo } = request;

  todo.done = true;

  return response.status(201).json(todo);


});

app.delete('/todos/:id', checksExistsUserAccount, checkExistsIdTodo, (request, response) => {
  const { user, todo } = request;
  user.todos.splice(todo, 1);

  return response.status(204).send();
});

module.exports = app;