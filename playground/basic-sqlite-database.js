const Sequelize = require('sequelize')
const sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
})

const Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 255]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

sequelize.sync({force: true}).then(() => {
    console.log('everything is synced')
    
    Todo.create({
        description: "Walking my dog",
        completed: false
    }).then((todo) => {
        console.log('Finished!')
        console.log(todo)
    })
})