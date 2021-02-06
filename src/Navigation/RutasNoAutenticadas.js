import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import Login from "../Views/Cuenta/Login";
import Registrar from "../Views/Cuenta/Registrar";
import RestaurarPassword from "../Views/Cuenta/RestaurarPassword";

const Stack = createStackNavigator();

export default function RutasNoAutenticadas() {
    return(

        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="login"
                screenOptions={{ headerShown: false }}
            >

                <Stack.Screen component={Login} name="login" />
                <Stack.Screen component={Registrar} name="registrar" />
                <Stack.Screen component={RestaurarPassword} name="lostpassword" />

            </Stack.Navigator>
        </NavigationContainer>

    );
}