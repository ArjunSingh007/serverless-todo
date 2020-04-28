import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getAllTodo } from '../../businessLogic/todo'
const logger = createLogger('get')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info('Geeting all todo for the user event',event)
  const authHeader = event.headers.Authorization
  const token = authHeader.split(" ")[1]
  const items = getAllTodo(token)
  logger.info('get Todos Items',items)

  return {
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
          items
      })
  }
}
