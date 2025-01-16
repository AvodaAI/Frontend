"use client";

import { AlertModal } from "@/app/components/modals/alert-modal";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useEditUserModal } from "@/hooks/use-edit-user-modal";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { TimeEntry } from "../page";

export const CellAction: React.FC<{ data: TimeEntry }> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const editUserModal = useEditUserModal();
  const onDelete = async () => {
    try {
      setLoading(true);

    } catch (error) {
      toast.error("Something Went Wrong!");
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };

  const handleEditUser = (data: TimeEntry) => {
    editUserModal.onOpen({
      // id: data.id,
      // first_name: data.first_name,
      // last_name: data.last_name,
      // role: data.role,
      // hire_date: data.hire_date,
      // action: "update-user",
    });
  };

  return (
    <div className="px-3">
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleEditUser(data)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
