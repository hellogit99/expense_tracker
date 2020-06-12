import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { deleteExpense } from '../../logicLayer/expense'
const logger = createLogger('Expense')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.warn("Proccessing delete event on expense", event )
  const expenseId = event.pathParameters.expenseId
  const userId = getUserId(event);

  // EXPENSE: Remove a EXPENSE item by id
await deleteExpense(userId, expenseId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: " "
  }
}
