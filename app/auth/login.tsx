import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

export default function TelaLogin() {
  const navegacao = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const fazerLogin = async () => {
    if (email && senha) {
      await AsyncStorage.setItem("usuario", JSON.stringify({ email }));
      navegacao.replace("/(tabs)");
    } else {
      alert("Preencha todos os campos!");
    }
  };

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.contentContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Logo */}
      <View style={estilos.logoContainer}>
        <View style={estilos.logo}>
          <Text style={estilos.logoText}>P</Text>
        </View>
        <Text style={estilos.pontueiText}>Pontuei.</Text>
      </View>

      {/* Título */}
      <Text style={estilos.titulo}>Estamos felizes de ter</Text>
      <Text style={estilos.titulo}>você por aqui!</Text>
      <Text style={estilos.subtitulo}>
        Realize login e desfrute de todas as vantagens que o Pontuei oferece!
      </Text>

      {/* Campos */}
      <View style={estilos.formContainer}>
        <Text style={estilos.label}>E-Mail</Text>
        <TextInput
          placeholder="seuemail@gmail.com"
          style={estilos.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Text style={estilos.label}>Senha</Text>
        <TextInput
          placeholder="*********"
          secureTextEntry
          style={estilos.input}
          value={senha}
          onChangeText={setSenha}
        />
        <Text style={estilos.esqueceuSenha}>Esqueceu minha senha</Text>
      </View>

      {/* Botão Login */}
      <TouchableOpacity onPress={fazerLogin}>
        <LinearGradient
          colors={['#ff3366', '#ff5e5e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={estilos.botaoCta}
        >
          <Text style={estilos.textoBotao}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Entrar com */}
      <Text style={estilos.entrarCom}>Entrar com</Text>
      
      {/* Botões sociais */}
      <View style={estilos.botoesContainer}>
        <TouchableOpacity style={estilos.botaoSocial}>
          <Text style={estilos.textoSocial}>G</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botaoSocial}>
          <Text style={estilos.textoSocial}>f</Text>
        </TouchableOpacity>
      </View>

      {/* Link cadastro */}
      <View style={estilos.cadastroContainer}>
        <Text style={estilos.textoCadastro}>Ainda não tem conta? </Text>
        <TouchableOpacity onPress={() => navegacao.push("/auth/Cadastro")}>
          <Text style={estilos.linkCadastro}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 50,
    height: 50,
    backgroundColor: "#ff4757",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  logoText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  pontueiText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    lineHeight: 28,
  },
  subtitulo: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  formContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  esqueceuSenha: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
    marginTop: -8,
  },
  botaoCta: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  entrarCom: {
    textAlign: "center",
    color: "#666",
    fontSize: 13,
    marginBottom: 15,
  },
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 30,
  },
  botaoSocial: {
    width: 45,
    height: 45,
    backgroundColor: "white",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textoSocial: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cadastroContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textoCadastro: {
    fontSize: 14,
    color: "#666",
  },
  linkCadastro: {
    fontSize: 14,
    color: "#ff4757",
    fontWeight: "600",
  },
});
