'use client'
import { AddProjectForm } from "@/app/org/[id]/(auth)/projects/components/AddProjectForm";
import { AddEditProject } from "@/types/project";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "../../../../../components/ui/modal";
import { updateProjectService } from "@/utils/services/projectServices";
import { useEditProjectModal } from "@/app/org/[id]/(auth)/projects/hooks/use-edit-project-modal";
import { EditTaskForm } from "@/app/org/[id]/(auth)/tasks/components/EditTaskForm";
import { AddEditTaskPayload } from "@/types/task";
import { updateTaskService } from "@/utils/services/taskServices";

export const EditTaskModal = () => {
  const { isOpen, onClose, defaultValues } = useEditProjectModal();
  const [loading, setLoading] = useState(false);
  const params = useParams();

  // Ensure orgId is a string
  const orgId = Array.isArray(params.id) ? params.id[0] : params.id;

  const handleSubmit = async (data: AddEditTaskPayload) => {
    try {
      setLoading(true);
      await updateTaskService(data);
      setLoading(false);
    } catch (error: any) {
      toast.error("Something Went Wrong!");
    } finally {
      setLoading(false);
    }
    // onClose();
  };

  return (
    <div>
      <Modal
        title="Update Task"
        description="Manage Task Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] h-[90%] sm:h-[750px] mt-5 overflow-y-hidden"
      >
        <EditTaskForm
          defaultValues={
            defaultValues || {
              taskId: '',
              title: "",
              description: "",
              due_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
              status: "To Do",
              priority: "Medium",
              assigned_to: -1,
              organization_id: orgId ? parseInt(orgId, 10) : -1,
            }
          }
          onSubmit={handleSubmit}
          loading={loading}
          onClose={onClose}
          buttonTitle="Add"
        />
      </Modal>
    </div>
  );
};
