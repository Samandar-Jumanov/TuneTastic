const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");


const Songs = sequelize.define('song', {
    Id : {
        type : DataTypes.INTEGER,
        autoIncrement : true ,
        primaryKey : true
    },

    songName : {
        type : DataTypes.STRING ,
        allowNull :false 
    },
    artist : {
        type : DataTypes.STRING,
        allowNull : false 
    },
    genre : {
        type : DataTypes.STRING,
        allowNull : false 
    },
    song : {
        type : DataTypes.STRING ,
        allowNull : false 
    },
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false 
    }
})

module.exports = {
    Songs 
}