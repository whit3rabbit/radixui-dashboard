/**
 * @file DataTable.tsx
 * @description This file defines a generic and reusable DataTable component.
 * It supports features like searching, sorting, pagination, column selection,
 * row selection, custom cell rendering, actions, and data export.
 */
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

/**
 * @interface Column
 * @description Defines the structure for a column in the DataTable.
 * @template T - The type of data in the row.
 * @property {string} key - Unique identifier for the column, often corresponding to a data property.
 * @property {string} header - The text to display in the column header.
 * @property {boolean} [sortable=true] - Whether the column can be sorted.
 * @property {boolean} [searchable=true] - Whether the column's content is included in search.
 * @property {string} [width] - The width of the column (e.g., "150px", "20%").
 * @property {(value: any, row: T) => React.ReactNode} [render] - Custom render function for the cell content.
 * @property {'left' | 'center' | 'right'} [align='left'] - Text alignment for the column.
 * @property {boolean} [hidden=false] - Whether the column is hidden by default.
 * @property {'left' | 'right' | null} [pinned=null] - Whether the column is pinned to the left or right. (Not fully implemented in this version)
 */
interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;
  pinned?: 'left' | 'right' | null; // TODO: Implement column pinning
}

/**
 * @interface DataTableProps
 * @description Defines the props for the DataTable component.
 * @template T - The type of data in each row.
 * @property {T[]} data - The array of data items to display.
 * @property {Column<T>[]} columns - The configuration for table columns.
 * @property {string} [searchPlaceholder="Search..."] - Placeholder text for the search input.
 * @property {(row: T) => void} [onRowClick] - Callback function when a row is clicked.
 * @property {(row: T) => React.ReactNode} [actions] - Function to render actions for a row (e.g., edit/delete buttons).
 * @property {boolean} [selectable=false] - Whether rows can be selected using checkboxes.
 * @property {(selectedRows: T[]) => void} [onSelectionChange] - Callback when row selection changes.
 * @property {string} [emptyMessage="No data found"] - Message to display when the table is empty.
 * @property {(format: 'csv' | 'excel' | 'pdf') => void} [onExport] - Callback for custom export logic. If not provided, basic CSV export is used.
 * @property {() => void} [onShare] - Callback for a share action.
 * @property {boolean} [showColumnToggle=true] - Whether to show the "Toggle Columns" button.
 */
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

/**
 * @typedef {'asc' | 'desc' | null} SortDirection
 * @description Represents the direction of sorting for a column.
 * - 'asc': Ascending
 * - 'desc': Descending
 * - null: No sorting
 */
type SortDirection = 'asc' | 'desc' | null;

/**
 * @function useDebounce
 * @description Custom hook to debounce a value.
 * This is used to delay the search filtering until the user stops typing, improving performance.
 * @template T - The type of the value to debounce.
 * @param {T} value - The value to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {T} The debounced value.
 */
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

/**
 * @function DataTable
 * @description A generic data table component with features like search, sort, pagination, and column visibility.
 * @template T - The type of data for each row, extending a record of string keys to any value.
 * @param {DataTableProps<T>} props - The props for the DataTable component.
 * @returns {JSX.Element} The rendered DataTable.
 */
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [columns, setColumns] = useState(initialColumns);
  const [showColumnDialog, setShowColumnDialog] = useState(false);

  // Debounce search term to improve performance - prevents filtering on every keystroke
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get visible columns - memoized to prevent unnecessary recalculations
  const visibleColumns = useMemo(() => columns.filter(col => !col.hidden), [columns]);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  /**
   * @description Memoized filtered data based on the debounced search term.
   * Filters rows where any searchable column contains the search term.
   * Handles nested object properties in column keys (e.g., "user.name").
   * @note For production with large datasets, client-side filtering should be replaced with server-side API calls.
   */
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm) return data;
    
    return data.filter(row => {
      const searchableColumns = visibleColumns.filter(col => col.searchable !== false);
      return searchableColumns.some(col => {
        const value = (col.key as string).includes('.') 
          ? (col.key as string).split('.').reduce((obj: any, key) => obj?.[key], row)
          : row[col.key];
        return value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      });
    });
  }, [data, debouncedSearchTerm, visibleColumns]);

  /**
   * @description Memoized sorted data based on the current sort column and direction.
   * Handles nested object properties for sorting.
   * @note For production, implement server-side sorting for better performance with large datasets.
   */
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = (sortColumn as string).includes('.') 
        ? (sortColumn as string).split('.').reduce((obj: any, key) => obj?.[key], a)
        : a[sortColumn];
      const bVal = (sortColumn as string).includes('.') 
        ? (sortColumn as string).split('.').reduce((obj: any, key) => obj?.[key], b)
        : b[sortColumn];
      
      if (aVal === bVal) return 0;
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [filteredData, sortColumn, sortDirection]);

  /**
   * @description Memoized paginated data based on the current page and page size.
   * @note For large datasets (>10k rows), consider implementing virtual scrolling
   * (e.g., using libraries like @tanstack/react-virtual).
   */
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  /**
   * @description Handles sorting when a column header is clicked.
   * Cycles through ascending, descending, and no sort for the clicked column.
   * @param {string} columnKey - The key of the column to sort by.
   */
  const handleSort = useCallback((columnKey: string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection]);

  /**
   * @description Handles the "select all" checkbox functionality.
   * Selects or deselects all rows on the current page.
   * @param {boolean} checked - Whether the "select all" checkbox is checked.
   */
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allIndices = new Set(paginatedData.map((_, index) => index));
      setSelectedRows(allIndices);
      onSelectionChange?.(paginatedData);
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  }, [paginatedData, onSelectionChange]);

  /**
   * @description Handles selection of an individual row.
   * @param {number} index - The index of the row in the paginatedData array.
   * @param {boolean} checked - Whether the row's checkbox is checked.
   */
  const handleSelectRow = useCallback((index: number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedRows(newSelected);
    
    const selectedData = paginatedData.filter((_, i) => newSelected.has(i));
    onSelectionChange?.(selectedData);
  }, [selectedRows, paginatedData, onSelectionChange]);

  /**
   * @description Toggles the visibility of a column.
   * @param {string} columnKey - The key of the column to toggle.
   */
  const toggleColumn = useCallback((columnKey: string) => {
    setColumns(prev => prev.map(col => 
      col.key === columnKey ? { ...col, hidden: !col.hidden } : col
    ));
  }, []);

  /**
   * @description Handles data export. If `onExport` prop is provided, it's called.
   * Otherwise, a basic CSV export is performed.
   * @param {'csv' | 'excel' | 'pdf'} format - The desired export format.
   */
  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (onExport) {
      onExport(format);
    } else {
      // Basic CSV export implementation
      if (format === 'csv') {
        const headers = visibleColumns.map(col => col.header).join(',');
        const rows = sortedData.map(row => 
          visibleColumns.map(col => {
            const value = (col.key as string).includes('.') 
              ? (col.key as string).split('.').reduce((obj: any, key) => obj?.[key], row)
              : row[col.key];
            return `"${value || ''}"`; // Handle null/undefined and ensure CSV quoting
          }).join(',')
        ).join('\n');
        
        const csv = `${headers}\n${rows}`;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }
      // TODO: Implement basic Excel and PDF export if onExport is not provided.
    }
  };

  /**
   * @description Gets the appropriate sort icon for a column header.
   * @param {string} columnKey - The key of the column.
   * @returns {JSX.Element} The sort icon component.
   */
  const getSortIcon = useCallback((columnKey: string) => {
    if (sortColumn !== columnKey) return <CaretSortIcon />;
    if (sortDirection === 'asc') return <ChevronUpIcon />;
    if (sortDirection === 'desc') return <ChevronDownIcon />;
    return <CaretSortIcon />;
  }, [sortColumn, sortDirection]);

  return (
    <Flex direction="column" gap="3">
      {/* Search and Actions Bar */}
      <Flex justify="between" align="center" gap="3">
        <TextField.Root 
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxWidth="300px"
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
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Toggle Columns</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Show or hide columns in the table
          </Dialog.Description>
          
          <ScrollArea height="300px">
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
) => JSX.Element;