import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';

import { AuthProvider } from './Components/AuthContext.js';


const HomePage = () => <Home></Home>;

function App() {

  return (
    <Router>
      <AuthProvider>
          <div className="App">

            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
