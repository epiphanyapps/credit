/**
 * Credit Report PDF Parsing Service
 *
 * Extracts text from a credit report PDF and sends it to Claude API
 * for structured parsing into accounts, negative items, and inquiries.
 */

import type {
  Bureau,
  CreditReportItem,
  NegativeItemType,
} from "@credit/shared"

/** Structured output from AI parsing */
export interface ParsedCreditReport {
  bureau: Bureau
  personalInfo: {
    name: string
    address: string
    ssn: string // last 4 only
    dateOfBirth: string
  }
  accounts: ParsedAccount[]
  negativeItems: CreditReportItem[]
  inquiries: ParsedInquiry[]
  summary: {
    totalAccounts: number
    openAccounts: number
    closedAccounts: number
    negativeItemCount: number
    inquiryCount: number
  }
}

export interface ParsedAccount {
  creditorName: string
  accountNumber: string
  accountType: string // "credit card", "auto loan", "student loan", "mortgage", etc.
  status: string // "open", "closed", "collection", "charged off"
  balance: number
  creditLimit?: number
  paymentHistory: string // e.g. "CCCCCCCCCCCC" (current) or "CCC30CCCCCCC" (one 30-day late)
  dateOpened: string
  dateReported: string
  isNegative: boolean
  negativeReason?: string
}

export interface ParsedInquiry {
  creditorName: string
  date: string
  type: "hard" | "soft"
  bureau: Bureau
}

/**
 * The Claude API prompt for parsing credit report text.
 * This is the core of the AI-powered analysis.
 */
export function buildParsingPrompt(extractedText: string, bureau: Bureau): string {
  return `You are a credit report analysis expert. Parse the following credit report text from ${bureau} and extract structured data.

Return a JSON object with this exact structure:
{
  "personalInfo": {
    "name": "Full Name",
    "address": "Full Address",
    "ssn": "last 4 digits only",
    "dateOfBirth": "MM/DD/YYYY"
  },
  "accounts": [
    {
      "creditorName": "Name",
      "accountNumber": "partial number as shown",
      "accountType": "credit card|auto loan|student loan|mortgage|personal loan|collection|other",
      "status": "open|closed|collection|charged off|paid",
      "balance": 0,
      "creditLimit": 0,
      "paymentHistory": "string of payment codes",
      "dateOpened": "MM/YYYY",
      "dateReported": "MM/YYYY",
      "isNegative": false,
      "negativeReason": "reason if negative, null otherwise"
    }
  ],
  "inquiries": [
    {
      "creditorName": "Name",
      "date": "MM/DD/YYYY",
      "type": "hard|soft"
    }
  ],
  "flaggedItems": [
    {
      "creditorName": "Name",
      "accountNumber": "partial",
      "itemType": "inaccurate_info|collection|late_payment|hard_inquiry|outdated_item|personal_info_error",
      "disputeReason": "Specific reason this item should be disputed",
      "reportedBalance": 0,
      "dateReported": "MM/YYYY"
    }
  ]
}

Flag items for dispute if any of these conditions apply:
- Account is in collections
- Has late payments (30, 60, 90, 120+ days)
- Balance seems incorrect or inconsistent
- Item is older than 7 years from first delinquency (should have aged off)
- Duplicate entries for the same debt
- Account status is inconsistent (e.g., closed but showing balance)
- Hard inquiry that seems unauthorized or duplicative

Be thorough. Extract EVERY account and inquiry. Flag anything that could potentially be disputed.

CREDIT REPORT TEXT:
${extractedText}`
}

/**
 * Detect which bureau a credit report PDF is from based on text content.
 */
export function detectBureau(text: string): Bureau {
  const lower = text.toLowerCase()
  if (lower.includes("transunion") || lower.includes("trans union")) {
    return "transunion"
  }
  if (lower.includes("experian")) {
    return "experian"
  }
  if (lower.includes("equifax")) {
    return "equifax"
  }
  // Default to TransUnion (our priority bureau)
  return "transunion"
}

/**
 * Convert AI-parsed flagged items into CreditReportItem format.
 */
export function convertFlaggedItems(
  flaggedItems: Array<{
    creditorName: string
    accountNumber?: string
    itemType: string
    disputeReason: string
    reportedBalance?: number
    dateReported?: string
  }>,
  bureau: Bureau,
): CreditReportItem[] {
  return flaggedItems.map((item, index) => ({
    id: `${bureau}-${index}-${Date.now()}`,
    bureau,
    creditorName: item.creditorName,
    accountNumber: item.accountNumber,
    itemType: item.itemType as NegativeItemType,
    reportedBalance: item.reportedBalance,
    dateReported: item.dateReported,
    disputeReason: item.disputeReason,
    autoDetected: true,
  }))
}
