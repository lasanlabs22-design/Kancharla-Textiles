import { Metadata } from "next"

import AccountPageHeader from "@modules/account/components/account-page-header"
import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      {/* No returns at this store; cancellation (with owner approval) comes with the order-management step. */}
      <AccountPageHeader
        eyebrow="Orders"
        title="My orders"
        description="Track your orders and see their status."
      />
      {/* The starter's "transfer order" form is removed: every order is placed after OTP sign-in. */}
      <OrderOverview orders={orders} />
    </div>
  )
}
