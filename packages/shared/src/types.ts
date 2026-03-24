/** Credit bureau identifiers */
export type Bureau = "equifax" | "experian" | "transunion"

/** Dispute round in the escalation ladder */
export type DisputeRound =
  | "round1_basic_dispute"
  | "round2_method_of_verification"
  | "round3_warning"
  | "round4_furnisher_dispute"
  | "cfpb_complaint"

/** Type of negative item on a credit report */
export type NegativeItemType =
  | "inaccurate_info"
  | "collection"
  | "late_payment"
  | "hard_inquiry"
  | "outdated_item"
  | "personal_info_error"

/** Status of a dispute */
export type DisputeStatus =
  | "draft"
  | "ready_to_send"
  | "sent"
  | "waiting_response"
  | "removed"
  | "verified"
  | "updated"
  | "escalated"

/** Letter template type */
export type LetterType =
  | "basic_dispute"
  | "method_of_verification"
  | "warning_intent_to_litigate"
  | "direct_furnisher_dispute"
  | "debt_validation"
  | "goodwill"
  | "pay_for_delete"

/** A negative item flagged on a credit report */
export interface CreditReportItem {
  id: string
  bureau: Bureau
  creditorName: string
  accountNumber?: string
  itemType: NegativeItemType
  reportedBalance?: number
  actualBalance?: number
  dateReported?: string
  dateOpened?: string
  disputeReason: string
  autoDetected: boolean
}

/** A dispute being tracked through the process */
export interface Dispute {
  id: string
  item: CreditReportItem
  currentRound: DisputeRound
  status: DisputeStatus
  letterType: LetterType
  dateSent?: string
  responseDeadline?: string
  responseReceived?: string
  trackingNumber?: string
  notes?: string
}

/** User profile for letter generation */
export interface UserProfile {
  fullName: string
  address: string
  city: string
  state: string
  zip: string
  ssnLast4: string
  dateOfBirth: string
}

/** Settlement negotiation details */
export interface Settlement {
  id: string
  collectionAgency: string
  originalCreditor?: string
  offeredAmount: number
  estimatedAgencyCost: number
  suggestedOffer: number
  agreedAmount?: number
  agreementInWriting: boolean
  datePaid?: string
  disputeAfterPayment?: string
}
