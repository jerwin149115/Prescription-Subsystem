import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Prescriptions from "./components/prescriptions/Prescriptions";
import Information from "./components/Information/Information"; // Assume you have a component for this page

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Prescriptions />} />
                <Route path="/information/:id" element={<Information />} />
            </Routes>
        </Router>
    );
}

export default App;
