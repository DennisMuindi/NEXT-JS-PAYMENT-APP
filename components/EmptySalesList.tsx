import { View, Image, Text } from "react-native";

export default function EmptySalesList() {
  return (
    <View className="flex items-center justify-center  h-2/3">
      <Image
        source={require("../assets/nodata.png")}
        resizeMode="contain"
        className="w-80 h-80"
      />
      <Text className="text-gray-400 text-2xl text-center">
        No Sales History!
      </Text>
    </View>
  );
}
