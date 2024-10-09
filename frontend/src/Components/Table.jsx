import { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

export function Table() {
  const [customer, setCustomer] = useState([]);

  useEffect(() => {
    async function getCustomers() {
      await axiosInstance
        .get("/customers")
        .then((res) => {
          setCustomer(res?.data?.customers);
        })
        .catch((err) => {});
    }

    getCustomers();
  }, []);

  const navigate = useNavigate();

  function handleBill(id) {
    navigate(`/customer/${id}`);
  }

  function handleAdd() {
    navigate(`/customer`);
  }

  async function handleDelete(id) {
    await axiosInstance
      .delete(`/customer/${id}`)
      .then((res) => {
        console.log(res);
        toast.success(res.data.msg);
        setCustomer((prev) => prev.filter((p) => p._id != id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="rounded p-2 m-4">
      <div className="flex justify-between items-center mt-2 mb-4">
        <p className="font-bold text-lg">Customer Details</p>
        <button
          onClick={handleAdd}
          className="bg-black text-white rounded w-fit px-4 py-2"
        >
          Add New Customer
        </button>
      </div>

      <div className="relative overflow-x-auto rounded-lg w-full max-h-[82vh] mb-2">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-y-scroll">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="">
              <th scope="col" className="px-6 py-3">
                Customer Name
              </th>
              <th scope="col" className="px-6 py-3">
                Customer Phone number
              </th>
              <th scope="col" colSpan={2} className="px-6 py-3">
                Generate Bill
              </th>
            </tr>
          </thead>
          <tbody>
            {customer.map((data) => {
              return (
                <tr
                  key={data?._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {data.username}
                  </th>
                  <td className="px-6 py-4">{data.phone}</td>
                  <td>
                    <button
                      className="py-[6px] px-3 bg-gray-50 text-black hover:bg-gray-200 rounded-lg"
                      onClick={() => {
                        handleBill(data._id);
                      }}
                    >
                      Generate Bill
                    </button>
                  </td>

                  <td>
                    <button
                      onClick={() => {
                        handleDelete(data._id);
                      }}
                    >
                      <MdDelete size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
