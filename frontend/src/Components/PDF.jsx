import React from "react";
import vegetableList from "../Utils/vegetable.js";

export default function Pdf(props) {
  const { vegetables, total, name, address, bill_number, date } = props;
  return (
    <div
      className="mx-auto my-8 border border-black pt-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold border-b border-black pb-3">
          NARAYAN GREEN VEGETABLES
        </h1>
        <h2 className="text-xl font-semibold pb-3 border-b border-black uppercase">
          INDIAN, exotic, imported & Fruits supplies
        </h2>
        <p className="pb-2 border-black border-b">
          <b>Warehouse Add:</b> Senapati Bapat Marg, Hawker Plaza Marg, Shop NO.
          110, Dadar (West), Mum-400028
        </p>
        {/* <p className="border-black border-t border-b pb-2">
          <b className="p-0">Office Address:</b> Siddhivinayak Chawal, Gazadhar
          Bandh, Santacruz (West), Mumbai-400054
        </p> */}
        <p className="border-b border-black pb-2">
          <b>Mob:</b> 9167267531/9987253372 &nbsp; <b>E-Mail Id:</b>
          Narayachoudhary83@gmail.com
        </p>
      </div>

      {/* Invoice Information */}
      <div className="flex justify-between w-full">
        <div className="w-4/5">
          <p className="border-b border-black pt-3 pb-4 px-6 capitalize">
            BILL TO: <strong>{name}</strong>
          </p>
          <p className="pt-3 pb-4 px-6 capitalize">
            Address: <strong>{address}</strong>
          </p>
        </div>
        <div className="w-1/5 border-l border-black">
          <p className="border-b px-2 pb-4 pt-3 border-black">
            Invoice No: <strong>{bill_number}</strong>
          </p>
          <p className="px-2 pb-4 pt-3">
            Invoice Date:{" "}
            <strong>
              {date && new Date(date).toLocaleDateString("en-GB")}
            </strong>
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-0">
        <table className="w-full border-collapse border-b border-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="border-t border-b border-black px-2 pt-2 pb-3 text-lg text-center">
                Sr. No
              </th>
              <th className="border border-r-0 border-black px-2 pt-2 pb-3 text-center text-lg">
                Particulars
              </th>
              <th className="border border-r-0 border-black px-2 text-center text-lg">
                Total (Kg)
              </th>
              <th className="border border-black px-2 text-center text-lg">
                Per (Kg)
              </th>
              <th className="border-t border-b border-black px-2 text-center text-lg">
                Amount (In Rs.)
              </th>
            </tr>
          </thead>
          <tbody>
            {vegetables?.map((item, index) => (
              <tr key={index + 1} className="pb-2">
                <td className="border border-black px-2 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-black px-2 py-2 text-center">
                  {item.name} / {vegetableList[item?.name?.toLowerCase()]}
                </td>
                <td className="border border-black px-2 py-2 text-center">
                  {item.quantity}
                </td>
                <td className="border border-black px-2 py-2 text-center">
                  {item.price_per_kg}
                </td>
                <td className="border border-black px-2 py-2 text-center">
                  {item.quantity * item.price_per_kg}
                </td>
              </tr>
            ))}
            <tr className="py-4">
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
            </tr>
            <tr className="py-4">
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
            </tr>
            <tr className="py-4">
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
            </tr>
            <tr className="py-4">
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
            </tr>
            <tr className="py-4">
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
              <td className="border border-black px-2 py-4"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-between w-full py-3 px-6 font-bold">
        <p className="">Total Amount:</p>
        <p>Rs. {total}</p>
      </div>
    </div>
  );
}
