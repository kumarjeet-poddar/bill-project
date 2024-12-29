import { useEffect, useState } from 'react';
import axiosInstance from '../../Utils/axiosInstance';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import BackButton from '../../Utils/BackButton';
import LedgerPdf from './LedgerPdf';
import { useRef } from 'react';
import generatePDF from 'react-to-pdf';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker } from 'antd';

export function Ledger() {
  const { RangePicker } = DatePicker;

  const [bills, setBills] = useState([]);
  const [total, setTotal] = useState(0);
  const [load, setLoad] = useState(false);
  const [customer, setCustomer] = useState();
  const [customerList, setCustomerList] = useState([]);
  const targetRef = useRef();

  useEffect(() => {
    async function getCustomers() {
      await axiosInstance
        .get('/customers')
        .then((res) => {
          setCustomerList(res?.data?.customers);
        })
        .catch((err) => {});
    }

    getCustomers();
  }, []);

  const [date, setDate] = useState([]);

  async function handleMonth(dates, dateString) {
    var start_date, end_date;

    if (dates.length < 2) return;

    setDate(dates.map((date) => date.format('DD/MM/YYYY')));

    const formattedDates = dates.map((date) => date.format('YYYY/MM/DD'));
    start_date = formattedDates[0];
    end_date = formattedDates[1];

    setLoad(true);
    await axiosInstance
      .get(
        `/monthly_bill?start_date=${start_date.toString()}&end_date=${end_date.toString()}&cust_id=${
          customer?._id
        }`
      )
      .then((res) => {
        setLoad(false);
        setBills(res?.data?.bills);

        var amount = 0;
        res?.data?.bills?.map((b) => {
          amount += b.total_amount;
        });

        setTotal(amount);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.msg);
        setLoad(false);
      });
  }

  async function handlePrint() {
    generatePDF(targetRef, {
      filename: `${customer.username}_${date[0]}-${date[1]}_invoice.pdf`,
    });
  }

  return (
    <>
      <BackButton />
      <div className="rounded p-2 m-4">
        <div className="flex sm:flex-row flex-col justify-between w-full mb-3">
          <p className="font-bold text-lg">Monthly Ledger</p>
          <p className="text-lg">
            Total Budget: <b>Rs. {Math.round(total)}</b>
          </p>
        </div>

        <div className="flex flex-col">
          <p>Select Customer</p>
          <select
            className="w-fit border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
            onChange={(e) => {
              setCustomer(JSON.parse(e.target.value));
            }}
          >
            <option value="">--select--</option>
            {customerList.map((cus, index) => (
              <option key={index} value={JSON.stringify(cus)}>
                {cus?.username}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-y-2 my-4 mr-2 justify-start items-start">
          <p>Select Month</p>

          <RangePicker onChange={handleMonth} />
        </div>

        {load ? (
          <CircularProgress />
        ) : (
          bills.length > 0 && (
            <div className="relative overflow-x-auto rounded-lg w-full mb-2 mt-4">
              <table className="w-full text-sm text-left rtl:text-right text-gray-100 overflow-y-scroll">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-100">
                  <tr className="">
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Customer Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Bill Number
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Bill Amount{' '}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((data) => {
                    return (
                      <tr
                        key={data?._id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <td className="px-6 py-4">
                          {data?.date && new Date(data?.date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="px-6 py-4">{data?.customer?.username}</td>
                        <td className="px-6 py-4">{data?.bill_number}</td>
                        <td className="px-6 py-4">Rs. {Math.round(data?.total_amount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        <div className="flex justify-end w-full">
          <button
            className="w-fit px-8 py-3 rounded-lg bg-gray-600 text-white cursor-pointer"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>
      </div>

      <div className="opacity-0">
        <div
          ref={targetRef}
          style={{
            width: '1152px',
            margin: 'auto',
            backgroundColor: '#fff',
          }}
        >
          <LedgerPdf customer={customer} bills={bills} total={total} dates={date} />
        </div>
      </div>
    </>
  );
}
