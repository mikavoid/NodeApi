const bodyParser = require('body-parser')
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
    const id = req.params.id
    todos.map((todo) => {
        if (todo.id == id) {
            res.status(200).json({data: todo})
        }
    })
    res.status(404).json({data: {error : 'Todo not found'}})
})

app.post('/todos', (req, res) => {
    
    const body = req.body
    
    let todo = {
        description: body.description,
        completed: body.completed,
        id: todoNextId,
    }
    
    todos.push(todo)
    todoNextId++
    console.log(todos)
    res.status(200).send()
})


app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT)
})