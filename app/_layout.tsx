import { Slot, Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../Redux/store";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";

import {
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Quicksand_600SemiBold,
    Quicksand_400Regular,
    Quicksand_700Bold,
    Quicksand_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
