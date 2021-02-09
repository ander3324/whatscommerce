import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import Toast from "react-native-easy-toast";

import RegisterForm from "../../Components/RegisterForm";

export default function Registrar() {

    const toastRef = useRef();

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#128C7E" />
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.imglogo}
        />
        <Text style={styles.textbanner}>Crear una Cuenta</Text>
        <RegisterForm toastRef={toastRef} />
        <Toast
          ref={toastRef}
          position="center"
          opacity={0.9}
          fadeOutDuration={3000}
        />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#128C7E"
    },
    imglogo: {
        width: 106,
        height: 106,
        marginTop: 40,
        alignSelf: "center"
    },
    textbanner: {
        fontFamily: "Roboto",
        fontWeight: "bold",
        fontSize: 30,
        color: "#fff",
        alignSelf: "center"
    }
});
