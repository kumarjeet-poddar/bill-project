import React from 'react';
import vegetableList from '../Utils/vegetable.js';

function splitIntoPages(items, itemsPerPage) {
  const pages = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage));
  }
  return pages;
}

export default function Pdf(props) {
  const { vegetables, total, name, address, bill_number, date, showBank, billCopyType } = props;

  const itemsPerPage = 32;

  // Split the vegetables array into pages
  const pages = splitIntoPages(vegetables, itemsPerPage);

  return (
    <div className="w-full px-4 pt-2 h-full">
      <div className="mx-auto m-4 border border-black">
        {/* Loop through each page */}
        {pages.map((pageItems, pageIndex) => (
          <div
            key={pageIndex}
            style={{
              pageBreakAfter: pageIndex === pages.length - 1 ? 'auto' : 'always',
            }}
          >
            {/* Show header only on the first page */}

            {pageIndex === 0 && (
              <div className="text-center">
                <h1 className="text-2xl font-bold border-b border-black pb-3 relative">
                  NARAYAN GREEN VEGETABLES
                  <span className="font-semibold text-base absolute top-[10px] right-4">
                    {billCopyType === 'duplicate' ? '(Customer Copy)' : '(Original Copy)'}
                  </span>
                </h1>
                <h2 className="text-xl font-semibold pb-3 border-b border-black uppercase">
                  INDIAN, Exotic, Imported & Fruits Supplier
                </h2>
                <p className="pb-2 border-black border-b">
                  <b>Warehouse Address:</b> Senapati Bapat Marg, Hawker Plaza Marg, Shop NO. 110,
                  Dadar (West), Mum-400028
                </p>
                <p className="border-b border-black pb-2">
                  <b>Mob:</b> 9167267531 / 9987253372 &nbsp; <b>E-Mail:</b>{' '}
                  narayanchoudhary83@gmail.com
                </p>

                {/* Invoice Information */}
                <div className="flex justify-between w-full">
                  <div className="w-3/4">
                    <p className="pt-2 pb-3 border-b border-black  px-6 capitalize text-left">
                      BILL TO: <strong>{name}</strong>
                    </p>
                    <p className="pt-2 pb-3 px-6 capitalize text-left">
                      Address: <strong>{address}</strong>
                    </p>
                  </div>
                  <div className="w-1/4 border-l border-black">
                    <p className="border-b px-2 pb-3 pt-2 border-black text-left">
                      Invoice No: <strong>{bill_number}</strong>
                    </p>
                    <p className="px-2 pb-3 pt-2 text-left">
                      Invoice Date:{' '}
                      <strong>{date && new Date(date).toLocaleDateString('en-GB')}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Render Table */}
            <table className="w-full border-collapse border-b border-black">
              {pageIndex === 0 && (
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
                    <th className="border border-black px-2 text-center text-lg">Per (Kg)</th>
                    <th className="border-t border-b border-black px-2 text-center text-lg">
                      Amount (In Rs.)
                    </th>
                  </tr>
                </thead>
              )}
              <tbody>
                {pageItems.map((item, index) => (
                  <tr key={index + 1} className="pb-2 w-full">
                    <td className="border border-black border-l-0 px-2 pb-3 pt-1 text-center w-[15%]">
                      {index + 1 + pageIndex * itemsPerPage}
                    </td>
                    <td className="border border-black px-2 pb-3 pt-1 text-center text-[17px] w-2/5 capitalize font-bold">
                      {item.name} / {vegetableList[item?.name?.toLowerCase()]}
                    </td>
                    <td className="border border-black px-2 pb-3 pt-1 text-center w-[15%] font-bold">
                      {item.quantity}
                    </td>
                    <td className="border border-black px-2 pb-3 pt-1 text-center w-[15%] font-bold">
                      {item.price_per_kg}
                    </td>
                    <td className="border border-black border-r-0 px-2 pb-3 pt-1 text-center w-[15%] font-bold">
                      {(item.quantity * item.price_per_kg).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {pageIndex === pages.length - 1 && (
                  <>
                    <tr className="py-4">
                      <td className="border border-black px-2 py-4 border-l-0"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-r-0 border-black px-2 py-4"></td>
                    </tr>
                    <tr className="py-4">
                      <td className="border border-black px-2 py-4 border-l-0"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-r-0 border-black px-2 py-4"></td>
                    </tr>
                    <tr className="py-4">
                      <td className="border border-black px-2 py-4 border-l-0"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-r-0 border-black px-2 py-4"></td>
                    </tr>
                    <tr className="py-4">
                      <td className="border border-black px-2 py-4 border-l-0"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-r-0 border-black px-2 py-4"></td>
                    </tr>
                    <tr className="py-4">
                      <td className="border border-black px-2 py-4 border-l-0"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-black px-2 py-4"></td>
                      <td className="border border-r-0 border-black px-2 py-4"></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            {/* Total Amount (Only on last page) */}
            {pageIndex === pages.length - 1 && (
              <>
                <div className="flex justify-between w-full py-3 px-4 font-bold mb-4">
                  <p>Total Amount:</p>
                  <p>Rs. {Math.round(total)}</p>
                </div>

                {showBank && (
                  <>
                    <p className="px-4 font-medium py-2 border-t w-full border-black text-gray-700">
                      Bank Details:
                    </p>
                    <table className="w-full p-2 font-bold" border={1}>
                      <tr className="">
                        <td className="border border-black border-l-0 p-2">Name:</td>
                        <td className="border-t border-b border-black p-2">
                          Narayan green vegetables
                        </td>
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
                        <td className="border-black border-t border-r p-2">UPI ID:</td>
                        <td className="border-t border-black p-2">narayanchoudhary83@uboi</td>
                      </tr>
                    </table>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
