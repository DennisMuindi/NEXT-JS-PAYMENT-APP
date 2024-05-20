import { Link, router, Redirect } from "expo-router";
import { useState } from "react";
import { View, Text } from "react-native";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  if (!isLoggedIn) {
    return <Redirect href={"/login"} />;
  }
}
