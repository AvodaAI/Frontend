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

export const EditTaskModal = () => {
  const { isOpen, onClose, defaultValues } = useEditProjectModal();
  const [loading, setLoading] = useState(false);
  const params = useParams();

  // Ensure orgId is a string
  const orgId = Array.isArray(params.id) ? params.id[0] : params.id;

  const handleSubmit = async (data: AddEditTaskPayload) => {
    try {
      setLoading(true);
      // const res = await updateProjectService({
      //   name: data.name,
      //   description: data.description ?? "",
      //   end_date: data.end_date ?? "",
      //   organizationId: data.organizationId,
      //   projectId: data.projectId,
      //   start_date: data.start_date ?? "",
      //   status: data.status ?? "",
      // });
      setLoading(false);
    } catch (error: any) {
      toast.success("Something Went Wrong!");
    } finally {
      setLoading(false);
    }
    onClose();
  };

  return (
    <div>
      <Modal
        title="Update Task"
        description="Manage Task Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] h-[90%] sm:h-[700px] mt-5 overflow-y-hidden"
      >
        <EditTaskForm
          defaultValues={
            defaultValues || {
              name: "",
              description: "",
              start_date: new Date().toISOString().slice(0, 10),
              end_date: "",
              status: "Not Started",
              organizationId: orgId ? parseInt(orgId, 10) : -1,
              projectId: ''
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
