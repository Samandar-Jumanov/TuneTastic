const jwt = require('jsonwebtoken')

const authToken = () =>{
    return (request , response , next ) =>{
        const authHeader = request.headers['authorization']
        const token =  authHeader && authHeader.split(' ')[1]

        if(token === null){
            return response.status(401).json({
                message :'Unauthorized'
            })
        }

        jwt.verify(token , process.env.SECRETKEY, (err , user )=>{
            if (err ){
                response.status(403)
            }
            request.user = user 
            next()
        })

    }
}

module.exports = {
    authToken
}


