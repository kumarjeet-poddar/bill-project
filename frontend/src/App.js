import Form from './Components/Form';
import { Table } from './Components/CustomersTable';
import Pdf from './Components/PDF';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Customer from './Components/CustomerBills';
import Home from './Components/Home';
import { Ledger } from './Components/Ledger/Ledger';
import QuotationForm from './Components/Quotation/QuotationForm';
import Admin from './Components/Admin/Page';
import SampleHook from './Components/Admin/abc';

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

          <Route path="/quotation/:quotation_type" element={<QuotationForm />} />
          <Route path="/pdf" element={<Pdf />} />
          <Route path="/bills/:custId" element={<Customer />} />

          <Route path="/admin" element={<Admin />} />
          <Route path="/abc" element={<SampleHook />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </>
  );
}

export default App;
