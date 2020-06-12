/**
 * Fields in a request to update a single EXPENSE item.
 */
export interface UpdateExpenseRequest {
  name: string
  paymentDate: string
  done: boolean
}