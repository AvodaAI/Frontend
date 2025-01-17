'use client'
import { AddTaskForm } from "@/app/org/[id]/(auth)/tasks/components/AddTaskForm";
import { useAddTaskModal } from "@/app/org/[id]/(auth)/tasks/hooks/use-add-task-modal";
import { AddEditTaskPayload } from "@/types/task";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "../../../../../components/ui/modal";
import { addTaskService } from "@/utils/services/taskServices";

export const AddTaskModal = () => {
  const { isOpen, onClose, defaultValues } = useAddTaskModal();
  const [loading, setLoading] = useState(false);
  const params = useParams();

  // Ensure orgId is a string
  const orgId = Array.isArray(params.id) ? params.id[0] : params.id;

  const handleSubmit = async (data: AddEditTaskPayload) => {
    try {
      setLoading(true);
      await addTaskService(data);
      setLoading(false);
    } catch (error: any) {
      toast.error("Something Went Wrong!");
    } finally {
      setLoading(false);
    }
    onClose();
  };

  return (
    <div>
      <Modal
        title="Create Task"
        description="Manage Task Information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] h-[90%] sm:h-[750px] mt-5 overflow-y-hidden"
      >
        <AddTaskForm
          defaultValues={
            defaultValues || {
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
