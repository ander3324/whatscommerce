import React from 'react';
import { View, Text } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import Constants from "expo-constants";

export default function FirebaseRecaptcha(props) {

    const { referencia } = props;

    return (
        <FirebaseRecaptchaVerifierModal 
            ref = { referencia }
            title = "No soy un robot"
            cancelLabel = "x"
            firebaseConfig = { Constants.manifest.extra.firebase }
        />
    )
}
