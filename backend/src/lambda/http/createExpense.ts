import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateExpenseRequest } from '../../requests/CreateExpenseRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { createExpense } from '../../logicLayer/expense'
const logger = createLogger('Expense')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  logger.info('auth user id ', userId)
  logger.info('Processing event: ', event);
  const newExpense: CreateExpenseRequest = JSON.parse(event.body);

  // EXPENSE: Implement creating a new EXPENSE item

  const expenseItem = await createExpense(newExpense, userId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({item: expenseItem})
  }
}
