import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as StoreProvider } from "react-redux";

import AppRouter from "./src/navigation";
import { useAppFonts } from "./src/hooks/useAppFonts";
import { AppTheme } from "./src/constants/themes";

import configureStore from "./src/store";

import { HexoLogin } from "./src/services/hexoskinAuth";
import connectToHexoskin from "./src/services/hexoskinApi";

const store = configureStore();

export default function App() {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const loadFont = async () => {
      const res = await useAppFonts();
      setLoading(false);
    };
    loadFont();
  }, []);

  return (
    <>
      {!isLoading && (
        <SafeAreaView style={{ flex: 1 }}>
          <StoreProvider store={store}>
            <PaperProvider theme={AppTheme}>
              <NavigationContainer>
                <HexoLogin />
                <AppRouter />
              </NavigationContainer>
            </PaperProvider>
          </StoreProvider>
        </SafeAreaView>
      )}
    </>
  );
}

