import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { font } from "../utils/font.helpers";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

export default function UserWallet() {
  const [activeView, setActiveView] = useState("withdrawals");
  const [loading, setLoading] = useState(false);
  const [isEyeOpen, setIsEyeOpen] = useState(true);
  const [accountBalance, setAccountBalance] = useState<any>();

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };
  const toggleEye = () => {
    setIsEyeOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(
          "https://payments.artemisys.tech/accounts/list",
          {
            params: {
              shop: "d71162b3-226b-45d2-b468-ea9881c087e0",
            },
          }
        );
        setAccountBalance(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBalance();
  }, []);

  return (
    <SafeAreaView className="p-5">
      <View className="border-b-2 border-gray-200 flex flex-row items-center justify-between ">
        <Text
          style={font.primary.semibold}
          className="text-gray-700 text-3xl pb-5"
        >
          Wallet
        </Text>
        <Image
          source={require(".././assets/hamburger.png")}
          className="h-5 w-5"
        />
      </View>
      <LinearGradient
        className="px-3 py-3  mt-2 rounded-xl"
        colors={["#0B023B", "#a99bf5", "#e3e0f5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View>
          <View className="flex flex-row items-center justify-between  pb-5">
            <View>
              <View className="">
                <Text
                  style={font.primary.medium}
                  className="text-lg text-white"
                >
                  Balance
                </Text>
                {isEyeOpen ? null : (
                  <Text
                    style={font.primary.semibold}
                    className="text-orange-500 text-3xl pb-3"
                  >
                    KES.{accountBalance && accountBalance.balance}
                  </Text>
                )}
              </View>
            </View>

            <Pressable onPress={toggleEye}>
              <Image
                source={
                  isEyeOpen
                    ? require(".././assets/eye-open.png")
                    : require(".././assets/eye-closed.png")
                }
                className="h-6 w-6  rounded-full"
              />
            </Pressable>
          </View>

          <Text
            style={font.primary.medium}
            className=" text-sm text-white pb-3 uppercase"
          >
            Total Transactions
          </Text>
          <Text
            style={font.primary.bold}
            className=" text-lg text-white pb-3 uppercase"
          >
            {accountBalance && accountBalance.transactions.length}
          </Text>
        </View>

        <View className="rounded-lg ml-44 bg-orange-500">
          <View className="p-2 flex flex-row justify-between items-center gap-">
            <Image
              source={require(".././assets/wallet.png")}
              className="h-8 w-8"
            />
            <Link
              href="/account"
              style={font.primary.bold}
              className="text-white text-lg"
            >
              Withdraw
            </Link>
          </View>
        </View>
      </LinearGradient>

      <View className=" mt-4 w-full">
        <View className="flex flex-row items-center justify-between">
          <Pressable
            style={{ flex: 1 }}
            onPress={() => handleViewChange("withdrawals")}
          >
            <View
              className={`w-full border-b-2 ${
                activeView === "withdrawals"
                  ? "border-orange-500"
                  : "border-gray-200"
              } py-1`}
            >
              <Text
                style={font.primary.bold}
                className={`text-lg text-center ${
                  activeView === "withdrawals"
                    ? "text-orange-500"
                    : "text-gray-400"
                }`}
              >
                Withdrawals
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => handleViewChange("topups")}
          >
            <View
              className={`w-full border-b-2 ${
                activeView === "topups"
                  ? "border-orange-500"
                  : "border-gray-200"
              } py-1`}
            >
              <Text
                style={font.primary.bold}
                className={`text-lg text-center ${
                  activeView === "topups" ? "text-orange-500" : "text-gray-400"
                }`}
              >
                TopUps
              </Text>
            </View>
          </Pressable>
        </View>

        {activeView === "withdrawals" && (
          <>
            <Text
              style={font.primary.semibold}
              className="py-5 text-gray-700 px-2 text-xl"
            >
              Recent Transactions
            </Text>
            <View className="pb-2">
              <Text
                style={font.primary.semibold}
                className=" text-gray-400 px-2 text-lg"
              >
                Today
              </Text>
            </View>
            {/* Transactions */}
            {accountBalance &&
              accountBalance.transactions.map((transact: any) => (
                <View
                  key={transact.id}
                  className="flex flex-row items-center justify-between mb-3"
                >
                  <View>
                    <Text
                      style={font.primary.semibold}
                      className="text-gray-700 px-2 text-lg"
                    >
                      Mpesa
                    </Text>
                    <Text
                      style={font.primary.medium}
                      className="text-gray-400 px-2 text-sm"
                    >
                      Phone No.254700372339
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={font.primary.semibold}
                      className="text-gray-900 px-2 text-lg"
                    >
                      -KES {transact.amount}
                    </Text>
                    <Text
                      style={font.primary.medium}
                      className="text-gray-400 px-2 text-sm"
                    >
                      02.12 PM
                    </Text>
                  </View>
                </View>
              ))}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
