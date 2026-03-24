import { FC } from "react"
import { View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import { useHeader } from "@/utils/useHeader"
import type { ThemedStyle } from "@/theme/types"

export const ImportReportScreen: FC<AppStackScreenProps<"ImportReport">> = ({ navigation }) => {
  const { themed } = useAppTheme()

  useHeader(
    {
      title: "Import Report",
      leftIcon: "back",
      onLeftPress: () => navigation.goBack(),
    },
    [navigation],
  )

  const handleUploadPDF = () => {
    // TODO: Implement PDF upload with expo-document-picker
    // Then parse with Claude API and navigate to review
    // navigation.navigate("ReportReview", { reportId: "..." })
  }

  return (
    <Screen preset="scroll" contentContainerStyle={themed($container)}>
      <View style={themed($card)}>
        <Text preset="subheading" text="Step 1: Get Your Free Report" />
        <Text
          style={themed($body)}
          text="Visit annualcreditreport.com to download your free credit reports from all 3 bureaus. You're entitled to free reports every week."
        />
      </View>

      <View style={themed($card)}>
        <Text preset="subheading" text="Step 2: Upload PDF" />
        <Text
          style={themed($body)}
          text="Upload the PDF and our AI will analyze it, identify every account, and flag items that may be eligible for dispute."
        />
        <Button
          text="Upload TransUnion Report"
          preset="reversed"
          onPress={handleUploadPDF}
          style={themed($button)}
        />
        <Button
          text="Upload Experian Report"
          preset="default"
          onPress={handleUploadPDF}
          style={themed($button)}
        />
        <Button
          text="Upload Equifax Report"
          preset="default"
          onPress={handleUploadPDF}
          style={themed($button)}
        />
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
    </Screen>
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
  marginTop: spacing.sm,
})
