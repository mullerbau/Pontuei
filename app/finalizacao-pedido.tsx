import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';

export default function FinalizacaoPedido() {
  const { items, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');

  const total = items.reduce((sum, item) => {
    const priceStr = item.price.replace('R$ ', '').replace(',', '.');
    const price = parseFloat(priceStr);
    if (isNaN(price)) return sum;
    return sum + (price * item.quantity);
  }, 0);

  const formatTotal = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return '0,00';
    return value.toFixed(2).replace('.', ',');
  };

  const handleFinalizarPedido = () => {
    if (!paymentMethod || !deliveryMethod) {
      Alert.alert('Erro', 'Selecione o método de pagamento e entrega');
      return;
    }

    // Criar o pedido
    addOrder({
      items,
      total: `R$ ${formatTotal(total)}`,
      status: 'em_preparo',
      paymentMethod,
      deliveryMethod,
    });

    clearCart();
    router.push('/pedido-sucesso');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#E94057" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar Pedido</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Resumo do Pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Qtd: {item.quantity}</Text>
              <Text style={styles.itemPrice}>R$ {(() => {
                const priceStr = item.price.replace('R$ ', '').replace(',', '.');
                const price = parseFloat(priceStr);
                if (isNaN(price)) return '0,00';
                const itemTotal = price * item.quantity;
                return isNaN(itemTotal) ? '0,00' : itemTotal.toFixed(2).replace('.', ',');
              })()}</Text>
            </View>
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: R$ {formatTotal(total)}</Text>
          </View>
        </View>

        {/* Método de Entrega */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Entrega</Text>
          <TouchableOpacity 
            style={[styles.option, deliveryMethod === 'retirada' && styles.selectedOption]}
            onPress={() => setDeliveryMethod('retirada')}
          >
            <Ionicons name="storefront" size={20} color={deliveryMethod === 'retirada' ? '#fff' : '#E94057'} />
            <Text style={[styles.optionText, deliveryMethod === 'retirada' && styles.selectedText]}>
              Retirar no Local
            </Text>
          </TouchableOpacity>
        </View>

        {/* Método de Pagamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Pagamento</Text>
          <TouchableOpacity 
            style={[styles.option, paymentMethod === 'dinheiro' && styles.selectedOption]}
            onPress={() => setPaymentMethod('dinheiro')}
          >
            <Ionicons name="cash" size={20} color={paymentMethod === 'dinheiro' ? '#fff' : '#E94057'} />
            <Text style={[styles.optionText, paymentMethod === 'dinheiro' && styles.selectedText]}>
              Dinheiro
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.option, paymentMethod === 'cartao' && styles.selectedOption]}
            onPress={() => setPaymentMethod('cartao')}
          >
            <Ionicons name="card" size={20} color={paymentMethod === 'cartao' ? '#fff' : '#E94057'} />
            <Text style={[styles.optionText, paymentMethod === 'cartao' && styles.selectedText]}>
              Cartão
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.option, paymentMethod === 'pix' && styles.selectedOption]}
            onPress={() => setPaymentMethod('pix')}
          >
            <Ionicons name="qr-code" size={20} color={paymentMethod === 'pix' ? '#fff' : '#E94057'} />
            <Text style={[styles.optionText, paymentMethod === 'pix' && styles.selectedText]}>
              PIX
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.finalizarButton} onPress={handleFinalizarPedido}>
          <Text style={styles.finalizarButtonText}>Confirmar Pedido</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E94057',
    marginBottom: 15,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E94057',
  },
  totalContainer: {
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#E94057',
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E94057',
    textAlign: 'right',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E94057',
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#E94057',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#E94057',
  },
  selectedText: {
    color: '#fff',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  finalizarButton: {
    backgroundColor: '#E94057',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  finalizarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});