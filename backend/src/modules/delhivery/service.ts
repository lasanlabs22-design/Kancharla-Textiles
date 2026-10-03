import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import type {
  CalculatedShippingOptionPrice,
  CalculateShippingOptionPriceDTO,
  CreateFulfillmentResult,
  FulfillmentOption,
} from "@medusajs/framework/types"

type Options = {
  // Shipping charge as a percentage of the bag value. Owner rule: 5%.
  shippingPercent?: number
  apiToken?: string
  baseUrl?: string
  pickupLocation?: string
}

/**
 * Delhivery fulfillment provider.
 *
 * POC scope: prices "Standard Delivery" at a percentage of the bag value.
 * Next step: create waybills (AWB) and pull tracking scans from the Delhivery API.
 */
class DelhiveryProviderService extends AbstractFulfillmentProviderService {
  static identifier = "delhivery"

  protected options_: Options

  constructor(_container: Record<string, unknown>, options: Options) {
    super()
    this.options_ = options
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return [{ id: "delhivery-standard", name: "Standard Delivery (Delhivery)" }]
  }

  async validateFulfillmentData(
    _optionData: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return data
  }

  async validateOption(_data: Record<string, unknown>): Promise<boolean> {
    return true
  }

  async canCalculate(): Promise<boolean> {
    return true
  }

  async calculatePrice(
    _optionData: CalculateShippingOptionPriceDTO["optionData"],
    _data: CalculateShippingOptionPriceDTO["data"],
    context: CalculateShippingOptionPriceDTO["context"]
  ): Promise<CalculatedShippingOptionPrice> {
    const percent = this.options_.shippingPercent ?? 5
    const bagValue = (context.items ?? []).reduce(
      (sum, item) => sum + Number(item.unit_price ?? 0) * Number(item.quantity ?? 0),
      0
    )

    return {
      calculated_amount: Math.round((bagValue * percent) / 100),
      // Our prices are GST-inclusive, so the shipping charge is too.
      is_calculated_price_tax_inclusive: true,
    }
  }

  async createFulfillment(
    data: Record<string, unknown>
  ): Promise<CreateFulfillmentResult> {
    // TODO(delhivery): create the shipment, store the waybill and label URL.
    return { data, labels: [] }
  }

  async cancelFulfillment(): Promise<any> {
    return {}
  }

  async createReturnFulfillment(): Promise<CreateFulfillmentResult> {
    return { data: {}, labels: [] }
  }
}

export default DelhiveryProviderService
