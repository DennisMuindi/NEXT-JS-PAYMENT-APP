import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, Image, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { font } from "../utils/font.helpers";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserVerification() {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
  ]);
  const [loading, setLoading] = useState(false);
  const handleVerification = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      console.log("userID", userId);
      const enteredCode = verificationCode.join("");

      const response = await axios.post(
        "https://sales-control-api-development.up.railway.app/api/authentication/verify",
        {
          userId: userId,
          code: parseInt(enteredCode),
        }
      );

      if (response.data.verified) {
        console.log("Verification success!");
        router.push("/password");
      } else {
        console.log("Verification failed. Code does not match.");
      }
    } catch (error: any) {
      console.error("Error:", error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);

    if (index < verificationCode.length - 1 && value !== "") {
      const nextRef = refs[index + 1]?.current;
      if (nextRef) {
        nextRef.focus();
      }
    }
  };
  const refs: React.RefObject<TextInput>[] = Array.from(
    { length: verificationCode.length },
    () => React.createRef<TextInput>()
  );

  return (
    <SafeAreaView className="p-5">
      <View className="">
        <Image source={require("../assets/logo.png")} className="w-32 h-10" />
      </View>
      <View className="my-7">
        <Text
          className="text-xl text-gray-900 pb-4"
          style={font.primary.semibold}
        >
          A Verification Code has been sent.
        </Text>
        <Text
          className="font-thin text-gray-600 text-lg text-justify"
          style={font.primary.semibold}
        >
          Please check your Phone -We've sent a code to 070037234. Enter it
          below to verify your account and secure your experience.
        </Text>
      </View>

      <View className="mb-5">
        <Text
          style={font.primary.semibold}
          className="text-gray-500 text-lg pb-2"
        >
          Enter the code
        </Text>

        <View className="flex flex-row items-center gap-5">
          {verificationCode.map((digit, index) => (
            <TextInput
              key={index}
              ref={refs[index]}
              className="text-gray-700 border-2 text-center text-lg border-gray-300 py-2 px-4 rounded-sm w-12 h-12"
              style={font.primary.semibold}
              placeholder={`${index + 1}`}
              value={digit}
              onChangeText={(text) => handleCodeChange(index, text)}
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </View>
      </View>

      <View className=" flex flex-row items-center gap-2">
        <Text className="text-lg" style={font.primary.semibold}>
          Didn't Receive code?
        </Text>
        <Text
          className="text-orange-500 underline text-lg"
          style={font.primary.bold}
        >
          Resend code
        </Text>
      </View>

      <View className="flex flex-row items-center justify-between py-5">
        <View className="w-full my-4 bg-orange-500 rounded-lg">
          <Pressable onPress={handleVerification}>
            <Text
              className="text-white text-lg text-center py-3 px-4 "
              style={font.primary.bold}
            >
              {loading ? "Verifying..." : "Verify Phone Number"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
