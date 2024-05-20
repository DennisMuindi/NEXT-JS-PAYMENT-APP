import { Slot, router } from "expo-router";
import { View, Text, Button, Image, Pressable } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";
import { font } from "../../utils/font.helpers";
import PaymentSheet from "../../components/PaymentSheet";
import React, { useEffect, useState } from "react";
import { BottomSheetProvider } from "@gorhom/bottom-sheet/lib/typescript/contexts";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
import {
  BottomSheetModalOptions,
  CustomerDetails,
  GlobalModalContext,
  SaleReference,
} from "../../context/AppContext";
import UserRegister from "../register";
import UserLogin from "../login";
import UserVerification from "../verify";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const [showModal, setShowModal] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [state, setStateValue] = useState<{
    modalValue: BottomSheetModalOptions;
    saleReference?: SaleReference;
    customerValue?: CustomerDetails;
  }>({
    modalValue: "hidden",
    customerValue: {} as CustomerDetails,
    saleReference: {} as SaleReference,
  });

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Quicksand_600SemiBold,
    Quicksand_400Regular,
    Quicksand_700Bold,
    Quicksand_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");

      setUserLoggedIn(false);

      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <GlobalModalContext.Provider value={{ state, setStateValue }}>
      <SafeAreaView
        className={[
          "px-4 flex-1",
          state.modalValue === "shown" ? "bg-gray-200" : "bg-white",
        ].join(" ")}
      >
        <BottomSheetModalProvider>
          {isSidebarOpen && (
            <View style={styles.sidebar} className="bg-[#FDD9CE] ">
              <View className="flex flex-row items-center justify-between p-2">
                <Image
                  source={require("../../assets/logo.png")}
                  className="w-32 h-10"
                />
                <Pressable onPress={toggleSidebar}>
                  <Image
                    source={require("../../assets/close.png")}
                    className="w-5 h-5"
                  />
                </Pressable>
              </View>
              <Pressable
                onPress={handleLogout}
                className="flex flex-row items-center gap-3 p-3"
              >
                <Text
                  className="text-lg text-gray-500"
                  style={font.primary.semibold}
                >
                  Log Out
                </Text>
                <Image
                  source={require("../../assets/logout.png")}
                  className="w-5 h-5"
                />
              </Pressable>
            </View>
          )}
          <View className="border-b border-gray-300 py-4 mb-4">
            <View className="flex flex-row items-center  justify-between">
              <Text
                className="text-2xl font-semibold"
                style={font.primary.semibold}
              >
                Payment Links
              </Text>
              <Pressable onPress={toggleSidebar}>
                <Image
                  source={require("../../assets/hamburger.png")}
                  className="w-5 h-5"
                />
              </Pressable>
            </View>

            <Text
              className="text-lg pt-1 text-gray-500"
              style={font.secondary.regular}
            >
              Create a payment link that a user can pay against.
            </Text>
          </View>
          <Slot />
          <View style={styles.container}>
            <PaymentSheet
              modalValue={state.modalValue}
              customerDetails={state.customerValue}
              saleReference={state.saleReference}
            />
          </View>
        </BottomSheetModalProvider>
      </SafeAreaView>
    </GlobalModalContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: "black",
  },
  sidebar: {
    width: 300,
    height: "100%",

    position: "absolute",
    right: 0,
    top: 45,
    bottom: 0,
    zIndex: 1,
    padding: 10,
  },
});
