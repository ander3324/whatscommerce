import { Alert, Linking } from "react-native";
import { size } from "lodash";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export const validarEmail = (text) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(text) === false) {
    return false;
  } else {
    return true;
  }
};

export const cargarImagenesxAspecto = async (array) => {
  let imgResponse = { status: false, imagen: "" };
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

  if (status === "denied") {
    alert("Debes permitir el acceso para cargar las imágenes.");
  } else {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: array
    });

    if (!result.cancelled) {
      imgResponse = { status: true, imagen: result.uri };
    }
  }
  return imgResponse;
};

/* export const cargarImagenesxAspecto = async (array) => {
  let imgResponse = { status: false, imagen: "" };
  const resultPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  const cameraPermissions = resultPermissions.permissions.cameraRoll.status;

  if (cameraPermissions === "denied") {
    alert("Usted debe permitir el accesos para cargar las imagenes");
  } else {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: array,
    });

    if (!result.cancelled) {
      imgResponse = { status: true, imagen: result.uri };
    }
  }
  return imgResponse;
}; */

export const convertirFicheroBlob = async (rutafisica) => {
  const fichero = await fetch(rutafisica);
  const blob = await fichero.blob();

  return blob;
};
