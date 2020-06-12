import 'source-map-support/register'
import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)
// const ddb = AWSXRay.captureAWSClient(new AWS.DynamoDB());

import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { ExpenseItem } from '../models/ExpenseItem'
import { ExpenseUpdate } from '../models/ExpenseUpdate'
import { createLogger } from '../utils/logger'
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const logger = createLogger('createExpense')

export class Data {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly expensesTable = process.env.EXPENSES_TABLE,
        private readonly bucketName = process.env.IMAGES_S3_BUCKET,

    ) {
    }

    async getExpenses(userId: string): Promise<ExpenseItem[]> {
        //const expenseIndex = process.env.INDEX_NAME

        const result = await this.docClient.query({
            TableName: this.expensesTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()


        logger.info("Expense's retrieved successfully")

        const items = result.Items
        return items as ExpenseItem[]
    }

    async createExpense(expenseItem: ExpenseItem): Promise<ExpenseItem> {
        await this.docClient.put({
            TableName: this.expensesTable,
            Item: expenseItem
        }).promise()

        return expenseItem
    }

    async updateExpense(userId: string, expenseId: string, expenseUpdate: ExpenseUpdate): Promise<ExpenseUpdate> {
        var params = {
            TableName: this.expensesTable,
            Key: {
                userId: userId,
                expenseId: expenseId
            },
            UpdateExpression: "set #n = :r, paymentDate=:p, done=:a",
            ExpressionAttributeValues: {
                ":r": expenseUpdate.name,
                ":p": expenseUpdate.paymentDate,
                ":a": expenseUpdate.done
            },
            ExpressionAttributeNames: {
                "#n": "name"
            },
            ReturnValues: "UPDATED_NEW"
        };

        await this.docClient.update(params).promise()
        logger.info("Update was successful")
        return expenseUpdate

    }



    async deleteExpense(userId: string, expenseId: string): Promise<String> {
        await this.docClient.delete({
            TableName: this.expensesTable,
            Key: {
                userId: userId,
                expenseId: expenseId
            }
        }).promise()
        
        logger.info("delete successfull")

        return ''

    }

    async generateUploadUrl(userId: string, expenseId: string): Promise<String> {
        const url = getUploadUrl(expenseId, this.bucketName)

        const attachmentUrl: string = 'https://' + this.bucketName + '.s3.amazonaws.com/' + expenseId

        const options = {
            TableName: this.expensesTable,
            Key: {
                userId: userId,
                expenseId: expenseId
            },
            UpdateExpression: "set attachmentUrl = :r",
            ExpressionAttributeValues: {
                ":r": attachmentUrl
            },
            ReturnValues: "UPDATED_NEW"
        };

        await this.docClient.update(options).promise()
        logger.info("Presigned url generated successfully ", url)

        return url;
    }

}


function getUploadUrl(expenseId: string, bucketName: string): string {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: expenseId,
        Expires: parseInt(urlExpiration)
    })
}



function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}