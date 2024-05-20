import { View, Text } from "react-native";
import SalesList from "./products";
import { Link } from "expo-router";
import { font } from "../../utils/font.helpers";

export default function Index() {
  return (
    <View className="">
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={font.primary.semibold} className="text-lg">
            Payment Links
          </Text>
          <Link
            style={font.primary.semibold}
            className="text-orange-500 border border-orange-300 p-2 rounded-md"
            href="/wallet"
          >
            View Account Details
          </Link>
        </View>
      </View>
      <SalesList />
    </View>
  );
}
