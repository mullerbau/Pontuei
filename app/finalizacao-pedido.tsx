import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';
import { useUser } from '../contexts/UserContext';
import { useLocalSearchParams } from 'expo-router';
import { ApiService, Establishment, OrderItem } from '../services/api';

export default function FinalizacaoPedido() {
  const { items, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { setLastStore } = useUser();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('retirada');
  const [storeName, setStoreName] = useState('Carregando...');
  const params = useLocalSearchParams();
  
  const storeId = params.storeId as string || 'diade';

  useEffect(() => {
    const loadStoreName = async () => {
      try {
        const establishment = await ApiService.getEstablishment(storeId);
        setStoreName(establishment.name);
      } catch (error) {
        const fallbackStores = ApiService.getFallbackEstablishments();
        const fallbackStore = fallbackStores.find(s => s.id === storeId);
        setStoreName(fallbackStore?.name || 'Dia de Café');
      }
    };
    loadStoreName();
  }, [storeId]);

  const total = items.reduce((sum, item) => {
    // Filtrar apenas itens que não são pontos
    if (item.price.includes('pontos')) return sum;
    
    const priceStr = item.price.replace('R$ ', '').replace(',', '.');
    const price = parseFloat(priceStr);
    if (isNaN(price)) return sum;
    return sum + (price * item.quantity);
  }, 0);

  const formatTotal = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return '0,00';
    return value.toFixed(2).replace('.', ',');
  };

  const handleFinalizarPedido = async () => {
    if (!paymentMethod || !deliveryMethod) {
      Alert.alert('Erro', 'Selecione o método de pagamento e entrega');
      return;
    }

    try {
      console.log('Iniciando finalização do pedido...');
      
      // Preparar dados para API
      const orderData = {
        establishment_id: storeId,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };
      
      console.log('Dados do pedido para API:', orderData);
      
      // Testar conexão primeiro
      const connectionOk = await ApiService.testConnection();
      console.log('Conexão com API:', connectionOk ? 'OK' : 'FALHOU');
      
      if (connectionOk) {
        // Criar pedido na API
        const apiOrder = await ApiService.createOrder(orderData);
        console.log('Pedido criado na API:', apiOrder);
      } else {
        throw new Error('API não está disponível');
      }
      
      // Os pontos são calculados automaticamente pelo pedido na API
      
      // Registrar última loja visitada
      if (storeId) {
        setLastStore(storeId);
      }

      // Não criar pedido localmente quando API funciona

      clearCart();
      router.push('/pedido-sucesso');
      
    } catch (error) {
      console.error('Erro ao criar pedido na API:', error);
      Alert.alert('Aviso', 'Pedido salvo localmente. Verifique sua conexão.');
      
      // Fallback: salvar apenas localmente se API falhar
      
      if (storeId) {
        setLastStore(storeId);
      }

      addOrder({
        items,
        total: `R$ ${formatTotal(total)}`,
        status: 'em_preparo',
        paymentMethod,
        deliveryMethod,
      });

      clearCart();
      router.push('/pedido-sucesso');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#E94057" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar Pedido</Text>
        <TouchableOpacity 
          style={styles.debugButton}
          onPress={async () => {
            const connection = await ApiService.testConnection();
            Alert.alert('Debug', `API: ${connection ? 'OK' : 'NÃO'}`);
          }}
        >
          <Text style={styles.debugText}>Debug</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Resumo do Pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
          <Text style={styles.storeName}>{storeName}</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Qtd: {item.quantity}</Text>
              <Text style={styles.itemPrice}>{(() => {
                // Se for item com pontos, mostrar apenas os pontos
                if (item.price.includes('pontos')) {
                  return item.price;
                }
                
                // Se for item com dinheiro, calcular total
                const priceStr = item.price.replace('R$ ', '').replace(',', '.');
                const price = parseFloat(priceStr);
                if (isNaN(price)) return 'R$ 0,00';
                const itemTotal = price * item.quantity;
                return `R$ ${isNaN(itemTotal) ? '0,00' : itemTotal.toFixed(2).replace('.', ',')}`;
              })()}</Text>
            </View>
          ))}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: R$ {formatTotal(total)}</Text>
          </View>
        </View>

        {/* Pontos que ganhará */}
        {total > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pontos que você ganhará</Text>
            <View style={styles.pointsContainer}>
              <Ionicons name="sparkles" size={24} color="#E94057" />
              <Text style={styles.pointsText}>
                +{Math.floor(total * 10)} pontos
              </Text>
            </View>
          </View>
        )}

        {/* Método de Entrega */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Entrega</Text>
          <TouchableOpacity 
            style={[styles.option, deliveryMethod === 'retirada' && styles.selectedOption]}
            onPress={() => setDeliveryMethod('retirada')}
          >
            <Ionicons name="storefront" size={20} color={deliveryMethod === 'retirada' ? '#fff' : '#E94057'} />
            <Text style={[styles.optionText, deliveryMethod === 'retirada' && styles.selectedText]}>
              Retirar Agora
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.option, deliveryMethod === 'retirada_depois' && styles.selectedOption]}
            onPress={() => setDeliveryMethod('retirada_depois')}
          >
            <Ionicons name="time" size={20} color={deliveryMethod === 'retirada_depois' ? '#fff' : '#E94057'} />
            <Text style={[styles.optionText, deliveryMethod === 'retirada_depois' && styles.selectedText]}>
              Retirar Depois
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
  storeName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
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
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  pointsText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E94057',
  },
  debugButton: {
    backgroundColor: '#666',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
  },
});