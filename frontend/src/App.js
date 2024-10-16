import Form from "./Components/Form";
import { Table } from "./Components/Table";
import Pdf from "./Components/PDF";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Customer from "./Components/Customer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Table />} />
          <Route path="/customer" element={<Form />} />
          <Route path="/customer/:operation/:custId" element={<Form />} />
          <Route path="/customer_bill" element={<Pdf />} />
          <Route path="/bills/:custId" element={<Customer />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </>
  );
}

export default App;

// form me dropdown css 3
// get bill page - same form 1
// edit bill from edit option 2
// thorough testing
