
const authRole = () =>{
  
    return (request , response , next ) =>{
        const role = request.headers
        
        if(!role || role.toLowerCase() !== "artist" ){
            response.status(403).json({
                message :'Artist role required '
            })
        }
        next()
    }
}

module.exports = {
    authRole
}

