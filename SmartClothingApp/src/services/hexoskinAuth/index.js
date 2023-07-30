import * as React from "react";
import { Button, View, Linking } from "react-native";

import { HEXO_CLIENT_ID, HEXO_SCOPE } from "@env";

export function HexoLogin() {
  const state = React.useRef(Math.random().toString(36).substring(7)).current; // Generate a unique state string

  const authorize = () => {
    const redirectUri = encodeURIComponent(
      "https://auth.expo.io/@arcs/SmartClothingApp"
    );
    const url = `https://api.hexoskin.com/api/connect/oauth2/auth/?response_type=token&client_id=${HEXO_CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}`;

    Linking.openURL(url).catch((err) =>
      console.error("Failed to open the browser:", err)
    );
  };

  React.useEffect(() => {
    const handleUrl = (event) => {
      console.log("Handling URL:", event.url); // Log the entire URL

      const { url } = event;
      const fragment = url.split("#")[1];
      const params = new URLSearchParams(fragment);

      const accessToken = params.get("access_token");

      console.log("Access token:", accessToken); // Log the extracted access token

      if (accessToken) {
        console.log("Access token:", accessToken);
      } else {
        console.error("Failed to get access token.");
      }
    };

    Linking.addEventListener("url", handleUrl);

    return () => {
      Linking.removeEventListener("url", handleUrl);
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Login" onPress={authorize} />
    </View>
  );
}
