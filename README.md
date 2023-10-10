# music
Started to build


# Main idea of project 
I really interested in creating an aws-bucket project so i created it as  a muisc app
The project can be used as a to upload music for an artist(based on roles ) 
And can be used for user to hear it

# Account 
/signup requirements : username email password  and role (will be chosen in client side )
/login  requirements : password and email 

# An musician role can upload song 
/upload-song    requirements : userId, artist, title   authRole , authToken 

# update song 
/update-song/:songId/:userId',  requirements : songId , userId (from params ) authRole , authToken , 
 title, artist (from body )


# get created songs 
/user-created/:userId,  authRole , authToken ,  


# delete song 
/delete-song/:songId/:userId   requirements : userId , songId (from request params )   authRole , authToken ,  


# And all songs can be got 
/get-all-songs',  authRole , authToken , 




