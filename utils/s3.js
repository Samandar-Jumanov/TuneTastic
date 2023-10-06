const S3 = require('aws-sdk/clients/s3')
require('dotenv').config()
const fs = require('fs')

const acceskey= process.env.AWS_ACCES_KEY
const secretKey = process.env.AWS_SECRET_KEY 
const region = process.env.AWS_BUCKET_REGION
const bucketName = process.env.AWS_BUCKETNAME

const s3 = new S3({
    region,    
    acceskey,
    secretKey,
})


function uploadFile(file){
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
      Bucket :    bucketName , 
      Body : fileStream,
      Key : file.filename 
    }
    return s3.upload(uploadParams).promise()
}


module.exports = {
    uploadFile
}