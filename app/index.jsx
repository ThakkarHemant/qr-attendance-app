import { useEffect } from "react";
import { useRouter, Link } from "expo-router";
import {
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { logout } from "../lib/firebaseAuth";
import getCurrentSession from "../lib/firebaseAuth";

export default function HomeScreen() {
  const router = useRouter();

  // ✅ Auth check here (NOT in layout)
  useEffect(() => {
    getCurrentSession().then((isLoggedIn) => {
      if (!isLoggedIn) {
        router.replace("/auth");
      }
    });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/auth");
    } catch (err) {
      Alert.alert("Error", err.message || "Logout failed");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Image
        source={require("../assets/images/10X_logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>QR ATTENDANCE</Text>

      <Link href="/generate" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>GENERATE QR CODE</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/scan" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>SCAN QR CODE</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/attendance" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>VIEW ATTENDANCE</Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 50,
  },
  button: {
    backgroundColor: "#ff4800",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 18,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  logoutBtn: {
    backgroundColor: "#ff4800",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 18,
    marginTop: 20,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});