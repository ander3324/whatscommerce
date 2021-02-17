import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, Image, Alert } from 'react-native'
import CodeInput from "react-native-code-input";
import { useNavigation } from "@react-navigation/native";
import Loading from "../../Components/Loading";
import { confirmarCodigo, obtenerToken, obtenerUsuario, addRegistroEspecifico } from "../../Utils/Acciones";

export default function ConfirmarNumero(props) {

    const { route } = props;
    const { verificationId } = route.params;
    console.log(verificationId);

    const [loading, setLoading] = useState(false);

    const confirmarCodigoSMS = async (code) => {
        
        setLoading(true);
        const resultado = await confirmarCodigo(verificationId, code);

        if(resultado) {

            const token = await obtenerToken();
            const { uid, displayName, photoURL, email, phoneNumber } = obtenerUsuario();
    
            const registro = await addRegistroEspecifico("Usuarios", uid, {
                token,
                displayName,
                photoURL,
                email,
                phoneNumber,
                fechaCreacion: new Date()
            });
    
            console.log(`UID: ${uid}. Okey`);
            setLoading(false);
        } else {
            Alert.alert("Error", "Validar código introducido", [{
                style: "default",
                text: "Okey"
            }]);
            setLoading(false);
        }
       

    }

    return (
        <View style = { styles.container }>
            <Image 
                source = { require("../../../assets/logo.png") }
                style = { styles.imgLogo }
            />
            <Text style = { styles.titulo } >Introduzca el código que enviamos a tu teléfono</Text>
           <CodeInput 
                activeColor= "#fff"
                inactiveColor = "#fff"
                autoFocus = {true}
                inputPosition = "center"
                size = {50}
                codeLength = {6}
                containerStyle={{ marginTop: 30 }}
                codeInputStyle = {{ borderWidth: 1.5 }}
                onFulfill = {(code) => {
                    //console.log(code);
                    confirmarCodigoSMS(code);
                }}
                secureTextEntry
           />
           <Loading isVisible = { loading } text="Por favor aguarde..." />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#128C7E",
        paddingHorizontal: 20
    },
    imgLogo: {
        width: 106,
        height: 106,
        alignSelf: "center",
        marginTop: 20
    },
    titulo: {
        fontSize: 18,
        textAlign: "center",
        color: "#fff",
        marginVertical: 20
    }
});
