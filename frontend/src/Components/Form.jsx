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
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import BackButton from "./BackButton";

function Form() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const { custId, operation, billId } = useParams();

  const [veges, setVeges] = useState([]);
  const [total, setTotal] = useState(0);
  const targetRef = useRef();
  const [load, setLoad] = useState(false);
  const [actionId, setActionId] = useState(-1);
  const [isAdd, setIsAdd] = useState(false);
  const [orgVeg, setOrgVeg] = useState([]);
  const name = watch("name");
  const address = watch("address");
  const date = watch("date");
  const bill_number = watch("bill_number");
  const navigate = useNavigate();
  const [currentDropdownId, setCurrentDropdownId] = useState(null);

  useEffect(() => {
    async function getCustomer() {
      await axiosInstance
        .get(`/customer/${custId}`)
        .then((res) => {
          if (operation === "edit") {
            setVeges(res?.data?.customer?.vegetables);
          }
          setOrgVeg(res?.data?.customer?.vegetables);
          setValue("name", res?.data?.customer?.username);
          setValue("phone", res?.data?.customer?.phone);
          setValue("address", res?.data?.customer?.address);

          if (operation === "generate_bill") {
            const currentDate = new Date().toISOString().split("T")[0];
            setValue("date", currentDate);
          }
        })
        .catch((err) => {});
    }

    async function getBill() {
      await axiosInstance
        .get(`/bill/${billId}/${custId}`)
        .then((res) => {
          setVeges(res?.data?.bill?.vegetables);
          setOrgVeg(res?.data?.all_vegetables);
          setValue("name", res?.data?.bill?.customer?.username);
          setValue("phone", res?.data?.bill?.customer?.phone);
          setValue("address", res?.data?.bill?.customer?.address);
          const formattedDate = res?.data?.bill?.date
            ? new Date(res.data.bill.date).toISOString().split("T")[0]
            : "";
          setValue("date", formattedDate);
          setValue("bill_number", res?.data?.bill?.bill_number);
        })
        .catch((err) => {});
    }

    if (billId) {
      getBill();
      return;
    }

    if (custId) getCustomer();

    if (operation === "generate_bill") {
      // setValue("bill_number", res?.data?.bill?.bill_number);

      const now = new Date();
      const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed
      const year = now.getFullYear();

      // Generate a random 3-digit number
      const randomNum = Math.floor(Math.random() * 900) + 100; // Random number between 100 and 999

      // Create the string in the required format
      return setValue("bill_number", `NGV/${month}-${year}/${randomNum}`);
    }
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

  async function handleRemove(id) {
    if (operation === "generate_bill" || billId) {
      setVeges((prev) => prev.filter((veg) => veg._id !== id));
      toast.success("Vegetable removed");
    } else {
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
        price: parseFloat(data.price_per_kg),
        quantity: parseFloat(data.quantity),
      };

      await axiosInstance
        .post("/vegetable", d)
        .then(async (res) => {
          if (res.status === 200) {
            setVeges((prev) => prev.filter((veg) => veg._id !== 0));
            setVeges((prev) => [...prev, res?.data?.vegetable]);
            setOrgVeg((prev) => [...prev, res?.data?.vegetable]);

            // if editing a bill - save vege to that bill
            if (billId) {
              await edit_bill({}, "add_veg_in_bill");
            }
            toast.success(res?.data?.msg);
            setIsAdd(false);
          }
        })
        .catch(async (err) => {
          if (err.response.status == 400) {
            setVeges((prev) => {
              const isDuplicate = prev.some(
                (veg) =>
                  veg.name.toLowerCase() === data.name.toLowerCase() &&
                  veg._id !== 0
              );

              if (isDuplicate) {
                toast.error("This vegetable is already added!");
                return prev.filter((veg) => veg._id !== 0);
              } else {
                toast.success("Vegetable added");
                return prev.map((veg) =>
                  veg._id === 0
                    ? { ...veg, _id: err.response.data.vegetable._id }
                    : veg
                );
              }
            });

            // if editing a bill - save vege to that bill
            if (billId) {
              await edit_bill({}, "add_veg_in_bill");
            }
          }
        });
    } else {
      const d = {
        veg_id: data._id,
        name: data.name,
        price: parseFloat(data.price_per_kg),
        quantity: parseFloat(data.quantity),
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

  async function edit_bill(data, str) {
    var d;
    if (str === "save_bill") {
      d = {
        vegetables: veges,
        total_amount: total,
        date: data.date,
        bill_number: data.bill_number,
      };
    } else {
      d = {
        vegetables: veges,
        total_amount: total,
      };
    }

    await axiosInstance
      .put(`bill/${billId}`, d)
      .then((res) => {
        if (str === "save_bill") {
          setLoad(false);
          toast.success(res?.data?.msg);
          generatePDF(targetRef, {
            filename: `${data.name}_${new Date(data.date).toLocaleDateString(
              "en-GB"
            )}_invoice.pdf`,
          });
        }
      })
      .catch((err) => {
        setLoad(false);
        toast.error(err?.response?.data?.msg);
      });

    return;
  }

  async function onSubmit(data) {
    var upd_data;

    setLoad(true);

    if (custId) {
      // edit customer
      if (operation === "edit") {
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
      if (operation === "generate_bill") {
        const bill_data = {
          cust_id: custId,
          cust_vegetables: veges,
          total,
          date: data.date,
          bill_number: data.bill_number,
        };

        await axiosInstance
          .post(`bill`, bill_data)
          .then((res) => {
            setLoad(false);
            if (res.status === 200) {
              toast.success(res?.data?.msg);
              generatePDF(targetRef, {
                filename: `${data.name}_${new Date(
                  data.date
                ).toLocaleDateString("en-GB")}_invoice.pdf`,
              });
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
        await edit_bill(data, "save_bill");
      }
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
            navigate("/customer");
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
        <div className="bg-slate-100 w-11/12 sm:max-w-lg px-4 py-8 my-8 rounded-xl flex flex-col">
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="text-lg font-bold text-center mb-4">
              Customer Details
            </p>
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

            {(operation === "generate_bill" || billId) && (
              <div className="mb-4">
                <label className="text-gray-800">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                  placeholder="dd-mm-yyyy"
                  {...register("date", { required: true })}
                />
                {errors.date && (
                  <span className="text-red-600">This is a required field</span>
                )}
              </div>
            )}

            {(operation === "generate_bill" || billId) && (
              <div className="mb-4">
                <label className="text-gray-800">Bill Number</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 mt-1 rounded-lg focus:outline-none placeholder-gray-300"
                  placeholder="Enter Bill Number"
                  {...register("bill_number", { required: true })}
                />
                {errors.date && (
                  <span className="text-red-600">This is a required field</span>
                )}
              </div>
            )}

            {custId && (
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
                          <div
                            className="flex items-center w-full gap-x-2 my-2"
                            key={data._id}
                          >
                            <div className="w-full flex flex-col">
                              <label className="pointer-events-none text-[10px]">
                                Vegetable
                              </label>
                              <ReactSearchAutocomplete
                                showIcon={false}
                                items={orgVeg}
                                placeholder={data.name}
                                value={data.name}
                                onFocus={() => setCurrentDropdownId(data._id)}
                                onBlur={() => setCurrentDropdownId(null)}
                                onSearch={(inputValue) => {
                                  const foundItem = veges.find(
                                    (veg) =>
                                      veg?.name?.toLowerCase() ===
                                      inputValue?.toLowerCase()
                                  );
                                  if (!foundItem) {
                                    handleOnChange(data._id, "name", {
                                      target: { value: inputValue },
                                    });
                                  }
                                }}
                                onSelect={(item) => {
                                  handleOnChange(data._id, "name", {
                                    target: { value: item.name },
                                  });
                                  handleOnChange(data._id, "quantity", {
                                    target: { value: "" },
                                  });
                                  handleOnChange(data._id, "price_per_kg", {
                                    target: { value: item.price_per_kg },
                                  });
                                }}
                                styling={{
                                  height: "40px",
                                  borderRadius: "8px",
                                  backgroundColor: "white",
                                  boxShadow: "none",
                                  color: "black",
                                  fontSize: "16px",
                                  iconColor: "gray",
                                  clearIconMargin: "0 4px 0 0",
                                  borderColor: "#d1d5db",
                                  placeholderColor: "black",
                                  zIndex:
                                    currentDropdownId === data._id ? 50 : 10,
                                  position: "relative",
                                }}
                              />
                            </div>
                            <div className="w-full flex flex-col">
                              <label className="text-[10px]">KGs</label>
                              <input
                                type="text"
                                placeholder="KGs"
                                value={data?.quantity}
                                required
                                className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 rounded-lg focus:outline-none placeholder-gray-300"
                                onChange={(e) =>
                                  handleOnChange(data._id, "quantity", e)
                                }
                              />
                            </div>
                            <div className="w-full flex flex-col">
                              <label className="pointer-events-none text-[10px]">
                                Price
                              </label>
                              <input
                                type="text"
                                placeholder="price per KG"
                                value={data?.price_per_kg}
                                required
                                onChange={(e) =>
                                  handleOnChange(data._id, "price_per_kg", e)
                                }
                                className="w-full border border-gray-300 bg-[ffffff] py-2 px-4 rounded-lg focus:outline-none placeholder-gray-300"
                              />
                            </div>
                            {operation === "edit" && (
                              <div
                                className="rounded-full cursor-pointer"
                                title="Edit"
                                onClick={() => {
                                  handleEditVeg(data._id);
                                }}
                              >
                                <RiPencilFill size={32} />
                              </div>
                            )}
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
                            {/* {index !== 0 && ( */}
                            <div
                              className="rounded-full cursor-pointer"
                              title="Remove"
                              onClick={() => {
                                handleRemove(data._id);
                              }}
                            >
                              <IoIosRemoveCircle size={32} />
                            </div>
                            {/* )} */}
                          </div>
                          {(actionId === data._id ||
                            (isAdd && data._id === 0)) && (
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

            {custId && (
              <p className="font-bold text-lg my-4">
                Total Amount: {total.toFixed(2)}
              </p>
            )}

            <button
              disabled={load}
              type="submit"
              className="w-full rounded-lg py-2 bg-cyan-400 hover:bg-cian-600 mt-4 text-white font-bold hover:bg-cyan-700 cursor-pointer disabled:cursor-none disabled:bg-gray-400"
            >
              {billId
                ? "Edit Bill"
                : operation === "generate_bill"
                ? "Generate Bill"
                : operation === "edit"
                ? "Save Details"
                : "Add Customer"}
            </button>
          </form>
        </div>
      </div>

      <div className="opacity-0">
        <div
          ref={targetRef}
          style={{
            width: "1152px",
            margin: "auto",
            backgroundColor: "#fff",
          }}
        >
          <Pdf
            vegetables={veges}
            total={total}
            name={name}
            address={address}
            date={date}
            bill_number={bill_number}
          />
        </div>
      </div>
    </>
  );
}

export default Form;
