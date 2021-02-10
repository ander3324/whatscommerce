import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import ConfirmarNumero from '../Views/Cuenta/ConfirmarNumero';
import EnviarConfirmacion from '../Views/Cuenta/EnviarConfirmacion';

const Stack = createStackNavigator();

export default function CuentaStack() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#128C7E" },
            headerTintColor: "#fff",
          }}
        >
          <Stack.Screen
            component={EnviarConfirmacion}
            name="enviar-confirmacion"
            options={{
              title: "Confirmar Número de Teléfono",
              headerStyle: { backgroundColor: "#128C7E" },
              headerTintColor: "#fff",
            }}
          />

          <Stack.Screen
            component={ConfirmarNumero}
            name="confirmar-movil"
            options={{
              title: "Confirmar Número",
              headerStyle: { backgroundColor: "#128C7E" },
              headerTintColor: "#fff",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
}