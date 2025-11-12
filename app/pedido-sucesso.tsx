import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function PedidoSucesso() {
  const [rating, setRating] = useState(0);

  const handleRating = (stars: number) => {
    setRating(stars);
  };

  const handleFinish = () => {
    if (rating > 0) {
      Alert.alert('Obrigado!', 'Sua avaliação foi enviada com sucesso.');
    }
    router.push('/pedidos');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>
        
        <Text style={styles.title}>Pedido Confirmado!</Text>
        <Text style={styles.subtitle}>Seu pedido foi realizado com sucesso</Text>
        
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>Pedido #1234</Text>
          <Text style={styles.orderStatus}>Em preparo</Text>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Avalie sua experiência</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                <Ionicons 
                  name={star <= rating ? "star" : "star-outline"} 
                  size={32} 
                  color="#FFD700" 
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleFinish}>
          <Text style={styles.buttonText}>Acompanhar Pedido</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successIcon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  orderInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  orderStatus: {
    fontSize: 14,
    color: '#ff3366',
    fontWeight: '500',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: '#ff3366',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});