import './App.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import WhatsappIcon from './Components/Whatsapp Icon/WhatsappIcon';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import ShoopPage from './Pages/ShoopPage';
import Productsregister from './Pages/ProductsRegisterPage';
import PaymentPage from './Pages/PaymentPage';

import { AuthProvider } from './Components/AuthContext.js';


const HomePage = () => <Home></Home>;
const Shoop = () => <ShoopPage></ShoopPage>;
const RegisterPage = () => <Productsregister></Productsregister>;
const Payment = () => <PaymentPage></PaymentPage>

function App() {

  return (
    <Router>
      <AuthProvider>
          <div className="App">

            <Header></Header>

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shoop" element={<Shoop />} />
              <Route path="/RegisterPage" element={<RegisterPage />} />
              <Route path='/Payment' element={<Payment />}></Route>
            </Routes>

            <WhatsappIcon></WhatsappIcon>

            <Footer></Footer>

          </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
