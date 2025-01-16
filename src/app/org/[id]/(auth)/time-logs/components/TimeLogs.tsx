import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { DataTable } from '@/app/components/ui/data-table';
import { Heading } from '@/app/components/ui/heading';
import { dataFallback } from '@/utils/datafallback';
import { formatDate } from '@/utils/timeFormatHandler';
import { Download, Loader2, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { columns } from './columns';
import ExportTimeLogsDataToExcel from './ExportUsersDataToExcel';
import { TimeLog } from '@/types/timeLog';
import moment from 'moment';

const TimeLogs = () => {
    const [timelogs, setTimelogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const params = useParams();

    // Ensure orgId is a string
    const orgId = Array.isArray(params.id) ? params.id[0] : params.id;
    const id = orgId ? parseInt(orgId, 10) : -1


    useEffect(() => {
        fetchTimelogs();
    }, []);

    const fetchTimelogs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timer/timelogs?organization_id=${id}&action=get-timelog`, { credentials: "include" });
            const data = await response.json();
            if (response.ok) {
                setTimelogs(data.data);
            } else {
                toast.error(data.error || 'Failed to fetch timelogs.');
            }
        } catch (error) {
            setLoading(false);
            throw new Error('Failed to fetch timelogs.');
        } finally {
            setLoading(false);
        }
    };



    const deleteSelectedTimeLogs = () => { };
    
    const formattedTimeLogs: TimeLog[] = timelogs.map((project: TimeLog) => ({
        id: project.id,
        name: dataFallback(project.name) || 'Beharudin Musa',
        pauses: project.pauses,
        total_active_time: project.total_active_time || 0,
        start_time: project.start_time,
        end_time: project.end_time,
        TimeLogStatus: project.TimeLogStatus,
        organizationId: id,
        created_at: moment(project.created_at).format('MMMM do, yyyy'),
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
                    title={`TimeLogs (${formattedTimeLogs.length})`}
                    description="Here's a list of all time logs"
                />
                <div></div>
                <div className='flex space-x-2'>
                    <Button
                        className={`bg-gray-400 hover:bg-gray-400`}
                        onClick={() =>
                            ExportTimeLogsDataToExcel("notfiltered", formattedTimeLogs)
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
                data={formattedTimeLogs}
                filterableColumns={[]}
                onConfirmFunction={deleteSelectedTimeLogs}
                onExport={ExportTimeLogsDataToExcel}
                buttonTitle="Delete Selection"
                ButtonIcon={Trash}
            />
        </Card>
    )
}

export default TimeLogs
