import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosAddCircle } from "react-icons/io";
import { IoIosRemoveCircle } from "react-icons/io";
import { useNavigate, useParams } from "react-router";
import { useRef } from "react";
import generatePDF from "react-to-pdf";
import Pdf from "./PDF";
import axiosInstance from "../Utils/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiPencilFill } from "react-icons/ri";

function Form() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const { custId } = useParams();

  const [veges, setVeges] = useState([]);
  const [total, setTotal] = useState(0);
  const targetRef = useRef();
  const [load, setLoad] = useState(false);
  const [actionId, setActionId] = useState(-1);
  const [isAdd, setIsAdd] = useState(false);
  const [orgVeg, setOrgVeg] = useState([]);
  const name = watch("name");
  const address = watch("address");

  useEffect(() => {
    async function getCustomer() {
      await axiosInstance
        .get(`/customer/${custId}`)
        .then((res) => {
          setVeges(res?.data?.customer?.vegetables);
          setOrgVeg(res?.data?.customer?.vegetables);
          setValue("name", res?.data?.customer?.username);
          setValue("phone", res?.data?.customer?.phone);
          setValue("address", res?.data?.customer?.address);
        })
        .catch((err) => {});
    }

    if (custId) getCustomer();
  }, [custId]);

  useEffect(() => {
    var amount = 0;
    
    veges.map((veg) => {
      if (!isNaN(veg.price_per_kg) && !isNaN(veg.quantity)) {
        var temp = veg.price_per_kg * veg.quantity;
        amount += temp;
      }
    });

    setTotal(amount);
  }, [veges]);

  async function handleRemove(id) {
    if (id === 0) {
      setVeges((prev) => prev.filter((veg) => veg._id !== 0));
    } else {
      await axiosInstance
        .delete(`/vegetable/${custId}/${id}`)
        .then((res) => {
          setVeges((prev) => prev.filter((p) => p._id !== id));
          toast.success(res?.data?.msg);
        })
        .catch((err) => {});
    }
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
  }

  function handleCancel(id) {
    if (isAdd && id == 0) {
      setVeges((prev) => prev.filter((veg) => veg._id !== 0));
      setIsAdd(false);
    } else {
      setActionId(-1);
      setVeges(orgVeg);
    }
  }

  async function handleSave(id) {
    const data = veges.find((v) => v._id === id);

    if (isAdd && id === 0) {
      const d = {
        cust_id: custId,
        name: data.name,
        price: parseInt(data.price_per_kg),
        quantity: parseInt(data.quantity),
      };

      await axiosInstance
        .post("/vegetable", d)
        .then((res) => {
          if (res.status === 200) {
            setVeges((prev) => prev.filter((veg) => veg._id !== 0));
            setVeges((prev) => [...prev, res?.data?.vegetable]);
            toast.success(res?.data?.msg);
            setIsAdd(false);
          }
        })
        .catch((err) => {});
    } else {
      const d = {
        veg_id: data._id,
        name: data.name,
        price: parseInt(data.price_per_kg),
        quantity: parseInt(data.quantity),
      };

      await axiosInstance
        .put(`/vegetable/${data._id}`, d)
        .then((res) => {
          if (res.status === 200) {
            toast.success(res?.data?.msg);
            setActionId(-1);
          }
        })
        .catch((err) => {});
    }
  }

  async function onSubmit(data) {
    var upd_data;
    setLoad(true);

    if (custId) {
      // edit customer
      const d = {
        cust_id: custId,
        phone: data.phone,
        address: data.address,
      };

      await axiosInstance
        .put(`customer/${custId}`, d)
        .then((res) => {
          setLoad(false);
          if (res.status === 200) {
            toast.success("Customer Bill generated");
            // generate bill
            generatePDF(targetRef, { filename: `${data.name}_invoice.pdf` });
          }
        })
        .catch((err) => {
          setLoad(false);
          toast.error(err?.response?.data?.msg);
        });
    } else {
      // add new customer
      upd_data = {
        username: data.name,
        phone: data.phone,
        address: data.address,
      };

      await axiosInstance
        .post("customer", upd_data)
        .then((res) => {
          setLoad(false);
          if (res.status === 200) {
            toast.success(res?.data?.msg);
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
      <div className="bg-slate-100 max-w-xl px-4 py-8 my-8 rounded-xl mx-auto flex flex-col">
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="text-lg font-bold text-center mb-4">Customer Details</p>
          <div className="mb-4">
            <label className="text-gray-800">Customer Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
              placeholder="Enter Customer name"
              {...register("name", { required: true })}
              readOnly={custId ? true : false}
            />
            {errors.username && (
              <span className="text-red-600">Please, enter name</span>
            )}
          </div>

          <div className="mb-4">
            <label className="text-gray-800">Customer Phone number</label>
            <input
              type="number"
              className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
              placeholder="Phone Number"
              {...register("phone", { required: true })}
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-800">Customer Address</label>
            <input
              type="text"
              className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
              placeholder="Enter Address"
              {...register("address", { required: true })}
            />
            {errors.username && (
              <span className="text-red-600">Please, enter address</span>
            )}
          </div>

          {custId && (
            <div className="mb-4 h-[35vh] overflow-y-scroll">
              <label className="text-gray-800">Vegetables</label>

              {veges.length > 0 ? (
                veges.map((data, index) => {
                  return (
                    <div key={data._id} className="flex flex-col gap-y-1">
                      <div
                        className="flex items-center w-full gap-x-2 my-2"
                        key={data._id}
                      >
                        <input
                          type="text"
                          placeholder="Vegetable Name"
                          value={data.name}
                          onChange={(e) => handleOnChange(data?._id, "name", e)}
                          className="w-1/2 border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                        />
                        <input
                          type="number"
                          placeholder="KGs"
                          value={data?.quantity}
                          className="w-1/4 border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                          onChange={(e) =>
                            handleOnChange(data._id, "quantity", e)
                          }
                        />
                        <input
                          type="number"
                          placeholder="price per KG"
                          value={data?.price_per_kg}
                          onChange={(e) =>
                            handleOnChange(data._id, "price_per_kg", e)
                          }
                          className="w-1/4 border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                        />
                        <div
                          className="rounded-full cursor-pointer"
                          title="Edit"
                          onClick={() => {
                            handleEditVeg(data._id);
                          }}
                        >
                          <RiPencilFill size={32} />
                        </div>
                        {index + 1 === veges.length &&
                          !veges.some((veg) => veg._id === 0) && (
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
                        {index !== 0 && (
                          <div
                            className="rounded-full cursor-pointer"
                            title="Remove"
                            onClick={() => {
                              handleRemove(data._id);
                            }}
                          >
                            <IoIosRemoveCircle size={32} />
                          </div>
                        )}
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
          )}

          {custId && (
            <p className="font-bold text-lg my-4">Total Amount: {total}</p>
          )}

          <button
            disabled={load}
            type="submit"
            className="w-full rounded-lg py-2 bg-cyan-400 hover:bg-cian-600 mt-4 text-white font-bold hover:bg-cyan-700 cursor-pointer disabled:cursor-none disabled:bg-gray-400"
          >
            Generate Bill
          </button>
        </form>
      </div>

      <div className="opacity-0">
        <div ref={targetRef}>
          <Pdf vegetables={veges} total={total} name={name} address={address} />
        </div>
      </div>
    </>
  );
}

export default Form;
