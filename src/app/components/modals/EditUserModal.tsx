import { useState } from "react";
import { Modal } from "../ui/modal";
import EditUserForm from "@/app/org/[id]/(auth)/users/components/EditUserForm";
import { useEditUserModal } from "@/hooks/use-edit-user-modal";
import { NewUser } from "@/types";

export const EditUserModal = () => {
  const { isOpen, onClose, defaultValues } = useEditUserModal();
  const [loading, setLoading] = useState(false);


  const handleSubmit = (data: NewUser) => {
    try {
      setLoading(true);
      console.log("object: ", data);
      // dispatch(updateUsersData(data));
      setLoading(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    onClose();
  };
  console.log("default: ", defaultValues);

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
              email: "",
              password: "",
              role: "user",
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
