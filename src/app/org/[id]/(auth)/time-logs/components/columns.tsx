"use client";

import { Checkbox } from "@/app/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-actions";
import { Button } from "@/app/components/ui/button";
import { Clock, Play } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { CustomTableMeta, TimeEntry } from "@/types/timeLog";


const HeaderComponent = ({ date, day, selectedItems, total }: { date: string; day: string; selectedItems: number; total: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-10">
      <div className="flex items-center space-x-2">
        <h2 className="text-sm font-bold text-black">{day},</h2>
        <span className="text-muted-foreground text-xs">{date}</span>
      </div>
      <p className="text-muted-foreground text-xs">{selectedItems} item(s) selected</p>
    </div>
    <div className="flex items-center space-x-2 px-3 py-2">
      <p className="text-muted-foreground text-xs">Total:</p>
      <Button variant={"outline"} size={"sm"} className="rounded-xl bg-transparent ring-1 ring-gray-400 px-2">
        <Clock size={18} />
        <span>{total}</span>
      </Button>
    </div>
  </div>
);

const CellComponent = ({ data }: { data: any }) => (
  <div className="flex items-center justify-between text-gray-600">
    <div className="flex items-center justify-between">
      <div className="flex flex-col justify-center w-68">
        <h2 className="text-sm font-medium text-black">{data.task}</h2>
        <span className="text-muted-foreground text-xs">{data.title}</span>
      </div>
      <div className=" flex justify-end">
        <Badge className="bg-blue-200 rounded-lg text-black font-light">{data.person}</Badge>
      </div>
    </div>
    <div className="flex space-x-4 items-center">
      <div className="flex space-x-2">
        <Clock size={18} />
        <span>{data.startTime}</span>
      </div>
      <span>{'-'}</span>
      <div className="flex space-x-2">
        <Clock size={18} />
        <span>{data.endTime}</span>
      </div>
    </div>
    <div className="flex space-x-2">
      <Clock size={18} />
      <span>{data.duration}</span>
    </div>
    <div className="flex space-x-2">
      <Button variant={'outline'} size={"sm"} className="rounded-xl bg-transparent px-2" >
        <Play size={18} />
        <span>Continue</span>
      </Button>
      <CellAction data={data} />
    </div>
  </div>
)


// Define the columns for the table
export const columns: ColumnDef<TimeEntry[]>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'info',
    header: ({ table }) => {
      const { headerProps } = table.options.meta as CustomTableMeta<TimeEntry>;
      return (
        <HeaderComponent
          day={headerProps.day}
          date={headerProps.date}
          selectedItems={table.getSelectedRowModel().rows.length}
          total={headerProps.total} />
      )
    },
    cell: ({ row }) => (
      <CellComponent data={row.original} />
    )
  },
];