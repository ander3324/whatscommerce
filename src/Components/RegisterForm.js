import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, Input, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { validarEmail } from "../Utils/Utils";
import { isEmpty, size } from "lodash";
import * as firebase from "firebase";
import Loading from "../Components/Loading";

export default function RegisterForm(props) {

    const { toastRef } = props;
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [repetirpassword, setrepetirpassword] = useState("");
    const navigation = useNavigation();
    const [show, setshow] = useState(false);
    const [loading, setLoading] = useState(false);

    function crearCuenta() {
        if (isEmpty(email) || isEmpty(password) || isEmpty(repetirpassword)) {
            toastRef.current.show("Todos los campos son obligatorios.");
        } else if(!validarEmail(email)) {
            toastRef.current.show("El email ingresado no es válido.");
        } else if (password != repetirpassword) {
            toastRef.current.show("Las contraseñas ingresadas no coinciden.");
        } else if (size(password) < 6) {
            toastRef.current.show("La contraseña debe tener al menos 6 caracteres.");
        } else {
            setLoading(true);
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((response) => {
                toastRef.current.show("Usuario creado correctamente");
                setLoading(false);
            }).catch((err) => {
                toastRef.current.show("Ha ocurrido un error o Usuario ya registrado.");
                setLoading(false);
            });
        }
    }

    return (
        <View style = { styles.container }>
        <View 
            style = {{
                borderBottomColor: "#25D366",
                borderBottomWidth: 2,
                width: 100
            }}
        />
        <Input 
            placeholder = "Email"
            containerStyle = { styles.input }
            rightIcon = {{
                type: "material-community",
                name: "email-outline",
                color: "#128C7E"
            }}
            leftIcon = {{
                type: "material-community",
                name: "account-outline",
                color: "#128C7E"
            }}
            onChangeText = {(text) => {
                setemail(text);
            }}
            value = { email }
        />
        <Input 
            placeholder="Contraseña"  
            containerStyle = { styles.input } 
            rightIcon = {{
                type: "material-community",
                name: show ? "eye-off-outline" : "eye-outline",
                color: "#128C7E",
                onPress: () => setshow(!show)
            }}
            leftIcon = {{
                type: "material-community",
                name: "security",
                color: "#128C7E"
            }}
            secureTextEntry = { !show }
            onChangeText = {(text) => {
                setpassword(text);
            }}
            value = { password }
        />
         <Input 
            placeholder="Repetir Contraseña"  
            containerStyle = { styles.input } 
            rightIcon = {{
                type: "material-community",
                name: show ? "eye-off-outline" : "eye-outline",
                color: "#128C7E",
                onPress: () => setshow(!show)
            }}
            leftIcon = {{
                type: "material-community",
                name: "security",
                color: "#128C7E"
            }}
            onChangeText = {(text) => {
                setrepetirpassword(text)
            }}
            secureTextEntry = { !show }
            value = { repetirpassword }
        />
        <Button
            title = "Crear Cuenta"
            containerStyle = { styles.btnentrar }
            buttonStyle = {{ backgroundColor: "#25D366" }}
            onPress = { () => crearCuenta() }
        />
         <Button
            title = "Iniciar Sesión"
            containerStyle = { styles.btnentrar }
            buttonStyle = {{ backgroundColor: "#128C7E" }}
            onPress = { () => navigation.goBack() }
        />
        <Loading isVisible = { loading } text="Por favor aguarde..." />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F6F8",
        flex: 1,
        marginTop: 20,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        alignItems: "center",
        paddingTop: 20
    },
    input: {
        width: "90%",
        marginTop: 20,
        height: 50
    },
    btnentrar: {
        width: "90%",
        marginTop: 20
    }
});

