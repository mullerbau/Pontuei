import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const PRIMARY_COLOR = '#E94057';

export default function CartModal() {
  const { items, showCartModal, setShowCartModal, removeItem } = useCart();
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold });

  const handleClose = () => {
    setShowCartModal(false);
  };

  if (!fontsLoaded) return null;

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
    return sum + (price * item.quantity);
  }, 0);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showCartModal}
      onRequestClose={handleClose}
    >
      <Pressable 
        style={styles.overlay} 
        onPress={handleClose}
      >
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Meus Pedidos</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.itemsList}>
            {items.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum item no carrinho</Text>
            ) : (
              items.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                  </View>
                  <Text style={styles.quantity}>x{item.quantity}</Text>
                  <TouchableOpacity 
                    onPress={() => removeItem(item.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={18} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
          
          {items.length > 0 && (
            <View style={styles.footer}>
              <Text style={styles.total}>Total: R$ {total.toFixed(2).replace('.', ',')}</Text>
              <TouchableOpacity style={styles.orderButton}>
                <Text style={styles.orderButtonText}>Finalizar Pedido</Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: PRIMARY_COLOR,
  },
  itemsList: {
    maxHeight: 300,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    marginTop: 40,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: PRIMARY_COLOR,
  },
  quantity: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#666',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  total: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  orderButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});