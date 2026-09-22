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
import About from "./pages/About"
import NotFound from "./pages/NotFound"
import Events from "./pages/Events"
import EventDetail from "./pages/EventDetail"
import ProtectedRoute from "./components/ProtectedRoute"

import BookTickets from "./pages/BookTickets"
import MyBookings from "./pages/MyBookings"
import GuestOnlyRoute from "./components/GuestOnlyRoute"
import AdminPanel from "./pages/admin/AdminPanel"

const AUTH_ROUTES = ["/signin", "/signup"]

export const App = () => {
  const { pathname } = useLocation()
  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  const isLandingPage = pathname === "/"

  const content = (
    <>
      {!isAuthRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/signup"
          element={
            <GuestOnlyRoute>
              <SignUp />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <GuestOnlyRoute>
              <SignIn />
            </GuestOnlyRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />

        <Route
          path="/events/:id/book"
          element={
            <ProtectedRoute>
              <BookTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />


        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAuthRoute && <Footer />}
    </>
  )

  return isLandingPage ? <PageLoader>{content}</PageLoader> : content
}

const LandingPage = () => (
  <>
    <Hero />
    <FeaturedEvents />
    <Concierge />
    <CategoryGrid />
  </>
)