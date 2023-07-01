require('dotenv').config()
module.exports={
    mongodb:process.env.mongodb,
    PORT:process.env.PORT,
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: process.env.region,
    secretLoginKey:process.env.secretLoginKey
}