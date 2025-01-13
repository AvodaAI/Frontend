import React, { useEffect, useState } from 'react'
import { Download, Loader2, Trash, UserPlus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useAddUserModal } from '@/hooks/use-add-user-modal';
import { dataFallback } from '@/utils/datafallback';
import { Project } from '@/types/project';
import { formatUnixDate } from '@/utils/unixdate';
import { Card } from '@/app/components/ui/card';
import { Heading } from '@/app/components/ui/heading';
import { Button } from '@/app/components/ui/button';
import ExportProjectsDataToExcel from './ExportProjectsDataToExcel';
import { DataTable } from '@/app/components/ui/data-table';
import { columns } from './columns';
import { getProjects } from '@/utils/services/projectServices';
import toast from 'react-hot-toast';
import { projectStatuses } from '@/data/data';
import { formatDate } from '@/utils/timeFormatHandler';

const Projects = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const params = useParams();

    // Ensure orgId is a string
    const orgId = Array.isArray(params.id) ? params.id[0] : params.id;
    const id = orgId ? parseInt(orgId, 10) : -1

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getProjects(id)
            const projects = await res.json()
            if (res.ok) {
                setProjects(projects.data ?? []);
            } else {
                toast.error(projects.error || "Error fetching projects");
                throw new Error(projects.error || "Error fetching projects");
            }
        }
        fetchUsers();
    }, [])

    const deleteSelectedProjects = () => { };
    const { onOpen } = useAddUserModal();

    const formattedProjects: Project[] = projects.map((project: any) => ({
        id: project.id,
        name: dataFallback(project.name) || 'N/A',
        description: dataFallback(project.description) || 'N/A',
        start_date: formatDate(dataFallback(project.start_date ?? "")).formattedDate,
        end_date: formatDate(dataFallback(project.end_date ?? "")).formattedDate,
        created_by: dataFallback(project.created_by) || 'N/A',
        projectStatus: project.status,
    }));
    console.log("object: ", formattedProjects)

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
                    title={`Projects (${formattedProjects.length})`}
                    description="Here's a list of all projects in your organization"
                />
                <div></div>
                <div className='flex space-x-2'>
                    <Button
                        className="bg-blue-500 hover:bg-blue-500"
                        onClick={() => onOpen()}
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Project
                    </Button>
                    <Button
                        className={`bg-gray-400 hover:bg-gray-400`}
                        onClick={() =>
                            ExportProjectsDataToExcel("notfiltered", formattedProjects)
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
                data={formattedProjects}
                filterableColumns={[{
                    id: 'projectStatus',
                    title: 'Status',
                    options: projectStatuses
                }]}
                onConfirmFunction={deleteSelectedProjects}
                onExport={ExportProjectsDataToExcel}
                buttonTitle="Delete Selection"
                ButtonIcon={Trash}
            />
        </Card>
    )
}

export default Projects
