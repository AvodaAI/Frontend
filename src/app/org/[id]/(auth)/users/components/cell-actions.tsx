"use client";

import { AlertModal } from "@/app/components/modals/alert-modal";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { SupabaseUser } from "@/types";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export const CellAction: React.FC<{ data: SupabaseUser }> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDisable, setOpenDisable] = useState(false);
  const [openEnable, setOpenEnable] = useState(false);

  // const dispatch = useAppDispatch();
  // const user = useAppSelector(usersPageSelector);
  // const editAgencyModal = useEditUserModal();
  const onDelete = async () => {
    try {
      setLoading(true);
      // const id = data._id ? data._id : -1;
      // dispatch(deleteUserData(id.toString()));
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpenDelete(false);
    }
  };
  const onDisable = async () => {
    try {
      setLoading(true);
      // dispatch(disableAgency(data._id!.toString()) as any);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpenDisable(false);
    }
  };
  const onEnable = async () => {
    try {
      setLoading(true);
      // dispatch(enableAgency(data._id!.toString()) as any);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpenEnable(false);
    }
  };
  // const handleEditAgencies = (data: Agencies) => {
  //   editFlightModal.onOpen({
  //     id: data._id,
  //     agencyName: data.agencyName,
  //     agencyEmail: data.agencyEmail,
  //     agencyPhone: data.agencyPhone,
  //     agencyAddress: data.agencyAddress,
  //     totalAgents: data.totalAgents,
  //     description: data.description,
  //     agencyStatus: data.agencyStatus,
  //   });
  // };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <AlertModal
        isOpen={openDisable}
        onClose={() => setOpenDisable(false)}
        onConfirm={onDisable}
        loading={loading}
      />
      <AlertModal
        isOpen={openEnable}
        onClose={() => setOpenEnable(false)}
        onConfirm={onEnable}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => { }}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
