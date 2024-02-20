import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import {
  ActivityCard,
  AppHeader,
  BreathingRateChart,
  HeartRateChart,
  VentilationChart,
} from "../../components";
import { Button, Text } from "react-native-paper";
import { AppColor, AppFonts, AppStyle } from "../../constants/themes.js";
import { initialize, requestPermission, insertRecords } from "react-native-health-connect";

export default function HomeScreen({ navigation }) {
  
  const firstName = useSelector((state) => state.user.firstName);
  const insertSampleData = async () => {
    const isInitalized = await initialize();
    const grantedPermissions = await requestPermission([
      {accessType: 'insert', recordType: 'Steps'},
    ]);
    insertRecords({
        recordType: "StepsCount",
        startTime: "2024-01-25T08:00:00.000Z",
        endTime: "2024-01-25T09:00:00.000Z",
        steps: 5000,
      }).then((response) => {
        console.log(response.result);
      }).catch((error) => console.error(error));
    }
    
  return (
    <ScrollView style={styles.container}>
      <AppHeader title={"Dashboard"} />
      <View style={styles.body}>
        <Text style={AppStyle.title}>Hello, {firstName}</Text>
        <Text style={AppStyle.title}>Hello World</Text>
        <View style={styles.insights}>
          <Text
            style={[AppStyle.subTitle, { fontFamily: AppFonts.chakraBold }]}
          >
            Weekly Summary
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Insights")}
            icon={"arrow-right"}
            uppercase
            contentStyle={{ flexDirection: "row-reverse" }}
            style={{ alignSelf: "flex-end" }}
          >
            View
          </Button>
        </View>
        <Text variant="titleMedium" style={{ marginTop: 20 }}>
          Today Status
        </Text>
        <ActivityCard
          style={{ marginTop: 10 }}
          icon="directions-run"
          title="Activity"
          value="8H 25Min"
        />
        <ActivityCard
          style={{ marginTop: 10 }}
          icon="transfer-within-a-station"
          title="Steps"
          value="8000"
        />
        <ActivityCard
          style={{ marginTop: 10 }}
          icon="fitness-center"
          title="Calories"
          value="2000 Kcal"
        />

        <Text variant="titleMedium" style={{ marginTop: 20 }}>
          Breath Rate
        </Text>
        <BreathingRateChart />
        <Text variant="titleMedium" style={{ marginTop: 20 }}>
          Ventilation Rate
        </Text>
        <VentilationChart />
        <Text variant="titleMedium" style={{ marginTop: 20 }}>
          Heartbeat Rate
        </Text>
        <HeartRateChart />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
  },
  body: {
    padding: 10,
  },
  insights: {
    marginVertical: 10,
    elevation: 2,
    shadowColor: AppColor.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 5 },
    backgroundColor: AppColor.primaryContainer,
    padding: 10,
  },
});
