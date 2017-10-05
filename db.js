const path = require('path')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'dev'
var sequelize

if (env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    })
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        dialect: 'sqlite',
        storage: __dirname + '/data/dev-todo-api.sqlite'
    })
}

let db = {};

// Fill all models
db.todo = sequelize.import(path.join(__dirname, 'models', 'todo.js'))
db.user = sequelize.import(path.join(__dirname, 'models', 'user.js'))
db.token = sequelize.import(path.join(__dirname, 'models', 'token.js'))

db.todo.belongsTo(db.user)
db.user.hasMany(db.todo)

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db