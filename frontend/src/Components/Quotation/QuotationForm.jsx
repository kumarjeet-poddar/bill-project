import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosAddCircle } from 'react-icons/io';
import { IoIosRemoveCircle } from 'react-icons/io';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useRef } from 'react';
import generatePDF from 'react-to-pdf';
import Pdf from '../PDF';
import axiosInstance from '../../Utils/axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import BackButton from '../../Utils/BackButton';
import QuotationPdf from './QuotationPDF';
import DeleteDialog from '../../Utils/DeleteDialog';

function QuotationForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [veges, setVeges] = useState([]);
  const [orgVeges, setOrgVeges] = useState([]);
  const [total, setTotal] = useState(0);
  const targetRef = useRef();
  const [load, setLoad] = useState(false);
  const [actionId, setActionId] = useState(-1);
  const name = watch('name');
  const address = watch('address');
  const date = watch('date');
  const phone = watch('phone');
  const quotation_number = watch('quotation_number');
  const [currentDropdownId, setCurrentDropdownId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const { quotation_type } = useParams();

  useEffect(() => {
    async function getQuotation() {
      await axiosInstance
        .get(`/quotation/${quotation_type}`)
        .then((res) => {
          setOrgVeges(res?.data?.quotation?.vegetables ? res?.data?.quotation?.vegetables : []);
          setVeges(res?.data?.quotation?.vegetables ? res?.data?.quotation?.vegetables : []);
          const now = new Date();
          const month = (now.getMonth() + 1).toString().padStart(2, '0');
          const year = now.getFullYear();
          const randomNum = Math.floor(Math.random() * 900) + 100;
          setValue('quotation_number', `NGV/${month}-${year}/${randomNum}`);
        })
        .catch((err) => {});
    }

    getQuotation();
  }, []);

  useEffect(() => {
    var amount = 0;

    if (veges && veges.length > 0) {
      veges.map((veg) => {
        const price = parseFloat(veg.price_per_kg);
        const quantity = parseFloat(veg.quantity);

        if (!isNaN(price) && !isNaN(quantity)) {
          var temp = price * quantity;
          amount += temp;
        }
      });

      setTotal(amount);
    }
  }, [veges]);

  function handleAddMore() {
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

  function handleRemove(id) {
    setVeges((prev) => prev.filter((veg) => veg._id !== id));
    setActionId(-1);
  }

  function handleModalDelete() {
    setVeges((prev) => prev.filter((veg) => veg._id !== deleteId));
    setActionId(-1);
    setOpen(false);
  }

  async function handleSave(id) {
    const data = veges.find((v) => v._id === id);

    let isDuplicate = veges.some(
      (veg) => veg.name.toLowerCase() === data.name.toLowerCase() && veg._id !== 0
    );

    if (isDuplicate) {
      setVeges((prev) => prev.filter((veg) => veg._id !== 0));
      toast.error('This vegetable is already added!');
      return;
    } else {
      await axiosInstance
        .post('/quotation', {
          veges,
          quotation_type,
        })
        .then(async (res) => {
          toast.success('Vegetable added!');
          setVeges(res?.data?.quotation?.vegetables);
        })
        .catch((err) => {});
      return;
    }
  }

  async function onSubmit(data) {
    setLoad(true);

    await axiosInstance
      .post('/quotation', {
        quotation_type,
        veges,
      })
      .then(async (res) => {
        setLoad(false);
        setVeges(res?.data?.quotation?.vegetables);
        generatePDF(targetRef, {
          filename: `${name}_${new Date(date).toLocaleDateString('en-GB')}.pdf`,
        });

        toast.success(res?.data?.msg);
      })
      .catch((err) => {
        setLoad(false);
      });
  }

  return (
    <>
      <BackButton />
      <div className="flex w-full flex-col justify-center items-center">
        <div className="bg-slate-100 w-11/12 sm:max-w-2xl px-4 py-8 my-8 rounded-xl flex flex-col">
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="text-lg font-bold text-center mb-4">Customer Details</p>
            <div className="mb-4">
              <label className="text-gray-800">Customer Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                placeholder="Enter Customer name"
                {...register('name', { required: true })}
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
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-800">Customer Address</label>
              <input
                type="text"
                className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                placeholder="Enter Address"
                {...register('address', { required: true })}
              />
              {errors.username && <span className="text-red-600">Please, enter address</span>}
            </div>

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
              <label className="text-gray-800">Quotation number</label>
              <input
                type="text"
                className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                placeholder="Enter Bill Number"
                {...register('quotation_number', { required: true })}
              />
              {errors.date && <span className="text-red-600">This is a required field</span>}
            </div>

            <div className="mb-4">
              <div className="flex justify-between">
                <label className="text-gray-800">Vegetables</label>
                <div>
                  <small>Count: </small>
                  <b>{veges && veges.length}</b>
                </div>
              </div>
              <div className="h-[35vh] overflow-y-scroll">
                {veges && veges.length > 0 ? (
                  veges.map((data, index) => {
                    return (
                      <div key={index} className="flex flex-col gap-y-1">
                        <div className="flex items-center w-full gap-x-2 my-2" key={data._id}>
                          <div
                            className="w-full flex flex-col"
                            onBlur={() => setCurrentDropdownId(null)}
                          >
                            <label className="pointer-events-none text-[10px]">Vegetable</label>
                            <ReactSearchAutocomplete
                              showIcon={false}
                              items={orgVeges}
                              placeholder={data.name}
                              value={data.name}
                              fuseOptions={{
                                keys: ['name'],
                                threshold: 0.1,
                                shouldSort: true,
                              }}
                              onFocus={() => setCurrentDropdownId(data._id)}
                              onSearch={(inputValue) => {
                                const foundItem = veges.find(
                                  (veg) => veg?.name?.toLowerCase() === inputValue?.toLowerCase()
                                );
                                if (!foundItem) {
                                  handleOnChange(data._id, 'name', {
                                    target: { value: inputValue },
                                  });
                                }
                              }}
                              onSelect={(item) => {
                                handleOnChange(data._id, 'name', {
                                  target: { value: item.name },
                                });
                                handleOnChange(data._id, 'unit', {
                                  target: { value: item.unit },
                                });
                                handleOnChange(data._id, 'price_per_kg', {
                                  target: { value: item.price_per_kg },
                                });
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
                          </div>
                          <div className="w-full flex flex-col">
                            <label className="text-[10px]">Quantity</label>
                            <input
                              inputMode="decimal"
                              type="tel"
                              placeholder="KGs"
                              value={data?.quantity}
                              required
                              className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 rounded-lg focus:outline-none placeholder-gray-300 focus:border-indigo-500 focus:bg-white bg-gray-100 cursor-not-allowed focus:cursor-text"
                              onChange={(e) => handleOnChange(data._id, 'quantity', e)}
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
                              onChange={(e) => handleOnChange(data._id, 'price_per_kg', e)}
                              className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 rounded-lg focus:outline-none placeholder-gray-300 focus:border-indigo-500 focus:bg-white bg-gray-100 cursor-not-allowed focus:cursor-text"
                            />
                          </div>
                          <div className="w-full flex flex-col">
                            <label className="text-[10px]">Amount</label>
                            <input
                              inputMode="decimal"
                              type="tel"
                              placeholder="00"
                              value={data?.quantity * data?.price_per_kg}
                              className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 rounded-lg focus:outline-none placeholder-gray-300 focus:border-indigo-500 focus:bg-white bg-gray-100 cursor-not-allowed focus:cursor-text"
                              onChange={(e) => {
                                if (isNaN(e.target.value)) return;
                                handleOnChange(data._id, 'total', e);
                              }}
                            />
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
                        {actionId === data._id && (
                          <div className="flex w-full justify-end gap-x-3 border-b pb-1">
                            <button
                              onClick={() => {
                                handleRemove(data._id);
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
                      handleAddMore(0);
                    }}
                  >
                    Add new
                  </button>
                )}
              </div>
            </div>

            <p className="font-bold text-lg my-4">Total Amount: {total.toFixed(2)}</p>

            <button
              disabled={load}
              type="submit"
              className="w-full rounded-lg py-2 bg-indigo-400 hover:bg-cian-600 mt-4 text-white font-bold hover:bg-indigo-700 cursor-pointer disabled:cursor-none disabled:bg-gray-400"
            >
              Save
            </button>
          </form>
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
          <QuotationPdf
            vegetables={veges}
            total={total}
            name={name}
            address={address}
            date={date}
            quotation_number={quotation_number}
            phone={phone}
            title={quotation_type === 'indian' ? 'Indian Vegetables' : 'Exotic Vegetables'}
          />
        </div>
      </div>

      <DeleteDialog title="Vegetable" open={open} setOpen={setOpen} onClick={handleModalDelete} />
    </>
  );
}

export default QuotationForm;
