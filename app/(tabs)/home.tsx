import { Poppins_400Regular, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const establishments = [
  { id: 1, name: 'McDonald\'s', image: '' },
  { id: 2, name: 'Burger King', image: '' },
  { id: 3, name: 'Starbucks', image: '' },
  { id: 4, name: 'Subway', image: '' },
  { id: 5, name: 'Outback', image: '' },
  { id: 6, name: 'Habib\'s', image: '' },
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
  { id: 1, name: 'DiaDe', image: '' },
  { id: 2, name: 'KFC', image: '' },
  { id: 3, name: 'Domino\'s', image: '🍕' },
  { id: 4, name: 'Taco Bell', image: '🌮' },
  { id: 5, name: 'Outback', image: '🥩' },
  { id: 6, name: 'Habib\'s', image: '🥙' },
];

function EstablishmentCard({ name, image }) {
  return (
    <TouchableOpacity style={styles.establishmentCard}>
      <View style={styles.establishmentLogo}>
        <Text style={styles.establishmentEmoji}>{image}</Text>
      </View>
      <Text style={styles.establishmentName}>{name}</Text>
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
        <LinearGradient
          key={banner.id}
          colors={banner.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.adBanner}
        >
          <Text style={styles.adText}>{banner.text}</Text>
        </LinearGradient>
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
            <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/images/pontuei logo.svg')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>
          
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Bem vindo de volta! 👋</Text>
            <Text style={styles.userName}>Eric Bauer</Text>
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
            <EstablishmentCard key={item.id} name={item.name} image={item.image} />
          ))}
        </ScrollView>

        {/* Ad Banner Carousel */}
        <AdBannerCarousel />

        {/* Services Section */}
        <Text style={styles.servicesTitle}>Serviços</Text>
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
        <Text style={styles.sectionTitle}>📍 Lojas próximas de você</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.establishmentsScroll}>
          {nearbyStores.map((item) => (
            <EstablishmentCard key={item.id} name={item.name} image={item.image} />
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '20vh',
    marginBottom: 20,
    
  },
  logoContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  pontueiText: {
    color: '#000000ff',
    fontSize: 18,
    fontWeight: '600',
  },
  notificationButton: {
    padding: 8,
  },
  welcomeContainer: {
    paddingHorizontal: 20,
    marginLeft: 15,
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
    fontSize: 18,
    color: '#E94057',
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  servicesTitle: {
    fontSize: 18,
    color: '#E94057',
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: 'bold',
    marginLeft: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  establishmentsScroll: {
    paddingLeft: 20,
    marginBottom: 32,
  },
  establishmentCard: {
    width: 85,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    marginBottom: 3,
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
    width: 45,
    height: 45,
    backgroundColor: '#f8f9fa',
    borderRadius: 22,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  establishmentEmoji: {
    fontSize: 24,
  },
  establishmentName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    fontWeight: '500',
  },
  adCarousel: {
    marginBottom: 32,
  },
  adCarouselContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  adBanner: {
    width: 320,
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
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
    borderRadius: 16,
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