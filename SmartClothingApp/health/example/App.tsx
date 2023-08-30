import { StyleSheet, Text, View } from 'react-native';

import * as ReactNativeHealth from 'react-native-health';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ReactNativeHealth.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
