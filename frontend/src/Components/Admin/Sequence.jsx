import { useEffect, useState } from 'react';
import { IoIosAddCircle, IoIosRemoveCircle } from 'react-icons/io';
import { RiPencilFill } from 'react-icons/ri';
import DeleteDialog from '../../Utils/DeleteDialog';
import axiosInstance from '../../Utils/axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Sequence() {
  const [vegetables, setVegetables] = useState([{ english_name: '', hindi_name: '', order: 1 }]);
  const [editId, setEditId] = useState(0);
  const [deleteId, setDeleteId] = useState(0);
  const [open, setOpen] = useState(false);
  const [orgVegetables, setOrgVegetables] = useState([]);

  useEffect(() => {
    async function getVegetables() {
      await axiosInstance
        .get('/sequence')
        .then((res) => {
          setVegetables(res.data.vegetables);
          setOrgVegetables(res.data.vegetables);
          if (res.data.vegetables.length > 0) setEditId(-1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getVegetables();
  }, []);

  const addVegetable = (index) => {
    setEditId(index + 1);
    setVegetables([
      ...vegetables,
      { english_name: '', hindi_name: '', order: vegetables.length + 1 },
    ]);
  };
  const removeVegetable = () => {
    const updated = vegetables.filter((_, i) => i !== deleteId);
    setVegetables(updated);
    setOpen(false);
  };
  const editVegetable = (index) => {
    setEditId(index);
  };
  const handleChange = (index, field, value) => {
    const updated = vegetables.map((veg, i) => (i === index ? { ...veg, [field]: value } : veg));
    setVegetables(updated);
  };
  const saveVegetables = async () => {
    try {
      const response = await axiosInstance.post('/sequence', {
        vegetables,
      });
      toast.success(response.data.msg);
    } catch (err) {
      toast.error(err?.response?.data?.msg);
    }
  };
  return (
    <>
      <div className="flex flex-col h-[82vh]">
        <div className="grow">
          {vegetables.length > 0 ? (
            vegetables.map((veg, index) => (
              <div key={index} className="flex items-center gap-x-3 pt-6">
                <div className="w-full flex flex-col">
                  <label className="text-[10px]">English Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    required
                    className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:outline-none placeholder-gray-300 focus:border-indigo-500"
                    value={veg.english_name}
                    readOnly={editId == index ? false : true}
                    onChange={(e) => handleChange(index, 'english_name', e.target.value)}
                  />
                </div>
                <div className="w-full flex flex-col">
                  <label className="text-[10px]">Hindi Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    required
                    className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:outline-none placeholder-gray-300 focus:border-indigo-500"
                    readOnly={editId == index ? false : true}
                    value={veg.hindi_name}
                    onChange={(e) => handleChange(index, 'hindi_name', e.target.value)}
                  />
                </div>
                <div className="w-full flex flex-col">
                  <label className="text-[10px]">Order</label>
                  <input
                    inputMode="decimal"
                    type="tel"
                    required
                    className="w-full border border-gray-300 py-2 px-4 rounded-lg focus:outline-none placeholder-gray-300 focus:border-indigo-500"
                    readOnly={editId == index ? false : true}
                    value={veg.order}
                    onChange={(e) => handleChange(index, 'order', Number(e.target.value))}
                  />
                </div>
                <div className="rounded-full cursor-pointer" title="Edit">
                  <RiPencilFill size={32} onClick={() => editVegetable(index)} />
                </div>
                {index + 1 == vegetables.length ? (
                  <div className="rounded-full cursor-pointer" title="Add New">
                    <IoIosAddCircle size={32} onClick={() => addVegetable(index)} />
                  </div>
                ) : null}
                <div className="rounded-full cursor-pointer" title="Remove">
                  <IoIosRemoveCircle
                    size={32}
                    onClick={() => {
                      setDeleteId(index);
                      setOpen(true);
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <button
              className="py-2 px-4 text-sm text-white bg-gray-900 hover:bg-black transition-all rounded float-right"
              onClick={() => addVegetable(1)}
            >
              Add new
            </button>
          )}
        </div>
        <div className="flex justify-end gap-x-3 py-4">
          <button
            className="py-2 px-4 text-sm text-indigo-500 border border-indigo-500 transition-all rounded"
            onClick={() => {
              setVegetables(orgVegetables);
            }}
          >
            Cancel
          </button>
          <button
            className="py-2 px-4 text-sm text-white bg-indigo-500 hover:bg-indigo-600 transition-all rounded"
            onClick={saveVegetables}
          >
            Save
          </button>
        </div>
      </div>
      <DeleteDialog title="Vegetable" open={open} setOpen={setOpen} onClick={removeVegetable} />
    </>
  );
}
