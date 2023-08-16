import * as React from "react";
import { Button, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';

import { HEXO_CLIENT_ID, HEXO_CLIENT_SECRET } from "@env";

export function HexoLogin() {
  
  WebBrowser.maybeCompleteAuthSession();

  const discovery = {
    authorizationEndpoint: 'https://api.hexoskin.com/api/connect/oauth2/auth/',
  };
  
  const state = Math.random().toString(36).substring(7); // Generate a unique state string


  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: HEXO_CLIENT_ID,
      //client_secret: HEXO_CLIENT_SECRET,
      redirectUri: makeRedirectUri({
        scheme: 'smartclothingapp'
      }),
      scopes: [], // Specify the permissions you need
      state: state,
      extraParams: {
        client_secret: HEXO_CLIENT_SECRET
      }
      //usePKCE: true, // This tells `expo-auth-session` to use PKCE
      
    },
    discovery
  );

  React.useEffect(() => {
    if (response && response.type === 'success') {
      const token = response.params.access_token;
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button disabled={!request} onPress={() => promptAsync()} title="Login" />
    </View>
  );
}