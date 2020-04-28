import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { generateUploadUrl } from '../../businessLogic/todo'
const logger = createLogger('update')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  logger.info('Get signed url', event)
  const url = generateUploadUrl(todoId)
  return {
      statusCode: 201,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
          uploadUrl: url
      })
  }
}
