import * as XLSX from 'xlsx';

// Your dynamic data
const ExportUsersDataToExcel = (filtered: string, data: any) => {
  const dynamicData = [
    [
      'Id',
      'Name',
      'Email',
      'Last Login',
      'Created At',
    ],
    ...data?.map((row: any) => [
      filtered === 'filtered' ? row.original.id : row.id,
      filtered === 'filtered' ? row.original.name : row.name,
      filtered === 'filtered' ? row.original.email : row.email,
      filtered === 'filtered' ? row.original.last_login : row.last_login,
      filtered === 'filtered' ? row.original.created_at : row.created_at,
    ]),
    // Add more rows as needed
  ];
  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);

  // Create a workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

  // Save the workbook to a file
  XLSX.writeFile(wb, 'Users.xlsx', { bookSST: true });
};

export default ExportUsersDataToExcel;

// Create a worksheet
