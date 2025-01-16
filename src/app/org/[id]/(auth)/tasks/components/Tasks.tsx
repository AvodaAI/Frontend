import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { DataTable } from '@/app/components/ui/data-table';
import { Heading } from '@/app/components/ui/heading';
import { useAddTaskModal } from '@/hooks/use-add-task-modal';
import { Task, Users } from '@/types/task';
import { dataFallback } from '@/utils/datafallback';
import { getTasksService, getUsersService } from '@/utils/services/taskServices';
import { formatDate } from '@/utils/timeFormatHandler';
import { Download, Loader2, Trash, UserPlus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { columns } from './columns';
import ExportTasksDataToExcel from './ExportTasksDataToExcel';

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
        const res = await getTasksService(Number(id));
        const data = await res.json();
        console.log(data)
        if (res.ok) {
            setTasks(data?.data ?? []);
        } else {
            setError(data.error || "Error fetching tasks");
            throw new Error(data.error || "Error fetching tasks");
        }
    };

    const fetchUsers = async () => {
        try {
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
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    const deleteSelectedProjects = () => { };
    const { onOpen } = useAddTaskModal();

    const formattedTasks: Task[] = tasks.map((task: any) => ({
        id: task.id,
        title: dataFallback(task.title) || 'N/A',
        assigned_user_name: task.assigned_user_name || 'Beharudin Musa',
        description: dataFallback(task.description) || 'N/A',
        due_date: formatDate(dataFallback(task.due_date ?? "")).formattedDate,
        priority: dataFallback(task.priority) || 'N/A',
        time_tracked: task.time_tracked || 0,
        taskStatus: task.status,
        organizationId: id,
    }));

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
