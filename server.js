const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

let todos = [
    {
        id: 1,
        description: 'Meet mom for lunch',
        completed: false
    },
    {
        id: 2,
        description: 'Go to market',
        completed: false
    },
    {
        id: 3,
        description: 'Feed the cat',
        completed: true
    }
]

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


app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT)
})