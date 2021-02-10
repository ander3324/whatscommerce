import { firebaseapp } from "./Firebase";
import * as firebase from "firebase";

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
}

export const validarPhone = (setPhoneAuth) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user.phoneNumber) {
            setPhoneAuth(true);
        } 
    });
}

export const cerrarSesion = () => {
    firebase.auth().signOut();
}