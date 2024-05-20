import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
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
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";

import { font } from "../utils/font.helpers";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [loading, setLoading] = useState(false);

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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleLogin = async (phoneNumber: any) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://sales-control-api-development.up.railway.app/api/authentication/login",
        {
          phoneNumber: `+${country?.callingCode}${phoneNumber}`,
          password: password,
        }
      );

      if (response.data && response.data.token) {
        const token = response.data.token;
        console.log("mytoken", token);
        await AsyncStorage.setItem("token", token);
        router.push("/sales");
      } else {
        router.push("/login");
      }
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.push("/sales");
      }
    };

    checkToken();
  }, []);
  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPassword("");
      setPhoneNumber("");
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView className="p-5" style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="">
          <Image source={require("../assets/logo.png")} className="w-32 h-10" />
        </View>
        <View className="my-7">
          <Text
            className="font-semibold text-3xl pb-4"
            style={font.primary.bold}
          >
            Welcome Back
          </Text>
          <Text
            className="font-thin text-lg text-gray-700"
            style={font.primary.semibold}
          >
            Ease into your Finances and inventory - your day just got a whole
            lot better.
          </Text>
        </View>

        <View className="py-2">
          <Text
            style={font.primary.semibold}
            className="text-gray-800 text-lg pb-2"
          >
            Phone Number
          </Text>
          <View className=" flex flex-row items-center">
            <View className="py-2 px-4 mr-3 text-gray-500 border-2 border-gray-300 rounded-lg">
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
            </View>

            <TextInput
              className="text-gray-500 border-2 border-gray-300 py-2 px-4 w-[77%] rounded-lg"
              style={font.primary.semibold}
              placeholder="700000000"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <View className="pt-4">
            <Text
              style={font.primary.semibold}
              className="text-gray-800 text-lg pb-2"
            >
              Enter Your Secure Password
            </Text>
            <TextInput
              className="text-gray-500 border-2 border-gray-300 py-2 px-4 rounded-lg"
              style={font.primary.semibold}
              secureTextEntry={true}
              placeholder="Enter Your Secure Password"
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>
        <View className="py-2 px-5">
          <Text
            style={font.primary.semibold}
            className="text-gray-500 text-sm text-justify"
          >
            Can't remember your password?
          </Text>
          <View className="flex flex-row items-center gap-1 py-1">
            <Text
              style={font.primary.semibold}
              className="text-gray-500 text-sm text-justify"
            >
              Don't worry it happens.
            </Text>
            <Text
              className="text-orange-500 underline text-sm "
              style={font.primary.semibold}
            >
              Reset it from here.
            </Text>
          </View>
        </View>

        <View className="w-[full] bg-orange-500 rounded-lg mb-5">
          <Pressable onPress={() => handleLogin(phoneNumber)}>
            <Text
              className="text-white text-center py-3 px-4 text-lg"
              style={font.primary.bold}
            >
              {loading ? "Please wait..." : "Proceed to Log In"}
            </Text>
          </Pressable>
        </View>

        <View className="">
          <Text style={font.primary.semibold} className="text-gray-500 mr-2">
            If you're not yet part of the PayApp family, what are you waiting
            for? Get ready for a hassle-free financial journey.
          </Text>

          <View className="w-[full] bg-transparent border-2 border-orange-300 rounded-lg my-5">
            <Link
              href="/register"
              className="text-center py-3 px-4 text-orange-400 text-lg"
              style={font.primary.bold}
            >
              Create an account
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
