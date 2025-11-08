import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const isTablet = width > 425;

const restaurantImages = {
  diade: require('@/assets/images/logo-restaurantes/diade.jpg'),
  ampm: require('@/assets/images/logo-restaurantes/ampm.png'),
  differ: require('@/assets/images/logo-restaurantes/differ.jpg'),
  versa: require('@/assets/images/logo-restaurantes/versa.jpg'),
};

const establishments = [
  { id: 1, name: 'DiaDe', image: restaurantImages.diade, rating: 4.8, distance: '0.2 km' },
  { id: 2, name: 'AM/PM', image: restaurantImages.ampm, rating: 4.2, distance: '0.5 km' },
  { id: 3, name: 'Differ', image: restaurantImages.differ, rating: 4.6, distance: '0.8 km' },
  { id: 4, name: 'Versa', image: restaurantImages.versa, rating: 4.4, distance: '1.2 km' },
];

const services = [
  { id: 1, name: 'Barbearias', description: 'Agende seu corte pelo App!', icon: '' },
  { id: 2, name: 'Manicure', description: 'Faça suas unhas lindondass', icon: '' },
  { id: 3, name: 'Pedicure', description: 'Faça seu pézin feioso', icon: '' },
  { id: 4, name: 'Cafeterias', description: 'Aproveite um café quentinho', icon: '' },
];

const adBanners = [
  { id: 1, text: ' APROVEITA A PROMOÇÃO LOCK', colors: ['#ff3366', '#ff5e5e'] },
  { id: 2, text: ' Promoções Especiais', colors: ['#ff3366', '#ff5e5e'] },
  { id: 3, text: ' Pontos em Dobro', colors: ['#ff3366', '#ff5e5e'] },
];

const nearbyStores = [
  { id: 1, name: 'DiaDe', image: restaurantImages.diade, rating: 4.8, distance: '0.2 km' },
  { id: 2, name: 'AM/PM', image: restaurantImages.ampm, rating: 4.2, distance: '0.5 km' },
  { id: 3, name: 'Differ', image: restaurantImages.differ, rating: 4.6, distance: '0.8 km' },
  { id: 4, name: 'Versa', image: restaurantImages.versa, rating: 4.4, distance: '1.2 km' },
];

function EstablishmentCard({ name, image, rating, distance }) {
  const handlePress = () => {
    if (name === 'DiaDe') {
      router.push('/loja');
    }
  };

  return (
    <TouchableOpacity style={styles.establishmentCard} onPress={handlePress}>
      <View style={styles.establishmentLogo}>
        <Image source={image} style={styles.establishmentImage} resizeMode="cover" />
      </View>
      <Text style={styles.establishmentName}>{name}</Text>
      <View style={styles.establishmentInfo}>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={10} color="#FFD700" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
        <Text style={styles.pipelineText}>|</Text>
        <Text style={styles.distanceText}>{distance}</Text>
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
        <Text style={styles.serviceIcon}>{icon}</Text>
      </LinearGradient>
      <Text style={styles.serviceName}>{name}</Text>
      <Text style={styles.serviceDescription}>{description}</Text>
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
            source={require('@/assets/images/carroussel-ads/ad1.png')}
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <View style={styles.headerContent}>
            
          <View style={styles.welcomeContainer}>
            <Image 
              source={require('@/assets/images/pontuei logo.svg')}
              style={styles.profileImage}
            />
            <View style={styles.welcomeTexts}>
              <Text style={styles.welcomeText}>Bem vindo de volta.</Text>
              <Text style={styles.userName}>Eric Bauer!</Text>
            </View>
            {/* <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/images/pontuei logo.svg')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View> */}
          </View>
          </View>

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.establishmentsScroll}>
          {establishments.map((item) => (
            <EstablishmentCard key={item.id} name={item.name} image={item.image} rating={item.rating} distance={item.distance} />
          ))}
        </ScrollView>

        {/* Ad Banner Carousel */}
        <AdBannerCarousel />

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.establishmentsScroll}>
          {nearbyStores.map((item) => (
            <EstablishmentCard key={item.id} name={item.name} image={item.image} rating={item.rating} distance={item.distance} />
          ))}
        </ScrollView>
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
  headerContent: {

    justifyContent: 'center',
    alignItems: 'center',
    height: '10vh',
    paddingTop: 20,
    marginTop: 10,
    
  },
  logoContainer: {
  },
  logo: {
    paddingTop: 10,
    width: 120,
    height: 120,
  
  },
  pontueiText: {
    color: '#000000ff',
    fontSize: 18,
    fontWeight: '600',
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  welcomeTexts: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.9)',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    color: '#E94057',
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: 'bold',
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
    width: isTablet ? 140 : 100,
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
    paddingHorizontal: 8,
    gap: 6,
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
});