import { useEffect, useState } from 'react';
import axiosInstance from '../Utils/axiosInstance';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
import BackButton from '../Utils/BackButton';
import DeleteDialog from '../Utils/DeleteDialog';

export function Table() {
  const [customer, setCustomer] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    async function getCustomers() {
      await axiosInstance
        .get('/customers')
        .then((res) => {
          setCustomer(res?.data?.customers);
        })
        .catch((err) => {});
    }

    getCustomers();
  }, []);

  const navigate = useNavigate();

  function handleBill(id) {
    navigate(`/form/generate_bill/${id}`);
  }

  function handleEdit(id) {
    navigate(`/form/edit/${id}`);
  }

  function handleAdd() {
    navigate(`/form`);
  }

  async function handleDelete() {
    await axiosInstance
      .delete(`/customer/${deleteId}`)
      .then((res) => {
        setOpen(false);
        toast.success(res.data.msg);
        setCustomer((prev) => prev.filter((p) => p._id != deleteId));
      })
      .catch((err) => {});
  }

  return (
    <>
      <BackButton />
      <div className="rounded p-2 m-4">
        <div className="flex justify-between items-center mt-2 mb-4">
          <p className="font-bold text-lg">Customer Details</p>
          <button onClick={handleAdd} className="bg-black text-white rounded w-fit px-4 py-2">
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {customer.length > 0 &&
                customer.map((data) => {
                  return (
                    <tr
                      key={data?._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                        onClick={() => {
                          navigate(`/bills/${data._id}`);
                        }}
                      >
                        {data.username}
                      </th>
                      <td className="px-6 py-4">{data.phone}</td>
                      <td className="flex flex-col md:flex-row items-center gap-x-8 gap-y-2 md:gap-y-0 px-2 py-4">
                        <button
                          className="py-[6px] px-3 bg-gray-50 text-black hover:bg-gray-200 rounded-lg w-28"
                          onClick={() => {
                            handleBill(data._id);
                          }}
                        >
                          Generate Bill
                        </button>

                        <button
                          className="py-[6px] px-3 bg-gray-50 text-black hover:bg-gray-200 rounded-lg w-28"
                          onClick={() => {
                            handleEdit(data._id);
                          }}
                        >
                          Edit Detail
                        </button>
                      </td>

                      <td>
                        <button
                          onClick={() => {
                            setDeleteId(data._id);
                            setOpen(true);
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

      <DeleteDialog title="Customer" open={open} setOpen={setOpen} onClick={handleDelete} />
    </>
  );
}
