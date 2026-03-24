import { FC, useState } from "react"
import { ActivityIndicator, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useCreditReport } from "@/context/CreditReportContext"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { pickAndExtractPDF, analyzeReportWithAI } from "@/services/creditReport"
import type { ParsedCreditReport } from "@/services/creditReport"
import { useAppTheme } from "@/theme/context"
import { useHeader } from "@/utils/useHeader"
import type { ThemedStyle } from "@/theme/types"

type Status = "idle" | "extracting" | "analyzing" | "done" | "error"

export const ImportReportScreen: FC<AppStackScreenProps<"ImportReport">> = ({ navigation }) => {
  const { themed } = useAppTheme()
  const { apiKey, setApiKey, setReport: saveReport } = useCreditReport()
  const [status, setStatus] = useState<Status>("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [report, setReport] = useState<ParsedCreditReport | null>(null)
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)

  useHeader(
    {
      title: "Import Report",
      leftIcon: "back",
      onLeftPress: () => navigation.goBack(),
    },
    [navigation],
  )

  const handleUploadPDF = async () => {
    if (!apiKey) {
      setShowApiKeyInput(true)
      return
    }

    try {
      setStatus("extracting")
      setStatusMessage("Selecting and extracting text from PDF...")

      const extracted = await pickAndExtractPDF()
      if (!extracted) {
        setStatus("idle")
        setStatusMessage("")
        return
      }

      setStatusMessage(
        `Extracted text from ${extracted.fileName} (${extracted.bureau}). Analyzing with AI...`,
      )
      setStatus("analyzing")

      const parsed = await analyzeReportWithAI({
        apiKey,
        text: extracted.text,
        bureau: extracted.bureau,
      })

      setReport(parsed)
      saveReport(parsed)
      setStatus("done")
      setStatusMessage(
        `Found ${parsed.summary.totalAccounts} accounts, ${parsed.summary.negativeItemCount} items flagged for dispute.`,
      )
    } catch (error) {
      setStatus("error")
      setStatusMessage(error instanceof Error ? error.message : "An error occurred")
    }
  }

  return (
    <Screen preset="scroll" contentContainerStyle={themed($container)}>
      {showApiKeyInput && !apiKey ? (
        <View style={themed($card)}>
          <Text preset="subheading" text="API Key Required" />
          <Text
            style={themed($body)}
            text="Enter your Claude API key to enable AI-powered credit report analysis. Your key is stored securely on-device."
          />
          <TextField
            placeholder="sk-ant-..."
            onChangeText={setApiKey}
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={themed($textField)}
          />
          <Button
            text="Save & Continue"
            preset="reversed"
            onPress={() => {
              if (apiKey) {
                setShowApiKeyInput(false)
                handleUploadPDF()
              }
            }}
            style={themed($button)}
          />
        </View>
      ) : (
        <>
          <View style={themed($card)}>
            <Text preset="subheading" text="Step 1: Get Your Free Report" />
            <Text
              style={themed($body)}
              text="Visit annualcreditreport.com to download your free credit reports from all 3 bureaus. You're entitled to free weekly reports."
            />
          </View>

          <View style={themed($card)}>
            <Text preset="subheading" text="Step 2: Upload PDF" />
            <Text
              style={themed($body)}
              text="Upload the PDF and our AI will analyze it, identify every account, and flag items that may be eligible for dispute."
            />

            {(status === "idle" || status === "error") && (
              <Button
                text="Select Credit Report PDF"
                preset="reversed"
                onPress={handleUploadPDF}
                style={themed($button)}
              />
            )}

            {(status === "extracting" || status === "analyzing") && (
              <View style={themed($loadingContainer)}>
                <ActivityIndicator size="large" />
                <Text style={themed($statusText)} text={statusMessage} />
              </View>
            )}

            {status === "error" && (
              <Text style={themed($errorText)} text={statusMessage} />
            )}

            {status === "done" && report && (
              <View style={themed($resultsContainer)}>
                <Text style={themed($successText)} text={statusMessage} />
                <View style={themed($statsRow)}>
                  <StatBox label="Accounts" value={report.summary.totalAccounts} themed={themed} />
                  <StatBox label="Flagged" value={report.summary.negativeItemCount} themed={themed} />
                  <StatBox label="Inquiries" value={report.summary.inquiryCount} themed={themed} />
                </View>
                <Button
                  text="Review Flagged Items"
                  preset="reversed"
                  onPress={() => navigation.navigate("ReportReview", { reportId: report.bureau })}
                  style={themed($button)}
                />
              </View>
            )}
          </View>

          <View style={themed($card)}>
            <Text preset="subheading" text="What We Look For" />
            <Text style={themed($body)} text="• Accounts you don't recognize" />
            <Text style={themed($body)} text="• Incorrect balances or dates" />
            <Text style={themed($body)} text="• Collections (especially old ones)" />
            <Text style={themed($body)} text="• Late payments on good accounts" />
            <Text style={themed($body)} text="• Unauthorized hard inquiries" />
            <Text style={themed($body)} text="• Items older than 7 years still reporting" />
            <Text style={themed($body)} text="• Personal information errors" />
          </View>

          <View style={themed($card)}>
            <Text preset="subheading" text="Privacy" />
            <Text
              style={themed($body)}
              text="Your credit report data is processed on-device and sent directly to the AI for analysis. We never store your raw credit report on our servers."
            />
          </View>
        </>
      )}
    </Screen>
  )
}

function StatBox({
  label,
  value,
  themed,
}: {
  label: string
  value: number
  themed: (style: ThemedStyle<ViewStyle>) => ViewStyle
}) {
  return (
    <View style={themed($statBox)}>
      <Text preset="bold" text={String(value)} />
      <Text size="xs" text={label} />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
})

const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  padding: spacing.lg,
  marginBottom: spacing.md,
})

const $body: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $loadingContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingVertical: spacing.lg,
  gap: spacing.md,
})

const $statusText: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  textAlign: "center",
  marginTop: spacing.sm,
})

const $errorText: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  color: colors.error,
  marginTop: spacing.sm,
})

const $successText: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
  marginBottom: spacing.md,
})

const $resultsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $statsRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-around",
  marginVertical: spacing.md,
})

const $statBox: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignItems: "center",
  backgroundColor: colors.palette.neutral300,
  borderRadius: 8,
  padding: spacing.md,
  minWidth: 80,
})
