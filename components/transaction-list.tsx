import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const transactions = [
  { id: 1, type: "Income", amount: 1000, category: "Salary", date: "2023-03-01" },
  { id: 2, type: "Expense", amount: 50, category: "Groceries", date: "2023-03-02" },
  { id: 3, type: "Expense", amount: 30, category: "Entertainment", date: "2023-03-03" },
]

export default function TransactionList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.type}</TableCell>
            <TableCell>${transaction.amount}</TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell>{transaction.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

