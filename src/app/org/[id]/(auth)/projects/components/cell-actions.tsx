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
import { useEditProjectModal } from "@/app/org/[id]/(auth)/projects/hooks/use-edit-project-modal";
import { Project } from "@/types/project";
import { deleteProjectService } from "@/utils/services/projectServices";
import { formatToISO } from "@/utils/timeFormatHandler";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export const CellAction: React.FC<{ data: Project }> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const editProjectModal = useEditProjectModal();

  const onDelete = async () => {
    try {
      setLoading(true);
      const projectId = data.id ? data.id : "-1";
      const organizationId = data.organizationId ? data.organizationId : -1;
      await deleteProjectService({ organizationId, projectId })
    } catch (error) {
      toast.error("Something Went Wrong!");
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };


  const handleEditProject = (data: Project) => {
    editProjectModal.onOpen({
      name: data.name,
      description: data.description ?? "",
      end_date: formatToISO(data.end_date ?? ""),
      organizationId: data.organizationId,
      projectId: data.id,
      start_date: formatToISO(data.start_date ?? ""),
      status: data.projectStatus ?? "",
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
          <DropdownMenuItem onClick={() => handleEditProject(data)}>
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
