import EditUserForm from "@/app/org/[id]/(auth)/users/components/EditUserForm";
import { useEditUserModal } from "@/hooks/use-edit-user-modal";
import { UpdateUser } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "../ui/modal";
import { updateUserService } from "@/utils/services/userServices";

export const EditUserModal = () => {
  const { isOpen, onClose, defaultValues } = useEditUserModal();
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (data: UpdateUser) => {
    try {
      setLoading(true);
      await updateUserService(data)
      setLoading(false);
      toast.success('User Updated Successfully!')
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    // onClose();
  };

  return (
    <div>
      <Modal
        title="Update User"
        description="Manage User information"
        isOpen={isOpen}
        onClose={onClose}
        className="z-[101] w-full sm:w-[80%] h-[50%] sm:h-[600px] mt-5 overflow-y-hidden"
      >
        <EditUserForm
          defaultValues={
            defaultValues || {
              id: -1,
              first_name: "",
              last_name: "",
              role: "employee",
              hire_date: "2024-12-16T10:06:26.129Z",
              status: 'active',
              action: "update-user",
            }
          }
          onSubmit={handleSubmit}
          loading={loading}
          onClose={onClose}
          buttonTitle="Update"
        />
      </Modal>
    </div>
  );
};
