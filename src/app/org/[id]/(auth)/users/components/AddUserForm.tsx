import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Loader } from "@/app/components/ui/loader";
import { NewUser } from "@/types";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { NoIconInput } from "@/app/components/ui/no-icon-input";
import { roles } from "@/data/data";
import { passwordRegex } from "@/lib/utils";


const formSchema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
  action: z.string().optional(),
  is_invite: z.boolean(),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  // status: z.string().min(1, { message: "Status is required" }),
  hire_date: z.string().min(1, { message: "hire date is required" }),
  organization_id: z.number().min(1, { message: "Organization id is required" }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(passwordRegex.value, {
      message: passwordRegex.message
    }),
  role: z.string().min(1, { message: "Role is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  defaultValues: Partial<FormValues>;
  onSubmit: (data: NewUser) => void;
  loading: boolean;
  onClose: () => void;
  buttonTitle: string;
}

const AddUserForm: React.FC<UserFormProps> = ({
  defaultValues,
  onSubmit,
  loading,
  onClose,
  buttonTitle,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (data: NewUser) => {
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
          <FormField
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
          />

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
          <div className="relative">
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password:</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <NoIconInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="password"
                        {...field}
                      />
                      <span
                        className="absolute right-4"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff height={20} />
                        ) : (
                          <Eye height={20} />
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /></div>
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

export default AddUserForm;
