import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../contexts/OrderContext';
import { ApiService, Order } from '../../services/api';

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'em_preparo':
      return { text: 'Em preparo', color: '#ff9800', icon: 'restaurant' };
    case 'pronto':
      return { text: 'Pronto', color: '#4caf50', icon: 'checkmark-circle' };
    case 'concluido':
      return { text: 'Concluído', color: '#4caf50', icon: 'checkmark-done' };
    default:
      return { text: 'Desconhecido', color: '#666', icon: 'help-circle' };
  }
};

export default function PedidosScreen() {
  const { orders: localOrders, updateOrderStatus } = useOrders();
  const [apiOrders, setApiOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const orders = await ApiService.getMyOrders();
      setApiOrders(orders);
    } catch (error) {
      console.error('Erro ao carregar pedidos da API:', error);
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const mapApiStatusToLocal = (status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': 'em_preparo',
      'confirmed': 'em_preparo',
      'ready': 'pronto',
      'completed': 'concluido',
      'cancelled': 'cancelado'
    };
    return statusMap[status] || status;
  };



  // Usar apenas pedidos da API se houver, senão usar locais
  const allOrders = apiOrders.length > 0 ? apiOrders.map(order => ({
    id: order.id,
    status: mapApiStatusToLocal(order.status),
    total: `R$ ${parseFloat(order.total_amount).toFixed(2).replace('.', ',')}`,
    items: order.order_items.map(item => ({
      id: item.product_id,
      name: item.product.name,
      quantity: item.quantity,
      price: `R$ ${parseFloat(item.unit_price).toFixed(2).replace('.', ',')}`
    })),
    createdAt: new Date(order.created_at),
    paymentMethod: 'N/A',
    deliveryMethod: 'N/A'
  })) : localOrders;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E94057" />
            <Text style={styles.loadingText}>Carregando pedidos...</Text>
          </View>
        ) : allOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
            <Text style={styles.emptySubtext}>Seus pedidos aparecerão aqui</Text>
          </View>
        ) : (
          allOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <TouchableOpacity key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>Pedido #{order.id.slice(-4).toUpperCase()}</Text>
                  <View style={styles.headerRight}>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
                      <Ionicons name={statusInfo.icon as any} size={12} color="#fff" />
                      <Text style={styles.statusText}>{statusInfo.text}</Text>
                    </View>

                  </View>
                </View>
                
                <View style={styles.orderItems}>
                  {order.items.map((item, index) => (
                    <Text key={index} style={styles.itemText}>
                      {item.quantity}x {item.name}
                    </Text>
                  ))}
                </View>
                
                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotal}>Total: {order.total}</Text>
                  <Text style={styles.orderDate}>
                    {order.createdAt.toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  orderItems: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff3366',
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },

});