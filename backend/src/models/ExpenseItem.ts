export interface ExpenseItem {
  userId: string
  expenseId: string
  createdAt: string
  name: string
  paymentDate: string
  done: boolean
  attachmentUrl?: string
}
