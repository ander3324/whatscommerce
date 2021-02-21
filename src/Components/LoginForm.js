import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon, Input, Button, Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { validarEmail } from "../Utils/Utils";
import { isEmpty, split } from "lodash";
import { validarSesion, cerrarSesion } from "../Utils/Acciones";
import * as firebase from "firebase";
import Loading from "../Components/Loading";

export default function LoginForm(props) {

    const { toastRef } = props;
    const navigation = useNavigation();

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    //cerrarSesion();

    const iniciarSesion = () => {
        if (isEmpty(email) || isEmpty(password)) {
            toastRef.current.show("El email y la contraseña no pueden estar vacíos.");
            console.log(`Ingresado: ` + email);
        } else if (!validarEmail(email)) {
            toastRef.current.show("El email ingresado no es válido.");
        } else {
            setLoading(true);
            //toastRef.current.show(`Bienvenid@ ${email}!`);
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                setLoading(false);
                toastRef.current.show(`Bienvenido ${split(email, '@')[0]}!`);
                console.log(firebase.auth().currentUser.email);
            }).catch((err) => {
                setLoading(false);
                console.log("Hubo un error.");
                toastRef.current.show("Email o contraseña incorrectos.");
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
                    onPress: () => setShow(!show)
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
            <Button
                title = "Ingresar"
                containerStyle = { styles.btnentrar }
                buttonStyle = {{ backgroundColor: "#25D366" }}
                onPress = { () => iniciarSesion() }
            />
            <Text style = { styles.txtcrearcuenta }>
                ¿No tenés una cuenta?  
                <Text 
                    style = { styles.cuenta }
                    onPress = {() => navigation.navigate("registrar")}
                >
                    {" "}
                    Crear Cuenta
                </Text>
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
                        onPress = { () => {
                            signInAsync();
                        } }
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
           <Loading isVisible = { loading } text="Por favor aguarde..." />
        </View>
    );
};

/*********LOGICA DE GOOGLE***********************************/

async function signInAsync() {
    try {
      await GoogleSignIn.initAsync();
      //const usuario = await GoogleSignIn.signInSilentlyAsync();
      await GoogleSignIn.askForPlayServicesAsync(); //usar solo en android
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === "success") {
        onSignIn(user);
        setloading(false);
        return true;
      } else {
        setloading(false);
        alert(JSON.stringify(result));
        return { cancelled: true };
      }
    } catch (e) {
      setloading(false);

      alert(e.message);

      return { error: true };
    }
  }

  function onSignIn(googleUser) {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.auth.idToken,
            googleUser.auth.accessToken
          );
          // Sign in with credential from the Google user.
          setloading(true);
          firebase
            .auth()
            .signInWithCredential(credential)
            .then((response) => {
              setloading(false);
            })
            .catch(function (error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              alert(errorMessage);
              setloading(false);
              // ...
            });
        } else {
          alert("Usuario ya está logueado");
        }
      });
  }

  function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }
  /**************************** FINAL GOOGLE **************************************** */

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
