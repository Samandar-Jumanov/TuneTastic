const { ListenedMusic } = require("./listenedMusic");
const { Songs } = require("./songs");
const { Users } = require("./users");


Songs.belongsTo(Users , {
    foreignKey :'userId'
})

Users.hasMany(Songs , {
    foreignKey :'userId',
    as :'songs'
})

ListenedMusic.belongsTo(Users , {
    foreignKey :'userId'
})

Users.hasMany(ListenedMusic , {
    foreignKey :'userId',
    as :'listendMusic'
})



module.exports = {
    Songs , 
    Users,
    ListenedMusic
}


