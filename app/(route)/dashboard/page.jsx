"use client";

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserListing from "./_components/UserListing"
import PurchaseHistory from "../../_components/PurchaseHistory";

function Dashboard() {
  const [userEmail] = React.useState("as2172025@gmail.com"); // Update with dynamic user email in production

  return (
    <div className="mt-16">
      <h2 className="font-bold text-2xl">Dashboard</h2>
      <Tabs defaultValue="listing" className="mt-5 ">
        <TabsList className="bg-linear-to-r from-yellow-400 to-yellow-500 text-black shadow-lg">
          <TabsTrigger value="listing" className='data-[state=active]:bg-yellow-300 data-[state=active]:text-black hover:bg-yellow-200'>Listing</TabsTrigger>
          <TabsTrigger value="purchase" className='data-[state=active]:bg-yellow-300 data-[state=active]:text-black hover:bg-yellow-200'>Purchase</TabsTrigger>
        </TabsList>
        <TabsContent value="listing">
          <UserListing/>
        </TabsContent>
        <TabsContent value="purchase">
          <PurchaseHistory userEmail={userEmail} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Dashboard

