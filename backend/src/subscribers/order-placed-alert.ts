import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Owner alert for every new order: a notification in the admin console's bell.
 * Resend email to the owner is added in the email step.
 */
export default async function orderPlacedAlert({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notifications = container.resolve(Modules.NOTIFICATION)

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: ["id", "display_id", "total", "currency_code", "email", "shipping_address.first_name", "shipping_address.city"],
    filters: { id: data.id },
  })

  if (!order) {
    return
  }

  const amount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: order.currency_code.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(Number(order.total))

  const who = [order.shipping_address?.first_name, order.shipping_address?.city]
    .filter(Boolean)
    .join(", ")

  await notifications.createNotifications({
    to: "",
    channel: "feed",
    template: "admin-ui",
    data: {
      title: `New order #${order.display_id}`,
      description: `${amount}${who ? ` from ${who}` : ""}`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
