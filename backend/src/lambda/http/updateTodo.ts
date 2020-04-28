import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todo'
import { createLogger } from '../../utils/logger'
const logger = createLogger('update')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  logger.info('Update event', event)

  updateTodo(updatedTodo, todoId)
  
  return {
    statusCode: 201,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: 'Item updated successfully'
}
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
}
