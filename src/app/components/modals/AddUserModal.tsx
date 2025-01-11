import { useState } from "react";
import { Modal } from "../ui/modal";
import AddUserForm from "@/app/org/[id]/(auth)/users/components/AddUserForm";
import { useAddUserModal } from "@/hooks/use-add-user-modal";
import { NewUser } from "@/types";
import { addUserService } from "@/utils/services/userServices";
import toast from "react-hot-toast";

export const AddUserModal = () => {
  const { isOpen, onClose, defaultValues } = useAddUserModal();
  const [loading, setLoading] = useState(false);

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
              status: 'active',
              is_invite: true,
              organization_id: 1,
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
