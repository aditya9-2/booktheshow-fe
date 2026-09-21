import { Routes, Route } from "react-router-dom"
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import FeaturedEvents from "./components/FeaturedEvents"
import Concierge from "./components/Concierge"

export const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <Footer />
    </>
  )
}

const LandingPage = () => {
  return (
    <>
      <Hero />
      <FeaturedEvents />
      <Concierge />
    </>
  )
}

