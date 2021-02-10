import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SwitchNavigator from "./src/Navigation/SwitchNavigator";
import RutasNoAutenticadas from "./src/Navigation/RutasNoAutenticadas";
import { validarSesion } from "./src/Utils/Acciones";
import Loading from "./src/Components/Loading";

export default function App() {
  
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    validarSesion(setUser);
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
