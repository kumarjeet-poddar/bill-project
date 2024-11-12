import Form from "./Components/Form";
import { Table } from "./Components/CustomersTable";
import Pdf from "./Components/PDF";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Customer from "./Components/CustomerBills";
import Home from "./Components/Home";
import { Ledger } from "./Components/Ledger";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customer" element={<Table />} />
          <Route path="/form" element={<Form />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/form/:operation/:custId" element={<Form />} />
          <Route path="/bill/:billId/:custId" element={<Form />} />
          <Route path="/pdf" element={<Pdf />} />
          <Route path="/bills/:custId" element={<Customer />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </>
  );
}

export default App;


// when generating a bill - in start no veges but if refresh page - state resets