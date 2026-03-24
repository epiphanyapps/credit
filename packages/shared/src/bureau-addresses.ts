import type { Bureau } from "./types"

export interface BureauAddress {
  name: string
  disputeAddress: string
  city: string
  state: string
  zip: string
  phone: string
  onlineDispute: string
}

export const BUREAU_ADDRESSES: Record<Bureau, BureauAddress> = {
  equifax: {
    name: "Equifax Information Services LLC",
    disputeAddress: "P.O. Box 740256",
    city: "Atlanta",
    state: "GA",
    zip: "30374",
    phone: "1-800-864-2978",
    onlineDispute: "https://www.equifax.com/personal/credit-report-services/credit-dispute/",
  },
  experian: {
    name: "Experian",
    disputeAddress: "P.O. Box 4500",
    city: "Allen",
    state: "TX",
    zip: "75013",
    phone: "1-888-397-3742",
    onlineDispute: "https://www.experian.com/disputes/main.html",
  },
  transunion: {
    name: "TransUnion Consumer Solutions",
    disputeAddress: "P.O. Box 2000",
    city: "Chester",
    state: "PA",
    zip: "19016",
    phone: "1-800-916-8800",
    onlineDispute: "https://www.transunion.com/credit-disputes/dispute-your-credit",
  },
}

/** TransUnion first — cheapest to report to, most complete data */
export const BUREAU_PRIORITY: Bureau[] = ["transunion", "experian", "equifax"]
