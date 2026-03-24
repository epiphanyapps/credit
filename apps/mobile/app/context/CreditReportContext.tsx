import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react"
import { useMMKVString } from "react-native-mmkv"

import type { CreditReportItem } from "@credit/shared"
import type { ParsedCreditReport } from "@/services/creditReport"

export type CreditReportContextType = {
  /** The most recently parsed credit report */
  report: ParsedCreditReport | null
  /** Set the parsed report (after AI analysis) */
  setReport: (report: ParsedCreditReport) => void
  /** Clear the stored report */
  clearReport: () => void
  /** All flagged items across all imported reports */
  flaggedItems: CreditReportItem[]
  /** Dismiss a flagged item (user says it's accurate) */
  dismissItem: (itemId: string) => void
  /** Claude API key for report analysis */
  apiKey: string
  /** Set the Claude API key */
  setApiKey: (key: string) => void
}

export const CreditReportContext = createContext<CreditReportContextType | null>(null)

export const CreditReportProvider: FC<PropsWithChildren> = ({ children }) => {
  const [report, setReportState] = useState<ParsedCreditReport | null>(null)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const [storedApiKey, setStoredApiKey] = useMMKVString("CreditReport.apiKey")

  const setReport = useCallback((newReport: ParsedCreditReport) => {
    setReportState(newReport)
  }, [])

  const clearReport = useCallback(() => {
    setReportState(null)
    setDismissedIds(new Set())
  }, [])

  const flaggedItems = (report?.negativeItems ?? []).filter(
    (item) => !dismissedIds.has(item.id),
  )

  const dismissItem = useCallback((itemId: string) => {
    setDismissedIds((prev) => new Set(prev).add(itemId))
  }, [])

  const setApiKey = useCallback(
    (key: string) => {
      setStoredApiKey(key)
    },
    [setStoredApiKey],
  )

  const value: CreditReportContextType = {
    report,
    setReport,
    clearReport,
    flaggedItems,
    dismissItem,
    apiKey: storedApiKey ?? "",
    setApiKey,
  }

  return (
    <CreditReportContext.Provider value={value}>
      {children}
    </CreditReportContext.Provider>
  )
}

export const useCreditReport = () => {
  const context = useContext(CreditReportContext)
  if (!context) {
    throw new Error("useCreditReport must be used within a CreditReportProvider")
  }
  return context
}
