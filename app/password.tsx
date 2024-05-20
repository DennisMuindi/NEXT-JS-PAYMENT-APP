import {
  Link,
  router,
  useLocalSearchParams,
  router as useRouter,
} from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Country, CountryCode } from "react-native-country-picker-modal";

import { font } from "../utils/font.helpers";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PasswordCreation() {
  const [loading, setLoading] = useState(false);
  const [passwordInput, setPasswordInput] = useState({
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState({
    password: "",
    confirmPassword: "",
  });
  const userId = useSelector((state: RootState) => state.user.userId);

  const validateFormInput = () => {
    let inputError = {
      password: "",
      confirmPassword: "",
    };

    if (!passwordInput.password) {
      inputError.password = "Password should not be empty";
    } else if (passwordInput.password.length < 8) {
      inputError.password = "Password should be at least 8 characters long";
    }

    if (!passwordInput.confirmPassword) {
      inputError.confirmPassword = "Please confirm your password";
    } else if (passwordInput.password !== passwordInput.confirmPassword) {
      inputError.confirmPassword = "Passwords do not match";
    }
    setPasswordError(inputError);

    return Object.values(inputError).every((value) => value === "");
  };

  const handlePasswordChange = (text: string, field: string) => {
    setPasswordInput({
      ...passwordInput,
      [field]: text,
    });

    validateFormInput();
  };

  const handlePasswordSetup = async () => {
    if (validateFormInput()) {
      try {
        const userId = await AsyncStorage.getItem("userId");
        setLoading(true);
        const response = await axios.post(
          "https://sales-control-api-development.up.railway.app/api/authentication/setup-password",
          {
            userId,
            password: passwordInput.password,
          }
        );
        console.log(response.data);
        if (response.status === 201) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView className="p-5">
      <View className="">
        <Image source={require("../assets/logo.png")} className="w-32 h-10" />
      </View>
      <View className="my-5">
        <Text
          className="text-xl text-gray-900 pb-3"
          style={font.primary.semibold}
        >
          Almost There!
        </Text>
        <Text
          className="font-thin text-gray-800 text-lg text-justify"
          style={font.primary.semibold}
        >
          Let's Set Up Your Password.
        </Text>
      </View>

      <View className="mb-5">
        <Text
          style={font.primary.semibold}
          className="text-gray-500 text-lg pb-2"
        >
          Just a few rules to keep things tight, you don’t have to follow all of
          them btw. But for better security, its good you follow them.
        </Text>
        <View className="pl-5 pt-2 w-[95%]">
          <Text
            style={font.primary.semibold}
            className="text-gray-500 text-sm text-justify"
          >
            At least 8 characters – the more, the merrier.
          </Text>
          <Text
            style={font.primary.semibold}
            className="text-gray-500 text-sm text-justify"
          >
            Mix it up with uppercase and lowercase – keep it simple though 😅
          </Text>
          <Text
            style={font.primary.semibold}
            className="text-gray-500 text-sm text-justify"
          >
            Throw in a number or two – for good measure.
          </Text>
          <Text
            style={font.primary.semibold}
            className="text-gray-500 text-sm text-justify"
          >
            Add a special character – something like !, $, or &.
          </Text>
        </View>
      </View>
      <View className="w-[95%] py-4">
        <Text style={font.primary.bold} className="text-gray-800 pb-2">
          Enter Your Password
        </Text>
        <TextInput
          className="text-gray-500 border-2 border-gray-300 py-2 px-4  rounded-lg"
          style={font.primary.semibold}
          secureTextEntry={true}
          placeholder="Enter your password"
          value={passwordInput.password}
          onChangeText={(text) => handlePasswordChange(text, "password")}
        />
        <Text style={font.primary.bold} className="text-orange-500">
          {passwordError.password}
        </Text>
      </View>
      <View className="w-[95%]">
        <Text style={font.primary.bold} className="text-gray-800 pb-2">
          Confirm Your Password
        </Text>
        <TextInput
          className="text-gray-500 border-2 border-gray-300 py-2 px-4  rounded-lg"
          style={font.primary.semibold}
          secureTextEntry={true}
          placeholder="Confirm the Password"
          value={passwordInput.confirmPassword}
          onChangeText={(text) => handlePasswordChange(text, "confirmPassword")}
        />
        <Text style={font.primary.bold} className="text-orange-500">
          {passwordError.confirmPassword}
        </Text>
      </View>

      <View className="flex flex-row items-center justify-between py-5">
        <View className="w-full my-4 bg-orange-500 rounded-lg">
          <Pressable onPress={handlePasswordSetup}>
            <Text
              className="text-white text-lg text-center py-3 px-4 "
              style={font.primary.bold}
            >
              {loading ? "Setting password..." : "Finish Setting Up Account"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
