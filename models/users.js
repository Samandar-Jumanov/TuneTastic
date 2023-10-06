const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");


const Users = sequelize.define('users', {
    Id : {
        type : DataTypes.INTEGER,
        autoIncrement : true ,
        primaryKey : true 
    },
    
    username : {
        type : DataTypes.STRING ,
        allowNull :false
    },
    email : {
        type : DataTypes.STRING ,
        allowNull : false ,
        unique : true 
    },
    password : {
        type : DataTypes.STRING ,
        allowNull : false 
    },
    token : {
        type : DataTypes.STRING ,
        allowNull : false 
    },
    role : {
        type : DataTypes.STRING ,
        allowNull : false 
    }
})


module.exports = {Users}