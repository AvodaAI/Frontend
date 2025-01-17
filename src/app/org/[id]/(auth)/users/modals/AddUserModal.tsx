'use client'
import AddUserForm from "@/app/org/[id]/(auth)/users/components/AddUserForm";
import { useAddUserModal } from "@/app/org/[id]/(auth)/users/hooks/use-add-user-modal";
import { NewUser } from "@/types";
import { addUserService } from "@/utils/services/userServices";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "../../../../../components/ui/modal";

export const AddUserModal = () => {
  const { isOpen, onClose, defaultValues } = useAddUserModal();
  const [loading, setLoading] = useState(false);
  const params = useParams();

  // Ensure orgId is a string
  const orgId = Array.isArray(params.id) ? params.id[0] : params.id;

  const handleSubmit = async (data: NewUser) => {
    try {
      setLoading(true);
      await addUserService(data)
      setLoading(false);
      toast.success('User Added Successfully!')
    } catch (error: any) {
      console.log(error);
      toast.success("Something Went Wrong!");
    } finally {
      setLoading(false);
    }
    onClose();
  };

  return (
    <div>
      <Modal
        title="Create User"
        description="Manage User information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] h-[90%] sm:h-[700px] mt-5 overflow-y-hidden"
      >
        <AddUserForm
          defaultValues={
            defaultValues || {
              first_name: "",
              last_name: "",
              email: "",
              password: "",
              role: "employee",
              hire_date: "2024-12-16T10:06:26.129Z",
              is_invite: true,
              organization_id: orgId ? parseInt(orgId, 10) : -1,
              action: "create-user",
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
