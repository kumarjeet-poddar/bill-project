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
          <Route path="/customer/:custId" element={<Form />} />
          <Route path="/customer_bill" element={<Pdf />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </>
  );
}

export default App;
