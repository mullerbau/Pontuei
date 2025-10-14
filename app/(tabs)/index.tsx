import React from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

const establishments = [
  { id: 1, name: 'McDonald\'s', image: '🍔' },
  { id: 2, name: 'Burger King', image: '🍟' },
  { id: 3, name: 'Starbucks', image: '☕' },
  { id: 4, name: 'Subway', image: '🥪' },
  { id: 5, name: 'Outback', image: '🥩' },
  { id: 6, name: 'Habib\'s', image: '🥙' },
];

const services = [
  { id: 1, name: 'Delivery', description: 'Entrega rápida', icon: '🚚' },
  { id: 2, name: 'Retirada', description: 'Retire no local', icon: '🏪' },
  { id: 3, name: 'Pontos', description: 'Acumule pontos', icon: '⭐' },
  { id: 4, name: 'Ofertas', description: 'Promoções especiais', icon: '🎁' },
];

const adBanners = [
  { id: 1, text: '🎉 Novidades e Ofertas', color: '#F06292' },
  { id: 2, text: '🔥 Promoções Especiais', color: '#E94057' },
  { id: 3, text: '⭐ Pontos em Dobro', color: '#FF6B35' },
];

const nearbyStores = [
  { id: 1, name: 'Pizza Hut', image: '🍕' },
  { id: 2, name: 'KFC', image: '🍗' },
  { id: 3, name: 'Domino\'s', image: '🍕' },
  { id: 4, name: 'Taco Bell', image: '🌮' },
  { id: 5, name: 'Outback', image: '🥩' },
  { id: 6, name: 'Habib\'s', image: '🥙' },
];

function EstablishmentCard({ name }) {
  return (
    <TouchableOpacity style={styles.establishmentCard}>
      <View style={styles.establishmentLogo} />
      <Text style={styles.establishmentName}>{name}</Text>
    </TouchableOpacity>
  );
}

function ServiceCard({ name, description }) {
  return (
    <TouchableOpacity style={styles.serviceCard}>
      <View style={styles.serviceLogo} />
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
        <View key={banner.id} style={[styles.adBanner, { backgroundColor: banner.color }]}>
          <Text style={styles.adText}>{banner.text}</Text>
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
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>P</Text>
          </View>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Bem vindo de volta, </Text>
          <Text style={styles.userName}>Eric Bauer</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquise por lojas, cafeterias e mais."
            placeholderTextColor="#9D9D9D"
          />
        </View>

        {/* Last Visited Establishments */}
        <Text style={styles.sectionTitle}>Últimos estabelecimentos visitados</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.establishmentsScroll}>
          {establishments.map((item) => (
            <EstablishmentCard key={item.id} name={item.name} />
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
            />
          ))}
        </View>

        {/* Nearby Stores */}
        <Text style={styles.sectionTitle}>Lojas próximas de você</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.establishmentsScroll}>
          {nearbyStores.map((item) => (
            <EstablishmentCard key={item.id} name={item.name} />
          ))}
        </ScrollView>
      </ScrollView>

      {/* Bottom Menu */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚫</Text>
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚫</Text>
          <Text style={styles.menuText}>Procura</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚫</Text>
          <Text style={styles.menuText}>Pedidos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚫</Text>
          <Text style={styles.menuText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: '#E94057',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeContainer: {
    alignItems: 'flex-start',
    marginLeft: 48,
    marginBottom: 35,
  },
  welcomeText: {
    fontSize: 11,
    color: '#000',
    fontFamily: 'Poppins_400Regular',
  },
  userName: {
    fontSize: 16,
    color: '#E94057',
    fontFamily: 'Poppins_600SemiBold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 332,
    height: 40,
    backgroundColor: 'rgba(217, 217, 217, 0.37)',
    borderRadius: 20,
    paddingHorizontal: 15,
    alignSelf: 'center',
    marginBottom: 35,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#9D9D9D',
    fontFamily: 'Poppins_400Regular',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#E94057',
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    marginBottom: 20,
  },
  establishmentsScroll: {
    paddingLeft: 20,
    marginBottom: 32,
  },
  establishmentCard: {
    width: 70,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  establishmentLogo: {
    width: 30,
    height: 30,
    backgroundColor: '#C4C4C4',
    borderRadius: 15,
    marginBottom: 5,
  },
  establishmentName: {
    fontSize: 9,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    fontWeight: '300',
  },
  adCarousel: {
    marginBottom: 32,
  },
  adCarouselContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  adBanner: {
    width: 352,
    height: 105,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  adText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  servicesTitle: {
    fontSize: 16,
    color: '#E94057',
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    marginBottom: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginBottom: 32,
  },
  serviceCard: {
    width: 134,
    height: 75,
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  serviceLogo: {
    width: 20,
    height: 20,
    backgroundColor: '#C4C4C4',
    borderRadius: 10,
    marginBottom: 5,
  },
  serviceName: {
    fontSize: 9,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 6,
    color: '#000',
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
  bottomMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  menuItem: {
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginBottom: 4,
    color: '#000',
  },
  menuText: {
    fontSize: 10,
    fontFamily: 'Poppins_400Regular',
    color: '#000',
  },
});