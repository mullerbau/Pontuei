import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CartProvider, useCart } from '../../contexts/CartContext';
import CartModal from '../../components/CartModal';

function CartIcon({ color, size }: { color: string, size: number }) {
  const { itemCount, showCart } = useCart();
  
  return (
    <TouchableOpacity onPress={showCart} style={styles.cartIconContainer}>
      <View style={styles.iconWrapper}>
        <Ionicons name="receipt" color={color} size={size} />
        {itemCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{itemCount}</Text>
          </View>
        )}
      </View>
      <Text style={[{ color, fontSize: 10, marginTop: 2 }]}>Pedidos</Text>
    </TouchableOpacity>
  );
}

function TabLayoutContent() {
  return (
    <>
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
          tabBarButton: (props) => (
            <CartIcon color={props.color || "#666"} size={24} />
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
      <CartModal />
    </>
  );
}

export default function TabLayout() {
  return (
    <CartProvider>
      <TabLayoutContent />
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  cartIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -10,
    backgroundColor: '#E94057',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});


