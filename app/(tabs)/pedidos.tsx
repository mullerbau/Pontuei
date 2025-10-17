import React from 'react';
import { View } from 'react-native';
import { useCart } from '../../contexts/CartContext';
import { useFocusEffect } from '@react-navigation/native';

export default function PedidosScreen() {
  const { showCart } = useCart();

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        showCart();
      }, 100);
    }, [])
  );

  return <View style={{ flex: 1, backgroundColor: 'transparent' }} />;
}