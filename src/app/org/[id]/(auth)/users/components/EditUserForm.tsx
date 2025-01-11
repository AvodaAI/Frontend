import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Loader } from "@/app/components/ui/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { roles } from "@/data/data";
import { NewUser, UpdateUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  id: z.number(),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  action: z.string().optional(),
  // status: z.string().min(1, { message: "Status is required" }),
  hire_date: z.string().min(1, { message: "Hire date is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  defaultValues: Partial<FormValues>;
  onSubmit: (data: UpdateUser) => void;
  loading: boolean;
  onClose: () => void;
  buttonTitle: string;
}

const UserForm: React.FC<UserFormProps> = ({
  defaultValues,
  onSubmit,
  loading,
  onClose,
  buttonTitle,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });


  const handleSubmit = async (data: FormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 w-full"
      >
        <div className="mb-5 flex flex-col gap-5">
          <FormField
            name="first_name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="last_name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            name="role"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role:</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="pt-6 space-x-2 flex items-center justify-center w-full">
          <Button
            type="button"
            variant={'ghost'}
            onClick={() => {
              form.reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 text-white hover:bg-blue-500 ${loading ? "cursor-not-allowed" : ""
              }`}
          >
            {loading && <Loader color="#ffffff" size={15} />} {buttonTitle}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
