import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash } from "lucide-react";
import { getLocalStorageUsers } from "@/lib/utils";
import { Users } from "@/types/task";
import { Project } from "@/types/project";

const projectSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string().min(1, { message: "Task title is required" }),
      description: z.string().min(1, { message: "Description is required" }),
      due_date: z.string().optional(),
      priority: z.string().min(1, { message: "Priority is required" }),
      status: z.string().min(1, { message: "Status is required" }),
      assigned_to: z.number().min(1, { message: "Assigned user is required" }),
      project_name: z.string().min(1, { message: "Project is required" }),
    })
  ),
  organization_id: z.number().min(1, { message: "Organization ID is required" }),
});

type FormValues = z.infer<typeof projectSchema>;

export interface AddTaskProps {
  orgId?: string;
  projects: Project[];
  onSubmit: (data: FormValues) => void;
  loading: boolean;
  onClose: () => void;
  buttonTitle: string;
}

export const AddTaskForm = ({ orgId, onSubmit, loading, onClose, buttonTitle, projects }: AddTaskProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      tasks: [
        {
          title: "",
          description: "",
          due_date: "",
          status: "To Do",
          priority: "Medium",
          project_name: "",
          assigned_to: -1,
        },
      ],
      organization_id: orgId ? parseInt(orgId, 10) : -1,
    },
  });

  const users: Users[] = getLocalStorageUsers();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tasks",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-36">Title</TableHead>
              <TableHead className="min-w-36">Description</TableHead>
              <TableHead className="min-w-36">Assigned To</TableHead>
              <TableHead className="min-w-36">Project</TableHead>
              <TableHead className="min-w-36">Priority</TableHead>
              <TableHead className="min-w-36">Status</TableHead>
              <TableHead className="min-w-36">Due Date</TableHead>
              <TableHead className="min-w-36">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  <FormField
                    name={`tasks.${index}.title`}
                    control={form.control}
                    render={({ field }) => (
                      <FormControl>
                        <FormItem>
                          <Input {...field} placeholder="Task title" disabled={loading} />
                          <FormMessage />
                        </FormItem>
                      </FormControl>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    name={`tasks.${index}.description`}
                    control={form.control}
                    render={({ field }) => (
                      <FormControl>
                        <FormItem>
                          <Textarea {...field} placeholder="Description" rows={1} disabled={loading} />
                          <FormMessage />
                        </FormItem>
                      </FormControl>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    name={`tasks.${index}.assigned_to`}
                    control={form.control}
                    render={({ field }) => (
                      <FormControl>
                        <FormItem>
                          <Select onValueChange={(value) => field.onChange(Number(value))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user, index) => (
                                <SelectItem key={index} value={String(user.id ?? -1)}>
                                  {user.first_name} {user.last_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      </FormControl>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    name={`tasks.${index}.project_name`}
                    control={form.control}
                    render={({ field }) => (
                      <FormControl>
                        <FormItem>
                          <Select onValueChange={(value) => field.onChange(value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                              {projects.map((project: Project) => (
                                <SelectItem key={project.id} value={String(project.id ?? -1)}>
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      </FormControl>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    name={`tasks.${index}.priority`}
                    control={form.control}
                    render={({ field }) => (
                      <FormControl>
                        <FormItem>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      </FormControl>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    name={`tasks.${index}.status`}
                    control={form.control}
                    render={({ field }) => (
                      <FormControl>
                        <FormItem>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="To Do">To Do</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      </FormControl>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    name={`tasks.${index}.due_date`}
                    control={form.control}
                    render={({ field }) => (
                      <FormControl>
                        <FormItem>
                          <Input type="date" {...field} disabled={loading} />
                          <FormMessage />
                        </FormItem>
                      </FormControl>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Button type="button" variant="ghost" onClick={() => remove(index)} disabled={loading || fields.length === 1}>
                    <Trash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className=" flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                title: "",
                description: "",
                due_date: "",
                status: "To Do",
                priority: "Medium",
                assigned_to: -1,
                project_name: "",
              })
            }
            disabled={loading}
          >
            <Plus size={16} /> Add Task
          </Button>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              form.reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {buttonTitle}
          </Button>
        </div>
      </form>
    </Form>
  );
};
