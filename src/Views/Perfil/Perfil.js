import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, StatusBar, Alert } from "react-native";
import { Icon, Avatar, Input } from "react-native-elements";
import { cargarImagenesxAspecto } from "../../Utils/Utils";
import {
  subirImagenesBatch,
  obtenerUsuario,
  addRegistroEspecifico,
  actualizarPerfil,
} from "../../Utils/Acciones";
import Loading from "../../Components/Loading";

export default function Perfil() {
  const [imagenperfil, setimagenperfil] = useState("");
  const [loading, setLoading] = useState(false);
  const usuario = obtenerUsuario();

  useEffect(() => {
    setimagenperfil(usuario.photoURL);
  }, []);

  console.log(usuario);

  return (
    <View>
      <StatusBar backgroundColor="#128C7E" />
      <CabeceraBG />
      <HeaderAvatar
        usuario={usuario}
        imagenperfil={imagenperfil}
        setimagenperfil={setimagenperfil}
        setLoading={setLoading}
      />
      <Loading isVisible={loading} text="Por favor aguarde..." />
    </View>
  );
}

function CabeceraBG() {
  return (
    <View>
      <View style={styles.bg}>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          Nombre
        </Text>
      </View>
    </View>
  );
}

function HeaderAvatar(props) {
  const { imagenperfil, setimagenperfil, usuario, setLoading } = props;

  const { uid } = usuario;

  const cambiarfoto = async () => {
    const resultado = await cargarImagenesxAspecto([1, 1]);

    if (resultado.status) {
    setLoading(true);
      console.log(resultado);
      const url = await subirImagenesBatch([resultado.imagen], "Perfil");
      console.log(url);
      const update = await actualizarPerfil({ photoURL: url[0] });
      const response = await addRegistroEspecifico("Usuarios", uid, {
        photoURL: url[0],
      });

      if (response.statusResponse) {
        setimagenperfil(url[0]);
        setLoading(false);
      } else {
        
        setLoading(false);
        Alert.alert("Ocurrió un error al actualizar la foto de perfil.");
      }
    }
  };

  return (
    <View style={styles.avatarinline}>
      <Avatar
        source={
          imagenperfil
            ? { uri: imagenperfil }
            : require("../../../assets/avatar.jpg")
        }
        style={styles.avatar}
        size="large"
        rounded
        showAccessory={true}
        onAccessoryPress={cambiarfoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    backgroundColor: "#128C7E",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarinline: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: -70,
  },
  avatar: {
    width: 120,
    height: 120,
  },
});
