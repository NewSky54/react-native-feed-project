import React, { useEffect } from "react";
import { ApolloProvider } from "@apollo/client";
import makeApolloClient from "./apollo";
import Home from "./src/home";
import { Text } from "react-native";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";

export default function App() {
  let [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_800ExtraBold,
  });

  const client = makeApolloClient();

  if (!client) {
    return <Text>Loading...</Text>;
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <ApolloProvider client={client}>
        <Home />
      </ApolloProvider>
    );
  }
}
