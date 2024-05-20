import { View, Pressable, TextInput, Text } from "react-native";
import { font } from "../utils/font.helpers";
import { useState } from "react";

export default function AlternatePhoneNumber({
  activeCustomer,
}: {
  activeCustomer: any;
}) {
  const [alternatePhoneNumber, setAlternatePhoneNumber] = useState(false);
  return (
    <>
      <View className="flex flex-row">
        <Text className="text-[16px] text-gray-400 font-medium">
          Sending Prompt to (254) {activeCustomer.phoneNumber}
        </Text>
        <Pressable
          onPress={() => setAlternatePhoneNumber(!alternatePhoneNumber)}
        >
          <Text className="ml-2 text-orange-500 text-sm underline">
            Change Number
          </Text>
        </Pressable>
      </View>
      <View className="my-2 flex flex-row items-center px-3 rounded border border-gray-300">
        <Text
          style={font.primary.bold}
          className="text-[16px] font-bold text-gray-300"
        >
          254
        </Text>
        <TextInput
          placeholder="Enter Name"
          style={font.primary.medium}
          className="text-[16px] font-medium text-gray-500 p-2 "
        />
      </View>
    </>
  );
}
