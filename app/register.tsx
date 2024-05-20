import { Link, router } from "expo-router";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { font } from "../utils/font.helpers";

import React, { useEffect, useState } from "react";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserRegister() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCountries, setShowCountries] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>("KE");
  const [country, setCountry] = useState<Country | null>(null);
  const [withCountryNameButton, setWithCountryNameButton] =
    useState<boolean>(false);
  const [withFlag, setWithFlag] = useState<boolean>(true);
  const [withEmoji, setWithEmoji] = useState<boolean>(false);
  const [withFilter, setWithFilter] = useState<boolean>(true);
  const [withAlphaFilter, setWithAlphaFilter] = useState<boolean>(false);
  const [withCallingCode, setWithCallingCode] = useState<boolean>(true);
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCountry(country);
  };
  const [userInfo, setUserInfo] = useState({
    phoneNumber: "",
    firstName: "",
    lastName: "",
    shopName: "",
  });
  useEffect(() => {
    setCountryCode("KE");
  }, []);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://sales-control-api-development.up.railway.app/api/authentication/register",
        {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          phoneNumber: `+${country?.callingCode}${userInfo.phoneNumber}`,
          shopName: userInfo.shopName,
        }
      );

      // "ce4618e3-0784-45d7-bd04-b05cec9cf7ca"
      const userId = response.data.userId;

      await AsyncStorage.setItem("userId", userId);

      if (response) {
        console.log(response.data);
        setUserInfo(response.data);
        router.push("/verify");
      }
      if (response) {
        setErrorMessage(response.data.message);
      }
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUserInfo({
        phoneNumber: "",
        firstName: "",
        lastName: "",
        shopName: "",
      });
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="p-5">
          <View className="">
            <Image
              source={require("../assets/logo.png")}
              className="w-32 h-10"
            />
          </View>
          <View className="my-7">
            <Text
              className="font-semibold text-lg text-justify pb-4 text-gray-500"
              style={font.primary.semibold}
            >
              Let's get started on making payments easier and smarter for you.
              Join us and experience the seamless way to send, receive and
              manage your money.
            </Text>
            <Text
              className="text-3xl text-gray-800"
              style={font.primary.semibold}
            >
              Create Your Account
            </Text>
          </View>

          <View className="flex gap-5">
            <View className="w-[95%]">
              <Text style={font.primary.bold} className="text-gray-800 pb-2">
                Enter Your First name
              </Text>
              <TextInput
                className="text-gray-500 border-2 border-gray-300 py-2 px-4  rounded-lg"
                style={font.primary.semibold}
                placeholder="Enter First name"
                value={userInfo.firstName}
                onChangeText={(text) =>
                  setUserInfo({ ...userInfo, firstName: text })
                }
              />
            </View>

            <View className="w-[95%]">
              <Text
                style={font.primary.semibold}
                className="text-gray-800 pb-2"
              >
                Enter Your Surname
              </Text>
              <TextInput
                className="text-gray-500 border-2 border-gray-300 py-2 px-4  rounded-lg"
                style={font.primary.semibold}
                placeholder="Enter Surname"
                value={userInfo.lastName}
                onChangeText={(text) =>
                  setUserInfo({ ...userInfo, lastName: text })
                }
              />
            </View>
            <View className="w-[95%]">
              <Text
                style={font.primary.semibold}
                className="text-gray-800 pb-2"
              >
                Create Shop
              </Text>
              <TextInput
                className="text-gray-500 border-2 border-gray-300 py-2 px-4  rounded-lg"
                style={font.primary.semibold}
                placeholder="Enter the name of your shop"
                value={userInfo.shopName}
                onChangeText={(text) =>
                  setUserInfo({ ...userInfo, shopName: text })
                }
              />
            </View>
          </View>

          <View className=" my-5 ">
            <Text style={font.primary.semibold} className="text-gray-500 pb-2">
              Phone Number
            </Text>
            <View className=" flex flex-row items-center">
              <View className="py-2 px-4 mr-2 text-gray-500 border-2 border-gray-300 rounded-lg flex flex-row items-center">
                <CountryPicker
                  {...{
                    countryCode,
                    withFilter,
                    withFlag,
                    withCountryNameButton,
                    withAlphaFilter,
                    withCallingCode,
                    withEmoji,
                    onSelect,
                  }}
                  visible={showCountries}
                />
                <Text
                  className="text-gray-400 py-1"
                  style={font.primary.semibold}
                >
                  {/* {country?.callingCode} */}
                </Text>
              </View>

              <TextInput
                className="text-gray-500 border-2 border-gray-300 py-2 px-4 w-[78%] rounded-lg"
                style={font.primary.semibold}
                placeholder="700000000"
                value={userInfo.phoneNumber}
                onChangeText={(text) =>
                  setUserInfo({ ...userInfo, phoneNumber: text })
                }
              />
            </View>
          </View>

          <View>
            {errorMessage && (
              <Text style={{ color: "red", marginVertical: 10 }}>
                {errorMessage}
              </Text>
            )}
          </View>

          <View>
            <Text
              className="text-gray-400 text-center text-sm "
              style={font.primary.semibold}
            >
              I agree to the terms & conditions and the privacy policy
            </Text>
          </View>

          <View className="w-[full] my-4 bg-orange-500 rounded-lg">
            <Pressable onPress={handleRegister}>
              <Text
                className="text-white  text-lg text-center py-2 px-4 "
                style={font.primary.bold}
              >
                {loading ? "Registering..." : "Proceed To Register"}
              </Text>
            </Pressable>
          </View>

          <Text style={font.primary.semibold} className="text-gray-800 text-lg">
            Already have an account ?
          </Text>
          <View className="w-[full] my-4 bg-transparent rounded-lg border-2 border-orange-300">
            <Pressable>
              <Link
                href="/login"
                className="text-orange-400 text-center py-2 px-4 text-lg "
                style={font.primary.semibold}
              >
                Login To Your Account
              </Link>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
