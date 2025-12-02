
import { Registration } from "./components/Registration";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Registration />} />
        {/* Add other routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;
