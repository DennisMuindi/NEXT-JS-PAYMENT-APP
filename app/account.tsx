import { Link, router } from "expo-router";
import {
  Image,
  View,
  Text,
  Button,
  Pressable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { font } from "../utils/font.helpers";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AccountDetails() {
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawalOptions, setWithdrawalOptions] = useState(false);

  const [amount, setAmount] = useState("0");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountBalance, setAccountBalance] = useState<any>();
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

  async function handleWithdrawal() {
    setWithdrawing(true);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://payments.artemisys.tech/initiate/withdrawal",
        {
          amount: amount,
          phone: `${country?.callingCode}${phoneNumber}`,
          description: "d71162b3-226b-45d2-b468-ea9881c087e0",
          occassion: "Payday",
        }
      );
      if (response.data.pending === true) {
        router.push("/verifywithdrawal");
      }
    } catch (e: any) {
      console.log("Error!!!", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={{ flex: 1, justifyContent: "space-between" }}
      className="mt-12 px-4"
    >
      <View>
        <View className="border-b-2 border-gray-300">
          <Text
            style={font.primary.bold}
            className="text-gray-800 text-3xl pb-5"
          >
            Wallet
          </Text>
        </View>

        <View className="flex flex-row items-center py-3">
          <Link
            href="/"
            style={font.primary.semibold}
            className="text-orange-500 text-[18px]"
          >
            <Image
              source={require("../assets/back.png")}
              className="w-4 h-4"
              resizeMode="contain"
            />
            {"   "}
            Back
          </Link>
        </View>

        <View>
          <Text
            style={font.primary.semibold}
            className="text-gray-700 text-2xl pb-5"
          >
            Withdraw From Wallet
          </Text>
        </View>
        <View>
          <View className="">
            <View className="py-2">
              <Text
                style={font.primary.semibold}
                className="text-gray-500 text-lg"
              >
                Phone Number
              </Text>
            </View>
            <View className=" flex flex-row items-center mb-4">
              <View className="py-3 px-4 mr-3 text-gray-500 border-2  border-gray-300 rounded-lg">
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
                className="text-gray-500 border-2 border-gray-300 py-3 px-4 w-[75%] rounded-lg"
                style={font.primary.semibold}
                placeholder="700000000"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
            <View className="pb-7 ">
              <Text
                style={font.primary.semibold}
                className="text-gray-500 text-lg pb-4"
              >
                Total Balance
              </Text>
              <Text
                style={font.primary.semibold}
                className="text-orange-500 text-3xl"
              >
                KES.{accountBalance && accountBalance.balance}
              </Text>
            </View>
            <View className="py-2 w-[75%]">
              <Text
                style={font.primary.semibold}
                className="text-gray-500 text-lg"
              >
                Enter the amount to withdraw
              </Text>
            </View>
            <View className="w-full">
              <TextInput
                onChangeText={(text) => setAmount(text)}
                className="px-5 py-3 border-2 border-gray-300 rounded-lg "
                style={font.primary.medium}
                placeholder=""
              />
            </View>
            <View className="py-2 w-[75%]">
              <Text
                style={font.primary.semibold}
                className="text-gray-500 text-lg"
              >
                Withdraw full amount
              </Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleWithdrawal}
        className="bg-orange-500 px-12 py-3 rounded-md my-4 b-0"
      >
        <Text
          style={font.primary.semibold}
          className="text-center text-white font-semibold"
        >
          {loading ? "Please Wait..." : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
