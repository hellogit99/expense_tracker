import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
 import * as AWS from 'aws-sdk'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { generateUploadUrl } from '../../logicLayer/expense'

const docClient = new AWS.DynamoDB.DocumentClient()

const expensesTable = process.env.EXPENSES_TABLE
const logger = createLogger('Expense')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(" Processing event for generating signed url", event)

  const expenseId = event.pathParameters.expenseId
  const userId = getUserId(event);
  // EXPENSE: Return a presigned URL to upload a file for a EXPENSE item with the provided id

  //check if expense item exists
  const validExpenseId = await expenseExists(userId, expenseId)

  if (!validExpenseId) {
    logger.error("No expense found with id ", expenseId)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'Expense item does not exist'
      })
    }
  }

  let url = await generateUploadUrl(userId, expenseId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }

}


export async function expenseExists(userId: string, expenseId: string) {

  const result = await docClient
    .get({
      TableName: expensesTable,
      Key: {
        userId: userId,
        expenseId: expenseId
      }
    })
    .promise()

  return !!result.Item
}