import { TextStyle, ViewStyle } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Icon } from "@/components/Icon"
import { translate } from "@/i18n/translate"
import { DashboardScreen } from "@/screens/DashboardScreen"
import { CreditReportScreen } from "@/screens/CreditReportScreen"
import { DisputesScreen } from "@/screens/DisputesScreen"
import { LearnScreen } from "@/screens/LearnScreen"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import type { MainTabParamList } from "./navigationTypes"

const Tab = createBottomTabNavigator<MainTabParamList>()

export function MainNavigator() {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { height: bottom + 70 }]),
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tintInactive,
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarItemStyle: themed($tabBarItem),
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: translate("mainNavigator:dashboardTab"),
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="check"
              color={focused ? colors.tint : colors.tintInactive}
              size={30}
            />
          ),
        }}
      />

      <Tab.Screen
        name="CreditReport"
        component={CreditReportScreen}
        options={{
          tabBarLabel: translate("mainNavigator:reportTab"),
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="components"
              color={focused ? colors.tint : colors.tintInactive}
              size={30}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Disputes"
        component={DisputesScreen}
        options={{
          tabBarLabel: translate("mainNavigator:disputesTab"),
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="ladybug"
              color={focused ? colors.tint : colors.tintInactive}
              size={30}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{
          tabBarLabel: translate("mainNavigator:learnTab"),
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="menu"
              color={focused ? colors.tint : colors.tintInactive}
              size={30}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  color: colors.text,
})
