import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PollsList from "./pages/PollsList";
import CreatePoll from "./pages/CreatePoll";
import PollDetails from "./pages/PollDetails";
import EditPoll from "./pages/EditPoll";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/polls" element={<PollsList />} />

        <Route path="/polls/new" element={<CreatePoll />} />

        <Route path="/polls/:id/edit" element={<EditPoll />} />

        <Route path="/polls/:id" element={<PollDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
