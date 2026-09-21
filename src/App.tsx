import { Routes, Route, useLocation } from "react-router-dom"
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import FeaturedEvents from "./components/FeaturedEvents"
import Concierge from "./components/Concierge"
import CategoryGrid from "./components/CategoryGrid"
import PageLoader from "./components/PageLoader"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import { useAuthStore } from "./store/authStore"
import { useEffect } from "react"
import About from "./pages/About"


const AUTH_ROUTES = ["/signin", "/signup"]


export const App = () => {

  const { pathname } = useLocation()
  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  const hydrate = useAuthStore((s) => s.hydrate)

    useEffect(() => {
        hydrate()
    }, [hydrate])


  return (
    <PageLoader>
      {!isAuthRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/about" element={<About />} />
      </Routes>
      {!isAuthRoute && <Footer />}
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

