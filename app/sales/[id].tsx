import axios from "axios";
import { Link, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Image,
  Text,
  Button,
  ScrollView,
  Pressable,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { font } from "../../utils/font.helpers";
import {
  BottomSheetModalOptions,
  CustomerDetails,
  GlobalModalContext,
} from "../../context/AppContext";

export default function SaleId() {
  const { id } = useLocalSearchParams();
  const [saleDetails, setSaleDetails] = useState<any>();
  const [refreshing, setRefreshing] = useState(false);
  const { state, setStateValue } = useContext(GlobalModalContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://sales-control-api-development.up.railway.app/api/sales/list",
          {
            params: {
              shop: "1ec3cb96-3303-4bb4-8e51-7b16be394758",
              ref: id,
            },
            headers: {
              "x-organization-id": "3d2c7967-5fb0-4fd5-ba02-42da8464cbd3",
            },
          }
        );

        setSaleDetails(response.data);

        setStateValue({
          modalValue: "hidden",
          customerValue: {
            name: response.data.customer?.name,
            phoneNumber: response.data.customer?.phoneNumber,
          },
          saleReference: {
            saleRefNo: id as string,
            amount: response.data.cart?.amount,
          },
        });
      } catch (error) {
      } finally {
        setRefreshing(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <SafeAreaView className="min-h-[75vh]" style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View className="text-gray-400 text-2xl text-center">
          <View className="flex flex-row items-center">
            <Link
              href="/"
              style={font.primary.semibold}
              className="text-orange-500 text-[18px]"
            >
              <Image
                source={require("../../assets/back.png")}
                className="w-4 h-4"
                resizeMode="contain"
              />
              {"  "}
              Back
            </Link>
          </View>
          <View className="flex flex-row items-center justify-between my-2 border-b border-gray-300 pb-4 pt-3">
            <Text className="text-xl " style={font.primary.bold}>
              {id}
            </Text>
            <View className="px-4 py-2 border border-gray-200 rounded-lg">
              <Image
                source={require("../../assets/download.png")}
                className="w-5 h-5"
              />
            </View>
          </View>
          {saleDetails && saleDetails.customer ? (
            <>
              <View
                className={[
                  "p-5 mt-2 border-2",
                  state.modalValue === "shown"
                    ? "border-gray-200"
                    : "border-gray-50",
                ].join(" ")}
              >
                <View className="border border-gray-300 rounded-xl p-4 w-full ">
                  <Text
                    className="font-semibold text-lg uppercase"
                    style={font.primary.semibold}
                  >
                    {(saleDetails.customer && saleDetails.customer?.name) ||
                      "N/A"}
                  </Text>
                  <View className="flex flex-row items-center justify-between">
                    <Text
                      className="text-gray-500 text-sm"
                      style={font.primary.medium}
                    >
                      {saleDetails.customer && saleDetails.customer.phoneNumber}
                    </Text>
                    <Text
                      className="text-orange-500 uppercase"
                      style={font.primary.bold}
                    >
                      {saleDetails.cart && saleDetails.cart.cartStatus}
                    </Text>
                  </View>
                </View>
                <View className="flex flex-row items-center justify-between py-2 border-b border-gray-200">
                  <Text
                    className="text-lg text-gray-400"
                    style={font.primary.semibold}
                  >
                    No. of Items
                  </Text>
                  <Text
                    className="text-lg text-gray-400"
                    style={font.primary.semibold}
                  >
                    {saleDetails.cart && saleDetails.cart.saleItems.length}
                  </Text>
                </View>

                <View className="flex flex-row items-center justify-between py-3 border-b border-gray-200">
                  <Text className=" text-xl " style={font.primary.semibold}>
                    Total Amount
                  </Text>
                  <Text className="text-xl " style={font.primary.semibold}>
                    Kshs.{" "}
                    {saleDetails.cart &&
                      Number(saleDetails.cart.amount).toLocaleString("en-US")}
                  </Text>
                </View>
                <ScrollView
                  className=""
                  style={{ maxHeight: 310 }}
                  pagingEnabled={true}
                >
                  {saleDetails.cart &&
                    saleDetails.cart.saleItems.map(
                      (saleItem: any, index: any) => (
                        <View
                          key={index}
                          className="flex flex-row justify-between text-lg p-2 border-b border-gray-100"
                        >
                          <Text className="w-[10%] text-gray-300 text-lg">
                            {index + 1}.
                          </Text>
                          <View className="w-[80%] gap-1">
                            <Text
                              className="text-[16px]"
                              style={font.primary.medium}
                            >
                              {saleItem.product && saleItem.product.name}
                            </Text>
                            <Text
                              className="font-semibold text-[18px]"
                              style={font.primary.bold}
                            >
                              Ksh.{" "}
                              {Number(saleItem.subTotal).toLocaleString(
                                "en-US"
                              )}
                            </Text>
                          </View>
                          <View className="flex flex-row items-center gap-2">
                            <Image
                              source={require("../../assets/close.png")}
                              resizeMode="contain"
                              className="w-2"
                            />
                            <Text
                              className="text-lg text-gray-400"
                              style={font.primary.regular}
                            >
                              {saleItem.quantity}
                            </Text>
                          </View>
                        </View>
                      )
                    )}
                </ScrollView>
              </View>
            </>
          ) : (
            <View>
              <Text>Loading</Text>
            </View>
          )}
        </View>
        <View className=" bottom-0 w-full mt-2">
          <Pressable className="p-3 w-full rounded-lg text-white border-gray-400 border-2">
            <Text className=" text-center" style={font.primary.semibold}>
              Copy Link
            </Text>
          </Pressable>
        </View>

        <View className=" bottom-0 w-full mt-2">
          <Pressable
            onPress={() =>
              state.modalValue === "hidden"
                ? setStateValue({ modalValue: "shown" })
                : setStateValue({ modalValue: "hidden" })
            }
            className="p-3 w-full rounded-lg text-white bg-orange-500"
          >
            <Text
              className="text-white text-center"
              style={font.primary.semibold}
            >
              Initiate Payment STK
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
