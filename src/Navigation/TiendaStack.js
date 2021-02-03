import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Tienda from '../Views/Tienda/Tienda';
import AddProduct from '../Views/Tienda/AddProduct';
import Contacto from '../Views/Tienda/Contacto';
import MensajesList from '../Views/Tienda/MensajesList';
import Detalle from '../Views/Tienda/Detalle';

const Stack = createStackNavigator();

export default function TiendaStack() {
    return (
       
        <Stack.Navigator>
            <Stack.Screen
                component={Tienda}
                name="tienda"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                component={AddProduct}
                name="add-product"
                options={{ 
                    title: "Añadir Nuevo Producto",
                    headerStyle: { backgroundColor: "#128C7E"},
                    headerTintColor: "#fff"
                 }}
            />
            <Stack.Screen
                component={Detalle}
                name="detalle"
                options={{ 
                    headerTransparent: true,
                    headerTintColor:  "#128C7E",
                    title: ""
                }}
            />
             <Stack.Screen
                component={MensajesList}
                name="mensajes"
                options={{ 
                    title: "Mensajes",
                    headerStyle: { backgroundColor: "#128C7E"},
                    headerTintColor: "#fff"
                }}
            />
             <Stack.Screen
                component={Contacto}
                name="contacto"
                options={{ 
                    title: "Contacto",
                    headerStyle: { backgroundColor: "#128C7E"},
                    headerTintColor: "#fff"
                }}
            />
        </Stack.Navigator>

    );
}