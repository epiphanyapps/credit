import { FC } from "react"
import { ViewStyle } from "react-native"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import { useHeader } from "@/utils/useHeader"
import type { ThemedStyle } from "@/theme/types"

export const DisputeDetailScreen: FC<AppStackScreenProps<"DisputeDetail">> = ({ navigation }) => {
  const { themed } = useAppTheme()

  useHeader(
    {
      title: "Dispute Detail",
      leftIcon: "back",
      onLeftPress: () => navigation.goBack(),
    },
    [navigation],
  )

  return (
    <Screen preset="scroll" contentContainerStyle={themed($container)}>
      <Text preset="heading" text="Dispute Detail" />
      <Text style={themed($body)} text="View dispute status, timeline, bureau responses, and next actions." />
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
