var express = require('express')
var todos = require('./todos.js')

var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
var port = process.env.PORT || 8080

app.get('/', function (request, response) {
  response.json({
    welcome: 'welcome to todo API!'
  })
})

app.get('/todos', function (request, response) {
  response.json(todos)
})

app.post('/todos', function (request, response) {
  var id = request.body.text.trim().toLowerCase().split(' ').join('-')
  todos[id] = {
    text: request.body.text.trim(),
    completed: request.body.completed.trim()
  }
  response.redirect('/todos/' + id)
})

app.get('/todos/:id', function (request, response) {
  if (!todos[request.params.id]) {
    response.status(404).end('404 Error: no such todo: ' + request.params.id)
    return
  }
  response.json(todos[request.params.id])
})

app.delete('/todos/:id', function (request, response) {
  if (!todos[request.params.id]) {
    response.status(404).end('404 Error: no such todo: ' + request.params.id)
    return
  }
  delete todos[request.params.id]
  response.redirect('/todos')
})

app.put('/todos/:id', function (request, response) {
  var todo = todos[request.params.id]
  if (!todo) {
    response.status(404).end('404 Error: no such todo: ' + request.params.id)
    return
  }
  if (request.body.text !== undefined) {
    todo.text = request.body.text.trim()
  }
  if (request.body.completed !== undefined) {
    todo.completed = request.body.completed.trim()
  }
  response.redirect('/todos')
})

app.use(function (request, response, next) {
  response.status(404).end('404 Error: ' + request.url + ' not found')
})

app.listen(port)
