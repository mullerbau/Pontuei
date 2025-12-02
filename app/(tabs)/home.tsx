import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserHeader from '@/components/UserHeader';
import { ApiService, Establishment } from '../../services/api';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const isTablet = width > 425;

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

const services = [
  { id: 1, name: 'Barbearias', description: 'Agende seu corte pelo App!', icon: 'cut' },
  { id: 2, name: 'Manicure', description: 'Faça suas unhas lindondass', icon: 'hand-left' },
  { id: 3, name: 'Pedicure', description: 'Faça seu pézin feioso', icon: 'footsteps' },
  { id: 4, name: 'Cafeterias', description: 'Aproveite um café quentinho', icon: 'cafe' },
];

const adBanners = [
  { id: 1, text: ' APROVEITA A PROMOÇÃO LOCK', colors: ['#ff3366', '#ff5e5e'], image: require('@/assets/images/carroussel-ads/ad1.png') },
  { id: 2, text: ' Promoções Especiais', colors: ['#ff3366', '#ff5e5e'], image: require('@/assets/images/carroussel-ads/ad2.png') },
  { id: 3, text: ' Pontos em Dobro', colors: ['#ff3366', '#ff5e5e'], image: require('@/assets/images/carroussel-ads/ad1.png') },
];



function EstablishmentCard({ establishment }: { establishment: Establishment }) {
  const handlePress = () => {
    router.push(`/loja/${establishment.id}`);
  };

  return (
    <TouchableOpacity style={styles.establishmentCard} onPress={handlePress}>
      <View style={styles.establishmentLogo}>
        <Image source={getRestaurantImage(establishment)} style={styles.establishmentImage} resizeMode="cover" />
      </View>
      <Text style={styles.establishmentName}>{establishment.name}</Text>
      <View style={styles.establishmentInfo}>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={10} color="#FFD700" />
          <Text style={styles.ratingText}>{getRandomRating()}</Text>
        </View>
        <Text style={styles.pipelineText}>|</Text>
        <Text style={styles.distanceText} numberOfLines={1}>{getRandomDistance()}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ServiceCard({ name, description, icon }) {
  return (
    <TouchableOpacity style={styles.serviceCard}>
      <LinearGradient
        colors={['#ff3366', '#ff5e5e']}
        style={styles.serviceLogo}
      >
        <Ionicons name={icon} size={24} color="#fff" />
      </LinearGradient>
      <Text style={styles.serviceName}>{name}</Text>
      <Text style={styles.serviceDescription}>{description}</Text>
    </TouchableOpacity>
  );
}

function FeaturedCard({ establishment }: { establishment: Establishment }) {
  const handlePress = () => {
    router.push(`/loja/${establishment.id}`);
  };

  return (
    <TouchableOpacity style={styles.featuredCard} onPress={handlePress}>
      <View style={styles.featuredImageContainer}>
        <Image source={getRestaurantImage(establishment)} style={styles.featuredImage} resizeMode="cover" />
      </View>
      <View style={styles.featuredContent}>
        <Text style={styles.featuredName}>{establishment.name}</Text>
        <Text style={styles.featuredSpecialty}>{establishment.description || establishment.category}</Text>
        <View style={styles.featuredInfo}>
          <View style={styles.featuredRating}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.featuredRatingText}>{getRandomRating()}</Text>
          </View>
          <Text style={styles.featuredDistance}>{getRandomDistance()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function AdBannerCarousel() {
  return (
    <ScrollView 
      horizontal 
      pagingEnabled 
      showsHorizontalScrollIndicator={false} 
      style={styles.adCarousel}
      contentContainerStyle={styles.adCarouselContent}
    >
      {adBanners.map((banner) => (
        <View key={banner.id} style={styles.adBanner}>
          <Image 
            source={banner.image}
            style={styles.adBannerImage}
            resizeMode="cover"
          />
        </View>
      ))}
    </ScrollView>
  );
}

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitedEstablishments, setVisitedEstablishments] = useState<string[]>([]);

  useEffect(() => {
    loadVisitedEstablishments();
    loadEstablishments();
  }, []);

  const loadVisitedEstablishments = async () => {
    try {
      const visited = await AsyncStorage.getItem('visitedEstablishments');
      if (visited) {
        setVisitedEstablishments(JSON.parse(visited));
      }
    } catch (error) {
      console.error('Erro ao carregar estabelecimentos visitados:', error);
    }
  };

  const loadEstablishments = async () => {
    try {
      setLoading(true);
      
      // Tentar carregar da API, se falhar usar dados locais
      try {
        const data = await ApiService.getEstablishments();
        const sortedData = sortEstablishmentsByVisited(data);
        setEstablishments(sortedData);
      } catch (apiError) {
        console.log('API não disponível, usando dados locais');
        const fallbackData = ApiService.getFallbackEstablishments();
        const sortedFallback = sortEstablishmentsByVisited(fallbackData);
        setEstablishments(sortedFallback);
      }
    } catch (error) {
      console.error('Erro ao carregar estabelecimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortEstablishmentsByVisited = (establishments: Establishment[]) => {
    return establishments.sort((a, b) => {
      const aIndex = visitedEstablishments.indexOf(a.id);
      const bIndex = visitedEstablishments.indexOf(b.id);
      
      // Se ambos foram visitados, ordenar por mais recente (menor índice)
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // Se apenas um foi visitado, colocar o visitado primeiro
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      // Se nenhum foi visitado, manter ordem original
      return 0;
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <UserHeader showWelcome />

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#ff3366" />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquise por lojas, cafeterias e mais."
              placeholderTextColor="#9D9D9D"
            />
          </View>
        </View>

        {/* Last Visited Establishments */}
        
        <Text style={styles.sectionTitle}>Últimos estabelecimentos visitados</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#E94057" />
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.establishmentsScroll}>
            {establishments.map((establishment) => (
              <EstablishmentCard key={establishment.id} establishment={establishment} />
            ))}
          </ScrollView>
        )}

        {/* Ad Banner Carousel */}
        <AdBannerCarousel />

        {/* Featured Section */}
        <Text style={styles.sectionTitle}>Destaques</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#E94057" />
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
            {establishments.map((establishment) => (
              <FeaturedCard key={establishment.id} establishment={establishment} />
            ))}
          </ScrollView>
        )}

        {/* Services Section */}
        <Text style={styles.sectionTitle}>Serviços</Text>
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              name={service.name}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </View>

        {/* Nearby Stores */}
        <Text style={styles.sectionTitle}>Lojas próximas de você</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#E94057" />
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.establishmentsScroll}>
            {establishments.map((establishment) => (
              <EstablishmentCard key={establishment.id} establishment={establishment} />
            ))}
          </ScrollView>
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
  scrollContent: {
    paddingBottom: 20,
  },

  searchWrapper: {
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    fontFamily: 'Poppins_400Regular',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#E94057',
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  establishmentsScroll: {
    paddingLeft: 20,
    marginBottom: 32,
  },
  establishmentCard: {
    width: isTablet ? 140 : 110,
    height: isTablet ? 150 : 130,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 16,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    padding: 12,
  },
  establishmentLogo: {
    width: isTablet ? 55 : 45,
    height: isTablet ? 55 : 45,
    backgroundColor: '#f8f9fa',
    borderRadius: isTablet ? 27 : 22,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  establishmentImage: {
    width: isTablet ? 55 : 45,
    height: isTablet ? 55 : 45,
    borderRadius: isTablet ? 27 : 22,
  },
  establishmentName: {
    fontSize: isTablet ? 14 : 12,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: 'bold',
    marginBottom: 4,
    alignSelf: 'stretch',
  },
  establishmentInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: 4,
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 10,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
  },
  distanceText: {
    fontSize: 9,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  pipelineText: {
    fontSize: 10,
    color: '#ccc',
    fontFamily: 'Poppins_400Regular',
  },
  adCarousel: {
    marginBottom: 32,
  },
  adCarouselContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  adBanner: {
    width: isTablet ? width * 0.7 : '85vw',
    height: isTablet ? 160 : 120,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    marginLeft: isTablet ? 40 : 33,
    elevation: 10,
    overflow: 'hidden',
  },
  adBannerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  adText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  serviceCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  serviceLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    fontSize: 24,
  },
  serviceName: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#333',
  },
  serviceDescription: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
  featuredScroll: {
    paddingLeft: 20,
    marginBottom: 32,
  },
  featuredCard: {
    width: width * 0.85,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  featuredImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 16,
  },
  featuredImage: {
    width: 60,
    height: 60,
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featuredName: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featuredSpecialty: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 8,
  },
  featuredInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredRatingText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
  },
  featuredDistance: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
  },
  loadingContainer: {
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
});