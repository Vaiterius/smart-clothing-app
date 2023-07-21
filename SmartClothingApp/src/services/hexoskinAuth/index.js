import * as React from "react";
import { Button, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";

import { HEXO_CLIENT_ID } from "@env";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://api.hexoskin.com/oauth2/auth/",
  tokenEndpoint: "https://api.hexoskin.com/oauth2/token/",
};

async function getAccessTokenWithAuthorizationCode(authCode) {
  const response = await fetch("https://api.hexoskin.com/oauth2/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: `grant_type=authorization_code&code=${authCode}&client_id=${HEXO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      makeRedirectUri({
        native: "https://auth.expo.io/@arcs/SmartClothingApp",
      })
    )}`,
  });
  console.log(response);
  if (response.ok) {
    const data = await response.json();
    return data.access_token;
  } else {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }
}

export function HexoLogin() {
  const state = Math.random().toString(36).substring(7); // Generate a unique state string
  const uri = makeRedirectUri({
    native: "https://auth.expo.io/@arcs/SmartClothingApp",
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: HEXO_CLIENT_ID,
      redirectUri: uri,
      responseType: "code",
      scopes: [], // Specify the permissions you need
      state: state,
      // usePKCE: true, // This tells `expo-auth-session` to use PKCE
      
    },
    discovery
  );


  React.useEffect(() => {
    console.log(response, "useeffect");
    if (response?.type === "success") {
      const { code } = response.params;
      // Now you have the authorization code, you can use this code to request the access token
      getAccessTokenWithAuthorizationCode(code)
        .then((token) => {
          console.log("Access token:", token);
        })
        .catch((error) => {
          console.error("Failed to get access token:", error);
        });
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync().then((response) => {
            console.log(response, "button"); // Log the response here
          });
        }}
      />
    </View>
  );
}
