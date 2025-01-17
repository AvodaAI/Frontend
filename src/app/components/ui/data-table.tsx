import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { Download, LucideIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from './button';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { Input } from './input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { AlertModal } from '../modals/alert-modal';
import { FilterableColumns } from '@/types';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  clickable?: boolean;
  onConfirmFunction: (data: TData[]) => void;
  getSelectedRow?: (data: TData) => void;
  buttonTitle?: string;
  ButtonIcon?: LucideIcon;
  onExport: (filtered: string, data: Row<TData>[]) => void;
  filterableColumns?: FilterableColumns[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  clickable,
  onConfirmFunction,
  getSelectedRow,
  buttonTitle,
  ButtonIcon,
  onExport,
  filterableColumns
}: DataTableProps<TData, TValue>) {
  
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [loading, setLoading] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [open, setOpen] = useState(false);

  const userAuthorities = localStorage.getItem('authorities');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const onConfirm = async () => {
    try {
      setLoading(true);
      const selectedDataToDelete = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);

      if (selectedDataToDelete.length > 0) {
        onConfirmFunction(selectedDataToDelete);
      }
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm ml-2"
        />
        <div className="flex w-full items-center justify-between">
          <div className="ml-2">
            <DataTableToolbar table={table} filterableColumns={filterableColumns} />
          </div>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <div className="flex space-x-2">
              <div className="flex items-center justify-center">
                {ButtonIcon && (
                  <div
                    className={`${!(
                      userAuthorities?.includes('DELETE_ACCOUNT') ||
                      !userAuthorities?.includes('DELETE_VISITORS')
                    ) && 'cursor-not-allowed'
                      }`}
                    title={`${!(
                      userAuthorities?.includes('DELETE_ACCOUNT') ||
                      !userAuthorities?.includes('DELETE_VISITORS')
                    ) && 'Not Authorized'
                      }`}
                  >
                    <Button
                      className="ml-2 border"
                      size="sm"
                      onClick={() => {
                        setOpen(true);
                      }}
                      variant="destructive"
                    >
                      <ButtonIcon className="mr-2 h-4 w-4" />
                      {buttonTitle}
                    </Button>
                  </div>
                )}
                <Button
                  className="ml-2 border"
                  size="sm"
                  onClick={() =>
                    onExport(
                      'filtered',
                      table.getFilteredSelectedRowModel().rows,
                    )
                  }
                  variant="secondary"
                  disabled={loading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Table>
        <TableHeader style={{ textAlign: 'center' }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} style={{ textAlign: 'center' }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={`${clickable && 'cursor-pointer'}`}
                onClick={() => clickable && getSelectedRow?.(row.original)}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow style={{ textAlign: 'center' }}>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
                style={{ textAlign: 'center' }}
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
