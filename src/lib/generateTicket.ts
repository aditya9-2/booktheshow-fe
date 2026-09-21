import jsPDF from "jspdf"
import QRCode from "qrcode"
import type { MyBooking } from "./types"

const formatFullDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })

const formatShortDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

export const generateTicketPDF = async (booking: MyBooking, email: string) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: [450, 250] })

    const primary: [number, number, number] = [14, 116, 144]
    const dark: [number, number, number] = [15, 23, 42]
    const gray: [number, number, number] = [110, 118, 130]

    // Main ticket body
    doc.setFillColor(...primary)
    doc.roundedRect(0, 0, 450, 250, 0, 0, "F")
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(10, 10, 430, 230, 10, 10, "F")

    // Perforation line
    doc.setDrawColor(220, 220, 220)
    doc.setLineDashPattern([4, 3], 0)
    doc.line(340, 10, 340, 240)
    doc.setFillColor(...primary)
    doc.circle(340, 10, 8, "F")
    doc.circle(340, 240, 8, "F")

    // Left section — event details
    doc.setTextColor(...primary)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.text("BOOKTHESHOW.", 28, 34)

    doc.setTextColor(...dark)
    doc.setFontSize(16)
    doc.text(booking.eventName, 28, 62, { maxWidth: 280 })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.setTextColor(...gray)
    doc.text(formatFullDate(booking.eventDate), 28, 84)

    doc.setDrawColor(230, 230, 230)
    doc.setLineDashPattern([], 0)
    doc.line(28, 100, 318, 100)

    // Helper functions for typography
    const labelProps = () => { doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(...gray); }
    const valueProps = () => { doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(...dark); }

    // Row 1: Section & Quantity
    labelProps()
    doc.text("SECTION", 28, 120)
    doc.text("QUANTITY", 120, 120)
    valueProps()
    doc.text(booking.sectionName, 28, 132, { maxWidth: 85 })
    doc.text(String(booking.quantity), 120, 132)

    // Row 2: Ticket holder
    labelProps()
    doc.text("TICKET HOLDER", 28, 156)
    valueProps()
    doc.text(email, 28, 168, { maxWidth: 200 })

    // Row 3: Booked on 
    labelProps()
    doc.text("BOOKED ON", 28, 192)
    valueProps()
    doc.text(`${formatShortDate(booking.createdAt)} · ${formatTime(booking.createdAt)}`, 28, 204, { maxWidth: 200 })

    // Insert QR Code
    try {
        const qrDataUrl = await QRCode.toDataURL(booking._id, {
            margin: 0,
            color: { dark: "#0f172a", light: "#ffffff" }
        })
        doc.addImage(qrDataUrl, "PNG", 255, 145, 65, 65)
    } catch (error) {
        console.error("Failed to generate QR code", error)
    }

    // Right stub
    doc.setTextColor(...dark)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("ADMIT ONE", 410, 220, { angle: 90 })

    doc.setFontSize(16)
    doc.text(`INR ${booking.priceAtBooking * booking.quantity}`, 380, 220, { angle: 90 })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.text(booking._id.slice(-10).toUpperCase(), 355, 220, { angle: 90 })

    doc.save(`${booking.eventName.replace(/\s+/g, "-").toLowerCase()}-ticket.pdf`)
}