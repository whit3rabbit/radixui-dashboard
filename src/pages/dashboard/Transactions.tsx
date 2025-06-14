/**
 * @file Transactions.tsx
 * @description This file defines the Transactions page component for the dashboard.
 * It displays a list of financial transactions, provides filtering options,
 * summary statistics, and actions like exporting or sharing transaction reports.
 * All data displayed is currently mock data.
 */
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
import DataTable from '../../components/DataTable' // Reusable DataTable component
import { useToast } from '../../components/notifications/toast-context' // For toast notifications

/**
 * @typedef {'deposit' | 'withdrawal' | 'transfer'} TransactionType
 * @description Represents the type of a financial transaction.
 */
type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

/**
 * @typedef {'completed' | 'pending' | 'failed'} TransactionStatus
 * @description Represents the status of a financial transaction.
 */
type TransactionStatus = 'completed' | 'pending' | 'failed';

/**
 * @interface Transaction
 * @description Defines the structure of a transaction object.
 * @property {string} id - Unique identifier for the transaction.
 * @property {Date} date - Date and time of the transaction.
 * @property {string} description - A brief description of the transaction.
 * @property {TransactionType} type - The type of transaction (e.g., 'deposit', 'withdrawal').
 * @property {number} amount - The monetary value of the transaction.
 * @property {TransactionStatus} status - The current status of the transaction.
 * @property {string} from - The source account or entity.
 * @property {string} to - The destination account or entity.
 * @property {string} reference - A reference number or code for the transaction.
 * @property {string} category - Category of the transaction (e.g., 'Income', 'Housing').
 */
interface Transaction {
  id: string;
  date: Date;
  description: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  from: string;
  to: string;
  reference: string;
  category: string;
}

// TODO: Replace mockTransactions with actual data fetched from an API or data source.
/**
 * @const mockTransactions
 * @description An array of mock transaction data used for demonstration purposes.
 */
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
  // ... more mock transactions
];

/**
 * @function Transactions
 * @description The main component for the Transactions page.
 * It displays a filterable and sortable table of financial transactions,
 * summary statistics, and provides options for exporting and sharing reports.
 * @returns {JSX.Element} The rendered Transactions page.
 */
export default function Transactions() {
  const { showToast } = useToast(); // Hook for displaying toast notifications
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactions, _setTransactions] = useState<Transaction[]>(mockTransactions); // State for transactions, initialized with mock data.
                                                                                // `_setTransactions` would be used if data can be updated/refetched.
  // --- Filter States ---
  const [dateRange, setDateRange] = useState('all'); // Filter by date range
  const [typeFilter, setTypeFilter] = useState('all'); // Filter by transaction type
  const [statusFilter, setStatusFilter] = useState('all'); // Filter by transaction status
  // TODO: Add state for amount range filter if it needs to be controlled.

  // --- Dialog States ---
  const [showShareDialog, setShowShareDialog] = useState(false); // Controls visibility of the share dialog
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null); // For transaction details dialog

  // --- Calculated Summary Statistics ---
  // TODO: These calculations should ideally be memoized (e.g., with useMemo) if `transactions` can change frequently
  // or if calculations are expensive, especially if filtering is client-side.
  const totalTransactions = transactions.length;
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransaction = totalTransactions > 0 ? totalVolume / totalTransactions : 0;
  const successRate = totalTransactions > 0 ? (transactions.filter(t => t.status === 'completed').length / totalTransactions) * 100 : 0;

  /**
   * @function getTypeIcon
   * @description Returns an icon component based on the transaction type.
   * @param {TransactionType} type - The type of the transaction.
   * @returns {JSX.Element} The corresponding icon.
   */
  const getTypeIcon = (type: TransactionType): JSX.Element => {
    switch (type) {
      case 'deposit':
        return <ArrowDownIcon />; // Icon indicating money coming in
      case 'withdrawal':
        return <ArrowUpIcon />; // Icon indicating money going out
      case 'transfer':
        return <ArrowRightIcon />; // Icon indicating a transfer
      default: // Should not happen with TransactionType
        return <ArrowRightIcon />;
    }
  };

  /**
   * @function getStatusColor
   * @description Returns a color name (from Radix theme colors) based on transaction status.
   * @param {TransactionStatus} status - The status of the transaction.
   * @returns {'green' | 'orange' | 'red'} The color name.
   */
  const getStatusColor = (status: TransactionStatus): 'green' | 'orange' | 'red' => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'failed':
        return 'red';
      default:
        return 'gray'; // Fallback, though status is typed
    }
  };

  /**
   * @function handleExport
   * @description Placeholder function to simulate exporting transaction data. Shows a toast.
   * @param {'csv' | 'excel' | 'pdf'} format - The desired export format.
   */
  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // TODO: Implement actual export logic (e.g., generate file and trigger download)
    showToast({
      type: 'success',
      title: `Exporting to ${format.toUpperCase()}`,
      description: 'Your transaction report will be downloaded shortly.'
    });
  };

  /**
   * @function handleShare
   * @description Opens the share dialog.
   */
  const handleShare = () => {
    setShowShareDialog(true);
  };

  /**
   * @function copyShareLink
   * @description Simulates copying a share link to the clipboard and shows a toast.
   */
  const copyShareLink = () => {
    // TODO: Implement actual share link generation and copying
    navigator.clipboard.writeText('https://dashboard.example.com/shared/transactions/mock-link-abc123xyz');
    showToast({
      type: 'success',
      title: 'Link Copied',
      description: 'A shareable link has been copied to your clipboard.'
    });
    setShowShareDialog(false); // Close dialog after copying
  };

  /**
   * @const columns
   * @description Configuration for the columns in the DataTable displaying transactions.
   * Defines how each piece of transaction data is rendered.
   */
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
            
            <Box style={{ flex: 1 }} minWidth="200px">
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
        <Dialog.Content maxWidth="450px">
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
        <Dialog.Content maxWidth="500px">
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

