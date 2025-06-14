import { useState } from 'react'
import { Box, Card, Flex, Heading, Text, Badge, Button, TextField, Select, Dialog, Checkbox, Grid } from '@radix-ui/themes'
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ArrowRightIcon,
  CalendarIcon,
  Share1Icon,
  DownloadIcon
} from '@radix-ui/react-icons'
import DataTable from '../../components/DataTable'
import { useToast } from '../../components/notifications/toast-context'

interface Transaction {
  id: string
  date: Date
  description: string
  type: 'deposit' | 'withdrawal' | 'transfer'
  amount: number
  status: 'completed' | 'pending' | 'failed'
  from: string
  to: string
  reference: string
  category: string
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: 'TXN001',
    date: new Date('2024-06-13T10:30:00'),
    description: 'Salary Payment',
    type: 'deposit',
    amount: 5000.00,
    status: 'completed',
    from: 'Acme Corp',
    to: 'Main Account',
    reference: 'SAL-2024-06',
    category: 'Income'
  },
  {
    id: 'TXN002',
    date: new Date('2024-06-12T15:45:00'),
    description: 'Rent Payment',
    type: 'withdrawal',
    amount: 1500.00,
    status: 'completed',
    from: 'Main Account',
    to: 'Landlord LLC',
    reference: 'RENT-06-2024',
    category: 'Housing'
  },
  {
    id: 'TXN003',
    date: new Date('2024-06-12T09:20:00'),
    description: 'Transfer to Savings',
    type: 'transfer',
    amount: 1000.00,
    status: 'completed',
    from: 'Main Account',
    to: 'Savings Account',
    reference: 'TRF-2024-0612',
    category: 'Savings'
  },
  {
    id: 'TXN004',
    date: new Date('2024-06-11T14:30:00'),
    description: 'Online Purchase',
    type: 'withdrawal',
    amount: 89.99,
    status: 'completed',
    from: 'Main Account',
    to: 'Amazon',
    reference: 'AMZ-123456',
    category: 'Shopping'
  },
  {
    id: 'TXN005',
    date: new Date('2024-06-11T11:00:00'),
    description: 'Freelance Payment',
    type: 'deposit',
    amount: 1200.00,
    status: 'pending',
    from: 'Client XYZ',
    to: 'Main Account',
    reference: 'INV-2024-045',
    category: 'Income'
  },
  {
    id: 'TXN006',
    date: new Date('2024-06-10T16:20:00'),
    description: 'Failed Transfer',
    type: 'transfer',
    amount: 500.00,
    status: 'failed',
    from: 'Main Account',
    to: 'External Bank',
    reference: 'TRF-FAIL-001',
    category: 'Transfer'
  },
  {
    id: 'TXN007',
    date: new Date('2024-06-10T08:15:00'),
    description: 'Utility Bill',
    type: 'withdrawal',
    amount: 120.50,
    status: 'completed',
    from: 'Main Account',
    to: 'Power Company',
    reference: 'UTIL-06-2024',
    category: 'Utilities'
  },
  {
    id: 'TXN008',
    date: new Date('2024-06-09T13:45:00'),
    description: 'Restaurant',
    type: 'withdrawal',
    amount: 65.30,
    status: 'completed',
    from: 'Main Account',
    to: 'The Grill House',
    reference: 'REST-0609',
    category: 'Food & Dining'
  }
]

export default function Transactions() {
  const { showToast } = useToast()
  const [transactions] = useState<Transaction[]>(mockTransactions)
  const [dateRange, setDateRange] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  // Calculate summary stats
  const totalTransactions = transactions.length
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0)
  const avgTransaction = totalVolume / totalTransactions
  const successRate = (transactions.filter(t => t.status === 'completed').length / totalTransactions) * 100

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownIcon />
      case 'withdrawal':
        return <ArrowUpIcon />
      case 'transfer':
        return <ArrowRightIcon />
    }
  }

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'green'
      case 'pending':
        return 'orange'
      case 'failed':
        return 'red'
    }
  }

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    showToast({
      type: 'success',
      title: `Exporting to ${format.toUpperCase()}`,
      description: 'Your file will be downloaded shortly'
    })
  }

  const handleShare = () => {
    setShowShareDialog(true)
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText('https://dashboard.example.com/shared/transactions/abc123')
    showToast({
      type: 'success',
      title: 'Link copied',
      description: 'Share link has been copied to clipboard'
    })
    setShowShareDialog(false)
  }

  const columns = [
    {
      key: 'type',
      header: 'Type',
      width: '60px',
      render: (value: Transaction['type']) => (
        <Box style={{ color: value === 'deposit' ? 'var(--green-9)' : value === 'withdrawal' ? 'var(--red-9)' : 'var(--blue-9)' }}>
          {getTypeIcon(value)}
        </Box>
      )
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (value: Date) => (
        <Text size="2">{value.toLocaleDateString()} {value.toLocaleTimeString()}</Text>
      )
    },
    {
      key: 'description',
      header: 'Description',
      sortable: true
    },
    {
      key: 'from',
      header: 'From',
      sortable: true
    },
    {
      key: 'to',
      header: 'To',
      sortable: true
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      align: 'right' as const,
      render: (value: number, row: Transaction) => (
        <Text 
          size="2" 
          weight="medium"
          color={row.type === 'deposit' ? 'green' : row.type === 'withdrawal' ? 'red' : undefined}
        >
          {row.type === 'deposit' ? '+' : '-'}${value.toFixed(2)}
        </Text>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: Transaction['status']) => (
        <Badge color={getStatusColor(value)} variant="soft">
          {value}
        </Badge>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (value: string) => (
        <Badge variant="outline" size="1">
          {value}
        </Badge>
      )
    }
  ]

  return (
    <Box>
      <Flex direction="column" gap="6">
        <Flex justify="between" align="center">
          <Box>
            <Heading size="8" mb="2">Transactions</Heading>
            <Text color="gray">View and manage all your financial transactions</Text>
          </Box>
          <Button>
            New Transaction
          </Button>
        </Flex>

        {/* Summary Cards */}
        <Grid columns={{ initial: '2', sm: '4' }} gap="4">
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Total Transactions</Text>
              <Text size="6" weight="bold">{totalTransactions}</Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Total Volume</Text>
              <Text size="6" weight="bold">${totalVolume.toFixed(2)}</Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Average Transaction</Text>
              <Text size="6" weight="bold">${avgTransaction.toFixed(2)}</Text>
            </Flex>
          </Card>
          <Card>
            <Flex direction="column" gap="1">
              <Text size="2" color="gray">Success Rate</Text>
              <Text size="6" weight="bold">{successRate.toFixed(1)}%</Text>
            </Flex>
          </Card>
        </Grid>

        {/* Filters */}
        <Card>
          <Flex gap="3" align="end" wrap="wrap">
            <Box>
              <Text size="2" weight="medium" mb="1">Date Range</Text>
              <Select.Root value={dateRange} onValueChange={setDateRange}>
                <Select.Trigger>
                  <CalendarIcon />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="all">All Time</Select.Item>
                  <Select.Item value="today">Today</Select.Item>
                  <Select.Item value="week">This Week</Select.Item>
                  <Select.Item value="month">This Month</Select.Item>
                  <Select.Item value="year">This Year</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
            
            <Box>
              <Text size="2" weight="medium" mb="1">Type</Text>
              <Select.Root value={typeFilter} onValueChange={setTypeFilter}>
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="all">All Types</Select.Item>
                  <Select.Item value="deposit">Deposits</Select.Item>
                  <Select.Item value="withdrawal">Withdrawals</Select.Item>
                  <Select.Item value="transfer">Transfers</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
            
            <Box>
              <Text size="2" weight="medium" mb="1">Status</Text>
              <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="all">All Status</Select.Item>
                  <Select.Item value="completed">Completed</Select.Item>
                  <Select.Item value="pending">Pending</Select.Item>
                  <Select.Item value="failed">Failed</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
            
            <Box style={{ flex: 1, minWidth: '200px' }}>
              <Text size="2" weight="medium" mb="1">Amount Range</Text>
              <Flex gap="2">
                <TextField.Root placeholder="Min" type="number" />
                <TextField.Root placeholder="Max" type="number" />
              </Flex>
            </Box>
          </Flex>
        </Card>

        {/* Transactions Table */}
        <Card>
          <DataTable
            data={transactions}
            columns={columns}
            searchPlaceholder="Search transactions..."
            onRowClick={setSelectedTransaction}
            selectable
            onExport={handleExport}
            onShare={handleShare}
          />
        </Card>
      </Flex>

      {/* Share Dialog */}
      <Dialog.Root open={showShareDialog} onOpenChange={setShowShareDialog}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Share Transactions</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Share this transaction report with others via a secure link.
          </Dialog.Description>
          
          <Flex direction="column" gap="3">
            <Box>
              <Text size="2" weight="medium" mb="1">Share Link</Text>
              <Flex gap="2">
                <TextField.Root 
                  value="https://dashboard.example.com/shared/transactions/abc123"
                  readOnly
                  style={{ flex: 1 }}
                />
                <Button size="2" onClick={copyShareLink}>
                  Copy
                </Button>
              </Flex>
            </Box>
            
            <Box>
              <Text size="2" weight="medium" mb="1">Link expires in</Text>
              <Select.Root defaultValue="7days">
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="1day">1 day</Select.Item>
                  <Select.Item value="7days">7 days</Select.Item>
                  <Select.Item value="30days">30 days</Select.Item>
                  <Select.Item value="never">Never</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>
            
            <Flex align="center" gap="2">
              <Checkbox defaultChecked />
              <Text size="2">Require password to access</Text>
            </Flex>
          </Flex>
          
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancel</Button>
            </Dialog.Close>
            <Button onClick={copyShareLink}>
              <Share1Icon />
              Create Share Link
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Transaction Details Dialog */}
      <Dialog.Root open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>Transaction Details</Dialog.Title>
          
          {selectedTransaction && (
            <Flex direction="column" gap="4" mt="4">
              <Flex justify="between">
                <Text size="2" color="gray">Transaction ID</Text>
                <Text size="2" weight="medium">{selectedTransaction.id}</Text>
              </Flex>
              
              <Flex justify="between">
                <Text size="2" color="gray">Date & Time</Text>
                <Text size="2">{selectedTransaction.date.toLocaleString()}</Text>
              </Flex>
              
              <Flex justify="between">
                <Text size="2" color="gray">Type</Text>
                <Badge variant="soft">{selectedTransaction.type}</Badge>
              </Flex>
              
              <Flex justify="between">
                <Text size="2" color="gray">Amount</Text>
                <Text size="3" weight="bold" color={selectedTransaction.type === 'deposit' ? 'green' : 'red'}>
                  {selectedTransaction.type === 'deposit' ? '+' : '-'}${selectedTransaction.amount.toFixed(2)}
                </Text>
              </Flex>
              
              <Flex justify="between">
                <Text size="2" color="gray">From</Text>
                <Text size="2">{selectedTransaction.from}</Text>
              </Flex>
              
              <Flex justify="between">
                <Text size="2" color="gray">To</Text>
                <Text size="2">{selectedTransaction.to}</Text>
              </Flex>
              
              <Flex justify="between">
                <Text size="2" color="gray">Reference</Text>
                <Text size="2" style={{ fontFamily: 'monospace' }}>{selectedTransaction.reference}</Text>
              </Flex>
              
              <Flex justify="between">
                <Text size="2" color="gray">Category</Text>
                <Badge variant="outline">{selectedTransaction.category}</Badge>
              </Flex>
              
              <Flex justify="between">
                <Text size="2" color="gray">Status</Text>
                <Badge color={getStatusColor(selectedTransaction.status)} variant="soft">
                  {selectedTransaction.status}
                </Badge>
              </Flex>
            </Flex>
          )}
          
          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Close</Button>
            </Dialog.Close>
            <Button>
              <DownloadIcon />
              Download Receipt
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  )
}

