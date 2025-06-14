import { useState } from 'react'
import { 
  Box, 
  Heading, 
  Flex, 
  Button, 
  Dialog,
  TextField,
  Select,
  Text,
  IconButton,
  Badge,
  DropdownMenu,
  AlertDialog,
  TextArea
} from '@radix-ui/themes'
import { 
  PlusIcon, 
  Pencil1Icon, 
  TrashIcon,
  DotsHorizontalIcon,
  DownloadIcon,
  CopyIcon,
  EyeOpenIcon
} from '@radix-ui/react-icons'
import DataTable from '../../components/DataTable'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: 'active' | 'draft' | 'archived'
  description?: string
  createdAt: string
  updatedAt: string
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    sku: 'WH-001',
    category: 'Electronics',
    price: 99.99,
    stock: 150,
    status: 'active',
    description: 'High-quality wireless headphones with noise cancellation',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-15'
  },
  {
    id: '2',
    name: 'Smart Watch',
    sku: 'SW-002',
    category: 'Electronics',
    price: 249.99,
    stock: 75,
    status: 'active',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-10'
  },
  {
    id: '3',
    name: 'Running Shoes',
    sku: 'RS-003',
    category: 'Footwear',
    price: 89.99,
    stock: 200,
    status: 'active',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-18'
  },
  {
    id: '4',
    name: 'Laptop Backpack',
    sku: 'LB-004',
    category: 'Accessories',
    price: 49.99,
    stock: 0,
    status: 'active',
    createdAt: '2024-02-05',
    updatedAt: '2024-03-20'
  },
  {
    id: '5',
    name: 'Bluetooth Speaker',
    sku: 'BS-005',
    category: 'Electronics',
    price: 79.99,
    stock: 100,
    status: 'draft',
    createdAt: '2024-02-10',
    updatedAt: '2024-03-19'
  },
  {
    id: '6',
    name: 'Yoga Mat',
    sku: 'YM-006',
    category: 'Sports',
    price: 29.99,
    stock: 300,
    status: 'active',
    createdAt: '2024-02-15',
    updatedAt: '2024-03-15'
  },
  {
    id: '7',
    name: 'Coffee Maker',
    sku: 'CM-007',
    category: 'Appliances',
    price: 149.99,
    stock: 50,
    status: 'active',
    createdAt: '2024-02-20',
    updatedAt: '2024-03-16'
  },
  {
    id: '8',
    name: 'Desk Lamp',
    sku: 'DL-008',
    category: 'Furniture',
    price: 39.99,
    stock: 120,
    status: 'archived',
    createdAt: '2024-02-25',
    updatedAt: '2024-03-01'
  },
  {
    id: '9',
    name: 'Water Bottle',
    sku: 'WB-009',
    category: 'Accessories',
    price: 19.99,
    stock: 500,
    status: 'active',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-18'
  },
  {
    id: '10',
    name: 'Gaming Mouse',
    sku: 'GM-010',
    category: 'Electronics',
    price: 69.99,
    stock: 80,
    status: 'active',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-20'
  }
]

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedRows, setSelectedRows] = useState<Product[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    status: 'active' as Product['status'],
    description: ''
  })

  const columns = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (_: any, product: any) => (
        <Box>
          <Text size="2" weight="medium">{product.name}</Text>
          <Text size="1" color="gray">{product.sku}</Text>
        </Box>
      )
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (category: any) => (
        <Badge variant="soft" color="gray">
          {category}
        </Badge>
      )
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (price: any) => (
        <Text size="2" weight="medium">
          ${price.toFixed(2)}
        </Text>
      )
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      render: (stock: any) => (
        <Flex align="center" gap="2">
          <Text size="2">{stock}</Text>
          {stock === 0 && (
            <Badge color="red" variant="soft" size="1">
              Out of stock
            </Badge>
          )}
          {stock > 0 && stock < 50 && (
            <Badge color="orange" variant="soft" size="1">
              Low stock
            </Badge>
          )}
        </Flex>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (status: any) => (
        <Badge 
          color={status === 'active' ? 'green' : status === 'draft' ? 'blue' : 'gray'}
          variant="soft"
        >
          {status}
        </Badge>
      )
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      sortable: true,
      render: (date: any) => new Date(date).toLocaleDateString()
    }
  ]

  const handleCreate = () => {
    const newProduct: Product = {
      id: String(Date.now()),
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      status: formData.status,
      description: formData.description,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    setProducts([...products, newProduct])
    setIsCreateOpen(false)
    resetForm()
  }

  const handleEdit = () => {
    if (!selectedProduct) return
    
    setProducts(products.map(product => 
      product.id === selectedProduct.id 
        ? { 
            ...product, 
            name: formData.name,
            sku: formData.sku,
            category: formData.category,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            status: formData.status,
            description: formData.description,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : product
    ))
    setIsEditOpen(false)
    resetForm()
  }

  const handleDelete = () => {
    if (!selectedProduct) return
    
    setProducts(products.filter(product => product.id !== selectedProduct.id))
    setIsDeleteOpen(false)
    setSelectedProduct(null)
  }

  const handleBulkDelete = () => {
    const selectedIds = new Set(selectedRows.map(row => row.id))
    setProducts(products.filter(product => !selectedIds.has(product.id)))
    setSelectedRows([])
  }

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      price: '',
      stock: '',
      status: 'active',
      description: ''
    })
    setSelectedProduct(null)
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status,
      description: product.description || ''
    })
    setIsEditOpen(true)
  }

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteOpen(true)
  }

  const actions = (product: Product) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" size="2">
          <DotsHorizontalIcon />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>
          <EyeOpenIcon />
          View Details
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => openEditDialog(product)}>
          <Pencil1Icon />
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <CopyIcon />
          Duplicate
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item color="red" onClick={() => openDeleteDialog(product)}>
          <TrashIcon />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )

  const categories = ['Electronics', 'Footwear', 'Accessories', 'Sports', 'Appliances', 'Furniture']

  return (
    <Box>
      <Flex justify="between" align="center" mb="6">
        <Box>
          <Heading size="7" mb="2">Products</Heading>
          <Text color="gray">Manage your product catalog</Text>
        </Box>
        <Flex gap="3">
          {selectedRows.length > 0 && (
            <Button color="red" variant="soft" onClick={handleBulkDelete}>
              <TrashIcon />
              Delete ({selectedRows.length})
            </Button>
          )}
          <Button variant="soft">
            <DownloadIcon />
            Export
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusIcon />
            Add Product
          </Button>
        </Flex>
      </Flex>

      <DataTable
        data={products}
        columns={columns}
        searchPlaceholder="Search products..."
        selectable
        onSelectionChange={setSelectedRows}
        actions={actions}
      />

      {/* Create Product Dialog */}
      <Dialog.Root open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Create New Product</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Add a new product to your catalog
          </Dialog.Description>

          <Flex direction="column" gap="4">
            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Product Name
              </Text>
              <TextField.Root
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Box>

            <Flex gap="3">
              <Box style={{ flex: 1 }}>
                <Text as="label" size="2" weight="medium" mb="1">
                  SKU
                </Text>
                <TextField.Root
                  placeholder="Enter SKU"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </Box>

              <Box style={{ flex: 1 }}>
                <Text as="label" size="2" weight="medium" mb="1">
                  Category
                </Text>
                <Select.Root 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <Select.Trigger style={{ width: '100%' }} placeholder="Select category" />
                  <Select.Content>
                    {categories.map(cat => (
                      <Select.Item key={cat} value={cat}>{cat}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>
            </Flex>

            <Flex gap="3">
              <Box style={{ flex: 1 }}>
                <Text as="label" size="2" weight="medium" mb="1">
                  Price
                </Text>
                <TextField.Root
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                >
                  <TextField.Slot>$</TextField.Slot>
                </TextField.Root>
              </Box>

              <Box style={{ flex: 1 }}>
                <Text as="label" size="2" weight="medium" mb="1">
                  Stock Quantity
                </Text>
                <TextField.Root
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </Box>
            </Flex>

            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Status
              </Text>
              <Select.Root 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value as Product['status'] })}
              >
                <Select.Trigger style={{ width: '100%' }} />
                <Select.Content>
                  <Select.Item value="active">Active</Select.Item>
                  <Select.Item value="draft">Draft</Select.Item>
                  <Select.Item value="archived">Archived</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Description
              </Text>
              <TextArea
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ minHeight: '80px' }}
              />
            </Box>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button onClick={handleCreate}>
              Create Product
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Edit Product Dialog */}
      <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Edit Product</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Update product information
          </Dialog.Description>

          <Flex direction="column" gap="4">
            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Product Name
              </Text>
              <TextField.Root
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Box>

            <Flex gap="3">
              <Box style={{ flex: 1 }}>
                <Text as="label" size="2" weight="medium" mb="1">
                  SKU
                </Text>
                <TextField.Root
                  placeholder="Enter SKU"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </Box>

              <Box style={{ flex: 1 }}>
                <Text as="label" size="2" weight="medium" mb="1">
                  Category
                </Text>
                <Select.Root 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <Select.Trigger style={{ width: '100%' }} placeholder="Select category" />
                  <Select.Content>
                    {categories.map(cat => (
                      <Select.Item key={cat} value={cat}>{cat}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>
            </Flex>

            <Flex gap="3">
              <Box style={{ flex: 1 }}>
                <Text as="label" size="2" weight="medium" mb="1">
                  Price
                </Text>
                <TextField.Root
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                >
                  <TextField.Slot>$</TextField.Slot>
                </TextField.Root>
              </Box>

              <Box style={{ flex: 1 }}>
                <Text as="label" size="2" weight="medium" mb="1">
                  Stock Quantity
                </Text>
                <TextField.Root
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </Box>
            </Flex>

            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Status
              </Text>
              <Select.Root 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value as Product['status'] })}
              >
                <Select.Trigger style={{ width: '100%' }} />
                <Select.Content>
                  <Select.Item value="active">Active</Select.Item>
                  <Select.Item value="draft">Draft</Select.Item>
                  <Select.Item value="archived">Archived</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Description
              </Text>
              <TextArea
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ minHeight: '80px' }}
              />
            </Box>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button onClick={handleEdit}>
              Save Changes
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <AlertDialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialog.Content style={{ maxWidth: 450 }}>
          <AlertDialog.Title>Delete Product</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button color="red" onClick={handleDelete}>
                Delete Product
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Box>
  )
}