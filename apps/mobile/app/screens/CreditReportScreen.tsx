import { FC } from "react"
import { View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export const CreditReportScreen: FC<MainTabScreenProps<"CreditReport">> = ({ navigation }) => {
  const { themed } = useAppTheme()

  return (
    <Screen preset="scroll" contentContainerStyle={themed($container)} safeAreaEdges={["top"]}>
      <Text preset="heading" text="Credit Report" style={themed($heading)} />

      <View style={themed($card)}>
        <Text preset="subheading" text="Import Your Report" />
        <Text style={themed($body)} text="Download your free report from annualcreditreport.com, then upload the PDF here. Our AI will analyze it and flag items to dispute." />
        <Button
          text="Upload PDF Report"
          preset="reversed"
          onPress={() => navigation.navigate("ImportReport")}
          style={themed($button)}
        />
      </View>

      <View style={themed($card)}>
        <Text preset="subheading" text="Bureau Priority" />
        <Text style={themed($body)} text="1. TransUnion — Most complete data (cheapest for agencies to report to)" />
        <Text style={themed($body)} text="2. Experian" />
        <Text style={themed($body)} text="3. Equifax" />
      </View>
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
})

const $heading: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  marginTop: spacing.md,
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
