import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { DataTable } from '@/app/components/ui/data-table';
import { Heading } from '@/app/components/ui/heading';
import { projectStatuses } from '@/data/data';
import { useAddProjectModal } from '@/hooks/use-add-project-modal';
import { Project } from '@/types/project';
import { dataFallback } from '@/utils/datafallback';
import { getProjects } from '@/utils/services/projectServices';
import { formatDate } from '@/utils/timeFormatHandler';
import { Download, Loader2, Trash, UserPlus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { columns } from './columns';
import ExportProjectsDataToExcel from './ExportProjectsDataToExcel';

const Projects = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const params = useParams();

    // Ensure orgId is a string
    const orgId = Array.isArray(params.id) ? params.id[0] : params.id;
    const id = orgId ? parseInt(orgId, 10) : -1

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await getProjects(id)
            const projects = await res.json()
            if (res.ok) {
                setProjects(projects.data ?? []);
            } else {
                toast.error(projects.error || "Error fetching projects");
                throw new Error(projects.error || "Error fetching projects");
            }
        }
        fetchProjects();
    }, [])

    const deleteSelectedProjects = () => { };
    const { onOpen } = useAddProjectModal();

    const formattedProjects: Project[] = projects.map((project: any) => ({
        id: project.id,
        name: dataFallback(project.name) || 'N/A',
        description: dataFallback(project.description) || 'N/A',
        start_date: formatDate(dataFallback(project.start_date ?? "")).formattedDate,
        end_date: formatDate(dataFallback(project.end_date ?? "")).formattedDate,
        created_by: dataFallback(project.created_by) || 'N/A',
        projectStatus: project.status,
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
