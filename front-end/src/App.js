import './App.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import WhatsappIcon from './Components/Whatsapp Icon/WhatsappIcon';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import ShoopPage from './Pages/ShoopPage';
import AdministrationPage from './Pages/AdministrationPage';
import PaymentPage from './Pages/PaymentPage';
import ProtectedAdminRoute from './Components/ProtectedAdminRoute/ProtectAdminRoute.js';
import OrdersPage from './Pages/OrdersPage.js';

import { AuthProvider } from './Components/AuthContext.js';


const HomePage = () => <Home></Home>;
const Shoop = () => <ShoopPage></ShoopPage>;
const AdministerPage = () => <AdministrationPage></AdministrationPage>;
const Payment = () => <PaymentPage></PaymentPage>
const Orders = () => <OrdersPage></OrdersPage>

function App() {

  return (
    <Router>
      <AuthProvider>
          <div className="App">

            <Header></Header>

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shoop" element={<Shoop />} />
              <Route path="/orders" element={<Orders />} />
              <Route 
                path="/AdministerPage" 
                element={
                  <ProtectedAdminRoute>
                    <AdministerPage />
                  </ProtectedAdminRoute>
                } 
              />
              <Route path="/Payment" element={<Payment />} />
            </Routes>

            <WhatsappIcon></WhatsappIcon>

            <Footer></Footer>

          </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
