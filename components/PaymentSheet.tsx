import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useContext,
  useState,
} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
} from "react-native";
import {
  BottomSheetModalOptions,
  GlobalModalContext,
  SaleReference,
} from "../context/AppContext";
import { font } from "../utils/font.helpers";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";

export default function PaymentSheet({
  modalValue,
  customerDetails,
  saleReference,
}: {
  modalValue: BottomSheetModalOptions;
  customerDetails: any;
  saleReference?: any;
}) {
  const context = useContext(GlobalModalContext);
  const [paymentMode, setPaymentMode] = useState("MOBILE");
  const [activeCustomer, setActiveCustomer] = useState({
    name: "",
    phoneNumber: "",
  });
  const [editablePhoneNumber, setEditablePhoneNumber] = useState(
    activeCustomer.phoneNumber
  );

  const [saleRef, setSaleRef] = useState<SaleReference>({
    saleRefNo: "",
    amount: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["45%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index == -1) {
      context.setStateValue({ modalValue: "hidden" });
    }
  }, []);

  const paymentModes = [
    {
      type: "MOBILE",
      name: "Mpesa",
      icon: require("../assets/mpesa.png"),
      description: "Receive Mpesa Payment",
    },
    {
      type: "CASH",
      name: "Cash",
      description: "Receive Cash Payment",
    },
  ];

  useEffect(() => {
    if (customerDetails !== undefined) {
      setActiveCustomer({
        name: customerDetails.name,
        phoneNumber: customerDetails.phoneNumber,
      });
    }

    if (modalValue === "shown") {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
      context.setStateValue({ modalValue: "hidden" });
    }

    if (saleReference) {
      setSaleRef(saleReference);
    }
  }, [customerDetails, modalValue, saleReference]);

  const handleSendPrompt = async () => {
    try {
      const response = await axios.request({
        url: "https://payments.artemisys.tech/stkpush",
        method: "POST",
        data: {
          reference: saleRef.saleRefNo,
          sender: `${activeCustomer.phoneNumber.slice(1).split(" ").join("")}`,
          amount: saleRef.amount,
          description: "1ec3cb96-3303-4bb4-8e51-7b16be394758",
        },
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // renders
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backgroundStyle={{
        borderRadius: 10,
        shadowColor: "black",
        shadowOpacity: 0.07,
        shadowRadius: 20,
      }}
    >
      <View className="px-6 py-2">
        <Text className="text-[16px] mb-2" style={font.primary.semibold}>
          Select Mode of Payment
        </Text>
        {paymentModes.map((mode) => (
          <TouchableOpacity
            onPress={() => setPaymentMode(mode.type)}
            key={mode.name}
            className={[
              "flex flex-row justify-between items-center p-3 border-2 my-2 rounded-xl",
              paymentMode === mode.type
                ? "border-orange-400"
                : "border-gray-200",
            ].join(" ")}
          >
            <View
              className={[
                "border border-gray-200 px-2 rounded-md",
                paymentMode === mode.type
                  ? "border-orange-500"
                  : "border-gray-200",
              ].join(" ")}
            >
              {mode.icon !== undefined ? (
                <Image
                  source={mode.icon}
                  resizeMode="contain"
                  className="w-12"
                />
              ) : (
                <Text
                  className={[
                    "uppercase text-sm font-bold py-2 px-1",
                    paymentMode === mode.type
                      ? "text-orange-500"
                      : "text-blue-400",
                  ].join(" ")}
                >
                  {mode.name}
                </Text>
              )}
            </View>

            <View className="ml-4 w-2/3">
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: font.primary.semibold.fontFamily,
                }}
                className={[
                  "font-semibold",
                  paymentMode === mode.type ? "text-orange-500" : "text-black",
                ].join(" ")}
              >
                {mode.name}
              </Text>
              <Text
                style={font.primary.medium}
                className={[
                  "text-[15px]",
                  paymentMode === mode.type ? "text-orange-500" : "text-black",
                ].join(" ")}
              >
                {mode.description}
              </Text>
            </View>

            <View>
              {paymentMode !== mode.type ? (
                <Entypo name="circle" size={24} color="#e9e9e9" />
              ) : (
                <Entypo name="check" size={20} color="orange" />
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* TODO: Give them the option to change the phone number that receives the prompt */}

        <Pressable
          className="my-4 p-3 bg-orange-500 rounded-lg"
          onPress={() => {
            setIsLoading(true);
            if (paymentMode === "MOBILE") {
              handleSendPrompt();
            } else {
              console.log("Confirm Payment");
            }
          }}
        >
          <Text
            style={font.primary.semibold}
            className="text-center font-semibold text-white"
          >
            {isLoading
              ? "Please Wait.... Sending the prompt"
              : !isLoading && paymentMode === "MOBILE"
              ? "Send Prompt To Customer"
              : "Confirm Payment"}
          </Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  );
}
