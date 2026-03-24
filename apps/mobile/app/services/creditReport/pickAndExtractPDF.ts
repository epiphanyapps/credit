/**
 * PDF picking and text extraction for credit reports.
 *
 * Uses expo-document-picker to select PDF files and
 * expo-pdf-text-extract for on-device text extraction.
 */

import * as DocumentPicker from "expo-document-picker"
import { extractText } from "expo-pdf-text-extract"

import type { Bureau } from "@credit/shared"
import { detectBureau } from "./parseCreditReport"

export interface ExtractedReport {
  text: string
  bureau: Bureau
  fileName: string
  uri: string
}

/**
 * Let user pick a credit report PDF and extract its text content.
 * Returns the extracted text and detected bureau, or null if cancelled.
 */
export async function pickAndExtractPDF(): Promise<ExtractedReport | null> {
  // Let user pick a PDF file
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/pdf",
    copyToCacheDirectory: true,
  })

  if (result.canceled || !result.assets?.[0]) {
    return null
  }

  const asset = result.assets[0]
  const uri = asset.uri
  const fileName = asset.name ?? "credit-report.pdf"

  // Extract text from PDF on device
  const fullText = await extractText(uri)

  if (!fullText.trim()) {
    throw new Error(
      "Could not extract text from this PDF. It may be a scanned document. " +
        "Please try downloading a digital copy from annualcreditreport.com.",
    )
  }

  // Auto-detect which bureau this report is from
  const bureau = detectBureau(fullText)

  return {
    text: fullText,
    bureau,
    fileName,
    uri,
  }
}
