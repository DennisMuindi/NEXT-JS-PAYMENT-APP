import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import axios from "axios";
import { Link, useLocalSearchParams } from "expo-router";
import { font } from "../../utils/font.helpers";
import { GlobalModalContext } from "../../context/AppContext";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProductList() {
  const { id } = useLocalSearchParams();

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
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [salesData, setSalesData] = useState<any>([]);
  const [shopId, setShopId] = useState<any>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);
  const { state, setStateValue } = useContext(GlobalModalContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 20;

  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchShopId = async () => {
      try {
        const shopListResponse = await axios.get(
          "https://sales-control-api-development.up.railway.app/api/shop/list"
        );

        const shopId = shopListResponse.data.map((item: any) => item.id);
        console.log("SHop id : ", shopId);
        setShopId(shopId);
      } catch (error) {}
    };

    fetchShopId();
  }, []);

  const handleAddService = async () => {
    try {
      setIsLoading(true);

      const token = await AsyncStorage.getItem("token");

      const response = await axios.post(
        "https://sales-control-api-development.up.railway.app/api/inventory/add-service",
        {
          name,
          serviceRate: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            shop: shopId,
          },
        }
      );

      console.log("Response:", response.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeSale = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://sales-control-api-development.up.railway.app/api/sales/make-sale",
        {
          cart: {
            amount: 0,
            cartStatus: "CLEARED",
            saleItems: [
              {
                service: {
                  id: "string",
                  name: "string",
                  serviceRate: "string",
                },
                quantity: 0,
                subTotal: 0,
              },
            ],
          },
          modeOfPayment: "Cash",
          splitOptions: {
            cash: 0,
            bank: 0,
            mpesa: 0,
            total: 0,
          },
          paidAmount: 0,
          customerId: "string",
          shopId,
        }
      );
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiateStk = async () => {
    try {
      setIsLoading(true);
      const response = await axios.request({
        url: "https://payments.artemisys.tech/stkpush",
        method: "POST",
        data: {
          reference: "",
          sender: "254705902646".slice(1).split(" ").join(""),
          amount: 10,
          description: "1ec3cb96-3303-4bb4-8e51-7b16be394758",
        },
      });
      console.log("sending prompt");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const filterSalesData = () => {
    return salesData.filter((sale: any) => {
      return (
        sale.saleReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sale.customer &&
          sale.customer.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  };
  const displayedSalesData = filterSalesData().slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View className="">
      <View className="flex flex-row  justify-between gap-2 py-4">
        <View className="flex flex-row border border-gray-300 items-center py-2 px-3 flex-1 rounded-lg">
          <Image
            source={require("../../assets/search.png")}
            className="w-4 h-4"
          />
          <TextInput
            placeholder="Search"
            className="ml-2 w-full"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
        <View className=" border border-gray-200 rounded-md p-2">
          <Image
            source={require("../../assets/download.png")}
            className="w-6 h-6"
          />
        </View>
        <Pressable className="" onPress={() => setIsServiceModalVisible(true)}>
          <Image
            source={require("../../assets/addButton.png")}
            className="w-11 h-11 rounded-lg"
          />
        </Pressable>
      </View>
      <View
        className="rounded-2xl shadow shadow-gray-100 bg-white h-[68vh]"
        style={{
          elevation: 10,
          shadowOpacity: 0.5,
          shadowColor: "#777",
        }}
      >
        <View className="flex flex-row items-center text-lg p-4 border-b border-gray-300">
          <Text
            className="font-medium text-sm text-gray-400 w-[50%]"
            style={font.primary.bold}
          >
            Payment Name
          </Text>
          <Text
            className="font-medium text-sm text-gray-400 w-[30%]"
            style={font.primary.bold}
          >
            Total
          </Text>
          <Text></Text>
        </View>
        <ScrollView>
          {displayedSalesData.length === 0 ? (
            <View className="flex flex-col items-center justify-center h-full">
              <View
                className="h-80"
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../assets/noproduct.png")}
                  className="h-60 w-72"
                />
              </View>

              <Text
                style={font.primary.semibold}
                className="text-gray-400 text-xl pb-2"
              >
                There are no products!
              </Text>
              <Pressable
                onPress={() => setIsModalVisible(true)}
                className="bg-orange-500 rounded-lg"
              >
                <Text
                  style={font.primary.bold}
                  className="text-white py-3 px-3 "
                >
                  Create Payment Link
                </Text>
              </Pressable>
            </View>
          ) : (
            displayedSalesData.map((sale: any, index: any) => (
              <View key={sale.saleReference}>
                <View className="w-full flex flex-row items-center justify-between text-lg p-3 border-b border-gray-300">
                  <Text
                    className="font-semibold text-gray-500 w-[20%]"
                    style={font.primary.bold}
                  >
                    {sale.saleReference.slice(0, 7)}...
                  </Text>
                  <Text
                    className=" text-gray-500 font-light w-[35%]"
                    style={font.primary.medium}
                  >
                    {sale.customer && sale.customer.name}
                  </Text>
                  <Text
                    className=" text- font-semibold  w-[30%]"
                    style={font.primary.semibold}
                  >
                    KES {Number(sale.cart.amount).toLocaleString("en-US")}
                  </Text>
                  <Link
                    className="active:bg-gray-50"
                    href={`/sales/${sale.saleReference}`}
                  >
                    <Image
                      source={require("../../assets/eye-open.png")}
                      className="w-6 h-6"
                    />
                  </Link>
                </View>
              </View>
            ))
          )}
        </ScrollView>
        <View className="p-4 bottom-0">
          <View className="flex flex-row justify-between items-center">
            <View className="border border-gray-400 py-2 px-5 rounded-xl">
              <Text
                className="font-semibold text-lg text-center text-gray-500"
                style={font.primary.semibold}
              >
                {currentPage}
              </Text>
            </View>
            <View>
              <Text
                className="text-lg text-gray-400 mx-3"
                style={font.primary.semibold}
              >
                Entries
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center gap-2">
              <View className="flex flex-row items-center border border-gray-400 py-2 px-6 rounded-xl">
                <Pressable onPress={handlePreviousPage}>
                  <Text
                    className="text-gray-500 text-lg font-semibold "
                    style={font.primary.semibold}
                  >
                    Previous
                  </Text>
                </Pressable>
              </View>
              <View className="flex flex-row items-center border border-gray-400 py-2 px-6 rounded-xl">
                <Pressable onPress={handleNextPage}>
                  <Text
                    className="text-gray-500 text-lg font-semibold"
                    style={font.primary.semibold}
                  >
                    Next
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View className="bg-white rounded-lg w-full p-2">
            <View className="flex flex-row items-center w-full justify-between border-b-2 border-gray-300 ">
              <Text
                className=" text-gray-700 text-2xl px-2 py-3"
                style={font.primary.semibold}
              >
                Create Payment Link
              </Text>
              <Pressable onPress={() => setIsModalVisible(false)}>
                <Text
                  className=" text-gray-500 text-2xl px-6"
                  style={font.primary.bold}
                >
                  X
                </Text>
              </Pressable>
            </View>

            <View className="">
              <View className="pt-3 px-3">
                <Text
                  style={font.primary.semibold}
                  className="text-gray-500 text-lg pb-2"
                >
                  Payment Name
                </Text>
                <TextInput
                  className="text-gray-500 border-2 border-gray-300 py-2 px-4 rounded-lg"
                  style={font.primary.semibold}
                  placeholder=""
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <View className="py-4 px-3">
                <Text
                  style={font.primary.semibold}
                  className="text-gray-500 text-lg pb-2"
                >
                  Enter Amount
                </Text>
                <TextInput
                  className="text-gray-700 border-2 border-gray-300 py-2 px-4 rounded-lg"
                  style={font.primary.semibold}
                  placeholder="KES"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              <View className="py-4 px-3">
                <Text
                  style={font.primary.semibold}
                  className="text-gray-500 text-lg pb-2"
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
              </View>
            </View>

            <View className="flex flex-row items-center justify-between px-3 py-4">
              <Pressable
                onPress={() => setIsModalVisible(false)}
                className="border-gray-200 border-1 rounded-lg"
              >
                <Text
                  className=" text-gray-500 text-lg py-3 px-6"
                  style={font.primary.semibold}
                >
                  Copy Link
                </Text>
              </Pressable>

              <Pressable
                onPress={handleInitiateStk}
                className="bg-orange-500 rounded-lg"
              >
                <Text
                  className="text-lg py-3 px-8 text-white"
                  style={font.primary.semibold}
                >
                  {isLoading ? "Sending...." : "Initiate STK"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isServiceModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsServiceModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View className="bg-white rounded-lg w-full p-2">
            <View className="flex flex-row items-center w-full justify-between border-b-2 border-gray-300 ">
              <Text
                className=" text-gray-700 text-2xl px-2 py-3"
                style={font.primary.semibold}
              >
                Add Service
              </Text>
              <Pressable onPress={() => setIsServiceModalVisible(false)}>
                <Text
                  className=" text-gray-500 text-2xl px-6"
                  style={font.primary.bold}
                >
                  X
                </Text>
              </Pressable>
            </View>

            <View className="">
              <View className="pt-3 px-3">
                <Text
                  style={font.primary.semibold}
                  className="text-gray-500 text-lg pb-2"
                >
                  Service Name
                </Text>
                <TextInput
                  className="text-gray-500 border-2 border-gray-300 py-2 px-4 rounded-lg"
                  style={font.primary.semibold}
                  placeholder="eg haircut"
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <View className="py-4 px-3">
                <Text
                  style={font.primary.semibold}
                  className="text-gray-500 text-lg pb-2"
                >
                  Service Rate
                </Text>
                <TextInput
                  className="text-gray-700 border-2 border-gray-300 py-2 px-4 rounded-lg"
                  style={font.primary.semibold}
                  placeholder="KES"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>

            <View className="flex flex-row items-center justify-between px-3 py-4">
              <Pressable
                onPress={handleAddService}
                className="bg-orange-500 rounded-lg"
              >
                <Text
                  className="text-lg py-3 px-8 text-white"
                  style={font.primary.semibold}
                >
                  {isLoading ? "Saving...." : "Save Changes"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(128, 128, 128, .6)",
    padding: 16,
  },
});
