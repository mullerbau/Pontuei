import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const pontosLojas = [
  { nome: "Café Central", pontos: 450, icone: "cafe", cor: "#FF6B35" },
  { nome: "Barbearia Style", pontos: 320, icone: "cut", cor: "#4ECDC4" },
  { nome: "Farmácia Saúde", pontos: 280, icone: "medical", cor: "#45B7D1" },
  { nome: "Restaurante Sabor", pontos: 150, icone: "restaurant", cor: "#96CEB4" },
];

const configs = [
  { icone: "settings", texto: "Gerenciar conta", cor: "#667eea" },
  { icone: "notifications", texto: "Notificações", cor: "#f093fb" },
  { icone: "shield-checkmark", texto: "Privacidade", cor: "#4facfe" },
  { icone: "help-circle", texto: "Ajuda & Suporte", cor: "#43e97b" },
];

export default function TelaPerfil() {
  const navegacao = useRouter();
  
  const fazerLogout = async () => {
    await AsyncStorage.removeItem('usuario');
    navegacao.replace('/auth/login');
  };

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* Header com gradiente */}
      <LinearGradient
        colors={['#ff3366', '#ff5e5e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.header}
      >
        <View style={s.avatar}>
          <Image source={require('../../assets/images/icon.jpg')} style={s.avatarImage} />
        </View>
        <Text style={s.name}>Eric Bauer</Text>
        <Text style={s.email}>eric@pontuei.com</Text>
      </LinearGradient>

      {/* Seção de pontos */}
      <View style={s.pointsSection}>
        <Text style={s.sectionTitle}>Seus Pontos</Text>
        <View style={s.pointsCard}>
          <View style={s.pointsRow}>
            <Ionicons name="diamond" size={20} color="#ff3366" />
            <Text style={s.totalPoints}>1.200</Text>
          </View>
          <Text style={s.pointsLabel}>pontos acumulados</Text>
        </View>
      </View>

      {/* Lojas favoritas */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Suas lojas favoritas</Text>
        {pontosLojas.map((loja, i) => (
          <TouchableOpacity key={i} style={s.storeCard}>
            <View style={s.storeIcon}>
              <Ionicons name={loja.icone as any} size={20} color="#ff3366" />
            </View>
            <View style={s.storeInfo}>
              <Text style={s.storeName}>{loja.nome}</Text>
              <Text style={s.storePoints}>{loja.pontos} pontos</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu rápido */}
      <View style={s.quickMenu}>
        <TouchableOpacity style={s.quickMenuItem}>
          <View style={s.quickIcon}>
            <Ionicons name="gift" size={20} color="#ff3366" />
          </View>
          <Text style={s.quickText}>Cupons</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.quickMenuItem}>
          <View style={s.quickIcon}>
            <Ionicons name="card" size={20} color="#ff3366" />
          </View>
          <Text style={s.quickText}>Carteira</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.quickMenuItem}>
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
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: { 
    alignItems: "center", 
    paddingVertical: 50, 
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: -20,
    zIndex: 1,
  },
  avatar: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    backgroundColor: "rgba(255,255,255,0.3)", 
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
  },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  name: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  email: { fontSize: 16, color: "rgba(255,255,255,0.8)" },
  
  pointsSection: { marginHorizontal: 20, marginTop: 40 },
  pointsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  pointsRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  totalPoints: { fontSize: 32, fontWeight: "bold", color: "#333", marginLeft: 8 },
  pointsLabel: { fontSize: 14, color: "#666" },
  
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
  storeIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,51,102,0.1)", alignItems: "center", justifyContent: "center", marginRight: 12 },
  storeInfo: { flex: 1 },
  storeName: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 2 },
  storePoints: { fontSize: 12, color: "#ff3366", fontWeight: "500" },
  
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
});