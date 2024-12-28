import { useEffect, useState } from 'react';
import axiosInstance from '../Utils/axiosInstance';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import BackButton from '../Utils/BackButton';

export default function Customer() {
  const [bills, setBills] = useState({});

  const { custId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getBills() {
      await axiosInstance
        .get(`/bills/${custId}`)
        .then((res) => {
          setBills(res?.data?.bills);
        })
        .catch((err) => {});
    }

    getBills();
  }, []);

  async function handleDelete(id) {
    await axiosInstance
      .delete(`/bill/${id}/${custId}`)
      .then((res) => {
        toast.success(res.data.msg);
        setBills((prev) => prev.filter((p) => p._id !== id));
      })
      .catch((err) => {});
  }

  function handleEdit(billId) {
    navigate(`/bill/${billId}/${custId}`);
  }

  return (
    <>
      <BackButton />
      <div className="m-8">
        <p className="font-bold my-4 text-lg underline">Previously Generated Bills</p>
        <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          {bills?.length > 0 ? (
            <table className="overflow-x-auto w-full text-left table-auto sm:min-w-max text-slate-800">
              <thead>
                <tr className="text-slate-500 border-b border-slate-300 bg-slate-50">
                  <th className="px-2 p-4 sm:px-4">
                    <p className="text-sm leading-none font-normal text-center">Bill Number</p>
                  </th>
                  <th className="px-2 p-4 sm:px-4">
                    <p className="text-sm leading-none font-normal text-center">Customer Name</p>
                  </th>
                  <th className="px-2 p-4 sm:px-4">
                    <p className="text-sm leading-none font-normal text-center">Bill Date</p>
                  </th>
                  <th className="px-2 p-4 sm:px-4">
                    <p className="text-sm leading-none font-normal text-center">Budget</p>
                  </th>
                  <th className="px-2 p-4 sm:px-4">
                    <p></p>
                  </th>
                  <th className="px-2 p-4 sm:px-4">
                    <p></p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {bills?.map((b, index) => {
                  return (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="py-4 px-2 sm:px-4 text-center">
                        <p className="text-sm">{b?.bill_number}</p>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-center">
                        <p className="text-sm font-bold">{b?.customer?.username}</p>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-center">
                        <p className="text-sm">
                          {b?.date && new Date(b?.date).toLocaleDateString('en-GB')}
                        </p>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-center">
                        <p className="text-sm">Rs. {Math.round(b?.total_amount)}</p>
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        <button
                          onClick={() => {
                            handleEdit(b?._id);
                          }}
                          className="text-sm font-semibold "
                        >
                          Edit
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          className="text-sm font-semibold hover:text-red-500 transition-all overflow-hidden"
                          onClick={() => {
                            handleDelete(b?._id);
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-center w-full py-4">No Bills Generated</p>
          )}
        </div>
      </div>
    </>
  );
}
