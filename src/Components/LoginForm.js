import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon, Input, Button, Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function LoginForm() {

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

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
            />
            <Input 
                placeholder="Contraseña"  
                containerStyle = { styles.input } 
                rightIcon = {{
                    type: "material-community",
                    name: "eye-outline",
                    color: "#128C7E",
                    onPress: () => alert ('Hola')
                }}
                leftIcon = {{
                    type: "material-community",
                    name: "security",
                    color: "#128C7E"
                }}
            />
            <Button
                title = "Ingresar"
                containerStyle = { styles.btnentrar }
                buttonStyle = {{ backgroundColor: "#25D366" }}
            />
            <Text style = { styles.txtcrearcuenta }>
                ¿No tenés una cuenta?  <Text style = { styles.cuenta }>Crear Cuenta</Text>
            </Text>
            <Divider style = {{
                backgroundColor: "#128C7E",
                height: 1,
                width: "90%",
                marginTop: 20
            }} />
            <Text style = { styles.txtosino }>O sino</Text>
           <View style = { styles.btnlogin }>
               <TouchableOpacity style = { styles.btnloginsocialgoogle }>
                   <Icon
                        size = {24}
                        type = "material-community"
                        name = "google"
                        color = "#fff"
                        backgroundColor = "transparent"
                   />
               </TouchableOpacity>
               <TouchableOpacity  style = { styles.btnloginsocialfacebook }>
                   <Icon
                        size = {24}
                        type = "material-community"
                        name = "facebook"
                        color = "#fff"
                        backgroundColor = "transparent"
                   />
               </TouchableOpacity>
           </View>
        </View>
    );
};

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
    },
    txtcrearcuenta: {
        marginTop: 20
    },
    cuenta: {
        color: "#128C7E",
        fontFamily: "Roboto",
        fontSize: 15
    },
    txtosino: {
        color: "#128C7E",
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 20
    },
    btnlogin: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%"
    },
    btnloginsocialfacebook: {
        backgroundColor: "#3F5C96",
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 5
    },
    btnloginsocialgoogle: {
        backgroundColor: "#DB4B47",
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 5
    }
});
