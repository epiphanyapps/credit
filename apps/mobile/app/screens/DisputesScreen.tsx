import { FC } from "react"
import { View, ViewStyle } from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export const DisputesScreen: FC<MainTabScreenProps<"Disputes">> = () => {
  const { themed } = useAppTheme()

  return (
    <Screen preset="scroll" contentContainerStyle={themed($container)} safeAreaEdges={["top"]}>
      <Text preset="heading" text="My Disputes" style={themed($heading)} />

      <View style={themed($emptyState)}>
        <Text preset="subheading" text="No Disputes Yet" />
        <Text
          style={themed($body)}
          text="Import your credit report and select items to dispute. Each dispute goes through up to 4 rounds of escalation."
        />
      </View>

      <View style={themed($card)}>
        <Text preset="subheading" text="How Disputes Work" />
        <Text style={themed($body)} text="Round 1: Basic dispute to bureau (30 days)" />
        <Text style={themed($body)} text="Round 2: Method of verification request (15 days)" />
        <Text style={themed($body)} text="Round 3: Warning / intent to litigate (30 days)" />
        <Text style={themed($body)} text="Round 4: Direct furnisher dispute (30 days)" />
        <Text style={themed($body)} text="Escalation: CFPB complaint" />
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

const $emptyState: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  padding: spacing.lg,
  marginBottom: spacing.md,
  alignItems: "center",
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
