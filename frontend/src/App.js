import Form from "./Components/Form";
import { Table } from "./Components/Table";
import Pdf from "./Components/PDF";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Table />} />
          <Route path="/customer" element={<Form />} />
          <Route path="/customer/:operation/:custId" element={<Form />} />
          <Route path="/customer_bill" element={<Pdf />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </>
  );
}

export default App;

// form me dropdown css
// click on customer - all bills table - name, amount, edit bill 2
// get bill page - same form 4
// add bill - on submitting form 5
// remove option in table 3
// edit bill from edit option
// remove generate option when editing details 1
// thorough testing