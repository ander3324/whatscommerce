import { firebaseapp } from "./Firebase";
import { Platform, YellowBox } from "react-native";
import * as firebase from "firebase";
import { constant } from "lodash";
import EnviarConfirmacion from "../Views/Cuenta/EnviarConfirmacion";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import "firebase/firestore";

//Corrección de error bto:
import { encode, decode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

YellowBox.ignoreWarnings(["Animated"]);
//LogBox.ignoreLogs("Animated");

const db = firebase.firestore(firebaseapp);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBagde: true,
  }),
});

export const validarSesion = (setValidarSesion) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setValidarSesion(true);
      console.log("Usuario logueado");
    } else {
      setValidarSesion(false);
      console.log("No ha iniciado sesión");
    }
  });
};

export const validarPhone = (setPhoneAuth) => {
  /*firebase.auth().onAuthStateChanged((user) => {
    if (user.phoneNumber) {
      setPhoneAuth(true);
    }
  }); */
  db.collection("Usuarios")
  .doc(obtenerUsuario().uid)
  .onSnapshot(snapshot => {
    setPhoneAuth(snapshot.exists);
  });
};

export const cerrarSesion = () => {
  firebase.auth().signOut();
};

export const enviarConfirmacionPhone = async (numero, recaptcha) => {
  let verificationId = "";

  await firebase
    .auth()
    .currentUser.reauthenticateWithPhoneNumber(numero, recaptcha.current)
    .then((response) => {
      verificationId = response.verificationId;
    })
    .catch((err) => console.log(err));

  return verificationId;
};

export const confirmarCodigo = async (verificationId, codigo) => {
  let resultado = false;
  const credenciales = firebase.auth.PhoneAuthProvider.credential(
    verificationId,
    codigo
  );

  await firebase
    .auth()
    .currentUser.linkWithCredential(credenciales)
    .then((response) => (resultado = true))
    .catch((err) => {
      console.log(err);
    });

  return resultado;
};

export const obtenerToken = async () => {
  let token = "";
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return token;
};

export const obtenerUsuario = () => {
  return firebase.auth().currentUser;
};

export const addRegistroEspecifico = async (coleccion, doc, data) => {
  const resultado = { error: "", statusResponse: false };
  await db
    .collection(coleccion)
    .doc(doc)
    .set(data)
    .then((response) => {
      resultado.statusResponse = true;
    })
    .catch((err) => {
      //resultado.statusResponse = false;
      resultado.error = err;
    });
  return resultado;
};
