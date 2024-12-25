import './App.css';
import 'rsuite/dist/rsuite.min.css';
import { BrowserRouter, Routes, Route } from "react-router";
import domArr from './pages/routesConfig';
import FormLogin from './pages/login';

function App() {
    return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormLogin />} />
          {domArr}
      </Routes>
    </BrowserRouter>
    )
};


export default App;
