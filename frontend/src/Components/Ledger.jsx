import { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { useNavigate } from "react-router";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import dayjs from "dayjs";
import CircularProgress from "@mui/material/CircularProgress";
import BackButton from "./BackButton";

export function Ledger() {
  const [bills, setBills] = useState([]);
  const [month, setMonth] = useState(dayjs());
  const [total, setTotal] = useState(0);
  const [load, setLoad] = useState(false);

  const navigate = useNavigate();

  async function handleMonth(val) {
    setMonth(val);
    const month = val.month() + 1;
    const year = val.year();

    setLoad(true);
    await axiosInstance
      .get(`/monthly_bill/${month}/${year}`)
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
        setLoad(false);
      });
  }

  return (
    <>
      <BackButton />
      <div className="rounded p-2 m-4">
        <p className="font-bold text-lg">Monthly Ledger</p>
        <div className="flex sm:flex-row flex-col justify-between w-full">
          <div className="flex flex-col gap-y-2 my-4 mr-2">
            <p>Select Month</p>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                className="bg-slate-200 rounded-lg w-fit"
                value={month}
                views={["month", "year"]}
                maxDate={dayjs().endOf("year")}
                onChange={(value) => handleMonth(value)}
              />
            </LocalizationProvider>
          </div>
          <p className="text-lg">
            Total Budget: <b>Rs. {total}</b>
          </p>
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
                      Bill Amount{" "}
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
                          {data?.date &&
                            new Date(data?.date).toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-6 py-4">
                          {data?.customer?.username}
                        </td>
                        <td className="px-6 py-4">{data?.bill_number}</td>
                        <td className="px-6 py-4">{data?.total_amount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </>
  );
}
