import { FC } from "react"
import { View, ViewStyle } from "react-native"

import { ListItem } from "@/components/ListItem"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const TOPICS = [
  { title: "How Credit Scores Work", subtitle: "Payment history, utilization, age, inquiries" },
  { title: "The Dispute Process", subtitle: "4 rounds of escalation + CFPB" },
  { title: "Your Legal Rights", subtitle: "FCRA §611, §623, FDCPA §809" },
  { title: "Settlement Negotiation", subtitle: "When and how to negotiate with collectors" },
  { title: "Pay-Then-Dispute Strategy", subtitle: "The insider strategy that actually works" },
  { title: "Credit Building Basics", subtitle: "Secured cards, utilization, account age" },
  { title: "Common Myths Debunked", subtitle: "10 myths that hurt your credit" },
] as const

export const LearnScreen: FC<MainTabScreenProps<"Learn">> = () => {
  const { themed } = useAppTheme()

  return (
    <Screen preset="scroll" contentContainerStyle={themed($container)} safeAreaEdges={["top"]}>
      <Text preset="heading" text="Learn" style={themed($heading)} />
      <Text
        style={themed($subtitle)}
        text="Understand how credit works so you can fix it yourself. No credit repair company needed."
      />

      <View style={themed($list)}>
        {TOPICS.map((topic, index) => (
          <ListItem
            key={index}
            text={topic.title}
            bottomSeparator
            rightIcon="caretRight"
          />
        ))}
      </View>
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
})

const $heading: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
  marginTop: spacing.md,
})

const $subtitle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $list: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  padding: spacing.sm,
})
