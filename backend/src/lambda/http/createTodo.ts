import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { createTodo } from '../../businessLogic/todo'
const logger = createLogger('create')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  logger.info('Create todo body',newTodo)
  const authHeader = event.headers.Authorization
  const token = authHeader.split(" ")[1]
  const item = createTodo(newTodo,token)
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
