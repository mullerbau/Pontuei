import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const pontosLojas = [
  { nome: "Café Central", pontos: 450, icone: "cafe" },
  { nome: "Barbearia Style", pontos: 320, icone: "cut" },
  { nome: "Farmácia Saúde", pontos: 280, icone: "medical" },
  { nome: "Restaurante Sabor", pontos: 150, icone: "restaurant" },
];

const configs = [
  { icone: "settings", texto: "Gerenciar conta" },
  { icone: "notifications", texto: "Notificações" },
  { icone: "shield-checkmark", texto: "Privacidade" },
  { icone: "help-circle", texto: "Ajuda & Suporte" },
];

export default function TelaPerfil() {
  const navegacao = useRouter();
  
  const fazerLogout = async () => {
    await AsyncStorage.removeItem('usuario');
    navegacao.replace('/auth/login');
  };

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <View style={s.avatar}>
          <Ionicons name="person" size={40} color="#ff3366" />
        </View>
        <Text style={s.name}>Natã Kuhn</Text>
      </View>

      <View style={s.section}>
        <View style={s.sectionHeader}>
          <Ionicons name="star" size={16} color="#ff3366" />
          <Text style={s.sectionTitle}>Suas lojas favoritas</Text>
        </View>
        {pontosLojas.map((loja, i) => (
          <TouchableOpacity key={i} style={s.item}>
            <View style={s.icon}>
              <Ionicons name={loja.icone as any} size={20} color="#ff3366" />
            </View>
            <View style={s.info}>
              <Text style={s.itemName}>{loja.nome}</Text>
              <Text style={s.points}>{loja.pontos} pontos</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.menu}>
        {[{i: "gift", t: "Meus cupons"}, {i: "card", t: "Carteira de pontos"}].map((item, i) => (
          <TouchableOpacity key={i} style={s.menuItem}>
            <Ionicons name={item.i as any} size={20} color="#ff3366" />
            <Text style={s.menuText}>{item.t}</Text>
            <Ionicons name="chevron-forward" size={16} color="#ff3366" />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.configTitle}>Configurações</Text>
      <View style={s.section}>
        {configs.map((config, i) => (
          <TouchableOpacity key={i} style={s.configItem}>
            <Ionicons name={config.icone as any} size={18} color="#ff3366" />
            <Text style={s.configText}>{config.texto}</Text>
            <Ionicons name="chevron-forward" size={16} color="#ff3366" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.logout} onPress={() => Alert.alert("Sair", "Você realmente deseja sair?", [{text: "Cancelar", style: "cancel"}, {text: "Sair", style: "destructive", onPress: fazerLogout}])}>
        <Text style={s.logoutText}>Sair 🚪</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: { alignItems: "center", paddingVertical: 40, backgroundColor: "#fff", marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#e3f2fd", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  name: { fontSize: 20, fontWeight: "bold", color: "#333" },
  section: { backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 12, padding: 16, marginBottom: 20 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#333", marginLeft: 8 },
  item: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fce4ec", alignItems: "center", justifyContent: "center", marginRight: 12 },
  info: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "500", color: "#333" },
  points: { fontSize: 14, color: "#ff3366", marginTop: 2 },
  menu: { marginHorizontal: 16, marginBottom: 20 },
  menuItem: { backgroundColor: "#fff", flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 12, marginBottom: 8 },
  menuText: { fontSize: 16, color: "#333", flex: 1, marginLeft: 12 },
  configTitle: { fontSize: 16, fontWeight: "600", color: "#666", marginHorizontal: 16, marginBottom: 12 },
  configItem: { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#f5f5f5" },
  configText: { fontSize: 16, color: "#333", flex: 1, marginLeft: 12 },
  logout: { alignSelf: "center", marginBottom: 40, paddingVertical: 12, paddingHorizontal: 24 },
  logoutText: { color: "#ff3366", fontSize: 16, fontWeight: "600" },
});