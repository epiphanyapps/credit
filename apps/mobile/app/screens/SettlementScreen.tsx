import { FC } from "react"
import { ViewStyle } from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import { useHeader } from "@/utils/useHeader"
import type { ThemedStyle } from "@/theme/types"

export const SettlementScreen: FC<AppStackScreenProps<"Settlement">> = ({ navigation }) => {
  const { themed } = useAppTheme()

  useHeader(
    {
      title: "Settlement",
      leftIcon: "back",
      onLeftPress: () => navigation.goBack(),
    },
    [navigation],
  )

  return (
    <Screen preset="scroll" contentContainerStyle={themed($container)}>
      <Text preset="heading" text="Settlement Calculator" />
      <Text style={themed($body)} text="Calculate your settlement offer based on debt age, type, and collection agency economics. Call on the last business day of the month for best results." />
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
})

const $body: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})
