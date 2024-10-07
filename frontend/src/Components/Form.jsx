import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosAddCircle } from "react-icons/io";
import { IoIosRemoveCircle } from "react-icons/io";
import vegList from "../Utils/VegetableData.json";
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
    formState: { errors },
  } = useForm();

  const { custId } = useParams();

  const [veges, setVeges] = useState([
    {
      id: 0,
    },
  ]);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");
  const [add, setAdd] = useState("");
  const navigate = useNavigate();
  const targetRef = useRef();
  const [load, setLoad] = useState(false);
  const [actionId, setActionId] = useState(-1);

  useEffect(() => {
    var amount = 0;
    veges.map((veg) => {
      if (!isNaN(veg.price) && !isNaN(veg.quantity)) {
        var temp = veg.price * veg.quantity;
        amount += temp;
      }
    });

    setTotal(amount);
  }, [veges]);

  async function onSubmit(data) {
    // const upd_data = {
    //   customer_name: data.name,
    //   customer_phone: data.phone,
    //   customer_address: data.address,
    //   vegetables: veges,
    //   total: total,
    // };
    // generatePDF(targetRef, { filename: `${data.name}_invoice.pdf` });

    var data;
    setLoad(true);

    if (custId) {
    } else {
      data = {
        username: data.name,
        phone: data.phone,
        address: data.address,
      };

      console.log(data);

      await axiosInstance
        .post("customer", data)
        .then((res) => {
          setLoad(false);
          if (res.status == 200) {
            toast.success(res?.data?.msg);
          }
        })
        .catch((err) => {
          setLoad(false);
          toast.error(err?.response?.data?.msg);
        });
    }
  }

  function handleRemove(idx) {
    var updated = veges.filter((v) => v.id !== idx);
    updated = updated.map((m) => {
      if (m.id > idx) return { ...m, id: m.id - 1 };
      return m;
    });

    setVeges(updated);
  }

  function handleAddMore(idx) {
    setVeges((prev) => [...prev, { id: idx + 1 }]);
  }

  function handleOnChange(idx, field, e) {
    var val = e.target.value;

    if (field == "name") {
      const selectedVeg = vegList.find((veg) => veg.veg_name === val);

      setVeges((data) => {
        const isExist = data.find((d) => d.id == idx);
        if (isExist) {
          return data.map((d) =>
            d.id === idx
              ? {
                  ...d,
                  name: selectedVeg.veg_name,
                  price: selectedVeg.veg_price,
                  quantity: selectedVeg.quantity,
                  amount: selectedVeg.quantity * selectedVeg.veg_price,
                }
              : d
          );
        }
      });
    } else {
      setVeges((data) => {
        const isExist = data.find((d) => d.id == idx);
        if (isExist) {
          return data.map((d) =>
            d.id === idx
              ? {
                  ...d,
                  [field]: val,
                  amount: field === "price" ? val * d.quantity : d.price * val,
                }
              : d
          );
        }
      });
    }
  }

  function handleEditVeg(id) {
    console.log(id)
    setActionId(id);
  }

  function handleCancel() {
    setActionId(-1);
  }

  function handleSave() {
    setActionId(-1);
  }

  console.log(veges)
  return (
    <>
      <div className="bg-slate-100 max-w-xl px-4 py-8 my-8 rounded-xl mx-auto flex flex-col">
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="text-lg font-bold text-center mb-4">Customer Details</p>
          <div className="mb-4">
            <label className="text-gray-800">Customer Name</label>
            <input
              type="name"
              className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
              placeholder="Enter Customer name"
              defaultValue=""
              {...register("name", { required: true })}
              onChange={(e) => {
                setName(e.target.value);
              }}
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
              {...register("phone")}
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-800">Customer Address</label>
            <input
              type="text"
              className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
              placeholder="Enter Address"
              defaultValue=""
              {...register("address", { required: true })}
              onChange={(e) => {
                setAdd(e.target.value);
              }}
            />
            {errors.username && (
              <span className="text-red-600">Please, enter address</span>
            )}
          </div>

          {custId && (
            <div className="mb-4">
              <label className="text-gray-800">Add Vegetables</label>

              {veges.length > 0 &&
                veges.map((data, index) => {
                  return (
                    <div className="flex flex-col gap-y-1">
                      <div
                        className="flex items-center w-full gap-x-2 my-2"
                        key={data.id}
                      >
                        <input
                          type="text"
                          placeholder="Vegetable Name"
                          value={data.name}
                          onChange={(e) => handleOnChange(index, "name", e)}
                          className="w-1/2 border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                        />
                        {/* <select
                        value={data.name}
                        onChange={(e) => handleOnChange(index, "name", e)}
                        className="w-1/2 border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                      >
                        <option value="">--select--vegetable--</option>
                        {vegList.map((list) => {
                          return (
                            <option key={list.id} value={list.veg_name}>
                              {list.veg_name}
                            </option>
                          );
                        })}
                      </select> */}
                        <input
                          type="number"
                          placeholder="KGs"
                          value={data?.quantity}
                          className="w-1/4 border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                          onChange={(e) => handleOnChange(index, "quantity", e)}
                        />
                        <input
                          type="number"
                          placeholder="price per KG"
                          value={data?.price}
                          onChange={(e) => handleOnChange(index, "price", e)}
                          className="w-1/4 border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                        />
                        <div
                          className="rounded-full cursor-pointer"
                          title="Edit"
                          onClick={() => {
                            handleEditVeg(data.id);
                          }}
                        >
                          <RiPencilFill size={32} />
                        </div>
                        {index + 1 == veges.length && (
                          <div
                            className="rounded-full cursor-pointer"
                            title="Add More"
                            onClick={() => {
                              handleAddMore(index);
                            }}
                          >
                            <IoIosAddCircle size={32} />
                          </div>
                        )}
                        {/* {index !== 0 && ( */}
                        <div
                          className="rounded-full cursor-pointer"
                          title="Remove"
                          onClick={() => {
                            handleRemove(index);
                          }}
                        >
                          <IoIosRemoveCircle size={32} />
                        </div>
                        {/* )} */}
                      </div>
                      {(actionId == data.id) && (
                        <div className="flex w-full justify-end gap-x-3 border-b pb-1">
                          <button
                            onClick={handleCancel}
                            className="py-1 px-2 text-sm text-white bg-red-500 hover:bg-red-600 transition-all rounded-xl"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="py-1 px-3 text-sm text-white bg-green-500 hover:bg-green-600 transition-all rounded-xl"
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {custId && (
            <p className="font-bold text-lg my-4">Total Amount: {total}</p>
          )}

          <button
            disabled={load}
            type="submit"
            className="w-full rounded-lg py-2 bg-cyan-400 hover:bg-cian-600 mt-4 text-white font-bold hover:bg-cyan-700 cursor-pointer"
          >
            Generate Bill
          </button>
        </form>
      </div>

      <div className="opacity-0">
        <div ref={targetRef}>
          <Pdf vegetables={veges} total={total} name={name} address={add} />
        </div>
      </div>
    </>
  );
}

export default Form;
