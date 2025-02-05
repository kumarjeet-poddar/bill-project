import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosAddCircle } from 'react-icons/io';
import { IoIosRemoveCircle } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router';
import { useRef } from 'react';
import generatePDF from 'react-to-pdf';
import Pdf from './PDF';
import axiosInstance from '../Utils/axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiPencilFill } from 'react-icons/ri';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import BackButton from '../Utils/BackButton';
import DeleteDialog from '../Utils/DeleteDialog';

function Form() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const { custId, operation, billId } = useParams();

  const bankRef = useRef();

  const [veges, setVeges] = useState([]);
  const [total, setTotal] = useState(0);
  const originalRef = useRef();
  const duplicateRef = useRef();
  const [load, setLoad] = useState(false);
  const [actionId, setActionId] = useState(-1);
  const [isAdd, setIsAdd] = useState(false);
  const [adminVegetables, setAdminVegetables] = useState([]);
  const name = watch('name');
  const address = watch('address');
  const date = watch('date');
  const bill_number = watch('bill_number');
  const navigate = useNavigate();
  const [currentDropdownId, setCurrentDropdownId] = useState(null);
  const [updVeges, setUpdVeges] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [editVegetableId, setEditVegetableId] = useState(0);
  const [customerVegetables, setCustomerVegetables] = useState([]);

  async function sortArray(vegetables) {
    await axiosInstance
      .post('/arranged_vegetables', {
        vegetables,
      })
      .then((res) => {
        setUpdVeges(res.data.vegetables);
      })
      .catch((err) => {});
  }

  useEffect(() => {
    async function getCustomer() {
      await axiosInstance
        .get(`/customer/${custId}`)
        .then((res) => {
          setValue('name', res?.data?.customer?.username);
          setValue('phone', res?.data?.customer?.phone);
          setValue('address', res?.data?.customer?.address);
          setAdminVegetables(res?.data?.admin_vegetables);
          setCustomerVegetables(res?.data?.customer?.vegetables);
          const currentDate = new Date().toLocaleDateString('en-CA');
          setValue('date', currentDate);
          setValue(
            'bill_number',
            `NGV/${res?.data?.customer?._id.slice(-4)}/${res?.data?.customer?.bill_number}`
          );
        })
        .catch((err) => {});
    }

    async function getBill() {
      await axiosInstance
        .get(`/bill/${billId}/${custId}`)
        .then((res) => {
          setVeges(res?.data?.bill?.vegetables);
          setAdminVegetables(res?.data?.admin_vegetables);
          setCustomerVegetables(res?.data?.customer_vegetables);
          setValue('name', res?.data?.bill?.customer?.username);
          setValue('phone', res?.data?.bill?.customer?.phone);
          setValue('address', res?.data?.bill?.customer?.address);
          const formattedDate = res?.data?.bill?.date
            ? new Date(res.data.bill.date).toLocaleDateString('en-CA')
            : '';
          setValue('date', formattedDate);
          setValue('bill_number', res?.data?.bill?.bill_number);
        })
        .catch((err) => {});
    }

    if (billId) {
      getBill();
      return;
    }

    if (custId) getCustomer();
  }, [custId, billId]);

  useEffect(() => {
    var amount = 0;

    veges.map((veg) => {
      const price = parseFloat(veg.price_per_kg);
      const quantity = parseFloat(veg.quantity);

      if (!isNaN(price) && !isNaN(quantity)) {
        var temp = price * quantity;
        amount += temp;
      }
    });

    setTotal(amount);
  }, [veges]);

  function handleSelectVegetable(item, id) {
    const customerVeg = customerVegetables.find(
      (veg) => veg.name.toLowerCase() === item.name.toLowerCase()
    );

    if (customerVeg) {
      handleOnChange(id, 'price_per_kg', { target: { value: customerVeg.price_per_kg } });
      handleOnChange(id, 'unit', { target: { value: customerVeg.unit } });
    }
    handleOnChange(id, 'name', { target: { value: item.name } });
  }

  async function handleModalDelete() {
    if (operation === 'generate_bill' || billId) {
      setVeges((prev) => {
        const updatedVeges = prev.filter((veg) => veg._id !== deleteId);

        if (billId) {
          edit_bill({ vegetables: updatedVeges }, 'add_veg_in_bill');
        }

        return updatedVeges;
      });
      toast.success('Vegetable removed');
    } else {
      // this is of no use right now becuase there is no functionality to delete items from customer collection
      if (deleteId === 0) {
        setVeges((prev) => prev.filter((veg) => veg._id !== 0));
      } else {
        await axiosInstance
          .delete(`/vegetable/${custId}/${deleteId}`)
          .then((res) => {
            setVeges((prev) => prev.filter((p) => p._id !== deleteId));
            toast.success(res?.data?.msg);
          })
          .catch((err) => {});
      }
    }
    setOpen(false);
  }

  function handleAddMore() {
    setIsAdd(true);
    setActionId(0);
    setVeges((prev) => [...prev, { _id: 0 }]);
  }

  function handleOnChange(idx, field, e) {
    var val = e.target.value;

    setVeges((data) => {
      const isExist = data.find((d) => d._id === idx);
      if (isExist) {
        return data.map((d) =>
          d._id === idx
            ? {
                ...d,
                [field]: val,
              }
            : d
        );
      }
    });
  }

  function handleEditVeg(id) {
    setActionId(id);
    setEditVegetableId(id);
  }

  function handleCancel(id) {
    if (isAdd && id == 0) {
      setVeges((prev) => prev.filter((veg) => veg._id !== 0));
      setIsAdd(false);
      return;
    }
    if (editVegetableId === id) {
      setVeges((prev) =>
        prev.map((veg) => {
          if (veg._id === id) {
            const matchedVeg = customerVegetables.find(
              (customerVeg) => customerVeg.name.toLowerCase() === veg.name.toLowerCase()
            );

            return matchedVeg
              ? {
                  name: matchedVeg.name,
                  price_per_kg: matchedVeg.price_per_kg,
                  unit: matchedVeg.unit,
                  quantity: matchedVeg.quantity,
                }
              : veg;
          }
          return veg;
        })
      );
      setActionId(-1);
    }
  }
  async function handleSave(id) {
    const data = veges.find((v) => v._id === id);
    if (!data) return;

    if (!data.name) {
      setVeges((prev) => prev.filter((veg) => veg._id !== id));
      return toast.error('Please select vegetable from the list.');
    }

    if (isAdd && id === 0) {
      const d = {
        cust_id: custId,
        name: data.name,
        price: parseFloat(data.price_per_kg),
        quantity: parseFloat(data.quantity),
        unit: data.unit,
      };

      await axiosInstance
        .post('/vegetable', d)
        .then(async (res) => {
          if (res.status === 200) {
            if (billId) {
              edit_bill({ vegetables: veges }, 'add_veg_in_bill');
            }

            setVeges((prev) => {
              const updatedVeges = prev.filter((veg) => veg._id !== 0);
              const newVeges = [...updatedVeges, res?.data?.vegetable];
              return newVeges;
            });
            setCustomerVegetables(res.data.customer_vegetables);
            toast.success(res?.data?.msg);
            setIsAdd(false);
          }
        })
        .catch(async (err) => {
          if (err.response.status == 400) {
            setCustomerVegetables(err.response.data.customer_vegetables);
            const toastId = 'vegetable-toast';
            setVeges((prev) => {
              const isDuplicate = prev.some(
                (veg) => veg.name.toLowerCase() === data.name.toLowerCase() && veg._id !== 0
              );

              if (isDuplicate) {
                if (!toast.isActive(toastId)) {
                  toast.error('This vegetable is already added!', { toastId });
                }
                return prev.filter((veg) => veg._id !== 0);
              }

              if (!toast.isActive(toastId)) {
                toast.success('Vegetable added', { toastId });
              }

              const updatedVeges = prev.map((veg) =>
                veg._id === 0 ? { ...veg, _id: err.response.data.vegetable._id } : veg
              );

              // If editing a bill, update it with the new vegetables
              // if (billId) {
              //   edit_bill({ vegetables: veges }, 'add_veg_in_bill');
              // }

              return updatedVeges;
            });

            if (billId) {
              edit_bill({ vegetables: veges }, 'add_veg_in_bill');
            }
          }
        });
    } else {
      if (billId) {
        const req = {
          cust_id: custId,
          name: data.name,
          price: data.price_per_kg,
          unit: data.unit,
        };
        await axiosInstance
          .put(`/bill_vegetable`, req)
          .then(async (res) => {
            if (res.status === 200) {
              await edit_bill({ vegetables: veges }, 'add_veg_in_bill');
              toast.success(res?.data?.msg);
              setActionId(-1);
              setCustomerVegetables(res.data.customer_vegetables);
            }
          })
          .catch((err) => {});
        return;
      }
      const d = {
        cust_id: custId,
        veg_id: data._id,
        name: data.name,
        price: parseFloat(data.price_per_kg),
        quantity: parseFloat(data.quantity),
        unit: data.unit,
      };

      await axiosInstance
        .put(`/vegetable/${data._id}`, d)
        .then((res) => {
          if (res.status === 200) {
            toast.success(res?.data?.msg);
            setActionId(-1);
            setCustomerVegetables(res.data.customer_vegetables);
          }
        })
        .catch((err) => {});
    }
  }

  async function edit_bill(data, str) {
    var d;
    if (str === 'save_bill') {
      d = {
        vegetables: data.vegetables,
        total_amount: total,
        date: data.date,
        bill_number: data.bill_number,
      };
    } else {
      d = {
        vegetables: data.vegetables,
        total_amount: total,
      };
    }

    await axiosInstance
      .put(`bill/${billId}`, d)
      .then(async (res) => {
        if (str === 'save_bill') {
          setLoad(false);
          toast.success('Details updated');
          await sortArray(veges);
        }
      })
      .catch((err) => {
        setLoad(false);
        toast.error(err?.response?.data?.msg);
      });

    return;
  }

  function handleBill() {
    generatePDF(duplicateRef, {
      filename: `${name}_${new Date(date).toLocaleDateString('en-GB')}_duplicate_invoice.pdf`,
    });

    generatePDF(originalRef, {
      filename: `${name}_${new Date(date).toLocaleDateString('en-GB')}_original_invoice.pdf`,
    });

    toast.success('Bill generated successfully');
  }

  async function onSubmit(data) {
    var upd_data;

    setLoad(true);

    if (custId) {
      // edit customer
      if (operation === 'edit') {
        const d = {
          cust_id: custId,
          phone: data.phone,
          address: data.address,
        };

        await axiosInstance
          .put(`customer/${custId}`, d)
          .then((res) => {
            setLoad(false);
            toast.success(res?.data?.msg);
          })
          .catch((err) => {
            setLoad(false);
            toast.error(err?.response?.data?.msg);
          });

        return;
      }

      // generate bill
      if (operation === 'generate_bill') {
        const bill_data = {
          cust_id: custId,
          cust_vegetables: veges,
          total,
          date: data.date,
          bill_number: data.bill_number,
        };

        await axiosInstance
          .post(`bill`, bill_data)
          .then(async (res) => {
            setLoad(false);
            if (res.status === 200) {
              toast.success('Details updated');
              await sortArray(veges);
            }
          })
          .catch((err) => {
            setLoad(false);
            toast.error(err?.response?.data?.msg);
          });

        return;
      }

      // edit bill
      if (billId) {
        const editBillReq = {
          ...data,
          vegetables: veges,
        };
        await edit_bill(editBillReq, 'save_bill');
      }
    } else {
      // add new customer
      upd_data = {
        username: data.name,
        phone: data.phone,
        address: data.address,
      };

      await axiosInstance
        .post('customer', upd_data)
        .then((res) => {
          setLoad(false);
          if (res.status === 200) {
            toast.success(res?.data?.msg);
            navigate('/customer');
          }
        })
        .catch((err) => {
          setLoad(false);
          toast.error(err?.response?.data?.msg);
        });
    }
  }

  return (
    <>
      <BackButton />
      <div className="flex w-full flex-col justify-center items-center">
        <div className="bg-slate-100 w-11/12 sm:max-w-2xl px-4 py-8 my-8 rounded-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <p className="text-lg font-bold text-center mb-4">Customer Details</p>
            <div className="mb-4">
              <label className="text-gray-800">Customer Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                placeholder="Enter Customer name"
                {...register('name', { required: true })}
                readOnly={custId ? true : false}
              />
              {errors.username && <span className="text-red-600">Please, enter name</span>}
            </div>

            <div className="mb-4">
              <label className="text-gray-800">Customer Phone number</label>
              <input
                type="number"
                className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                placeholder="Phone Number"
                {...register('phone', { required: true })}
                readOnly={custId ? true : false}
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-800">Customer Address</label>
              <input
                type="text"
                className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                placeholder="Enter Address"
                {...register('address', { required: true })}
                readOnly={custId ? true : false}
              />
              {errors.username && <span className="text-red-600">Please, enter address</span>}
            </div>

            {operation === 'edit' ? null : (
              <>
                <div className="mb-4">
                  <label className="text-gray-800">Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                    placeholder="dd-mm-yyyy"
                    {...register('date', { required: true })}
                  />
                  {errors.date && <span className="text-red-600">This is a required field</span>}
                </div>

                <div className="mb-4">
                  <label className="text-gray-800">Bill Number</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                    placeholder="Enter Bill Number"
                    {...register('bill_number', { required: true })}
                  />
                  {errors.date && <span className="text-red-600">This is a required field</span>}
                </div>
              </>
            )}

            {custId && operation !== 'edit' && (
              <div className="mb-4">
                <div className="flex justify-between">
                  <label className="text-gray-800">Vegetables</label>
                  <div>
                    <small>Count: </small>
                    <b>{veges && veges.length}</b>
                  </div>
                </div>
                <div className="h-[35vh] overflow-y-scroll">
                  {veges.length > 0 ? (
                    veges.map((data, index) => {
                      return (
                        <div key={index} className="flex flex-col gap-y-1">
                          <div className="flex items-center w-full gap-x-2 my-2" key={data._id}>
                            <label
                              className="w-full flex flex-col"
                              onBlur={() => setCurrentDropdownId(null)}
                            >
                              <div className="pointer-events-none text-[10px] ">Vegetable</div>
                              <ReactSearchAutocomplete
                                showIcon={false}
                                items={adminVegetables}
                                fuseOptions={{
                                  keys: ['name'], // Search by the "name" property
                                  threshold: 0.1, // Lower threshold for stricter matches
                                  shouldSort: true, // Sort results by relevance
                                }}
                                // TODO: render this value conditionally
                                // inputValue={data.name}
                                // value={data.name}
                                placeholder={data.name ? data.name : ''}
                                onFocus={() => setCurrentDropdownId(data._id)}
                                onSearch={(inputValue) => {
                                  const foundItem = adminVegetables.find(
                                    (veg) => veg?.name?.toLowerCase() === inputValue?.toLowerCase()
                                  );
                                  if (!foundItem) {
                                    handleOnChange(data._id, 'name', {
                                      target: { value: '' },
                                    });
                                  }
                                }}
                                onSelect={(item) => {
                                  handleSelectVegetable(item, data._id);
                                }}
                                styling={{
                                  height: '41px',
                                  borderRadius: '8px',
                                  backgroundColor:
                                    currentDropdownId === data._id ? 'white' : '#f3f4f6',
                                  border:
                                    currentDropdownId === data._id
                                      ? '1px solid #06b6d4'
                                      : '1px solid #d1d5db',
                                  cursor: currentDropdownId === data._id ? 'text' : 'not-allowed',
                                  boxShadow: 'none',
                                  color: 'black',
                                  fontSize: '16px',
                                  iconColor: 'gray',
                                  clearIconMargin: '0 4px 0 0',
                                  placeholderColor: 'black',
                                  zIndex: currentDropdownId === data._id ? 50 : 10,
                                  position: 'relative',
                                }}
                              />
                            </label>
                            <div className="w-full flex flex-col">
                              <label className="text-[10px]">Quantity</label>
                              <input
                                inputMode="decimal"
                                type="tel"
                                placeholder="KGs"
                                value={data?.quantity}
                                required
                                className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 rounded-lg focus:outline-none placeholder-gray-300 focus:border-indigo-500 focus:bg-white bg-gray-100 cursor-not-allowed focus:cursor-text"
                                onChange={(e) => {
                                  if (isNaN(e.target.value)) return;
                                  handleOnChange(data._id, 'quantity', e);
                                }}
                                readOnly={editVegetableId == data._id ? false : true}
                              />
                            </div>
                            <div className="w-full flex flex-col">
                              <label className="text-[10px]">Unit</label>
                              <input
                                type="text"
                                placeholder="kg"
                                value={data?.unit}
                                className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 rounded-lg focus:outline-none placeholder-gray-300 focus:border-indigo-500 focus:bg-white bg-gray-100 cursor-not-allowed focus:cursor-text"
                                onChange={(e) => {
                                  handleOnChange(data._id, 'unit', e);
                                }}
                                readOnly={editVegetableId == data._id ? false : true}
                              />
                            </div>
                            <div className="w-full flex flex-col">
                              <label className="pointer-events-none text-[10px]">Price</label>
                              <input
                                inputMode="decimal"
                                type="tel"
                                placeholder="price per KG"
                                value={data?.price_per_kg}
                                required
                                onChange={(e) => {
                                  if (isNaN(e.target.value)) return;
                                  handleOnChange(data._id, 'price_per_kg', e);
                                }}
                                readOnly={editVegetableId == data._id ? false : true}
                                className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 rounded-lg focus:outline-none placeholder-gray-300 focus:border-indigo-500 focus:bg-white bg-gray-100 cursor-not-allowed focus:cursor-text"
                              />
                            </div>
                            <div className="w-full flex flex-col">
                              <label className="text-[10px]">Amount</label>
                              <input
                                inputMode="decimal"
                                type="tel"
                                placeholder="00"
                                value={
                                  isNaN(data?.quantity * data?.price_per_kg)
                                    ? ''
                                    : data?.quantity * data?.price_per_kg
                                }
                                readOnly={editVegetableId == data._id ? false : true}
                                className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 rounded-lg focus:outline-none placeholder-gray-300 focus:border-indigo-500 focus:bg-white bg-gray-100 cursor-not-allowed focus:cursor-text"
                                onChange={(e) => {
                                  if (isNaN(e.target.value)) return;
                                  handleOnChange(data._id, 'total', e);
                                }}
                              />
                            </div>
                            <div
                              className="rounded-full cursor-pointer"
                              title="Edit"
                              onClick={() => {
                                handleEditVeg(data._id);
                              }}
                            >
                              <RiPencilFill size={32} />
                            </div>
                            {index + 1 === veges.length && !veges.some((veg) => veg._id === 0) && (
                              <div
                                className="rounded-full cursor-pointer"
                                title="Add More"
                                onClick={() => {
                                  handleAddMore();
                                }}
                              >
                                <IoIosAddCircle size={32} />
                              </div>
                            )}
                            <div
                              className="rounded-full cursor-pointer"
                              title="Remove"
                              onClick={() => {
                                setDeleteId(data._id);
                                setOpen(true);
                              }}
                            >
                              <IoIosRemoveCircle size={32} />
                            </div>
                          </div>
                          {(actionId === data._id || (isAdd && data._id === 0)) && (
                            <div className="flex w-full justify-end gap-x-3 border-b pb-1">
                              <button
                                onClick={() => {
                                  handleCancel(data._id);
                                }}
                                type="button"
                                className="py-1 px-2 text-sm text-white bg-red-500 hover:bg-red-600 transition-all rounded-xl"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  handleSave(data._id);
                                }}
                                type="button"
                                className="py-1 px-3 text-sm text-white bg-green-500 hover:bg-green-600 transition-all rounded-xl"
                              >
                                Save
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <button
                      className="py-1 px-2 text-sm text-white bg-gray-900 hover:bg-black transition-all rounded-lg float-right"
                      onClick={() => {
                        handleAddMore();
                      }}
                    >
                      Add new
                    </button>
                  )}
                </div>
              </div>
            )}

            {custId && <p className="font-bold text-lg my-4">Total Amount: {total.toFixed(2)}</p>}

            {custId && (
              <div className="flex items-center flex-row w-fit h-fit justify-center">
                <input type="checkbox" id="bank" ref={bankRef} />
                <label for="bank" className="ml-2 text-sm">
                  Add Bank Details
                </label>
              </div>
            )}

            <button
              disabled={load}
              type="submit"
              className="w-full rounded-lg py-2 bg-indigo-400 hover:bg-cian-600 mt-4 text-white font-bold hover:bg-indigo-700 cursor-pointer disabled:cursor-none disabled:bg-gray-400"
            >
              {custId ? 'Save' : 'Add Customer'}
            </button>
            {(operation === 'generate_bill' || billId) && (
              <button
                type="button"
                onClick={handleBill}
                className="w-full rounded-lg py-2 border text-indigo-500 border-indigo-400 hover:bg-cian-600 mt-4 font-bold cursor-pointer"
              >
                Generate Bill
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="opacity-0">
        <div
          ref={originalRef}
          style={{
            width: '1152px',
            margin: 'auto',
            backgroundColor: '#fff',
          }}
        >
          <Pdf
            vegetables={updVeges}
            total={total}
            name={name}
            address={address}
            date={date}
            bill_number={bill_number}
            showBank={bankRef?.current?.checked}
            billCopyType="original"
          />
        </div>
      </div>

      <div className="opacity-0">
        <div
          ref={duplicateRef}
          style={{
            width: '1152px',
            margin: 'auto',
            backgroundColor: '#fff',
          }}
        >
          <Pdf
            vegetables={updVeges}
            total={total}
            name={name}
            address={address}
            date={date}
            bill_number={bill_number}
            showBank={bankRef?.current?.checked}
            billCopyType="duplicate"
          />
        </div>
      </div>

      <DeleteDialog title="Vegetable" open={open} setOpen={setOpen} onClick={handleModalDelete} />
    </>
  );
}

export default Form;
