import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ConfirmarNumero from '../Views/Cuenta/ConfirmarNumero';
import EnviarConfirmacion from '../Views/Cuenta/EnviarConfirmacion';

const Stack = createStackNavigator();

export default function CuentaStack() {
    return(

        <Stack.Navigator 
            screenOptions={{
                headerStyle: { backgroundColor: "#128C7E"},
                headerTintColor: "#fff"
            }}
        >

            <Stack.Screen
                component={ConfirmarNumero}
                name="confirmar-numero"
                options={{ title: "Confirmar Número" }}
            />
            <Stack.Screen
                component={EnviarConfirmacion}
                name="enviar-confirmacion"
                options={{ title: "Confirmar Número de Teléfono" }}
            />

        </Stack.Navigator>

    );
}