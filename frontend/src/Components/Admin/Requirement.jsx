import { useEffect, useState } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';

export default function RequirementPage() {
  const [date, setDate] = useState('');
  const [customers, setCustomers] = useState([]);
  const [vegetables, setVegetables] = useState([]);

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
        <TableContainer component={Paper}>
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
                    className="capitalize"
                    sx={{
                      position: 'sticky',
                      left: 0,
                      zIndex: 1,
                      backgroundColor: 'white',
                    }}
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
    </div>
  );
}
