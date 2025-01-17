import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { DataTable } from '@/app/components/ui/data-table';
import { Heading } from '@/app/components/ui/heading';
import { useAddTaskModal } from '@/app/org/[id]/(auth)/tasks/hooks/use-add-task-modal';
import { Task, Users } from '@/types/task';
import { dataFallback } from '@/utils/datafallback';
import { getTasksService, getUsersService } from '@/utils/services/taskServices';
import { formatDate } from '@/utils/timeFormatHandler';
import { Download, Loader2, Trash, UserPlus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { columns } from './columns';
import ExportTasksDataToExcel from './ExportTasksDataToExcel';
import toast from 'react-hot-toast';
import { formatTasks } from '@/lib/formatter';

const Tasks = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<Users[]>([]);

    const params = useParams();

    // Ensure orgId is a string
    const orgId = Array.isArray(params.id) ? params.id[0] : params.id;
    const id = orgId ? parseInt(orgId, 10) : -1


    const fetchTasks = async () => {
        try {
            setLoading(true)
            const res = await getTasksService(Number(id));
            const data = await res.json();
            if (res.ok) {
                setTasks(data?.data ?? []);
            } else {
                setError(data.error || "Error fetching tasks");
                throw new Error(data.error || "Error fetching tasks");
            }
        } catch (error) {
            console.error("An error occurred while fetching tasks:", error);
            toast.error("An Error Occurred While Fetching Tasks");
        } finally {
            setLoading(false)
        }

    };

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await getUsersService(Number(id));
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error || "Error fetching users";
                setError(errorMessage);
            }

            const { users = [] } = await response.json();
            if (users.length > 0) {
                const formattedUsers = users.map((user: { user_email: string; user_id: number }) => ({
                    email: user.user_email,
                    id: user.user_id,
                }));
                setUsers(formattedUsers);
            }
        } catch (error) {
            console.error("An error occurred while fetching users:", error);
            toast.error("An Error Occurred While Fetching Users");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const deleteSelectedProjects = () => { };
    const { onOpen } = useAddTaskModal();

    const formattedTasks = formatTasks(tasks, id);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <Card className="p-5">
            <div className="flex border-b pb-2 items-center justify-between">
                <Heading
                    title={`Tasks (${formattedTasks.length})`}
                    description="Here's a list of all tasks in your organization"
                />
                <div></div>
                <div className='flex space-x-2'>
                    <Button
                        className="bg-blue-500 hover:bg-blue-500"
                        onClick={() => onOpen()}
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Task
                    </Button>
                    <Button
                        className={`bg-gray-400 hover:bg-gray-400`}
                        onClick={() =>
                            ExportTasksDataToExcel("notfiltered", formattedTasks)
                        }
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export All
                    </Button>
                </div>
            </div>
            <DataTable
                searchKey="name"
                clickable={true}
                columns={columns}
                data={formattedTasks}
                filterableColumns={[]}
                onConfirmFunction={deleteSelectedProjects}
                onExport={ExportTasksDataToExcel}
                buttonTitle="Delete Selection"
                ButtonIcon={Trash}
            />
        </Card>
    )
}

export default Tasks
