import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MiTienda from '../Views/MiTienda/MiTienda';
import EditarProducto from '../Views/MiTienda/EditarProducto';

const Stack = createStackNavigator();

export default function MiTiendaStack() {
    return (
       
        <Stack.Navigator 
            screenOptions={{
                headerStyle: { backgroundColor: "#128C7E"},
                headerTintColor: "#fff"
            }}
        >
            <Stack.Screen
                component={MiTienda}
                name="mitienda"
                options={{ title: "Mi Tienda" }}
            />
            <Stack.Screen
                component={EditarProducto}
                name="edit-product"
                options={{ 
                    title: "Editar Producto"
                 }}
            />
        </Stack.Navigator>

    );
}