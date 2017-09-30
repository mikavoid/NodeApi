const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.status(200).json({data: 'Todo API root'})
})

app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT)
})