import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';



export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#E94057",
          tabBarInactiveTintColor: "#666",
          tabBarStyle: {
            paddingVertical: 10,
            height: 60,
            paddingHorizontal: 20,
          },
          tabBarItemStyle: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 5,
          },
        }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="buscar"
        options={{
          title: "Buscar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="loja"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
      

      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="finalizacao-pedido"
        options={{
          href: null,
        }}
      />
      </Tabs>
  );
}




