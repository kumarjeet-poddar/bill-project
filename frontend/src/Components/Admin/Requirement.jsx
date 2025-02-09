import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useDownloadExcel } from 'react-export-table-to-excel';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { truncateText } from '../Quotation/QuotationPDF';

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

    const capitalizeText = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

    const tableColumn = ['Vegetable', ...customers.map((name) => name.toUpperCase())];
    const tableRows = vegetables.map((row) => [
      truncateText(capitalizeText(row.vegetable)),
      ...customers.map((customer) => row[customer] || ''),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 15, // Adjusted to avoid overlapping the title
      styles: {
        fontSize: 7,
        cellPadding: 1,
        textColor: [0, 0, 0], // Ensures text is visible
      },
      headStyles: {
        fontSize: 8, // Slightly larger font for header
        fontStyle: 'bold', // Bold headings
        fillColor: [0, 0, 255], // Blue background for heading
        textColor: [255, 255, 255], // White text color
      },
      bodyStyles: {
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 30 },
      },
      margin: { top: 15, right: 5, bottom: 5, left: 5 },
      theme: 'striped',
      pageBreak: 'auto',
      didDrawPage: (data) => {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 255);

        doc.text('Order Sheet', 5, 10);

        const pageWidth = doc.internal.pageSize.width;
        const textWidth = doc.getTextWidth('Narayan Green Vegetables');
        doc.text('Narayan Green Vegetables', (pageWidth - textWidth) / 2, 10);

        const dateTextWidth = doc.getTextWidth(date);
        doc.text(date.split('-').reverse().join('/'), pageWidth - dateTextWidth - 5, 10);

        // doc.text(`Order Sheet - Narayan Green Vegetables - ${date}`, 5, 10);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 255); // Blue heading
      },
    });

    doc.save(`Order Sheet_${date}.pdf`);
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
                    className="uppercase"
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
