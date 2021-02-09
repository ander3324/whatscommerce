import { firebaseapp } from "./Firebase";
import * as firebase from "firebase";

export const validarSesion = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("Usuario logueado");
        } else {
            console.log("No ha iniciado sesión");
        }
    });
}


export const cerrarSesion = () => {
    firebase.auth().signOut();
}