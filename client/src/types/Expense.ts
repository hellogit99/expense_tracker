export interface Expense {
  expenseId: string
  createdAt: string
  name: string
  paymentDate: string
  done: boolean
  attachmentUrl?: string
}
