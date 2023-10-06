const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");


const Songs = sequelize.define('song', {
    Id : {
        type : DataTypes.INTEGER,
        autoIncrement : true ,
        primaryKey : true
    },
     songId :{
        type:DataTypes.STRING,
        allowNull : false 
     },
     author:{
        type : DataTypes.INTEGER,
        allowNull : false 
     },
     userId : {
        type : DataTypes.STRING,
        allowNull : false 
     }
})

module.exports = {
    Songs 
}