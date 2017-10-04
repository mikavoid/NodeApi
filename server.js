const bodyParser = require('body-parser')
const _ = require('underscore')
const bcrypt = require('bcrypt')
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
    let where = {}

    if (queryParams.hasOwnProperty('completed')) {
        where.completed = (queryParams.completed === 'true')
    }

    if (queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0) {
        const q = queryParams.q.trim()
        where.description = { $like: `%${q}%`}
    }

    db.todo.findAll({where}).then((todos) => {
        if (!todos) {
            return res.status(404).send()
        }
        return res.json({data: todos})
    }).catch((err) => {
        return res.status(500).json(err)
    })
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

    db.todo.destroy({where: {id}}).then((rowsDeleted) => {
        if (rowsDeleted < 1) {
            return res.status(404).json(err)
        }
        return res.status(204).send()
    }).catch((err) => {
        return res.status(500).json(err)
    })
})

app.put('/todos/:id', (req, res) => {
    let body = _.pick(req.body, 'description', 'completed')
    const id = parseInt(req.params.id, 10)
    const attributes = {};


    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed
    }

    if (body.hasOwnProperty('description')) {
        attributes.description = body.description
    }

    db.todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send()
        }
        todo.update(attributes).then((todo) => {
            res.json(todo.toJSON())
        }).catch((err) => {
            res.status(404).json({data: {error : err}})
        })
    }, (err) => {
        res.status(500).send()
    })

})

app.post('/users', (req, res) => {
    let body = req.body
    let user = _.pick(body, 'email', 'password')
    user.email = user.email.trim()
    user.password = user.password.trim()

    db.user.create(user).then((user) => {
        if (!user) {
            return res.status(404)
        }
        return res.json(user.toPublicJSON())
    }).catch((err) => {
        res.status(500).json(err)
    }) 
})

app.post('/users/login', (req, res) => {
    const body = req.body
    let userData = _.pick(body, 'email', 'password')
    
    db.user.authenticate(userData).then((user) => {
        const token = user.generateToken('authentication')

        if (!token) {
            return res.status(401).send()
        }

        return res.header('Auth', token).json({authenticated: true, user})
    }, () => {
        res.status(401).send()
    }).catch((err) => {
        return res.status(500).json(err)
    })

})

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log("Server is listening on port " + PORT)
    })
})

