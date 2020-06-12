
import 'source-map-support/register'
import * as uuid from 'uuid'

import { ExpenseItem } from '../models/ExpenseItem'
import { Data } from '../dataLayer/data'
import { CreateExpenseRequest } from '../requests/CreateExpenseRequest'
import { ExpenseUpdate } from '../models/ExpenseUpdate'
import { UpdateExpenseRequest } from '../requests/UpdateExpenseRequest'

const data = new Data()

export async function getExpenses(userId: string): Promise<ExpenseItem[]> {
    return await data.getExpenses(userId)
}

export async function createExpense(
    createExpenseRequest: CreateExpenseRequest,
    userId: string
): Promise<ExpenseItem> {

    const expenseId = uuid.v4()

    const newExpense: ExpenseItem = {
        userId: userId,
        expenseId: expenseId,
        createdAt: new Date().toISOString(),
        name: createExpenseRequest.name,
        paymentDate: createExpenseRequest.paymentDate,
        done: false
    }

    return await data.createExpense(newExpense)
}

export async function updateExpense(
    userId: string,
    ExpenseId: string,
    updateExpenseRequest: UpdateExpenseRequest
): Promise<ExpenseUpdate> {

    const updatedExpense: ExpenseUpdate = {
        name: updateExpenseRequest.name,
        paymentDate: updateExpenseRequest.paymentDate,
        done: updateExpenseRequest.done
    }

    return await data.updateExpense(userId, ExpenseId, updatedExpense)
}

export async function deleteExpense(userId: string, ExpenseId: string): Promise<String>  {

    return data.deleteExpense(userId, ExpenseId)
}


export async function generateUploadUrl(userId: string, ExpenseId: string):  Promise < String >{
    return data.generateUploadUrl(userId, ExpenseId)
}