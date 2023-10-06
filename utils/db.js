const {Sequelize} = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASEURL , {
    dialect :'postgres',
})


sequelize.authenticate().then(()=>{
    console.log("Database connected ")
}).catch(err =>{
    console.error(err)
})


module.exports = sequelize 