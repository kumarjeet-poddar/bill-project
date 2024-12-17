import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center w-screen h-screen gap-y-4">
        <Link to="/ledger">
          <button className="border bg-slate-700 hover:bg-slate-800 transition-all text-slate-100 py-3 px-4 rounded-lg w-48">
            Ledger
          </button>
        </Link>
        <Link to="/customer">
          <button className="border bg-slate-700 hover:bg-slate-800 transition-all text-slate-100 py-3 px-4 rounded-lg w-48">
            Customer Details
          </button>
        </Link>
        <Link to="/quotation/indian">
          <button className="border bg-slate-700 hover:bg-slate-800 transition-all text-slate-100 py-3 px-4 rounded-lg w-48">
            Quotation Form (Indian Vegetables)
          </button>
        </Link>
        <Link to="/quotation/exotic">
          <button className="border bg-slate-700 hover:bg-slate-800 transition-all text-slate-100 py-3 px-4 rounded-lg w-48">
            Quotation Form (Exotic Vegetables)
          </button>
        </Link>
      </div>
    </>
  );
}
