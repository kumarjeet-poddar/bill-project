import { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { useParams } from "react-router";
import { toast } from "react-toastify";

export default function Customer() {
  const [bills, setBills] = useState({});

  const { custId } = useParams();

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
        setBills((prev) => ({
          ...prev,
          bills: prev.bills.filter((p) => p._id !== id),
        }));
      })
      .catch((err) => {});
  }

  console.log(bills);
  return (
    <>
      <div className="m-8">
        <p className="font-bold my-4 text-lg underline">
          Previously Generated Bills
        </p>
        <div class="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          {bills?.bills?.length > 0 ? (
            <table class="w-full text-left table-auto min-w-max text-slate-800">
              <thead>
                <tr class="text-slate-500 border-b border-slate-300 bg-slate-50">
                  <th class="p-4">
                    <p class="text-sm leading-none font-normal">
                      Customer Name
                    </p>
                  </th>
                  <th class="p-4">
                    <p class="text-sm leading-none font-normal">Bill Date</p>
                  </th>
                  <th class="p-4">
                    <p class="text-sm leading-none font-normal">Budget</p>
                  </th>
                  <th class="p-4">
                    <p></p>
                  </th>
                  <th class="p-4">
                    <p></p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {bills?.bills?.map((b) => {
                  return (
                    <tr class="hover:bg-slate-50">
                      <td class="p-4">
                        <p class="text-sm font-bold">{bills?.username}</p>
                      </td>
                      <td class="p-4">
                        <p class="text-sm">
                          {new Date(b?.createdAt).toLocaleString()}
                        </p>
                      </td>
                      <td class="p-4">
                        <p class="text-sm">Rs. {b?.total_amount}</p>
                      </td>
                      <td class="p-4">
                        <a href="#" class="text-sm font-semibold ">
                          Edit
                        </a>
                      </td>
                      <td class="p-4">
                        <button
                          class="text-sm font-semibold hover:text-red-500 transition-all overflow-hidden"
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
            <p className="text-sm text-center w-full py-4">
              No Bills Generated
            </p>
          )}
        </div>
      </div>
    </>
  );
}
