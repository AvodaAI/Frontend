import * as XLSX from 'xlsx';

// Your dynamic data
const ExportTasksDataToExcel = (filtered: string, data: any) => {
  const dynamicData = [
    [
      'Id',
      'Name',
      'Description',
      'Start Date',
      'End Date',
      'Creator',
      'Status',
    ],
    ...data?.map((row: any) => [
      filtered === 'filtered' ? row.original.id : row.id,
      filtered === 'filtered' ? row.original.name : row.name,
      filtered === 'filtered' ? row.original.description : row.description,
      filtered === 'filtered' ? row.original.start_date : row.start_date,
      filtered === 'filtered' ? row.original.end_date : row.end_date,
      filtered === 'filtered' ? row.original.created_by : row.created_by,
      filtered === 'filtered' ? row.original.projectStatus : row.projectStatus,
    ]),
    // Add more rows as needed
  ];
  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);

  // Create a workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

  // Save the workbook to a file
  XLSX.writeFile(wb, 'Projects.xlsx', { bookSST: true });
};

export default ExportTasksDataToExcel;

// Create a worksheet
