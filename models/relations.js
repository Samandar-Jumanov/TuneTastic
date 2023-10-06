const { Songs } = require("./songs");
const { Users } = require("./users");


Songs.belongsTo(Users , {
    foreignKey :'userId'
})

Users.hasMany(Songs , {
    foreignKey :'userId',
    as :'songs'
})

module.exports = {
    Songs , 
    Users
}


