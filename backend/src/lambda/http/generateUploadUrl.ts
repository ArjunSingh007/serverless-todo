import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update')
const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const todoTable = process.env.TODO_TABLE
const bucketName = process.env.S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info('Get signed url', event)

  const authHeader = event.headers.Authorization
  const authSplit = authHeader.split(" ")
  const token = authSplit[1]
  console.log(token)
  const imageId = uuid.v4()
  const url = s3.getSignedUrl('putObject',{
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
  })

  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`

  await docClient.update({
    TableName: todoTable,
    Key: {
      "todoId": todoId
      },
    UpdateExpression: "set attachmentUrl = :attachmentUrl",
    ExpressionAttributeValues:{
      ":attachmentUrl": attachmentUrl
      }
  }).promise()

  return {
      statusCode: 201,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
          iamgeUrl: attachmentUrl,
          uploadUrl: url
      })
  }
}
