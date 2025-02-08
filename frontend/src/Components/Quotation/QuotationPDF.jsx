import React, { useEffect, useState } from 'react';
import { ToWords } from 'to-words';

const PAGE_ROW_LIMIT = 30;

export const truncateText = (text, maxLength = 15) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const paginateData = (data, rowsPerPage) => {
  const pages = [];

  for (let i = 0; i < data.length; i += rowsPerPage * 2) {
    const pageData = data.slice(i, i + rowsPerPage * 2);
    const column1 = pageData.slice(0, rowsPerPage);
    const column2 = pageData.slice(rowsPerPage);
    pages.push({ column1, column2 });
  }
  return pages;
};

export default function QuotationPdf(props) {
  const { vegetables, total, name, address, date, phone, quotation_number, title, discount } =
    props;

  const [discountedAmount, setDiscountedAmount] = useState(0);
  const toWords = new ToWords();

  useEffect(() => {
    if (discount) {
      const amountAfterDiscount = total - (total * discount) / 100;
      setDiscountedAmount(amountAfterDiscount);
    } else {
      setDiscountedAmount(total);
    }
  }, [total, discount]);

  const pages = paginateData(vegetables, PAGE_ROW_LIMIT);

  return (
    <div className="w-full px-4 pt-2 h-full">
      <div className="mx-auto m-4 border border-b-0 border-black">
        {pages.map((pageItems, pageIndex) => (
          <table className="w-full" key={pageIndex}>
            {pageIndex == 0 && (
              <>
                <tr className="w-full mt-8">
                  <td
                    className=" border-b border-black px-2 pb-5 font-bold text-lg text-center uppercase"
                    colSpan={12}
                  >
                    {title}
                  </td>
                </tr>
                <tr className="w-full">
                  <td
                    className="w-1/2 border-b border-r border-black px-2 pb-3 text-sm"
                    colspan={6}
                  >
                    Sender's Details
                  </td>
                  <td className="w-1/2 border-b border-black px-2 pb-3 text-sm" colspan={6}>
                    Reciever's Details
                  </td>
                </tr>

                <tr>
                  <td className="w-1/2 border-b border-r border-black px-2 pb-3" colspan={6}>
                    <b>Supplier: </b>NARAYAN GREEN VEGETABLES
                  </td>
                  <td className="w-1/2 border-b border-black px-2 pb-3" colspan={6}>
                    <b>Reciever: </b>
                    {name}
                  </td>
                </tr>

                <tr>
                  <td className="w-1/2 border-b border-r border-black px-2 pb-3" colspan={6}>
                    <b>Warehouse Address:</b> Senapati Bapat Marg, Hawker Plaza Marg, Shop NO. 110,
                    Dadar (West), Mum-400028
                  </td>
                  <td className="w-1/2 border-b border-black px-2 pb-3" colspan={6}>
                    <b>Address:</b> {address}
                  </td>
                </tr>

                <tr>
                  <td className="w-1/2 border-r border-b border-black px-2 pb-3" colspan={6}>
                    <b>Mob:</b> 9167267531 / 9987253372
                  </td>

                  <td className="border-b border-black w-1/2 px-2 pb-3" colspan={6}>
                    <b>Mob:</b> {phone}
                  </td>
                </tr>
                <tr>
                  <td className="w-1/2 border-r border-b border-black px-2 pb-3 h-8" colspan={6}>
                    <b>Date:</b> {new Date(date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="w-1/2 border-black px-2 pb-3 h-8 border-b" colspan={6}>
                    <b>Quotation number:</b> {quotation_number}
                  </td>
                </tr>
                <tr>
                  <td className="w-1/2 border-r border-black px-2 pb-3 h-8" colspan={6}></td>
                </tr>

                <tr className="bg-gray-200">
                  <th className="border-t border-b text-sm border-black px-2 pt-2 pb-3 text-center">
                    S. No.
                  </th>
                  <th className="border border-r-0 border-black px-2 pt-2 pb-3 text-center text-sm">
                    Item
                  </th>
                  <th className="border border-black px-2 text-center pt-2 pb-3 text-sm">
                    Quanity
                  </th>
                  <th className="border border-black px-2 text-center pt-2 pb-3 text-sm">Unit</th>
                  <th className="border border-x-0 border-black px-2 text-center pt-2 pb-3 text-sm">
                    Price
                  </th>
                  <th className="border border-black px-2 text-center pt-2 pb-3 text-sm">Amount</th>

                  <th className="border-t border-b border-black px-2 pt-2 pb-3 text-center text-sm">
                    S. No.
                  </th>
                  <th className="border border-r-0 border-black px-2 pt-2 pb-3 text-center text-sm">
                    Item
                  </th>
                  <th className="border border-black px-2 text-center pt-2 pb-3 text-sm">
                    Quanity
                  </th>
                  <th className="border border-black px-2 text-center pt-2 pb-3 text-sm">Unit</th>
                  <th className="border-y border-black px-2 text-center pt-2 pb-3 text-sm">
                    Price
                  </th>
                  <th className="border border-r-0 border-black px-2 text-center pt-2 pb-3 text-sm">
                    Amount
                  </th>
                </tr>
              </>
            )}

            {Array.from({
              length: Math.max(pageItems.column1.length, pageItems.column2.length),
            }).map((_, rowIndex) => {
              const firstColumnSerialNumber = rowIndex + 1 + pageIndex * PAGE_ROW_LIMIT * 2;
              const secondColumnSerialNumber = pageItems.column2[rowIndex]
                ? firstColumnSerialNumber + PAGE_ROW_LIMIT
                : '';

              return (
                <tr key={rowIndex} className="w-full">
                  <td className="border-b border-r border-black px-2 text-center pb-3 pt-1 w-[6%]">
                    {firstColumnSerialNumber}
                  </td>
                  <td className="border-b border-r border-black px-2 font-semibold capitalize pb-3 pt-1 w-[24%] text-center">
                    {truncateText(pageItems.column1[rowIndex]?.name || '')}
                  </td>
                  <td className="border-b border-r border-black px-2 font-semibold pb-3 text-center pt-1 w-[5%]">
                    {pageItems.column1[rowIndex]?.quantity || ''}
                  </td>
                  <td className="border-b border-r border-black px-2 pb-3 pt-1 w-[5%] text-center">
                    {pageItems.column1[rowIndex]?.unit || ''}
                  </td>
                  <td className="border-b border-r border-black px-2 font-semibold pb-3 pt-1 w-[5%] text-center">
                    {pageItems.column1[rowIndex]?.price_per_kg || ''}
                  </td>
                  <td className="border-b border-r border-black px-2 font-semibold pb-3 pt-1 w-[5%] text-center">
                    {pageItems.column1[rowIndex]?.quantity &&
                    pageItems.column1[rowIndex]?.price_per_kg
                      ? (
                          pageItems.column1[rowIndex]?.quantity *
                          pageItems.column1[rowIndex]?.price_per_kg
                        ).toFixed(0)
                      : ''}
                  </td>
                  <td className="border-b border-r border-black px-2 text-center pb-3 pt-1 w-[6%]">
                    {secondColumnSerialNumber}
                  </td>
                  <td className="border-b border-r border-black px-2 text-center font-semibold capitalize pb-3 pt-1 w-[24%]">
                    {truncateText(pageItems.column2[rowIndex]?.name || '')}
                  </td>
                  <td className="border-b border-r border-black px-2 text-center font-semibold pb-3 pt-1 w-[5%]">
                    {pageItems.column2[rowIndex]?.quantity || ''}
                  </td>
                  <td className="border-b border-r border-black px-2 pb-3 pt-1 text-center w-[5%]">
                    {pageItems.column2[rowIndex]?.unit || ''}
                  </td>
                  <td className="border-b border-r border-black px-2 text-center font-semibold pb-3 pt-1 w-[5%]">
                    {pageItems.column2[rowIndex]?.price_per_kg || ''}
                  </td>
                  <td className="border-b border-black px-2 text-center font-semibold pb-3 pt-1 w-[5%]">
                    {pageItems.column2[rowIndex]?.quantity &&
                    pageItems.column2[rowIndex]?.price_per_kg
                      ? (
                          pageItems.column2[rowIndex]?.quantity *
                          pageItems.column2[rowIndex]?.price_per_kg
                        ).toFixed(0)
                      : ''}
                  </td>
                </tr>
              );
            })}

            {pageIndex == pages.length - 1 && (
              <>
                <tr className="w-full">
                  <td className="px-2 font-medium py-2 border-t border-black" colSpan={6}>
                    Bank Details:
                  </td>
                  <td
                    className="w-1/2 border border-black border-r-0 border-b-0 text-right px-2 pb-3 h-8 font-bold"
                    colspan={6}
                  >
                    Total Amount:{' '}
                    {toWords.convert(Math.round(discountedAmount), { currency: true })}
                  </td>
                </tr>
                <tr className="">
                  <td className="border border-black border-l-0 p-2" colspan={6}>
                    Name: Narayan green vegetables
                  </td>
                  <td
                    className="w-1/2 px-4 pb-3 h-8 text-right font-bold border border-x-0 border-black"
                    colspan={6}
                  >
                    {discount ? `Subtotal: Rs.${Math.round(total)}` : null}
                  </td>
                </tr>
                <tr className="">
                  <td className=" border-black border-r p-2 border-b" colspan={6}>
                    A/C: 319201010042283
                  </td>
                  <td className="border-b border-black p-2 text-right font-bold" colspan={6}>
                    {discount ? `Discount: ${discount}%` : null}
                  </td>
                </tr>
                <tr>
                  <td className="border-r border-black p-2 border-b" colspan={6}>
                    IFSC Code: UBIN0531928
                  </td>
                  <td className="border-b border-black p-2 text-right font-bold" colspan={6}>
                    Final Amount: Rs.{discountedAmount.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="border-r border-black p-2 border-b" colspan={6}>
                    UPI number: 9167267531
                  </td>
                  <td
                    className=" border-black px-2 border-b text-right align-text-top font-bold"
                    rowSpan={2}
                    colspan={6}
                  >
                    For Narayan Green Vegetables
                  </td>
                </tr>
                <tr>
                  <td className="border-black border-r p-2 border-b" colspan={6}>
                    UPI ID: narayanchoudhary83@uboi
                  </td>
                </tr>
              </>
            )}
          </table>
        ))}
      </div>
    </div>
  );
}

//ask to order by sequence ?
