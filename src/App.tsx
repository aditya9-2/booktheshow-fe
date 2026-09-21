import { Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import FeaturedEvents from "./components/FeaturedEvents"
import Concierge from "./components/Concierge"
import CategoryGrid from "./components/CategoryGrid"
import PageLoader from "./components/PageLoader"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import About from "./pages/About"
import NotFound from "./pages/NotFound"
import { useAuthStore } from "./store/authStore"
import Events from "./pages/Events"
import EventDetail from "./pages/EventDetail"

const AUTH_ROUTES = ["/signin", "/signup"]

export const App = () => {
  const { pathname } = useLocation()
  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  const isLandingPage = pathname === "/"
  const hydrate = useAuthStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const content = (
    <>
      {!isAuthRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAuthRoute && <Footer />}
    </>
  )

  return isLandingPage ? <PageLoader>{content}</PageLoader> : content
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