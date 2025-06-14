import { useState } from 'react'
import { 
  Box, 
  Heading, 
  Flex, 
  Button, 
  Dialog,
  Text,
  IconButton,
  Badge,
  DropdownMenu,
  Card,
  Separator,
  ScrollArea
} from '@radix-ui/themes'
import { 
  EyeOpenIcon,
  DotsHorizontalIcon,
  DownloadIcon,
  CheckIcon,
  Cross2Icon,
  ClockIcon,
  CubeIcon as PackageIcon,
  ReloadIcon
} from '@radix-ui/react-icons'
import DataTable from '../../components/DataTable'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
  }
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  shippingAddress: string
  createdAt: string
  updatedAt: string
}

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    items: [
      { id: '1', name: 'Wireless Headphones', quantity: 1, price: 99.99 },
      { id: '2', name: 'Phone Case', quantity: 2, price: 19.99 }
    ],
    total: 139.97,
    status: 'delivered',
    paymentMethod: 'Credit Card',
    shippingAddress: '123 Main St, New York, NY 10001',
    createdAt: '2024-03-15T10:30:00',
    updatedAt: '2024-03-18T14:20:00'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    },
    items: [
      { id: '3', name: 'Smart Watch', quantity: 1, price: 249.99 }
    ],
    total: 249.99,
    status: 'shipped',
    paymentMethod: 'PayPal',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    createdAt: '2024-03-16T09:15:00',
    updatedAt: '2024-03-17T11:45:00'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com'
    },
    items: [
      { id: '4', name: 'Running Shoes', quantity: 1, price: 89.99 },
      { id: '5', name: 'Sports Socks', quantity: 3, price: 12.99 }
    ],
    total: 128.96,
    status: 'processing',
    paymentMethod: 'Credit Card',
    shippingAddress: '789 Pine St, Chicago, IL 60601',
    createdAt: '2024-03-17T14:20:00',
    updatedAt: '2024-03-17T14:20:00'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customer: {
      name: 'Alice Williams',
      email: 'alice.williams@example.com'
    },
    items: [
      { id: '6', name: 'Laptop Backpack', quantity: 1, price: 49.99 },
      { id: '7', name: 'Water Bottle', quantity: 2, price: 19.99 }
    ],
    total: 89.97,
    status: 'pending',
    paymentMethod: 'Debit Card',
    shippingAddress: '321 Elm St, Houston, TX 77001',
    createdAt: '2024-03-18T08:45:00',
    updatedAt: '2024-03-18T08:45:00'
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customer: {
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com'
    },
    items: [
      { id: '8', name: 'Bluetooth Speaker', quantity: 1, price: 79.99 }
    ],
    total: 79.99,
    status: 'cancelled',
    paymentMethod: 'Credit Card',
    shippingAddress: '654 Maple Dr, Phoenix, AZ 85001',
    createdAt: '2024-03-18T11:30:00',
    updatedAt: '2024-03-18T15:00:00'
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    customer: {
      name: 'Eva Davis',
      email: 'eva.davis@example.com'
    },
    items: [
      { id: '9', name: 'Yoga Mat', quantity: 1, price: 29.99 },
      { id: '10', name: 'Resistance Bands', quantity: 1, price: 24.99 }
    ],
    total: 54.98,
    status: 'shipped',
    paymentMethod: 'Apple Pay',
    shippingAddress: '987 Cedar Ln, Seattle, WA 98101',
    createdAt: '2024-03-19T13:00:00',
    updatedAt: '2024-03-20T09:30:00'
  },
  {
    id: '7',
    orderNumber: 'ORD-2024-007',
    customer: {
      name: 'Frank Miller',
      email: 'frank.miller@example.com'
    },
    items: [
      { id: '11', name: 'Coffee Maker', quantity: 1, price: 149.99 },
      { id: '12', name: 'Coffee Beans', quantity: 2, price: 14.99 }
    ],
    total: 179.97,
    status: 'processing',
    paymentMethod: 'Credit Card',
    shippingAddress: '147 Birch Rd, Boston, MA 02101',
    createdAt: '2024-03-20T10:15:00',
    updatedAt: '2024-03-20T10:15:00'
  },
  {
    id: '8',
    orderNumber: 'ORD-2024-008',
    customer: {
      name: 'Grace Wilson',
      email: 'grace.wilson@example.com'
    },
    items: [
      { id: '13', name: 'Desk Lamp', quantity: 1, price: 39.99 },
      { id: '14', name: 'Notebook Set', quantity: 1, price: 12.99 }
    ],
    total: 52.98,
    status: 'delivered',
    paymentMethod: 'PayPal',
    shippingAddress: '258 Spruce Ave, Denver, CO 80201',
    createdAt: '2024-03-14T16:45:00',
    updatedAt: '2024-03-17T10:00:00'
  }
]

export default function Orders() {
  const [orders] = useState<Order[]>(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Order[]>([])

  const columns = [
    {
      key: 'orderNumber',
      header: 'Order',
      sortable: true,
      render: (_: any, order: any) => (
        <Box>
          <Text size="2" weight="medium">{order.orderNumber}</Text>
          <Text size="1" color="gray">{new Date(order.createdAt).toLocaleDateString()}</Text>
        </Box>
      )
    },
    {
      key: 'customer.name',
      header: 'Customer',
      sortable: true,
      render: (_: any, order: any) => (
        <Box>
          <Text size="2">{order.customer.name}</Text>
          <Text size="1" color="gray">{order.customer.email}</Text>
        </Box>
      )
    },
    {
      key: 'items',
      header: 'Items',
      render: (items: OrderItem[]) => (
        <Text size="2">{items.reduce((sum, item) => sum + item.quantity, 0)} items</Text>
      )
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      render: (total: any) => (
        <Text size="2" weight="medium">${total.toFixed(2)}</Text>
      )
    },
    {
      key: 'paymentMethod',
      header: 'Payment',
      render: (method: any) => (
        <Badge variant="soft" color="gray" size="1">
          {method}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (status: any) => {
        const statusConfig = {
          pending: { color: 'orange' as const, icon: <ClockIcon /> },
          processing: { color: 'blue' as const, icon: <ReloadIcon /> },
          shipped: { color: 'purple' as const, icon: <PackageIcon /> },
          delivered: { color: 'green' as const, icon: <CheckIcon /> },
          cancelled: { color: 'red' as const, icon: <Cross2Icon /> }
        }
        
        const config = statusConfig[status as keyof typeof statusConfig]
        
        return (
          <Badge color={config.color} variant="soft">
            {config.icon}
            {status}
          </Badge>
        )
      }
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      sortable: true,
      render: (date: any) => new Date(date).toLocaleDateString()
    }
  ]

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    // In a real app, this would update the order status
    console.log(`Updating order ${orderId} to status ${newStatus}`)
  }

  const actions = (order: Order) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" size="2">
          <DotsHorizontalIcon />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => handleViewDetails(order)}>
          <EyeOpenIcon />
          View Details
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            Update Status
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item onClick={() => handleUpdateStatus(order.id, 'pending')}>
              <ClockIcon />
              Pending
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => handleUpdateStatus(order.id, 'processing')}>
              <ReloadIcon />
              Processing
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => handleUpdateStatus(order.id, 'shipped')}>
              <PackageIcon />
              Shipped
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => handleUpdateStatus(order.id, 'delivered')}>
              <CheckIcon />
              Delivered
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={() => handleUpdateStatus(order.id, 'cancelled')}>
              <Cross2Icon />
              Cancelled
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )

  return (
    <Box>
      <Flex justify="between" align="center" mb="6">
        <Box>
          <Heading size="7" mb="2">Orders</Heading>
          <Text color="gray">Manage and track customer orders</Text>
        </Box>
        <Flex gap="3">
          {selectedRows.length > 0 && (
            <Button variant="soft">
              Process ({selectedRows.length})
            </Button>
          )}
          <Button variant="soft">
            <DownloadIcon />
            Export
          </Button>
        </Flex>
      </Flex>

      <DataTable
        data={orders}
        columns={columns}
        searchPlaceholder="Search orders..."
        selectable
        onSelectionChange={setSelectedRows}
        actions={actions}
      />

      {/* Order Details Dialog */}
      <Dialog.Root open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          <Dialog.Title>Order Details</Dialog.Title>
          
          {selectedOrder && (
            <Box>
              <Flex justify="between" align="start" mb="4">
                <Box>
                  <Text size="2" weight="bold">{selectedOrder.orderNumber}</Text>
                  <Text size="2" color="gray">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </Text>
                </Box>
                <Badge 
                  color={
                    selectedOrder.status === 'delivered' ? 'green' :
                    selectedOrder.status === 'shipped' ? 'purple' :
                    selectedOrder.status === 'processing' ? 'blue' :
                    selectedOrder.status === 'pending' ? 'orange' : 'red'
                  }
                  variant="soft"
                  size="2"
                >
                  {selectedOrder.status}
                </Badge>
              </Flex>

              <Card mb="4">
                <Heading size="3" mb="3">Customer Information</Heading>
                <Flex direction="column" gap="2">
                  <Flex justify="between">
                    <Text size="2" color="gray">Name:</Text>
                    <Text size="2">{selectedOrder.customer.name}</Text>
                  </Flex>
                  <Flex justify="between">
                    <Text size="2" color="gray">Email:</Text>
                    <Text size="2">{selectedOrder.customer.email}</Text>
                  </Flex>
                  <Flex justify="between">
                    <Text size="2" color="gray">Payment Method:</Text>
                    <Text size="2">{selectedOrder.paymentMethod}</Text>
                  </Flex>
                </Flex>
              </Card>

              <Card mb="4">
                <Heading size="3" mb="3">Shipping Address</Heading>
                <Text size="2">{selectedOrder.shippingAddress}</Text>
              </Card>

              <Card mb="4">
                <Heading size="3" mb="3">Order Items</Heading>
                <ScrollArea style={{ maxHeight: '200px' }}>
                  <Flex direction="column" gap="2">
                    {selectedOrder.items.map((item, index) => (
                      <Box key={item.id}>
                        {index > 0 && <Separator my="2" />}
                        <Flex justify="between" align="center">
                          <Box>
                            <Text size="2" weight="medium">{item.name}</Text>
                            <Text size="1" color="gray">Quantity: {item.quantity}</Text>
                          </Box>
                          <Text size="2" weight="medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Text>
                        </Flex>
                      </Box>
                    ))}
                  </Flex>
                </ScrollArea>
                <Separator my="3" />
                <Flex justify="between" align="center">
                  <Text size="3" weight="bold">Total</Text>
                  <Text size="3" weight="bold">${selectedOrder.total.toFixed(2)}</Text>
                </Flex>
              </Card>

              <Flex gap="3" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Close
                  </Button>
                </Dialog.Close>
                <Button>
                  Update Order
                </Button>
              </Flex>
            </Box>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  )
}