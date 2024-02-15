import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { AppHeader } from "../../components";
import DailyMetrics from "../../components/DailyMetrics/DailyMetrics";
import Icon from "react-native-vector-icons/FontAwesome5";
import { AppColor, AppStyle, AppFonts } from "../../constants/themes";

const ViewBikingData = ({ route }) => {
  const { previousScreenTitle } = route.params;
  return (
    <ScrollView>
      <AppHeader title={previousScreenTitle} back={true} />
      <DailyMetrics name="Biking Data" />

      <View style={styles.title}>
        <View style={styles.bigIcon}>
          <Icon name="bicycle" size={40} color={AppColor.primary} />
        </View>
        <Text style={styles.dataText}>Biking</Text>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricTitle}>Total Time</Text>
            <Text style={styles.metricValue}>1:11:50</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricTitle}>Distance</Text>
            <Text style={styles.metricValue}>8.78 MI</Text>
          </View>
        </View>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricTitle}>Active Calories</Text>
            <Text style={styles.metricValue}>203 CAL</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricTitle}>Total Calories</Text>
            <Text style={styles.metricValue}>310 CAL</Text>
          </View>
        </View>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricTitle}>Avg. Heart Rate</Text>
            <Text style={styles.metricValue}>95 BPM</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricTitle}>Avg. Speed</Text>
            <Text style={styles.metricValue}>7.3 MPH</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 10,
    gap: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  bigIcon: {
    backgroundColor: AppColor.primaryContainer,
    height: 70,
    width: 70,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  dataText: {
    color: "black",
    fontSize: 25,
  },

  metricsContainer: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  metricItem: {
    width: "48%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  metricTitle: {
    fontSize: 23,
    color: "black", // Dark grey color for the text
  },
  metricValue: {
    fontSize: 25,
    fontWeight: "bold",
    color: AppColor.primary, // Black color for the number
  },
});

export default ViewBikingData;
