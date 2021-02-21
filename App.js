import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, LogBox } from "react-native";
import SwitchNavigator from "./src/Navigation/SwitchNavigator";
import RutasNoAutenticadas from "./src/Navigation/RutasNoAutenticadas";
import { validarSesion, iniciarnotificaciones } from "./src/Utils/Acciones";
import Loading from "./src/Components/Loading";
import { encode, decode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

LogBox.ignoreLogs([
  "Animated",
  "Setting a timer",
  "Avatar.onAccessoryPress",
  "Avatar.showAccessory",
]);

export default function App() {
  
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    setLoading(true);
    validarSesion(setUser);
    iniciarnotificaciones(notificationListener, responseListener);
    setLoading(false);
  }, []);

  if(loading) {
    return <Loading isVisible = {loading} text = "Cargando..." />
  }

  return user ? <SwitchNavigator /> :  <RutasNoAutenticadas />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
