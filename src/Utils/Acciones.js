import { firebaseapp } from "./Firebase";
import { Platform, LogBox } from "react-native";
import * as firebase from "firebase";
import { constant, map } from "lodash";
import EnviarConfirmacion from "../Views/Cuenta/EnviarConfirmacion";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import "firebase/firestore";
import uuid from "random-uuid-v4";
import { convertirFicheroBlob } from "./Utils";
import { FireSQL } from "firesql";

const db = firebase.firestore(firebaseapp);
const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

//Corrección de error bto:
import { encode, decode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

//YellowBox.ignoreWarnings(["Animated", "Setting a timer", "YellowBox has been replaced"]);
//LogBox.ignoreLogs("Animated");
LogBox.ignoreLogs([
  "Animated",
  "Setting a timer",
  "Avatar.onAccessoryPress",
  "Avatar.showAccessory",
  "Require cycle",
  "Failed",
  "Possible"
]);

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
    .onSnapshot((snapshot) => {
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
    .set(data, { merge: true })
    .then((response) => {
      resultado.statusResponse = true;
    })
    .catch((err) => {
      //resultado.statusResponse = false;
      resultado.error = err;
    });
  return resultado;
};

export const subirImagenesBatch = async (imagenes, ruta) => {
  const imagenesurl = [];

  await Promise.all(
    map(imagenes, async (image) => {
      const blob = await convertirFicheroBlob(image);
      const ref = firebase.storage().ref(ruta).child(uuid());

      await ref.put(blob).then(async (result) => {
        await firebase
          .storage()
          .ref(`${ruta}/${result.metadata.name}`)
          .getDownloadURL()
          .then((imagenurl) => {
            imagenesurl.push(imagenurl);
          });
      });
    })
  );

  return imagenesurl;
};

export const actualizarPerfil = async (data) => {
  let respuesta = false;
  await firebase
    .auth()
    .currentUser.updateProfile(data)
    .then((response) => {
      respuesta = true;
    });

  return respuesta;
};

export const reautenticar = async (verificationId, code) => {
  let response = { statusresponse: false };

  const credenciales = new firebase.auth.PhoneAuthProvider.credential(
    verificationId,
    code
  );

  await firebase
    .auth()
    .currentUser.reauthenticateWithCredential(credenciales)
    .then((resultado) => (response.statusresponse = true))
    .catch((err) => {
      console.log(err);
    });

  return response;
};

export const actualizarEmailFirebase = async (email) => {
  let response = { statusresponse: false };
  await firebase
    .auth()
    .currentUser.updateEmail(email)
    .then((respuesta) => {
      response.statusresponse = true;
    })
    .catch((err) => (response.statusresponse = false));
  return response;
};

export const actualizarTelefono = async (verificationId, code) => {
  let response = { statusresponse: false };
  console.log(verificationId);
  console.log(code);

  const credenciales = new firebase.auth.PhoneAuthProvider.credential(
    verificationId,
    code
  );

  await firebase
    .auth()
    .currentUser.updatePhoneNumber(credenciales)
    .then((resultado) => (response.statusresponse = true))
    .catch((err) => {
      console.log(err);
    });

  return response;
};

export const addRegistro = async (colecion, data) => {
  const resultado = { error: "", statusreponse: false };

  await db
    .collection(colecion)
    .add(data)
    .then((response) => {
      resultado.statusreponse = true;
    })
    .catch((err) => {
      resultado.error = err;
    });

  return resultado;
};

export const ListarMisProductos = async () => {
  let productos = [];

  await db
    .collection("Productos")
    .where("usuario", "==", obtenerUsuario().uid)
    .where("status", "==", 1)
    .get()
    .then((response) => {
      response.forEach((doc) => {
        const producto = doc.data();
        producto.id = doc.id;
        productos.push(producto);
      });
    })
    .catch((err) => {
      console.log("error");
    });

  return productos;
};

export const actualizarRegistro = async (coleccion, documento, data) => {
  let response = { statusresponse: false };

  await db
    .collection(coleccion)
    .doc(documento)
    .update(data)
    .then((result) => (response.statusreponse = true))
    .catch((err) => console.log(err));

  return response;
};

export const eliminarProducto = async (coleccion, documento) => {
  let response = { statusresponse: false };

  await db
    .collection(coleccion)
    .doc(documento)
    .delete()
    .then((result) => (response.statusresponse = true))
    .catch((err) => {
      console.log(err);
    });

  return response;
};

export const obternerRegistroxID = async (coleccion, documento) => {
  let response = { statusresponse: false, data: null };

  await db
    .collection(coleccion)
    .doc(documento)
    .get()
    .then((result) => {
      const producto = result.data();
      producto.id = result.id;

      response.data = producto;
      response.statusresponse = true;
    })
    .catch((err) => {
      console.log(err);
    });

  return response;
};

export const ListarProductos = async () => {
  const productoslist = [];
  let index = 0;

  await db
    .collection("Productos")
    .where("status", "==", 1)
    .get()
    .then((response) => {
      response.forEach((doc) => {
        const producto = doc.data();
        producto.id = doc.id;
        productoslist.push(producto);
      });
    })
    .catch((err) => console.log(err));

  for (const registro of productoslist) {
    const usuario = await obternerRegistroxID("Usuarios", registro.usuario);
    productoslist[index].usuario = usuario.data;
    index++;
  }

  return productoslist;
};

export const listarProductosxCategoria = async (categoria) => {
  const productoslist = [];
  let index = 0;

  await db
    .collection("Productos")
    .where("status", "==", 1)
    .where("categoria", "==", categoria)
    .get()
    .then((response) => {
      response.forEach((doc) => {
        const producto = doc.data();
        producto.id = doc.id;
        productoslist.push(producto);
      });
    })
    .catch((err) => console.log(err));

  for (const registro of productoslist) {
    const usuario = await obternerRegistroxID("Usuarios", registro.usuario);
    productoslist[index].usuario = usuario.data;
    index++;
  }

  return productoslist;
};

export const Buscar = async (search) => {
  let productos = [];

  await fireSQL
    .query(`SELECT * FROM Productos WHERE titulo LIKE '${search}%' `)
    .then((response) => {
      productos = response;
    });

  return productos;
};

export const iniciarnotificaciones = (
  notificationListener,
  responseListener
) => {
  notificationListener.current = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log(notification);
    }
  );

  responseListener.current = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log(response);
    }
  );

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};

export const sendPushNotification = async (mensaje) => {
  let respuesta = false;
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mensaje),
  }).then((response) => {
    respuesta = true;
  });

  return respuesta;
};

export const setMensajeNotificacion = (token, titulo, body, data) => {
  const message = {
    to: token,
    sound: "default",
    title: titulo,
    body: body,
    data: data,
  };

  return message;
};

export const ListarNotificaciones = async () => {
  let respuesta = { statusresponse: false, data: [] };

  let index = 0;

  await db
    .collection("Notificaciones")
    .where("receiver", "==", obtenerUsuario().uid)
    .where("visto", "==", 0)
    .get()
    .then((response) => {
      let datos;

      response.forEach((doc) => {
        datos = doc.data();
        datos.id = doc.id;
        respuesta.data.push(datos);
      });
      respuesta.statusresponse = true;
    });

  for (const notificacion of respuesta.data) {
    const usuario = await obternerRegistroxID("Usuarios", notificacion.sender);
    respuesta.data[index].sender = usuario.data;
    index++;
  }

  return respuesta;
};


