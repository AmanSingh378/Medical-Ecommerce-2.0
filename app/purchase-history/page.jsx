
"use client"

import PurchaseHistory from "@/app/_components/PurchaseHistory";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import { useState } from "react";

// Note: In production, get userEmail from auth context/session/localStorage
// For demo, using a placeholder - replace with actual user email logic
const DemoEmail = "as2172025@gmail.com"; // Replace with real user email

export default function PurchaseHistoryPage() {
  const [userEmail] = useState(DemoEmail);

  return (
    <div suppressHydrationWarning>
      <Header />
      <main>
        <PurchaseHistory userEmail={userEmail} />
      </main>
      <Footer />
    </div>
  );
}

