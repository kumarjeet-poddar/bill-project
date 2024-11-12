import React from "react";
import vegetableList from "../Utils/vegetable.js";

export default function Pdf(props) {
  const { vegetables, total, name, address, bill_number, date } = props;
  return (
    <div className="max-w-6xl mx-auto my-8 border border-black pt-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold border-b border-black pb-3">
          NARAYAN GREEN VEGETABLES & FRUITS SUPLIERS
        </h1>
        <h2 className="text-xl font-semibold pb-3 border-b border-black ">
          INDIAN & CHINESE
        </h2>
        <p>
          <b>Warehouse Add:</b> Senapati Bapat Marg, Hawker Plaza Marg, Shop NO.
          110, Dadar (West), Mum-400028
        </p>
        <p>
          <b>Office Address:</b> Siddhivinayak Chawal, Gazadhar Bandh, Santacruz
          (West), Mumbai-400054
        </p>
        <p className="border-b border-black pb-2">
          <b>Mob:</b> 9167267531/9987253372 &nbsp; <b>E-Mail Id:</b>
          Narayachoudhary83@gmail.com
        </p>
      </div>

      {/* Invoice Information */}
      <div className="flex justify-between w-full">
        <div className="w-full">
          <p className="border-b border-black pt-3 pb-4 px-6 capitalize">
            BILL TO: <strong>{name}</strong>
          </p>
          <p className=" border-black pt-3 pb-4 px-6 capitalize">
            Address: <strong>{address}</strong>
          </p>
        </div>
        <div className="">
          <p className="border-b border-l pl-2 pb-1 border-black">
            Invoice No: <strong>{bill_number}</strong>
          </p>
          <p className="border-l pl-2 border-black pb-1">
            Invoice Date:{" "}
            <strong>{date}</strong>
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-0">
        <table className="w-full border-collapse border-b border-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="border-t border-b border-black px-2 py-2">
                Sr. No
              </th>
              <th className="border border-r-0 border-black px-2 py-2">
                Particulars
              </th>
              <th className="border border-r-0 border-black px-2 py-2">
                Total (Kg)
              </th>
              <th className="border border-black px-2 py-2">Per (Kg)</th>
              <th className="border-t border-b border-black px-2 py-2">
                Amount (In Rs.)
              </th>
            </tr>
          </thead>
          <tbody>
            {vegetables?.map((item, index) => (
              <tr key={index + 1} className="pb-2">
                <td className="border border-black px-2 py-2">{index + 1}</td>
                <td className="border border-black px-2 py-2">
                  {item.name} / {vegetableList[item?.name?.toLowerCase()]}
                </td>
                <td className="border border-black px-2 py-2">
                  {item.quantity}
                </td>
                <td className="border border-black px-2 py-2">
                  {item.price_per_kg}
                </td>
                <td className="border border-black px-2 py-2">
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
