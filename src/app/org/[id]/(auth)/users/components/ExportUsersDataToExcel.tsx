import * as XLSX from 'xlsx';

// Your dynamic data
const ExportUsersDataToExcel = (filtered: string, data: any) => {
  const dynamicData = [
    [
      'User Name',
      'User Email',
      'User Phone',
      'User Address',
      'Country',
      'Country Code',
      'Total Agents',
      'Description',
      'User Status',
      'Updated At',
      'Created At',
    ],
    ...data?.map((row: any) => [
      filtered === 'filtered' ? row.original.agencyName : row.agencyName,
      filtered === 'filtered' ? row.original.agencyEmail : row.agencyEmail,
      filtered === 'filtered' ? row.original.agencyPhone : row.agencyPhone,
      filtered === 'filtered' ? row.original.agencyAddress : row.agencyAddress,
      filtered === 'filtered' ? row.original.country : row.country,
      filtered === 'filtered' ? row.original.countryCode : row.countryCode,
      filtered === 'filtered' ? row.original.totalAgents : row.totalAgents,
      filtered === 'filtered' ? row.original.description : row.description,
      filtered === 'filtered' ? row.original.agencyStatus : row.agencyStatus,
      filtered === 'filtered' ? row.original.gate : row.gate,
      filtered === 'filtered' ? row.original.terminal : row.terminal,
      filtered === 'filtered' ? row.original.updatedAt : row.updatedAt,
      filtered === 'filtered' ? row.original.createdAt : row.createdAt,
    ]),
    // Add more rows as needed
  ];
  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);

  // Create a workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

  // Save the workbook to a file
  XLSX.writeFile(wb, 'Agency.xlsx', { bookSST: true });
};

export default ExportUsersDataToExcel;

// Create a worksheet
