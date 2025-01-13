'use client'
import { AddProjectForm } from "@/app/org/[id]/(auth)/projects/components/AddProjectForm";
import { useAddProjectModal } from "@/hooks/use-add-project-modal";
import { AddEditProject } from "@/types/project";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "../ui/modal";

export const AddProjectModal = () => {
  const { isOpen, onClose, defaultValues } = useAddProjectModal();
  const [loading, setLoading] = useState(false);
  const params = useParams();

  // Ensure orgId is a string
  const orgId = Array.isArray(params.id) ? params.id[0] : params.id;

  const handleSubmit = async (data: AddEditProject) => {
    try {
      setLoading(true);
      // await addUserService(data)
      setLoading(false);
      toast.success('User Added Successfully!')
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
        title="Create Project"
        description="Manage Project information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] h-[90%] sm:h-[700px] mt-5 overflow-y-hidden"
      >
        <AddProjectForm
          defaultValues={
            defaultValues || {
              name: "",
              description: "",
              start_date: new Date().toISOString().slice(0, 10),
              end_date: "",
              status: "Not Started",
              organizationId: orgId ? parseInt(orgId, 10) : -1,
              action: "create-project"
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
