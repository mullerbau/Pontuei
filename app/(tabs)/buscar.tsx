import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ApiService, Establishment } from '../../services/api';

const restaurantImages = {
  diade: require('@/assets/images/logo-restaurantes/diade.jpg'),
  ampm: require('@/assets/images/logo-restaurantes/ampm.png'),
  differ: require('@/assets/images/logo-restaurantes/differ.jpg'),
  versa: require('@/assets/images/logo-restaurantes/versa.jpg'),
};

const getRestaurantImage = (establishment: Establishment) => {
  // Se tem logo_url da API, usa ela
  if (establishment.logo_url) {
    return { uri: establishment.logo_url };
  }
  
  // Fallback para imagens locais
  const imageMap = {
    'DiaDe': restaurantImages.diade,
    'AM/PM': restaurantImages.ampm,
    'Differ': restaurantImages.differ,
    'Versa': restaurantImages.versa,
  };
  return imageMap[establishment.name] || restaurantImages.diade;
};

const getRandomRating = () => (4.2 + Math.random() * 0.7).toFixed(1);
const getRandomDistance = () => (0.3 + Math.random() * 1.2).toFixed(1) + ' km';

export default function Buscar() {
  const [searchText, setSearchText] = useState('');
  const [restaurants, setRestaurants] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Tentar carregar da API, se falhar usar dados locais
      try {
        const data = await ApiService.getEstablishments();
        setRestaurants(data);
      } catch (apiError) {
        console.log('API não disponível, usando dados locais');
        const fallbackData = ApiService.getFallbackEstablishments();
        setRestaurants(fallbackData);
      }
    } catch (error) {
      console.error('Erro ao carregar restaurantes:', error);
      setError('Erro ao carregar restaurantes');
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (restaurant.description && restaurant.description.toLowerCase().includes(searchText.toLowerCase())) ||
    restaurant.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleRestaurantPress = (restaurant: Establishment) => {
    router.push(`/loja/${restaurant.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#ff3366" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar restaurantes..."
          placeholderTextColor="#9D9D9D"
          value={searchText}
          onChangeText={setSearchText}
          autoFocus
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {searchText.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={60} color="#ccc" />
            <Text style={styles.emptyTitle}>Buscar Restaurantes</Text>
            <Text style={styles.emptySubtitle}>Digite o nome do restaurante ou tipo de comida</Text>
          </View>
        ) : loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#ff3366" />
            <Text style={styles.emptyTitle}>Carregando...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle" size={60} color="#ccc" />
            <Text style={styles.emptyTitle}>Erro</Text>
            <Text style={styles.emptySubtitle}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadRestaurants}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : filteredRestaurants.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="sad" size={60} color="#ccc" />
            <Text style={styles.emptyTitle}>Nenhum resultado</Text>
            <Text style={styles.emptySubtitle}>Tente buscar por outro termo</Text>
          </View>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <TouchableOpacity 
              key={restaurant.id} 
              style={styles.restaurantCard}
              onPress={() => handleRestaurantPress(restaurant)}
            >
              <Image source={getRestaurantImage(restaurant)} style={styles.restaurantImage} />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantSpecialty}>{restaurant.description || restaurant.category}</Text>
                <View style={styles.restaurantDetails}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>{getRandomRating()}</Text>
                  </View>
                  <Text style={styles.distanceText}>{getRandomDistance()}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  restaurantDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
  retryButton: {
    backgroundColor: '#ff3366',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});