import { Routes, Route } from "react-router-dom"
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import FeaturedEvents from "./components/FeaturedEvents"
import Concierge from "./components/Concierge"
import CategoryGrid from "./components/CategoryGrid"
import PageLoader from "./components/PageLoader"

export const App = () => {
  return (
    <PageLoader>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <Footer />
    </PageLoader>
  )
}

const LandingPage = () => {
  return (
    <>
      <Hero />
      <FeaturedEvents />
      <Concierge />
      <CategoryGrid />
    </>
  )
}

