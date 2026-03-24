import { FC } from "react"
import { View, ViewStyle, TextStyle, Pressable } from "react-native"

import { Button } from "@/components/Button"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useCreditReport } from "@/context/CreditReportContext"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"
import { useHeader } from "@/utils/useHeader"
import type { ThemedStyle } from "@/theme/types"
import type { CreditReportItem, NegativeItemType } from "@credit/shared"

const ITEM_TYPE_LABELS: Record<NegativeItemType, string> = {
  inaccurate_info: "Inaccurate Information",
  collection: "Collection Account",
  late_payment: "Late Payment",
  hard_inquiry: "Hard Inquiry",
  outdated_item: "Outdated Item (7+ years)",
  personal_info_error: "Personal Info Error",
}

const ITEM_TYPE_COLORS: Record<NegativeItemType, string> = {
  inaccurate_info: "#E53E3E",
  collection: "#DD6B20",
  late_payment: "#D69E2E",
  hard_inquiry: "#3182CE",
  outdated_item: "#805AD5",
  personal_info_error: "#718096",
}

export const ReportReviewScreen: FC<AppStackScreenProps<"ReportReview">> = ({ navigation }) => {
  const { themed, theme } = useAppTheme()
  const { report, flaggedItems, dismissItem } = useCreditReport()

  useHeader(
    {
      title: "Review Flagged Items",
      leftIcon: "back",
      onLeftPress: () => navigation.goBack(),
    },
    [navigation],
  )

  if (!report) {
    return (
      <Screen preset="fixed" contentContainerStyle={themed($container)}>
        <View style={themed($emptyState)}>
          <Text preset="subheading" text="No Report Imported" />
          <Text
            style={themed($body)}
            text="Import a credit report first to see flagged items."
          />
          <Button
            text="Import Report"
            preset="reversed"
            onPress={() => navigation.navigate("ImportReport")}
            style={themed($button)}
          />
        </View>
      </Screen>
    )
  }

  const summaryText = `${report.summary.totalAccounts} accounts found across ${report.bureau}. ${flaggedItems.length} items flagged for potential dispute.`

  return (
    <Screen preset="scroll" contentContainerStyle={themed($container)}>
      {/* Summary */}
      <View style={themed($summaryCard)}>
        <Text preset="subheading" text={`${report.bureau.charAt(0).toUpperCase() + report.bureau.slice(1)} Report`} />
        <Text style={themed($body)} text={summaryText} />
        <View style={themed($statsRow)}>
          <View style={themed($stat)}>
            <Text preset="bold" text={String(report.summary.openAccounts)} />
            <Text size="xs" text="Open" />
          </View>
          <View style={themed($stat)}>
            <Text preset="bold" text={String(report.summary.closedAccounts)} />
            <Text size="xs" text="Closed" />
          </View>
          <View style={themed($stat)}>
            <Text preset="bold" text={String(report.summary.inquiryCount)} />
            <Text size="xs" text="Inquiries" />
          </View>
          <View style={themed($stat)}>
            <Text preset="bold" text={String(flaggedItems.length)} />
            <Text size="xs" text="Flagged" />
          </View>
        </View>
      </View>

      {/* Flagged Items */}
      {flaggedItems.length === 0 ? (
        <View style={themed($emptyState)}>
          <Text preset="subheading" text="No Flagged Items" />
          <Text style={themed($body)} text="All items on this report appear accurate. Great news!" />
        </View>
      ) : (
        <>
          <Text preset="subheading" text="Flagged Items" style={themed($sectionTitle)} />
          <Text
            style={themed($body)}
            text="Review each item below. Tap to start a dispute or dismiss if accurate."
          />

          {flaggedItems.map((item) => (
            <FlaggedItemCard
              key={item.id}
              item={item}
              themed={themed}
              onDismiss={() => dismissItem(item.id)}
              onDispute={() => navigation.navigate("CreateDispute", { itemId: item.id })}
            />
          ))}
        </>
      )}
    </Screen>
  )
}

function FlaggedItemCard({
  item,
  themed,
  onDismiss,
  onDispute,
}: {
  item: CreditReportItem
  themed: (style: ThemedStyle<ViewStyle>) => ViewStyle
  onDismiss: () => void
  onDispute: () => void
}) {
  const typeLabel = ITEM_TYPE_LABELS[item.itemType] ?? item.itemType
  const typeColor = ITEM_TYPE_COLORS[item.itemType] ?? "#718096"

  return (
    <View style={themed($itemCard)}>
      <View style={themed($itemHeader)}>
        <View style={[themed($typeBadge), { backgroundColor: typeColor + "20" }]}>
          <Text
            size="xxs"
            text={typeLabel}
            style={{ color: typeColor } as TextStyle}
          />
        </View>
        {item.autoDetected && (
          <Text size="xxs" text="AI Detected" style={themed($aiTag)} />
        )}
      </View>

      <Text preset="bold" text={item.creditorName} style={themed($creditorName)} />

      {item.accountNumber && (
        <Text size="xs" text={`Account: ${item.accountNumber}`} style={themed($detail)} />
      )}

      {item.reportedBalance !== undefined && (
        <Text
          size="xs"
          text={`Reported Balance: $${item.reportedBalance.toLocaleString()}`}
          style={themed($detail)}
        />
      )}

      <Text size="sm" text={item.disputeReason} style={themed($reason)} />

      <View style={themed($actionRow)}>
        <Pressable onPress={onDismiss} style={themed($dismissButton)}>
          <Text size="xs" text="Dismiss (Accurate)" />
        </Pressable>
        <Button text="Dispute This" preset="reversed" onPress={onDispute} />
      </View>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
})

const $summaryCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  padding: spacing.lg,
  marginBottom: spacing.lg,
})

const $body: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})

const $statsRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: spacing.md,
})

const $stat: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignItems: "center",
  backgroundColor: colors.palette.neutral300,
  borderRadius: 8,
  padding: spacing.sm,
  minWidth: 65,
})

const $sectionTitle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $emptyState: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  padding: spacing.xl,
  alignItems: "center",
})

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $itemCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  padding: spacing.lg,
  marginTop: spacing.md,
})

const $itemHeader: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
})

const $typeBadge: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs,
  borderRadius: 6,
})

const $aiTag: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
})

const $creditorName: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
})

const $detail: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.xxs,
})

const $reason: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
})

const $actionRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: spacing.md,
})

const $dismissButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
})
