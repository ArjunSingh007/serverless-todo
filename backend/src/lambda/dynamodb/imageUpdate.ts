import 'source-map-support/register'
import { deleteFromS3, greyImage} from '../../businessLogic/todo'
   
exports.handler = async (event) => {
    const eventName = event.Records[0].eventName
    console.log(JSON.stringify(event))  
    if(eventName == 'REMOVE' ||  eventName == 'MODIFY'){
      const dynamodb = event.Records[0].dynamodb
      var url;
      var done;
      var type;
      var key;
      url = dynamodb.OldImage.attachmentUrl
      type = Object.keys(url)[0] 
      console.log('keys: ', type)
      if(type === 'S'){
        key = url.S.split('/')[3]

        console.log('key',key)

        console.log(eventName,'\n\n\n')
        if(eventName === "REMOVE"){
            const resp = deleteFromS3(key)
            console.log('Delete completed',resp) 
        } 
        else if(eventName === "MODIFY") {
          done = dynamodb.NewImage.done.BOOL
            if(done == true){
              console.log('URL:',url.S)
              const image = greyImage(url.S, key)
              console.log(image)
            } 
          }  
      console.log('Sucessfull')  
      } 
    }
    return `Completed`;
};

  