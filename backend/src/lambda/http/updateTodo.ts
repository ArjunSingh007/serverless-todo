import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update')
const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  logger.info('Update event', event)

  await docClient.update({
    TableName: todoTable,
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

  return {
    statusCode: 201,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: 'Item updated successfully'
}
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
}
