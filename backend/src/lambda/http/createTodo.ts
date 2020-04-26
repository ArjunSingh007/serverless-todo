import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import { parseUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('create')
const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  logger.info('Create todo body',newTodo)
  const todoId = uuid.v4()

  const authHeader = event.headers.Authorization
  const authSplit = authHeader.split(" ")
  const token = authSplit[1]
  
  const timestamp = new Date().toISOString()
  
  const item = {
    todoId: todoId,
    userId: parseUserId(token),
    createdAt: timestamp,
    ...newTodo,
    done: false,
    attachmentUrl: null
  }

  logger.info('Item to create',item)

  await docClient.put({
      TableName: todoTable,
      Item: item
  }).promise()

  return {
      statusCode: 201,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item
      })
  }
}
