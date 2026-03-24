import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Config from "@/config"
import { useAuth } from "@/context/AuthContext"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { LoginScreen } from "@/screens/LoginScreen"
import { WelcomeScreen } from "@/screens/WelcomeScreen"
import { ImportReportScreen } from "@/screens/ImportReportScreen"
import { ReportReviewScreen } from "@/screens/ReportReviewScreen"
import { DisputeDetailScreen } from "@/screens/DisputeDetailScreen"
import { CreateDisputeScreen } from "@/screens/CreateDisputeScreen"
import { LetterPreviewScreen } from "@/screens/LetterPreviewScreen"
import { SettlementScreen } from "@/screens/SettlementScreen"
import { useAppTheme } from "@/theme/context"

import { MainNavigator } from "./MainNavigator"
import type { AppStackParamList, NavigationProps } from "./navigationTypes"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

const exitRoutes = Config.exitRoutes

const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const { isAuthenticated } = useAuth()

  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={isAuthenticated ? "Welcome" : "Login"}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Main" component={MainNavigator} />

          {/* Dispute flow screens (pushed on top of tabs) */}
          <Stack.Screen name="ImportReport" component={ImportReportScreen} />
          <Stack.Screen name="ReportReview" component={ReportReviewScreen} />
          <Stack.Screen name="DisputeDetail" component={DisputeDetailScreen} />
          <Stack.Screen name="CreateDispute" component={CreateDisputeScreen} />
          <Stack.Screen name="LetterPreview" component={LetterPreviewScreen} />
          <Stack.Screen name="Settlement" component={SettlementScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}

      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
}

export const AppNavigator = (props: NavigationProps) => {
  const { navigationTheme } = useAppTheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <AppStack />
      </ErrorBoundary>
    </NavigationContainer>
  )
}
