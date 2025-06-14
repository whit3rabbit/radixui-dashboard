/**
 * @file Products.tsx
 * @description This file defines the Products page component for the dashboard.
 * It allows users to manage their product catalog, including viewing, adding,
 * editing, and deleting products. It features a DataTable for displaying products
 * and dialogs for create/edit/delete operations.
 * All data displayed is currently mock data.
 */
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
import DataTable from '../../components/DataTable' // Reusable DataTable component

/**
 * @typedef {'active' | 'draft' | 'archived'} ProductStatus
 * @description Represents the possible statuses of a product.
 */
type ProductStatus = 'active' | 'draft' | 'archived';

/**
 * @interface Product
 * @description Defines the structure of a product object.
 * @property {string} id - Unique identifier for the product.
 * @property {string} name - Name of the product.
 * @property {string} sku - Stock Keeping Unit for the product.
 * @property {string} category - Category the product belongs to.
 * @property {number} price - Price of the product.
 * @property {number} stock - Current stock quantity of the product.
 * @property {ProductStatus} status - Current status of the product (e.g., 'active', 'draft').
 * @property {string} [description] - Optional detailed description of the product.
 * @property {string} createdAt - ISO date string representing when the product was created.
 * @property {string} updatedAt - ISO date string representing when the product was last updated.
 */
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  description?: string;
  createdAt: string; // Should ideally be Date object or ISO string
  updatedAt: string; // Should ideally be Date object or ISO string
}

// TODO: Replace mockProducts with actual data fetched from an API or data source.
/**
 * @const mockProducts
 * @description An array of mock product data used for demonstration purposes.
 */
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
  // ... more mock products
]

/**
 * @typedef ProductFormData
 * @description Defines the structure for the product form data (used for create/edit).
 * Note: Price and stock are strings here due to input field behavior, conversion needed on submit.
 * @property {string} name
 * @property {string} sku
 * @property {string} category
 * @property {string} price
 * @property {string} stock
 * @property {ProductStatus} status
 * @property {string} description
 */
type ProductFormData = {
  name: string;
  sku: string;
  category: string;
  price: string; // Input as string, parse to number on submit
  stock: string; // Input as string, parse to number on submit
  status: ProductStatus;
  description: string;
};

/**
 * @function Products
 * @description The main component for the Products page.
 * It displays a table of products and provides CRUD (Create, Read, Update, Delete) functionalities.
 * Features include adding new products, editing existing ones, and deleting products,
 * all managed through dialogs and a data table.
 * @returns {JSX.Element} The rendered Products page.
 */
export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts); // Holds the list of products
  const [isCreateOpen, setIsCreateOpen] = useState(false); // Controls visibility of the create product dialog
  const [isEditOpen, setIsEditOpen] = useState(false); // Controls visibility of the edit product dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // Controls visibility of the delete confirmation dialog
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Stores the product selected for editing or deletion
  const [selectedRows, setSelectedRows] = useState<Product[]>([]); // Stores rows selected in DataTable for bulk actions

  // State for the form data in create/edit dialogs
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    status: 'active', // Default status for new products
    description: ''
  });

  /**
   * @const columns
   * @description Configuration for the columns in the DataTable displaying products.
   */
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

  /**
   * @function handleCreate
   * @description Handles the creation of a new product.
   * It takes the current `formData`, adds a new product to the `products` state,
   * closes the create dialog, and resets the form.
   * In a real app, this would involve an API call.
   */
  const handleCreate = () => {
    // TODO: Add validation for formData before creating.
    const newProduct: Product = {
      id: String(Date.now()), // Simple ID generation for mock data
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

  /**
   * @function handleEdit
   * @description Handles editing an existing product.
   * It updates the product in the `products` state based on `selectedProduct` and `formData`,
   * closes the edit dialog, and resets the form.
   * In a real app, this would involve an API call.
   */
  const handleEdit = () => {
    if (!selectedProduct) return;
    // TODO: Add validation for formData before editing.
    setProducts(products.map(product =>
      product.id === selectedProduct.id
        ? {
            ...product,
            name: formData.name,
            sku: formData.sku,
            category: formData.category,
            price: parseFloat(formData.price) || 0, // Ensure price is a number
            stock: parseInt(formData.stock) || 0,   // Ensure stock is a number
            status: formData.status,
            description: formData.description,
            updatedAt: new Date().toISOString().split('T')[0] // Update timestamp
          }
        : product
    ));
    setIsEditOpen(false);
    resetForm();
  };

  /**
   * @function handleDelete
   * @description Handles the deletion of a single product.
   * It removes the `selectedProduct` from the `products` state and closes the delete dialog.
   * In a real app, this would involve an API call.
   */
  const handleDelete = () => {
    if (!selectedProduct) return;
    setProducts(products.filter(product => product.id !== selectedProduct.id));
    setIsDeleteOpen(false);
    setSelectedProduct(null); // Clear selected product
  };

  /**
   * @function handleBulkDelete
   * @description Handles the deletion of multiple products selected in the DataTable.
   * It filters out the selected products from the `products` state.
   * In a real app, this would involve multiple API calls or a bulk delete API endpoint.
   */
  const handleBulkDelete = () => {
    const selectedIds = new Set(selectedRows.map(row => row.id));
    setProducts(products.filter(product => !selectedIds.has(product.id)));
    setSelectedRows([]); // Clear selection
  };

  /**
   * @function resetForm
   * @description Resets the `formData` state to its initial empty/default values
   * and clears the `selectedProduct`. Used after create/edit operations.
   */
  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      price: '',
      stock: '',
      status: 'active',
      description: ''
    });
    setSelectedProduct(null);
  };

  /**
   * @function openEditDialog
   * @description Opens the edit product dialog and populates the form with the selected product's data.
   * @param {Product} product - The product to be edited.
   */
  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price.toString(), // Convert number to string for input field
      stock: product.stock.toString(), // Convert number to string for input field
      status: product.status,
      description: product.description || '' // Handle potentially undefined description
    });
    setIsEditOpen(true);
  };

  /**
   * @function openDeleteDialog
   * @description Opens the delete confirmation dialog for the selected product.
   * @param {Product} product - The product to be deleted.
   */
  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  /**
   * @function actions
   * @description A function that returns JSX for the actions column in the DataTable
   * for each product row (e.g., Edit, Delete buttons).
   * @param {Product} product - The product object for the current row.
   * @returns {JSX.Element} The actions dropdown menu for the product.
   */
  const actions = (product: Product): JSX.Element => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" size="2">
          <DotsHorizontalIcon />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={() => alert(`Viewing details for ${product.name}`)}> {/* Placeholder for actual view */}
          <EyeOpenIcon />
          View Details
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => openEditDialog(product)}>
          <Pencil1Icon />
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => alert(`Duplicating ${product.name}`)}> {/* Placeholder for duplicate action */}
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
  );

  /**
   * @const categories
   * @description A list of available product categories for the select dropdown in forms.
   */
  const categories = ['Electronics', 'Footwear', 'Accessories', 'Sports', 'Appliances', 'Furniture', 'Books', 'Clothing'];

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
        <Dialog.Content maxWidth="450px">
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
                minHeight="80px"
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
        <Dialog.Content maxWidth="450px">
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
                minHeight="80px"
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
        <AlertDialog.Content maxWidth="450px">
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