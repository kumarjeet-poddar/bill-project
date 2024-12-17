import React from 'react';

export default function LedgerPdf(props) {
  const { customer, bills, total } = props;

  return (
    <div className="w-full px-4 pt-2 h-full">
      <div className="mx-auto m-4 border border-b-0 border-black">
        <table className="w-full">
          <tr className="w-full">
            <td className="w-1/2 border-b border-r border-black px-2 pb-2 text-sm">
              Sender's Details
            </td>
            <td className="w-1/2 border-b border-black px-2 pb-2 text-sm">Reciever's Details</td>
          </tr>

          <tr>
            <td className="w-1/2 border-b border-r border-black px-2 pb-2">
              <b>Supplier: </b>NARAYAN GREEN VEGETABLES
            </td>
            <td className="w-1/2 border-b border-black px-2 pb-2">
              <b>Customer: </b>
              {customer?.username}
            </td>
          </tr>

          <tr>
            <td className="w-1/2 border-b border-r border-black px-2 pb-2">
              <b>Warehouse Address:</b> Senapati Bapat Marg, Hawker Plaza Marg, Shop NO. 110, Dadar
              (West), Mum-400028
            </td>
            <td className="w-1/2 border-b border-black px-2 pb-2">
              <b>Address:</b> {customer?.address}
            </td>
          </tr>

          <tr>
            <td className="w-1/2 border-r border-b border-black px-2 pb-2">
              <b>Mob:</b> 9167267531 / 9987253372
            </td>

            <td className="border-b border-black w-1/2 px-2 pb-2">
              <b>Mob:</b> {customer?.phone}
            </td>
          </tr>
          <tr>
            <td className="w-1/2 border-r border-black px-2 pb-2 h-8"></td>
          </tr>
        </table>

        {/* Render Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border-t border-b border-black px-2 py-2 text-center w-[15%]">
                Sr. No
              </th>
              <th className="border border-r-0 border-black px-2 text-center w-[15%]">Date</th>
              <th className="border border-r-0 border-black px-2 text-center w-[15%]">Bill No.</th>
              <th className="border border-black px-2 text-center w-2/5">Description</th>
              <th className="border-t border-b border-black px-2 text-center w-[15%]">
                Amount (In Rs.)
              </th>
            </tr>
          </thead>
          <tbody>
            {bills.length > 0 &&
              bills.map((item, index) => (
                <tr key={index + 1} className="pb-2 w-full">
                  <td className="border-b border-r border-black px-2 pb-3 pt-1 text-center w-[15%]">
                    {index + 1}
                  </td>
                  <td className="border-b border-r border-black px-2 pb-3 pt-1 text-center w-[15%] capitalize">
                    {' '}
                    {item?.date && new Date(item?.date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="border-b border-r border-black px-2 pb-3 pt-1 text-center w-[15%]">
                    {item.bill_number}
                  </td>
                  <td className="border-b border-r border-black px-2 pb-3 pt-1 text-center w-2/5">
                    Indian, Exotic, Imported & Fruits Supplier
                  </td>
                  <td className="border-b border-black px-2 pb-3 pt-1 text-center w-[15%]">
                    {item.total_amount.toFixed(2)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="flex justify-between w-full py-3 px-4 font-bold border-b border-black">
          <p>Total Amount:</p>
          <p>Rs. {total?.toFixed(2)}</p>
        </div>

        <p className="px-4 font-medium py-2 border-t w-full border-black text-gray-700">
          Bank Details:
        </p>
        <table className="w-full p-2 font-bold" border={1}>
          <tr className="">
            <td className="border border-black border-l-0 p-2">Name:</td>
            <td className="border-t border-b border-black p-2">Narayan green vegetables</td>
          </tr>
          <tr className="">
            <td className="border border-black border-l-0 p-2">A/C:</td>
            <td className="border-t border-b border-black p-2">319201010042283 </td>
          </tr>
          <tr>
            <td className="border border-black border-l-0 p-2">IFSC Code: </td>
            <td className="border-t border-b border-black p-2">UBIN0531928</td>
          </tr>
          <tr>
            <td className="border border-black border-l-0 p-2">UPI number:</td>
            <td className="border-t border-b border-black p-2">9167267531</td>
          </tr>
          <tr>
            <td className="border-black border border-l-0 p-2">UPI ID:</td>
            <td className="border-t border-black p-2 border-b">narayanchoudhary83@uboi</td>
          </tr>
        </table>

        <div className="flex justify-end w-full pt-1 pb-20 px-6 font-bold border-b border-black">
          <p>For Narayan Green Vegetables</p>
        </div>
      </div>
    </div>
  );
}
