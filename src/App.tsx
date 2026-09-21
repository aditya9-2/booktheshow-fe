import { Routes, Route } from "react-router-dom"
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"

export const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
      </Routes>
    </>
  )
}

