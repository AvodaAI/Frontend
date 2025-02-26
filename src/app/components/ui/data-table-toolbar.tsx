"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "./button";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { FilterableColumns } from "@/types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: FilterableColumns[]
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {filterableColumns && filterableColumns.map(data => (
          <DataTableFacetedFilter
            column={table.getColumn(data.id)}
            title={data.title}
            options={data.options}
          />
        )
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="ml-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
