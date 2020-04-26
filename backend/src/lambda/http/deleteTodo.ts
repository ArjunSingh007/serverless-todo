import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS from 'aws-sdk'
import { parseUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('delete')
const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info('Delete event',event)
  
  const authHeader = event.headers.Authorization
  const authSplit = authHeader.split(" ")
  const userId = parseUserId(authSplit[1])
  logger.info('UserId',userId)
  console.log("deleteinprogress")
  await docClient.delete({
    TableName: todoTable,
    Key: {
      "todoId": todoId
    }
  }).promise()
  console.log("deletesuccess")
  return {
    statusCode: 201,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body:'Item deleted'
  }
}
