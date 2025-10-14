import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
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
          <Text style={s.avatarText}>NK</Text>
        </View>
        <Text style={s.name}>Natã Kuhn</Text>
        <Text style={s.email}>nata@pontuei.com</Text>
      </LinearGradient>

      {/* Card de pontos totais */}
      <View style={s.pointsCard}>
        <View style={s.pointsHeader}>
          <Ionicons name="star" size={24} color="#FFD700" />
          <Text style={s.pointsTitle}>Pontos Totais</Text>
        </View>
        <Text style={s.totalPoints}>1.200</Text>
        <Text style={s.pointsSubtitle}>Continue comprando para ganhar mais!</Text>
      </View>

      {/* Lojas favoritas */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>🏪 Suas lojas favoritas</Text>
        {pontosLojas.map((loja, i) => (
          <TouchableOpacity key={i} style={s.storeCard}>
            <View style={[s.storeIcon, { backgroundColor: loja.cor + '20' }]}>
              <Ionicons name={loja.icone as any} size={24} color={loja.cor} />
            </View>
            <View style={s.storeInfo}>
              <Text style={s.storeName}>{loja.nome}</Text>
              <Text style={s.storePoints}>{loja.pontos} pontos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu rápido */}
      <View style={s.quickMenu}>
        <TouchableOpacity style={s.quickMenuItem}>
          <LinearGradient colors={['#ff3366', '#ff5e5e']} style={s.quickIcon}>
            <Ionicons name="gift" size={24} color="#fff" />
          </LinearGradient>
          <Text style={s.quickText}>Cupons</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.quickMenuItem}>
          <LinearGradient colors={['#ff3366', '#ff5e5e']} style={s.quickIcon}>
            <Ionicons name="card" size={24} color="#fff" />
          </LinearGradient>
          <Text style={s.quickText}>Carteira</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.quickMenuItem}>
          <LinearGradient colors={['#ff3366', '#ff5e5e']} style={s.quickIcon}>
            <Ionicons name="trophy" size={24} color="#fff" />
          </LinearGradient>
          <Text style={s.quickText}>Ranking</Text>
        </TouchableOpacity>
      </View>

      {/* Configurações */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>⚙️ Configurações</Text>
        {configs.map((config, i) => (
          <TouchableOpacity key={i} style={s.configCard}>
            <View style={[s.configIcon, { backgroundColor: config.cor + '20' }]}>
              <Ionicons name={config.icone as any} size={20} color={config.cor} />
            </View>
            <Text style={s.configText}>{config.texto}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
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
  avatarText: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  name: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  email: { fontSize: 16, color: "rgba(255,255,255,0.8)" },
  
  pointsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  pointsHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  pointsTitle: { fontSize: 18, fontWeight: "600", color: "#333", marginLeft: 8 },
  totalPoints: { fontSize: 48, fontWeight: "bold", color: "#ff3366", marginBottom: 8 },
  pointsSubtitle: { fontSize: 14, color: "#666", textAlign: "center" },
  
  section: { marginHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 16 },
  
  storeCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  storeIcon: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center", marginRight: 16 },
  storeInfo: { flex: 1 },
  storeName: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 4 },
  storePoints: { fontSize: 14, color: "#ff3366", fontWeight: "500" },
  
  quickMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginTop: 24,
  },
  quickMenuItem: { alignItems: "center" },
  quickIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickText: { fontSize: 14, fontWeight: "500", color: "#333" },
  
  configCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  configIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginRight: 16 },
  configText: { fontSize: 16, color: "#333", flex: 1, fontWeight: "500" },
  
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ff3366",
  },
  logoutText: { color: "#ff3366", fontSize: 16, fontWeight: "600", marginLeft: 8 },
});