import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  AppStateStatus,
  BackHandler,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function Index() {
  // const [isRefreshing, setIsRefreshing] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
    })();
  }, []);

  // Handle Android back buttonn
  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior (exit app)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  // Handle app state changes to maintain proper layout
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        // Force status bar configuration when app becomes active
        StatusBar.setBarStyle("dark-content", true);
        StatusBar.setBackgroundColor("#fff", true);
        StatusBar.setTranslucent(false);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => subscription?.remove();
  }, []);

  // commented refresh 
  // const onRefresh = () => {
  //   setIsRefreshing(true);
  //   webViewRef.current.reload();
  //   setTimeout(() =>
  //     setIsRefreshing(false), 1000);

  // };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#fff"
          translucent={false}
        />
        <WebView
          ref={webViewRef}
          source={{ uri: "https://tracthing.com/" }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          sharedCookiesEnabled={true}
          startInLoadingState={true}
          mixedContentMode="compatibility"
          geolocationEnabled={true} // Enable geolocation
          originWhitelist={["*"]} // Allow all origins
          allowsFullscreenVideo={false}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
