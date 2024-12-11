import { Link } from "react-router-dom";

export default function Home(){
    return <>

    <div className="flex flex-col justify-center items-center w-screen h-screen gap-y-4">
       <Link to="/ledger"><button className="border bg-slate-700 hover:bg-slate-800 transition-all text-slate-100 py-3 px-4 rounded-lg w-40">Ledger</button></Link>
       <Link to="/customer"><button className="border bg-slate-700 hover:bg-slate-800 transition-all text-slate-100 py-3 px-4 rounded-lg w-40">Customer Details</button></Link>
       <Link to="/quotation"><button className="border bg-slate-700 hover:bg-slate-800 transition-all text-slate-100 py-3 px-4 rounded-lg w-40">Quotation Form</button></Link>
    </div>
    </>
}