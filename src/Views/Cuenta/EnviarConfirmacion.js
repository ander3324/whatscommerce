import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Alert } from 'react-native';
import { Button, Icon } from "react-native-elements";
import CountryPicker from 'react-native-country-picker-modal';
import { useNavigation } from "@react-navigation/native";
import { isEmpty } from "lodash";
import FirebaseRecaptcha from "../../Utils/FirebaseRecaptcha";
import { enviarConfirmacionPhone } from "../../Utils/Acciones";

export default function EnviarConfirmacion() {

    const [ country, setCountry ] = useState("AR");
    const [ callingCode, setCallingCode ] = useState("54");
    const [ phone, setPhone ] = useState("");

    const recaptchaVerifier = useRef();
    const inputPhone = useRef();

    const navigation = useNavigation();

    const enviarConfirmacion = async () => {
        if(!isEmpty(phone)) {
            const numero = `+${callingCode}${phone}`;
            const verificationId = await enviarConfirmacionPhone(numero, recaptchaVerifier);
            if(!isEmpty(verificationId)) {
                navigation.navigate("confirmar-movil", { verificationId });
            } else {
                Alert.alert("Verificación", "Introduzca un número válido", [{
                    style: "cancel",
                    text: "Ok",
                    onPress: () => {
                        inputPhone.current.clear();
                        inputPhone.current.focus();
                    }
                }]);
            }
        }
    }

    return (
        <View style = { styles.container }>
            <Image 
                source = {require("../../../assets/logo.png")}
                style = { styles.imglogo }
            />
            <View style={styles.panel}>
                <View
                    style={{
                        borderBottomColor: "#25D366",
                        borderBottomWidth: 2,
                        width: 100
                    }}
                >
                </View>
                <View style = { styles.panelinterno }>
                    <Icon 
                        name = "whatsapp"
                        type = "material-community"
                        size = { 100 }
                        color = "#25D366"
                    />
                    <Text style = { styles.titulo }>Ingresar tu número de Whatsapp</Text>
                    <View style = { styles.viewtelefono } >
                        <CountryPicker 
                            withFlag
                            withCallingCode
                            withFilter
                            withCallingCodeButton
                            countryCode = { country }
                            onSelect = {(Country) => {
                                console.log(Country);
                                setCountry(Country.cca2);
                                setCallingCode(...Country.callingCode);
                            }}
                        />
                        <Text style = {{ color: "#fff" }}>{" "} | {" "} </Text>
                        <TextInput 
                            placeholder = "Número de Whatsapp"
                            style = { styles.input }
                            placeholderTextColor = "#fff"
                            onChangeText = { (text) => setPhone(text) }
                            value = { phone }
                            ref = { inputPhone }
                        />
                    </View>
                    <Button 
                        title = "Confirmar Número"
                        buttonStyle = {{ 
                            backgroundColor: "#25D366", 
                            marginHorizontal: 20 
                        }}
                        containerStyle = {{
                            marginVertical: 20
                        }}
                        onPress = { () => enviarConfirmacion() }
                    />
                </View>
            </View>
            <FirebaseRecaptcha referencia = {recaptchaVerifier} />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#128C7E'
    },
    imglogo: {
        width: 106,
        height: 106,alignSelf: "center",
        marginVertical: 40
    },
    panel: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 20,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        alignItems: "center"
    },
    panelinterno: {
        flex: 1,
        marginHorizontal: 20,
        justifyContent: "space-around"
    },
    titulo: {
        fontSize: 16,
        textAlign: "center",
        color: "#25D366",
        fontWeight: "bold"
    },
    viewtelefono: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        height: 50,
        marginHorizontal: 20,
        paddingHorizontal: 20,
        backgroundColor: "rgba(37, 211, 106, 0.6)"
    },
    input: {
        width: "80%",
        height: 50,
        marginLeft: 5
    }
  });
