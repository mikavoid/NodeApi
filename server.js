const bodyParser = require('body-parser')
const _ = require('underscore')
const express = require('express')
const app = express()

const db = require('./db')

const PORT = process.env.PORT || 3000

let todos = []
let todoNextId = 1

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200).json({data: 'Todo API root'})
})

app.get('/todos', (req, res) => {
    const queryParams = req.query
    let filteredTodos = todos

    // If has property && completed === 'true'
    if (queryParams.hasOwnProperty('completed')) {
        filteredTodos = _.where(filteredTodos, {completed: queryParams.completed.trim() === 'true' } )
    }

    // Search
    if (queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0) {
        const q = queryParams.q.trim()
        filteredTodos = _.filter(filteredTodos, (todo) => {
            return (todo.description.indexOf(q) >= 0)
        })
    }


    res.status(200).json({data: filteredTodos})
})

app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10)

    db.todo.findById(id).then((todo) => {
        if (!!todo) {
            return res.status(200).json({data: todo})
        }
        res.status(404).send()
    }).catch((err) => {
        res.status(404).json({data: {error : 'An error occured'}})
    })
})

app.post('/todos', (req, res) => {

    const body = req.body
    let todo = _.pick(body, 'description', 'completed')
    todo.description = todo.description.trim()

    db.todo.create(todo).then((todo) => {
        res.status(200).json(todo.toJSON())
    }).catch((err) => {
        res.status(400).json(err)
    });

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

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log("Server is listening on port " + PORT)
    })
})

