import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useDownloadExcel } from 'react-export-table-to-excel';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function RequirementPage() {
  const [date, setDate] = useState('');
  const [customers, setCustomers] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const tableRef = useRef(null);

  async function handleDateChange(e) {
    const value = e.target.value;
    setDate(value);

    await axiosInstance
      .get(`/requirements?date=${value}`)
      .then((res) => {
        setCustomers(res?.data?.customers);
        setVegetables(res?.data?.data);
      })
      .catch((err) => {});
  }

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Function to truncate customer names
    const truncateName = (name) => {
      if (name.length > 14) {
        return name.substring(0, 7) + '...' + name.substring(name.length - 7);
      }
      return name;
    };

    const tableColumn = ['Vegetable', ...customers.map(truncateName)];
    const tableRows = vegetables.map((row) => [
      row.vegetable,
      ...customers.map((customer) => row[customer] || ''),
    ]);

    let firstPage = true;

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 10,
      styles: {
        fontSize: 7, // Further reduced font size
        cellPadding: 1, // Further reduced padding
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Slightly reduced width for the first column
      },
      margin: { top: 10, right: 7, bottom: 10, left: 7 }, // Reduced margins
      theme: 'striped',
      pageBreak: 'auto',
      didDrawPage: (data) => {
        // Add heading only on the first page
        if (firstPage) {
          doc.setFontSize(12);
          doc.text('Requirement Table', 7, 7);
          firstPage = false;
        }
      },
      willDrawCell: (data) => {
        // Ensure header is not repeated on subsequent pages
        if (data.row.index === 0 && data.pageCount > 1) {
          data.cell.styles.fillColor = '#FFFFFF';
          data.cell.styles.textColor = '#FFFFFF';
        }
      },
    });

    const currentDate = new Date().toISOString().split('T')[0];
    doc.save(`Requirement_${currentDate}.pdf`);
  };

  return (
    <div className="flex flex-col gap-y-4 pb-10 min-h-screen">
      <div className="flex w-full justify-end">
        <input
          className="w-64 border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
          type="date"
          value={date}
          onChange={handleDateChange}
        />
      </div>
      {customers.length > 0 && vegetables.length > 0 ? (
        <TableContainer component={Paper} ref={tableRef}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    zIndex: 3,
                    backgroundColor: 'white',
                    fontWeight: 600,
                  }}
                >
                  Vegetable
                </TableCell>
                {customers?.map((customer, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 2,
                      backgroundColor: 'white',
                      fontWeight: 600,
                    }}
                    align="right"
                  >
                    {customer}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {vegetables?.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell
                    component="th"
                    scope="row"
                    className="capitalize w-fit"
                    sx={{
                      position: 'sticky',
                      left: 0,
                      zIndex: 1,
                      backgroundColor: 'white',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    style={{ minWidth: '120px', maxWidth: '160px' }}
                  >
                    {row.vegetable}
                  </TableCell>
                  {customers.map((customer, index) => (
                    <TableCell key={index} align="right">
                      {row[customer] || ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}

      <div className="flex justify-end w-full">
        <button
          className="w-fit px-8 py-3 rounded-lg bg-gray-600 text-white cursor-pointer"
          onClick={generatePDF}
        >
          Print
        </button>
      </div>
    </div>
  );
}
