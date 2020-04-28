import 'source-map-support/register'

const Jimp = require('jimp')  
const  AWS = require('aws-sdk');
const s3 = new AWS.S3()
   
exports.handler = async (event) => {
    const eventName = event.Records[0].eventName
    console.log(JSON.stringify(event))  
    if(eventName == 'REMOVE' ||  eventName == 'MODIFY'){
      const dynamodb = event.Records[0].dynamodb
      var url;
      var done;
      var type;
      var key;
      const bucket = process.env.S3_BUCKET;
      url = dynamodb.OldImage.attachmentUrl
      type = Object.keys(url)[0] 
      console.log('keys: ', type)
      if(type === 'S'){
        key = url.S.split('/')[3]

        console.log('key',key)

        console.log(eventName,'\n\n\n')
        if(eventName === "REMOVE"){
            const resp = await s3.deleteObject({
              Bucket: bucket,
              Key: key, 
            }).promise()
            console.log('Delete completed',resp) 

        } else if(eventName === "MODIFY") {
          done = dynamodb.NewImage.done.BOOL
            if(done == true){
              console.log('URL:',url.S)
              
              const image = await Jimp.read(url.S)
                            .then((image) => {
                            console.log( "Before resizing")
                            return image.greyscale().getBufferAsync("image/jpeg", (err, buffer) => {
                                    console.log(err,'Error')
                                    return buffer  
                                    }
                                  )
                            })  
                            .then((image) => {
                            console.log('Buffer',image)
                            return uploadToS3(image, bucket,  key);
                            }) 
                            .catch(err => {
                              throw err;
                            })
                            .finally(() => {
                              console.info("Function ran successfully")
                            })
              console.log(image)
            } 
          }  
      console.log('Sucessfull')  
      } 
    }
    return `COmpleted`;
};


async function uploadToS3(data, bucket, key) {
  console.log("Inside uploadToS3: ")
  console.log("data:", data) 
  const resp = await s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: data,
      ContentType: "image/jpg" 
    }).promise()
  console.log("Response from S3: ", resp);
  return resp
}

  