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
import AdminOrdersPage from './Pages/OrdersPage.js';
import UserOrdersPage from './Pages/UserOrdersPage';


import { AuthProvider } from './Components/AuthContext.js';


const HomePage = () => <Home></Home>;
const Shoop = () => <ShoopPage></ShoopPage>;
const AdministerPage = () => <AdministrationPage></AdministrationPage>;
const Payment = () => <PaymentPage></PaymentPage>
const Orders = () => <AdminOrdersPage></AdminOrdersPage>
const UserOrders = () => <UserOrdersPage></UserOrdersPage>

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App"> {/* Este é o nosso container principal */}
          <Header />

          {/* ↓↓↓ CORREÇÃO AQUI ↓↓↓ */}
          {/* Envolvemos as rotas em uma tag <main> para separar o conteúdo principal */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shoop" element={<Shoop />} />
              <Route path="/my-orders" element={<UserOrders />} />
              <Route path="/AdministerPage" element={
                <ProtectedAdminRoute>
                  <AdministerPage />
                </ProtectedAdminRoute>
              }
              />
              <Route path="/admin/orders" element={
                <ProtectedAdminRoute>
                  <Orders />
                </ProtectedAdminRoute>
              }
              />
              <Route path="/Payment" element={<Payment />} />
            </Routes>
          </main>

            <WhatsappIcon></WhatsappIcon>

            <Footer></Footer>

          </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
