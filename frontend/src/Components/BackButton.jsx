import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router";

export default function BackButton(){

    const navigate = useNavigate();

    return <>
    <div className="rounded-full bg-slate-100 w-11 h-11 flex items-center justify-center ml-4 mt-4 cursor-pointer" onClick={()=>{navigate(-1)}}>
    <IoArrowBack size={32}/>
    </div>
    </>
}