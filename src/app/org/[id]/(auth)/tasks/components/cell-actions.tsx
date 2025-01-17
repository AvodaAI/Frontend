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
import { useEditTaskModal } from "@/app/org/[id]/(auth)/tasks/hooks/use-edit-task-modal";
import { Task } from "@/types/task";
import { deleteTaskService } from "@/utils/services/taskServices";
import { formatToISO } from "@/utils/timeFormatHandler";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export const CellAction: React.FC<{ data: Task }> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const editTaskModal = useEditTaskModal();

  const onDelete = async () => {
    try {
      setLoading(true);
      const taskId = data.id ? data.id : "-1";
      const organization_id = data.organization_id ? data.organization_id : -1;
      await deleteTaskService({ organization_id, taskId })
    } catch (error) {
      toast.error("Something Went Wrong!");
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };


  const handleEditTask = (data: Task) => {
    editTaskModal.onOpen({
      taskId: data.id,
      title: data.title,
      description: data.description ?? "",
      due_date: data.due_date ? formatToISO(data.due_date) : new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      organization_id: data.organization_id,
      assigned_to: data.assigned_to,
      status: data.taskStatus ?? "To Do",
      priority: data.priority ?? "Medium",
    });
  };

  return (
    <>
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
          <DropdownMenuItem onClick={() => handleEditTask(data)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
