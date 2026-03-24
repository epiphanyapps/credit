/**
 * AI-powered credit report analysis using Claude API.
 *
 * Takes extracted text from a credit report PDF and returns
 * structured data with flagged dispute candidates.
 */

import type { Bureau, CreditReportItem } from "@credit/shared"
import {
  buildParsingPrompt,
  convertFlaggedItems,
  type ParsedAccount,
  type ParsedCreditReport,
  type ParsedInquiry,
} from "./parseCreditReport"

// TODO: Move to environment config
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"

interface AnalyzeOptions {
  apiKey: string
  text: string
  bureau: Bureau
}

/**
 * Send extracted credit report text to Claude API for structured parsing.
 * Returns parsed report with flagged items for dispute.
 */
export async function analyzeReportWithAI(
  options: AnalyzeOptions,
): Promise<ParsedCreditReport> {
  const { apiKey, text, bureau } = options
  const prompt = buildParsingPrompt(text, bureau)

  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Claude API error: ${response.status} ${error}`)
  }

  const data = await response.json()
  const content = data.content?.[0]?.text

  if (!content) {
    throw new Error("No response from Claude API")
  }

  // Extract JSON from the response (it may be wrapped in markdown code blocks)
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Could not parse JSON from Claude API response")
  }

  const parsed = JSON.parse(jsonMatch[0])

  // Convert to our internal types
  const accounts: ParsedAccount[] = parsed.accounts ?? []
  const inquiries: ParsedInquiry[] = (parsed.inquiries ?? []).map(
    (inq: ParsedInquiry) => ({
      ...inq,
      bureau,
    }),
  )
  const negativeItems: CreditReportItem[] = convertFlaggedItems(
    parsed.flaggedItems ?? [],
    bureau,
  )

  return {
    bureau,
    personalInfo: parsed.personalInfo ?? {
      name: "",
      address: "",
      ssn: "",
      dateOfBirth: "",
    },
    accounts,
    negativeItems,
    inquiries,
    summary: {
      totalAccounts: accounts.length,
      openAccounts: accounts.filter((a) => a.status === "open").length,
      closedAccounts: accounts.filter((a) => a.status === "closed").length,
      negativeItemCount: negativeItems.length,
      inquiryCount: inquiries.filter((i) => i.type === "hard").length,
    },
  }
}
