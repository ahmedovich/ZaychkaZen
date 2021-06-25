import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Zen } from "./src/features/Zen/Zen";
import { ZenHistory } from "./src/features/Zen/ZenHistory";
import { Timer } from "./src/features/timer/Timer";
import { spacing } from "./src/utils/sizes";

const STATUSES = {
  COMPLETE: 1,
  CANCELLED: 2,
};

export default function App() {
  const [zenSubject, setZenSubject] = useState(null);
  const [zenHistory, setZenHistory] = useState([]);

  const addZenHistorySubjectWithStatus = (subject, status) => {
    setZenHistory([
      ...zenHistory,
      { key: String(zenHistory.length + 1), subject, status },
    ]);
  };

  const onClear = () => {
    setZenHistory([]);
  };

  const saveZenHistory = async () => {
    try {
      await AsyncStorage.setItem("zenHistory", JSON.stringify(zenHistory));
    } catch (e) {
      console.log(e);
    }
  };

  const loadZenHistory = async () => {
    try {
      const history = await AsyncStorage.getItem("zenHistory");
      if (history && JSON.parse(history).length) {
        setZenHistory(JSON.parse(history));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadZenHistory();
  }, []);

  useEffect(() => {
    saveZenHistory();
  }, [zenHistory]);

  return (
    <ImageBackground
      source={require("./src/components/Pictures/wedding.jpg")}
      style={styles.container}
    >
      {zenSubject ? (
        <Timer
          zenSubject={zenSubject}
          onTimerEnd={() => {
            addZenHistorySubjectWithStatus(zenSubject, STATUSES.COMPLETE);
            setZenSubject(null);
          }}
          clearSubject={() => {
            addZenHistorySubjectWithStatus(zenSubject, STATUSES.CANCELLED);
            setZenSubject(null);
          }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Zen addSubject={setZenSubject} />
          <ZenHistory zenHistory={zenHistory} onClear={onClear} />
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: null,
    width: null,
    opacity: 0.85,
    paddingTop: Platform.OS === "ios" ? spacing.md : spacing.lg,
  },
});
