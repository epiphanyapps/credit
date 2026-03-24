import { FC } from "react"
import { View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export const DashboardScreen: FC<MainTabScreenProps<"Dashboard">> = ({ navigation }) => {
  const { themed } = useAppTheme()

  return (
    <Screen preset="scroll" contentContainerStyle={themed($container)} safeAreaEdges={["top"]}>
      <Text preset="heading" text="Credit Dashboard" style={themed($heading)} />

      <View style={themed($card)}>
        <Text preset="subheading" text="Get Started" />
        <Text
          style={themed($body)}
          text="Import your credit report to begin identifying items to dispute."
        />
        <Button
          text="Import Credit Report"
          preset="reversed"
          onPress={() => navigation.navigate("ImportReport")}
          style={themed($button)}
        />
      </View>

      <View style={themed($card)}>
        <Text preset="subheading" text="Active Disputes" />
        <Text style={themed($body)} text="No active disputes yet. Import your report to get started." />
      </View>

      <View style={themed($card)}>
        <Text preset="subheading" text="Next Actions" />
        <Text
          style={themed($body)}
          text="Your next steps will appear here once you start the dispute process."
        />
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
  marginBottom: spacing.sm,
})

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
})
