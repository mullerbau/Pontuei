import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function TelaInicial() {
  const navegacao = useRouter();

  const sair = async () => {
    await AsyncStorage.removeItem("usuario");
    navegacao.replace("/");
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Você está logado no PONTUEI!</Text>

      <TouchableOpacity style={estilos.botao} onPress={sair}>
        <Text style={estilos.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  botao: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 10,
  },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});