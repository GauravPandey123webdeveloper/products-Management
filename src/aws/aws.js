const aws=require('aws-sdk')
const { accessKeyId, secretAccessKey, region } = require('../../config')
aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
})
let uploadImage = async (file)=>{
    return new Promise(function(resolve,reject){
        let s3= new aws.S3({apiVersion:'2006-03-01'});
        var uploadParams={
            ACL:"public-read",
            Bucket:"classroom-training-bucket",
            Key:"gaurav/"+file.originalname,
            Body:file.buffer
        }
        s3.upload(uploadParams,function(err,data){
            if(err){
                return reject({error:err})
            }
            console.log("file uploaded successfully")
            return resolve(data.Location)
        })
    })
}
module.exports.uploadImage=uploadImage