import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from "./OnBoardingPage/Pages/Index";
import Guest from "./OnBoardingPage/Pages/Guest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/guest" element={<Guest />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App