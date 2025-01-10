import { useState } from "react";
import { Modal } from "../ui/modal";
import AddUserForm from "@/app/org/[id]/(auth)/users/components/AddUserForm";
import { useAddUserModal } from "@/hooks/use-add-user-modal";
import { NewUser } from "@/types";
import { addUserService } from "@/utils/services/userServices";

export const AddUserModal = () => {
  const { isOpen, onClose, defaultValues } = useAddUserModal();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: NewUser) => {
    try {
      setLoading(true);
      console.log(data);
      await addUserService(data)
      setLoading(false);
    } catch (error: any) {
      console.log(error);
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
              role: "user",
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
