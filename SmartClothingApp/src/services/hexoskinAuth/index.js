import * as React from 'react';
import { Button, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
// import * as Random from 'expo-random';

import {HEXO_CLIENT_ID} from '@env'
import {HEXO_CLIENT_SECRET} from '@env'

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://api.hexoskin.com/oauth2/auth/',
  tokenEndpoint: 'https://api.hexoskin.com/oauth2/token/',
};

export function HexoLogin() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: HEXO_CLIENT_ID,
      redirectUri: makeRedirectUri({
        native: 'https://auth.expo.io/@arcs/SmartClothingApp',
        useProxy: true,
      }),
      responseType: 'code',
      scopes: [], // Specify the permissions you need
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      // Now you have the authorization code, you can use this code to request the access token
      // TODO: Implement the function to exchange the code for an access token
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync({ useProxy: true });
        }}
      />
    </View>
  );
}
