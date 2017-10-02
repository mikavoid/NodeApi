const bodyParser = require('body-parser')
const _ = require('underscore')
const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

let todos = []
let todoNextId = 1

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200).json({data: 'Todo API root'})
})

app.get('/todos', (req, res) => {
    res.status(200).json({data: todos})
})

app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10)

    var todo = _.findWhere(todos, {id})
    if (todo) {
        res.status(200).json({data: todo})
    }
    res.status(404).json({data: {error : 'Todo not found'}})
})

app.post('/todos', (req, res) => {

    const body = req.body
    
    // Validation
    if (!_.isString(body.description) 
            || !_.isBoolean(body.completed) 
            || body.description.trim().length === 0) {
        res.status(404).send()
    }
    
    body.description = body.description.trim()
    
    let todo = _.pick(body, 'description', 'completed')
    todo.id = todoNextId
    
    todos.push(todo)
    todoNextId++
    res.status(200).send()
})

app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10)
    const matchedTodo = _.findWhere(todos, {id})
    
    if (!matchedTodo) {
        return res.status(404).json({'error': 'No todo found'})
    }
    
    todos = _.without(todos, matchedTodo)
    res.status(200).send(matchedTodo)
})

app.put('/todos/:id', (req, res) => {
    let body = _.pick(req.body, 'description', 'completed')
    const id = parseInt(req.params.id, 10)
    const validAttributes = {};
    const matchedTodo = _.findWhere(todos, {id})
    
    if (!matchedTodo) {
         return res.status(404).json({'error': 'No todo found'})
    }
   
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed
    } else if (body.hasOwnProperty('completed')) {
        return res.status(404).send()
    }
    
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description
    } else if (body.hasOwnProperty('description')) {
        return res.status(404).send()
    }
    
    _.extend(matchedTodo, validAttributes)
    return res.status(200).json(matchedTodo)
    
})


app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT)
})