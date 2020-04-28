import * as AWS from "aws-sdk";
import {TodoItem} from "../models/TodoItem";
import {TodoUpdate} from "../models/TodoUpdate";


export class ToDoAccess {
    constructor(
        private readonly docClient = new AWS.DynamoDB.DocumentClient(),
        private readonly s3 = new AWS.S3({signatureVersion: 'v4'}),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly bucketName = process.env.S3_BUCKET,
        private readonly userIdIndex = process.env.USERID_INDEX,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
    }

    async getAllTodo(userId: string): Promise<TodoItem[]> {
        console.log("Inside getAllTodo");
        const result = await this.docClient.query({
            TableName : this.todoTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise()
      
        const items = result.Items
        console.log('Todos Items',items)
        return items as TodoItem[]
    }

    async createTodo(item: TodoItem): Promise<TodoItem> {
        console.log("Inside createTodo");
        const result = await this.docClient.put({
            TableName: this.todoTable,
            Item: item
        }).promise()
        console.log("Create item",result);
        return item
    }

    async updateTodo(updatedTodo: TodoUpdate, todoId: string): Promise<TodoUpdate> {
        console.log("Inside updateTodo");

        const result = await this.docClient.update({
            TableName: this.todoTable,
            Key: {
              "todoId": todoId
            },
            UpdateExpression: "set #a = :a, done = :b, dueDate = :c",
            ExpressionAttributeNames:{
              "#a": "name"
            },
            ExpressionAttributeValues:{
              ":a": updatedTodo['name'],
              ":b": updatedTodo['done'],
              ":c": updatedTodo['dueDate']
            }
          }).promise()
        console.log("todoUpdate result",result);
        return updatedTodo;
    }

    async deleteTodo(todoId: string): Promise<string> {
        console.log("Inside deletetodo");
        const result = await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
              "todoId": todoId
            }
          }).promise()
        console.log(result);
        return "deleted";
    }

    async generateUploadUrl(todoId: string): Promise<string> {
        console.log("Inside generateurl");
        const url = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: parseInt(this.urlExpiration),
        });
        console.log("url:", url);

        const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${todoId}`

        const result = await this.docClient.update({
            TableName: this.todoTable,
            Key: {
            "todoId": todoId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues:{
            ":attachmentUrl": attachmentUrl
            }
        }).promise()
        console.log("url update", result)

        return url;
    }
    
    async uploadToS3(data: Buffer, key: string): Promise<string> {
        console.log("Inside uploadToS3")
        console.log("data:", data) 
        const resp = await this.s3.putObject({
            Bucket: this.bucketName,
            Key: key,
            Body: data,
            ContentType: "image/jpg" 
          }).promise()
        console.log("Response from S3: ", resp);
        return "uploaded"
    }
    
    async deleteFromS3(key: string): Promise<string>{
        console.log("Inside deleteFromS3")
        const resp = await this.s3.deleteObject({
            Bucket: this.bucketName,
            Key: key, 
          }).promise()
        console.log("Response from S3: ", resp);
        return "deleted"
    }
}