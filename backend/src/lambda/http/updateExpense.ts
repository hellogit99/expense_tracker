import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateExpenseRequest } from '../../requests/UpdateExpenseRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { updateExpense } from '../../logicLayer/expense'
const logger = createLogger('Expense')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const expenseId = event.pathParameters.expenseId
  const updatedExpense: UpdateExpenseRequest = JSON.parse(event.body)
  logger.info("processing event ", event)

  const userId = getUserId(event);

  await updateExpense( userId, expenseId, updatedExpense)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: " "
  }
}
