'use client'
import { AddTaskForm } from "@/app/org/[id]/(auth)/tasks/components/AddTaskForm";
import { useAddTaskModal } from "@/app/org/[id]/(auth)/tasks/hooks/use-add-task-modal";
import { AddEditTaskPayload } from "@/types/task";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "../../../../../components/ui/modal";
import { addTaskService } from "@/utils/services/taskServices";
import { getProjects } from "@/utils/services/projectServices";

export const AddTaskModal = () => {
  const { isOpen, onClose, defaultValues } = useAddTaskModal();
  const [projects, setProjects] = useState()
  const [loading, setLoading] = useState(false);
  const params = useParams();

  // Ensure orgId is a string
  const orgId = Array.isArray(params.id) ? params.id[0] : params.id;

    useEffect(() => {
      const fetchProject = async () => {
        const response = await getProjects(Number(orgId))
        const data = await response.json()
        setProjects(data.data)
      }
      fetchProject()
    }, [])

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
    <div className="test">
      <Modal
        title="Create Task"
        description="Manage Task Information"
        isOpen={isOpen}
        onClose={onClose}
        className="flex flex-col !max-w-4xl z-[101] w-full sm:w-[80%] h-full sm:h-auto mt-5 overflow-y-auto sm:overflow-y-hidden p-4"
      >
        <AddTaskForm
          orgId={orgId}
          projects={projects??[]}
          onSubmit={handleSubmit}
          loading={loading}
          onClose={onClose}
          buttonTitle="Add"
        />
      </Modal>
    </div>
  );
};
