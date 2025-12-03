import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOrders } from '../../contexts/OrderContext';
import { useUser } from '../../contexts/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserHeader from '../../components/UserHeader';
import { ApiService, Establishment } from '../../services/api';
import { useState, useEffect } from 'react';



const configs = [
  { icone: "settings", texto: "Gerenciar conta", cor: "#667eea" },
  { icone: "notifications", texto: "Notificações", cor: "#f093fb" },
  { icone: "shield-checkmark", texto: "Privacidade", cor: "#4facfe" },
  { icone: "help-circle", texto: "Ajuda & Suporte", cor: "#43e97b" },
];

export default function TelaPerfil() {
  const navegacao = useRouter();
  const { orders } = useOrders();
  const { getStorePoints, lastVisitedStore, getFavoriteStore, getEstablishmentRanking } = useUser();
  const [favoriteStore, setFavoriteStore] = useState<any>(null);
  const [storePoints, setStorePoints] = useState(0);
  const [showRanking, setShowRanking] = useState(false);
  const [establishmentRanking, setEstablishmentRanking] = useState<any[]>([]);
  const [showWallet, setShowWallet] = useState(false);
  
  // Carregar dados da loja favorita
  useEffect(() => {
    loadFavoriteStore();
    loadRanking();
  }, []);
  
  const loadFavoriteStore = async () => {
    const favorite = await getFavoriteStore();
    setFavoriteStore(favorite);
    if (favorite) {
      setStorePoints(favorite.points);
    }
  };

  const loadRanking = async () => {
    const ranking = await getEstablishmentRanking();
    setEstablishmentRanking(ranking);
  };
  
  const fazerLogout = async () => {
    try {
      await AsyncStorage.removeItem('usuario');
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('lastVisitedStore');
      navegacao.replace('/auth/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Falha ao sair da conta');
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <UserHeader />

        {/* Lojas favoritas */}
        <View style={s.section} style={[s.section, { marginTop: 40 }]}>
        <Text style={s.sectionTitle}>Sua loja favorita</Text>
        {favoriteStore ? (
          <TouchableOpacity style={s.storeCard} onPress={() => navegacao.push(`/loja/${favoriteStore.establishment.id}`)}>
            <View style={s.storeImageContainer}>
              <Image 
                source={favoriteStore.establishment.logo_url ? { uri: favoriteStore.establishment.logo_url } : require('../../assets/images/logo-restaurantes/diade.jpg')}
                style={s.storeImage}
              />
            </View>
            <View style={s.storeInfo}>
              <Text style={s.storeName}>{favoriteStore.establishment.name}</Text>
              <Text style={s.storePoints}>{favoriteStore.points} pontos</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        ) : (
          <View style={s.emptyStoreCard}>
            <Text style={s.emptyStoreText}>Nenhuma loja com pontos ainda</Text>
          </View>
        )}
      </View>

        {/* Menu rápido */}
        <Text style={s.sectionTitleRap}>Acesso rápido</Text>
        <View style={s.quickMenu}>
        <TouchableOpacity style={s.quickMenuItem} onPress={() => setShowWallet(true)}>
          <View style={s.quickIcon}>
            <Ionicons name="card" size={20} color="#ff3366" />
          </View>
          <Text style={s.quickText}>Carteira</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.quickMenuItem} onPress={() => setShowRanking(true)}>
          <View style={s.quickIcon}>
            <Ionicons name="trophy" size={20} color="#ff3366" />
          </View>
          <Text style={s.quickText}>Ranking</Text>
        </TouchableOpacity>
      </View>

        {/* Configurações */}
        <View style={s.section}>
        <Text style={s.sectionTitle}>Configurações</Text>
        {configs.map((config, i) => (
          <TouchableOpacity key={i} style={s.configCard}>
            <View style={s.configIcon}>
              <Ionicons name={config.icone as any} size={18} color="#ff3366" />
            </View>
            <Text style={s.configText}>{config.texto}</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

        {/* Logout */}
        <TouchableOpacity 
        style={s.logoutButton} 
        onPress={() => Alert.alert("Sair", "Você realmente deseja sair?", [
          {text: "Cancelar", style: "cancel"}, 
          {text: "Sair", style: "destructive", onPress: fazerLogout}
        ])}
      >
        <Ionicons name="log-out" size={20} color="#E94057" />
        <Text style={s.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Ranking */}
      {showRanking && (
        <View style={s.modalOverlay}>
          <View style={s.rankingModal}>
            <View style={s.rankingHeader}>
              <Text style={s.rankingTitle}>Seus Restaurantes</Text>
              <TouchableOpacity onPress={() => setShowRanking(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={s.rankingList}>
              {establishmentRanking.map((item, index) => (
                <TouchableOpacity 
                  key={item.establishment.id} 
                  style={s.rankingItem}
                  onPress={() => {
                    setShowRanking(false);
                    navegacao.push(`/loja/${item.establishment.id}`);
                  }}
                >
                  <View style={s.rankingPosition}>
                    <Text style={s.positionText}>{index + 1}º</Text>
                  </View>
                  <View style={s.establishmentAvatar}>
                    <Image 
                      source={item.establishment.logo_url ? { uri: item.establishment.logo_url } : require('../../assets/images/logo-restaurantes/diade.jpg')}
                      style={s.avatarImage}
                    />
                  </View>
                  <View style={s.establishmentInfo}>
                    <Text style={s.establishmentName}>{item.establishment.name}</Text>
                    <Text style={s.establishmentPoints}>{item.points} pontos • {item.ordersCount} pedidos</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#ccc" />
                </TouchableOpacity>
              ))}
              {establishmentRanking.length === 0 && (
                <View style={s.emptyRanking}>
                  <Text style={s.emptyRankingText}>Nenhum restaurante com pontos ainda</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Modal da Carteira */}
      {showWallet && (
        <View style={s.modalOverlay}>
          <View style={s.rankingModal}>
            <View style={s.rankingHeader}>
              <Text style={s.rankingTitle}>Minha Carteira</Text>
              <TouchableOpacity onPress={() => setShowWallet(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={s.rankingList}>
              {establishmentRanking.map((item, index) => (
                <TouchableOpacity 
                  key={item.establishment.id} 
                  style={s.walletItem}
                  onPress={() => {
                    setShowWallet(false);
                    navegacao.push(`/loja/${item.establishment.id}`);
                  }}
                >
                  <View style={s.establishmentAvatar}>
                    <Image 
                      source={item.establishment.logo_url ? { uri: item.establishment.logo_url } : require('../../assets/images/logo-restaurantes/diade.jpg')}
                      style={s.avatarImage}
                    />
                  </View>
                  <View style={s.establishmentInfo}>
                    <Text style={s.establishmentName}>{item.establishment.name}</Text>
                    <Text style={s.walletPoints}>{item.points} pontos disponíveis</Text>
                  </View>
                  <View style={s.pointsBadge}>
                    <Ionicons name="sparkles" size={16} color="#ff3366" />
                    <Text style={s.pointsBadgeText}>{item.points}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {establishmentRanking.length === 0 && (
                <View style={s.emptyRanking}>
                  <Ionicons name="wallet" size={48} color="#ccc" />
                  <Text style={s.emptyRankingText}>Nenhum ponto na carteira ainda</Text>
                  <Text style={s.emptySubtext}>Faça pedidos para ganhar pontos!</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContent: {
    paddingBottom: 20,
  },

  

  
  section: { marginHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 12, textAlign: "center" },
  
  storeCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  storeImageContainer: { width: 36, height: 36, borderRadius: 18, marginRight: 12, overflow: 'hidden' },
  storeImage: { width: 36, height: 36, borderRadius: 18 },
  storeInfo: { flex: 1 },
  storeName: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 2 },
  storePoints: { fontSize: 12, color: "#ff3366", fontWeight: "500" },
  sectionTitleRap: { fontSize: 18, fontWeight: "600", color: "#333", textAlign: "center", marginTop: 24 },
  quickMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  quickMenuItem: { alignItems: "center" },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,51,102,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  quickText: { fontSize: 12, fontWeight: "500", color: "#333" },
  
  configCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  configIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,51,102,0.1)", alignItems: "center", justifyContent: "center", marginRight: 12 },
  configText: { fontSize: 14, color: "#333", flex: 1, fontWeight: "500" },
  
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff3366",
  },
  logoutText: { color: "#ff3366", fontSize: 14, fontWeight: "600", marginLeft: 6 },
  emptyStoreCard: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  emptyStoreText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  rankingModal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    maxHeight: "70%",
    width: "90%",
    maxWidth: 400,
  },
  rankingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rankingTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  rankingList: {
    flex: 1,
    padding: 20,
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  rankingPosition: {
    width: 30,
    alignItems: "center",
  },
  positionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff3366",
  },
  establishmentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 15,
  },
  avatarImage: {
    width: 40,
    height: 40,
  },
  establishmentInfo: {
    flex: 1,
  },
  establishmentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  establishmentPoints: {
    fontSize: 14,
    color: "#666",
  },
  emptyRanking: {
    padding: 40,
    alignItems: "center",
  },
  emptyRankingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  walletItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  walletPoints: {
    fontSize: 14,
    color: "#ff3366",
    fontWeight: "500",
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 51, 102, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  pointsBadgeText: {
    fontSize: 12,
    color: "#ff3366",
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
});