import { Stack } from "expo-router";
import { CartProvider } from '../contexts/CartContext';
import { OrderProvider } from '../contexts/OrderContext';
import { UserProvider } from '../contexts/UserContext';

export default function LayoutPrincipal() {
  return (
    <UserProvider>
      <OrderProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }} initialRouteName="auth">
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="loja" />
            <Stack.Screen name="finalizacao-pedido" />
            <Stack.Screen name="pedido-sucesso" />
          </Stack>
        </CartProvider>
      </OrderProvider>
    </UserProvider>
  );
}
