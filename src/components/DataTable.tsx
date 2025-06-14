import { useState, useMemo, memo, useCallback, useEffect } from 'react'
import { 
  Table, 
  TextField, 
  Select, 
  Flex, 
  Text, 
  IconButton, 
  Box,
  Button,
  Checkbox,
  DropdownMenu,
  Badge,
  Dialog,
  ScrollArea
} from '@radix-ui/themes'
import { 
  MagnifyingGlassIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  CaretSortIcon,
  Share1Icon,
  DownloadIcon,
  EyeOpenIcon
} from '@radix-ui/react-icons'

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;
  pinned?: 'left' | 'right' | null;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  emptyMessage?: string;
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
  onShare?: () => void;
  showColumnToggle?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

// Custom hook for debounced search to improve performance
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns: initialColumns,
  searchPlaceholder = "Search...",
  onRowClick,
  actions,
  selectable = false,
  onSelectionChange,
  emptyMessage = "No data found",
  onExport,
  onShare,
  showColumnToggle = true
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [columns, setColumns] = useState(initialColumns)
  const [showColumnDialog, setShowColumnDialog] = useState(false)

  // Debounce search term to improve performance - prevents filtering on every keystroke
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Get visible columns - memoized to prevent unnecessary recalculations
  const visibleColumns = useMemo(() => columns.filter(col => !col.hidden), [columns])

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm])

  // Filter data based on debounced search term
  // TODO: For production with large datasets, replace client-side filtering with server-side API calls
  // Example: Use a debounced effect to call your API with search, sort, and pagination parameters
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm) return data
    
    return data.filter(row => {
      const searchableColumns = visibleColumns.filter(col => col.searchable !== false)
      return searchableColumns.some(col => {
        const value = (col.key as string).includes('.') 
          ? (col.key as string).split('.').reduce((obj: any, key) => obj?.[key], row)
          : row[col.key]
        return value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      })
    })
  }, [data, debouncedSearchTerm, visibleColumns])

  // Sort data
  // TODO: For production, implement server-side sorting for better performance with large datasets
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData
    
    return [...filteredData].sort((a, b) => {
      const aVal = (sortColumn as string).includes('.') 
        ? (sortColumn as string).split('.').reduce((obj: any, key) => obj?.[key], a)
        : a[sortColumn]
      const bVal = (sortColumn as string).includes('.') 
        ? (sortColumn as string).split('.').reduce((obj: any, key) => obj?.[key], b)
        : b[sortColumn]
      
      if (aVal === bVal) return 0
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }, [filteredData, sortColumn, sortDirection])

  // Paginate data  
  // TODO: For large datasets (>10k rows), consider implementing virtual scrolling
  // Libraries like @tanstack/react-virtual can help with performance
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = useCallback((columnKey: string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }, [sortColumn, sortDirection])

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allIndices = new Set(paginatedData.map((_, index) => index))
      setSelectedRows(allIndices)
      onSelectionChange?.(paginatedData)
    } else {
      setSelectedRows(new Set())
      onSelectionChange?.([])
    }
  }, [paginatedData, onSelectionChange])

  const handleSelectRow = useCallback((index: number, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(index)
    } else {
      newSelected.delete(index)
    }
    setSelectedRows(newSelected)
    
    const selectedData = paginatedData.filter((_, i) => newSelected.has(i))
    onSelectionChange?.(selectedData)
  }, [selectedRows, paginatedData, onSelectionChange])

  const toggleColumn = useCallback((columnKey: string) => {
    setColumns(prev => prev.map(col => 
      col.key === columnKey ? { ...col, hidden: !col.hidden } : col
    ))
  }, [])

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (onExport) {
      onExport(format)
    } else {
      // Basic CSV export implementation
      if (format === 'csv') {
        const headers = visibleColumns.map(col => col.header).join(',')
        const rows = sortedData.map(row => 
          visibleColumns.map(col => {
            const value = (col.key as string).includes('.') 
              ? (col.key as string).split('.').reduce((obj: any, key) => obj?.[key], row)
              : row[col.key]
            return `"${value || ''}"`
          }).join(',')
        ).join('\n')
        
        const csv = `${headers}\n${rows}`
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'data.csv'
        a.click()
        window.URL.revokeObjectURL(url)
      }
    }
  }

  const getSortIcon = useCallback((columnKey: string) => {
    if (sortColumn !== columnKey) return <CaretSortIcon />
    if (sortDirection === 'asc') return <ChevronUpIcon />
    if (sortDirection === 'desc') return <ChevronDownIcon />
    return <CaretSortIcon />
  }, [sortColumn, sortDirection])

  return (
    <Flex direction="column" gap="3">
      {/* Search and Actions Bar */}
      <Flex justify="between" align="center" gap="3">
        <TextField.Root 
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 300 }}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>
        
        <Flex gap="2">
          {showColumnToggle && (
            <Button 
              variant="soft" 
              size="2"
              onClick={() => setShowColumnDialog(true)}
            >
              <EyeOpenIcon />
              Columns
            </Button>
          )}
          
          {onShare && (
            <Button variant="soft" size="2" onClick={onShare}>
              <Share1Icon />
              Share
            </Button>
          )}
          
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant="soft" size="2">
                <DownloadIcon />
                Export
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => handleExport('excel')}>
                Export as Excel
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
      </Flex>

      {/* Selected rows info */}
      {selectable && selectedRows.size > 0 && (
        <Flex align="center" gap="2">
          <Badge color="blue" variant="soft">
            {selectedRows.size} selected
          </Badge>
          <Button 
            size="1" 
            variant="ghost" 
            onClick={() => {
              setSelectedRows(new Set())
              onSelectionChange?.([])
            }}
          >
            Clear selection
          </Button>
        </Flex>
      )}

      {/* Table */}
      <Box style={{ overflowX: 'auto' }}>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              {selectable && (
                <Table.ColumnHeaderCell style={{ width: '40px' }}>
                  <Checkbox 
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </Table.ColumnHeaderCell>
              )}
              {visibleColumns.map(column => (
                <Table.ColumnHeaderCell 
                  key={column.key as string}
                  align={column.align}
                  style={{ 
                    width: column.width,
                    cursor: column.sortable !== false ? 'pointer' : 'default'
                  }}
                  onClick={() => column.sortable !== false && handleSort(column.key as string)}
                >
                  <Flex align="center" gap="1">
                    <Text>{column.header}</Text>
                    {column.sortable !== false && getSortIcon(column.key as string)}
                  </Flex>
                </Table.ColumnHeaderCell>
              ))}
              {actions && <Table.ColumnHeaderCell style={{ width: '60px' }} />}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {paginatedData.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={visibleColumns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}>
                  <Text align="center" color="gray" style={{ padding: '40px 0' }}>
                    {emptyMessage}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedData.map((row, index) => (
                <Table.Row 
                  key={index}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <Table.Cell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedRows.has(index)}
                        onCheckedChange={(checked) => handleSelectRow(index, checked as boolean)}
                      />
                    </Table.Cell>
                  )}
                  {visibleColumns.map(column => {
                    const value = (column.key as string).includes('.') 
                      ? (column.key as string).split('.').reduce((obj: any, key: string) => obj?.[key], row)
                      : row[column.key as keyof T]
                    
                    return (
                      <Table.Cell key={column.key as string} align={column.align}>
                        {column.render ? column.render(value, row) : value?.toString() || '-'}
                      </Table.Cell>
                    )
                  })}
                  {actions && (
                    <Table.Cell onClick={(e) => e.stopPropagation()}>
                      {actions(row)}
                    </Table.Cell>
                  )}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Pagination */}
      <Flex justify="between" align="center">
        <Flex align="center" gap="2">
          <Text size="2">Rows per page:</Text>
          <Select.Root value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="10">10</Select.Item>
              <Select.Item value="25">25</Select.Item>
              <Select.Item value="50">50</Select.Item>
              <Select.Item value="100">100</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>

        <Flex align="center" gap="2">
          <Text size="2">
            Page {currentPage} of {totalPages} ({sortedData.length} total)
          </Text>
          <IconButton 
            size="2" 
            variant="soft" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            <ChevronUpIcon style={{ transform: 'rotate(-90deg)' }} />
          </IconButton>
          <IconButton 
            size="2" 
            variant="soft" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            <ChevronUpIcon style={{ transform: 'rotate(90deg)' }} />
          </IconButton>
        </Flex>
      </Flex>

      {/* Column Toggle Dialog */}
      <Dialog.Root open={showColumnDialog} onOpenChange={setShowColumnDialog}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Toggle Columns</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Show or hide columns in the table
          </Dialog.Description>
          
          <ScrollArea style={{ height: 300 }}>
            <Flex direction="column" gap="2">
              {columns.map(column => (
                <Flex key={column.key as string} align="center" justify="between" p="2">
                  <Text size="2">{column.header}</Text>
                  <Checkbox
                    checked={!column.hidden}
                    onCheckedChange={() => toggleColumn(column.key as string)}
                  />
                </Flex>
              ))}
            </Flex>
          </ScrollArea>
          
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Close</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  )
}

export default memo(DataTable) as <T extends Record<string, any>>(
  props: DataTableProps<T>
) => JSX.Element