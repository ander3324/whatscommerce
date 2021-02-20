import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, View, StatusBar, Alert } from "react-native";
import { Icon, Avatar, Input } from "react-native-elements";
import { cargarImagenesxAspecto, validarEmail } from "../../Utils/Utils";

import {
  subirImagenesBatch,
  obtenerUsuario,
  addRegistroEspecifico,
  actualizarPerfil,
  enviarConfirmacionPhone,
  reautenticar,
  actualizarEmailFirebase,
  actualizarTelefono,
  cerrarSesion,
} from "../../Utils/Acciones";

import Loading from "../../Components/Loading";
import InputEditable from "../../Components/InputEditable";
import Modal from "../../Components/Modal";
import CodeInput from "react-native-code-input";
import FirebaseRecaptcha from "../../Utils/FirebaseRecaptcha";
import { useFocusEffect } from "@react-navigation/native";

export default function Perfil() {
  const [imagenperfil, setimagenperfil] = useState("");
  const [loading, setLoading] = useState(false);
  const usuario = obtenerUsuario();
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [editablename, seteditablename] = useState(false);
  const [editableemail, seteditableemail] = useState(false);
  const [editablephone, seteditablephone] = useState(false);

  const [verificationid, setverificationid] = useState("");
  const [isVisible, setisVisible] = useState(false);

  const [updatePhone, setUpdatePhone] = useState(false);

  const recapcha = useRef();

  useEffect(() => {
    setimagenperfil(usuario.photoURL);
    const { displayName, phoneNumber, email } = usuario;
    setDisplayName(displayName);
    setPhoneNumber(phoneNumber);
    setEmail(email);
  }, []);

  const onChangeInput = (input, valor) => {
    switch (input) {
      case "displayName":
        setDisplayName(valor);
        break;
      case "email":
        setEmail(valor);
        break;
      case "phoneNumber":
        setPhoneNumber(valor);
        break;
    }
  };

  const obtenerValor = (input, valor) => {
    switch (input) {
      case "displayName":
        return displayName;
        break;
      case "email":
        return email;
        break;
      case "phoneNumber":
        return phoneNumber;
        break;
    }
  };

  const actualizarValor = async (input, valor) => {
    let dato = "";
    switch (input) {
      case "displayName":
        console.log(await actualizarPerfil({ displayName: valor }));
        addRegistroEspecifico("Usuarios", usuario.uid, { displayName: valor });
        console.log(usuario);
        dato = "Nombre";
        break;
      case "email":
        if (valor !== usuario.email) {
          if (validarEmail(valor)) {
            const verification = await enviarConfirmacionPhone(
              phoneNumber,
              recapcha
            );
            if (verification) {
              setverificationid(verification);
              setisVisible(true);
            } else {
              alert("Ha ocurrido un error en la verificación");
              setEmail(usuario.email);
            }
          }
        }
        dato = "Email";
        break;
      case "phoneNumber":
        if (valor !== usuario.phoneNumber) {
          const verification = await enviarConfirmacionPhone(
            phoneNumber,
            recapcha
          );
          if (verification) {
            setverificationid(verification);
            setUpdatePhone(true);
            setisVisible(true);
          } else {
            alert("Ha ocurrido un error en la verificación");
            setEmail(usuario.phoneNumber);
          }
        }
        dato = "Teléfono";
        break;
    }
    Alert.alert(`${dato} del usuario actualizado.`);
  };

  console.log(usuario);

  const ConfirmarCodigo = async (verificationid, code) => {
    setLoading(true);
    if (updatePhone) {
      const telefono = await actualizarTelefono(verificationid, code);
      const updateregistro = await addRegistroEspecifico(
        "Usuarios",
        usuario.uid,
        { phoneNumber: phoneNumber }
      );
      setUpdatePhone(false);
      console.log(telefono);
      console.log(updateregistro);
    } else {
      const resultado = await reautenticar(verificationid, code);
      console.log(resultado);

      if (resultado.statusresponse) {
        const emailresponse = await actualizarEmailFirebase(email);
        const updateregistro = await addRegistroEspecifico(
          "Usuarios",
          usuario.uid,
          { email: email }
        );
        console.log(emailresponse);
        console.log(updateregistro);
      } else {
        alert("Ha ocurrido un error al actualizar el correo");
        setLoading(false);
        setisVisible(false);
      }
    }
    setLoading(false);
    setisVisible(false);
  };

  return (
    <View>
      <StatusBar backgroundColor="#128C7E" />
      <CabeceraBG nombre = { displayName } />
      <HeaderAvatar
        usuario={usuario}
        imagenperfil={imagenperfil}
        setimagenperfil={setimagenperfil}
        setLoading={setLoading}
      />
      <FormDatos
        onChangeInput={onChangeInput}
        obtenerValor={obtenerValor}
        editableemail={editableemail}
        editablephone={editablephone}
        editablename={editablename}
        seteditableemail={seteditableemail}
        seteditablephone={seteditablephone}
        seteditablename={seteditablename}
        actualizarValor={actualizarValor}
      />
      <ModalVerification
        isVisibleModal={isVisible}
        setisVisibleModal={setisVisible}
        verificationid={verificationid}
        ConfirmarCodigo={ConfirmarCodigo}
      />
      <Icon
        name="logout"
        type="material-community"
        color="#128c7e"
        containerStyle={styles.btncontainer}
        onPress={() => {
          cerrarSesion();
        }}
        reverse
      />
      <FirebaseRecaptcha referencia={recapcha} />
      <Loading isVisible={loading} text="Por favor aguarde..." />
    </View>
  );
}

function CabeceraBG(props) {
  const { nombre } = props;

  return (
    <View>
      <View style={styles.bg}>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          { nombre }
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

function FormDatos(props) {
  const {
    onChangeInput,
    obtenerValor,
    editableemail,
    editablename,
    editablephone,
    seteditableemail,
    seteditablename,
    seteditablephone,
    actualizarValor,
  } = props;

  return (
    <View>
      <InputEditable
        id="displayName"
        label="Nombre"
        obtenerValor={obtenerValor}
        placeholder="Nombre"
        onChangeInput={onChangeInput}
        editable={editablename}
        seteditable={seteditablename}
        actualizarValor={actualizarValor}
      />
      <InputEditable
        id="email"
        label="Correo"
        obtenerValor={obtenerValor}
        placeholder="ejemplo@ejemplo.com"
        onChangeInput={onChangeInput}
        editable={editableemail}
        seteditable={seteditableemail}
        actualizarValor={actualizarValor}
      />
      <InputEditable
        id="phoneNumber"
        label="Teléfono"
        obtenerValor={obtenerValor}
        placeholder="+00000000"
        onChangeInput={onChangeInput}
        editable={editablephone}
        seteditable={seteditablephone}
        actualizarValor={actualizarValor}
      />
    </View>
  );
}

function ModalVerification(props) {
  const {
    isVisibleModal,
    setisVisibleModal,
    ConfirmarCodigo,
    verificationid,
  } = props;

  return (
    <Modal isVisible={isVisibleModal} setIsVisible={setisVisibleModal}>
      <View style={styles.confirmacion}>
        <Text style={styles.titulomodal}>Confirmar Código</Text>
        <Text style={styles.detalle}>
          Se ha enviado un código de verificación a su número de teléfono
        </Text>

        <CodeInput
          secureTextEntry
          activeColor="#128c7e"
          inactiveColor="#128c7e"
          autoFocus={false}
          inputPosition="center"
          size={40}
          containerStyle={{ marginTop: 30 }}
          codeInputStyle={{ borderWidth: 1.5 }}
          codeLength={6}
          onFulfill={(code) => {
            ConfirmarCodigo(verificationid, code);
          }}
        />
      </View>
    </Modal>
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
  confirmacion: {
    height: 200,
    width: "100%",
    alignItems: "center",
  },
  titulomodal: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
  },
  detalle: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
  },
  btncontainer: {
    position: "relative",
    bottom: 10,
    right: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    alignSelf: "flex-end",
    marginTop: 20 
  },
});
