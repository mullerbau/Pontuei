import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert, ActivityIndicator, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useRef } from "react";
import { Ionicons } from '@expo/vector-icons';
import CryptoJS from 'crypto-js';

export default function TelaCadastro() {
  const navegacao = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroConfirmarSenha, setErroConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const animacaoBotao = useRef(new Animated.Value(1)).current;

  const animar = () => Animated.sequence([Animated.timing(animacaoBotao, {toValue: 0.95, duration: 100, useNativeDriver: true}), Animated.timing(animacaoBotao, {toValue: 1, duration: 100, useNativeDriver: true})]).start();

  const fazerCadastro = async () => {
    if (erroEmail || erroSenha || erroConfirmarSenha || !email.trim() || !senha.trim() || !confirmarSenha.trim()) return Alert.alert("Erro", "Corrija os erros");
    animar(); setCarregando(true);
    try {
      await AsyncStorage.setItem("usuario", JSON.stringify({email, senha: CryptoJS.SHA256(senha).toString(), dataCadastro: new Date().toISOString()}));
      setCarregando(false); navegacao.replace("/auth/login");
    } catch { Alert.alert("Erro", "Tente novamente"); setCarregando(false); }
  };

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.contentContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Botão voltar */}
      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => navegacao.back()}>
        <Text style={estilos.setaVoltar}>←</Text>
      </TouchableOpacity>
      
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
        <Text style={estilos.label}>E-Mail *</Text>
        <TextInput
          placeholder="seuemail@gmail.com"
          style={[estilos.input, erroEmail ? estilos.inputErro : null]}
          value={email}
          onChangeText={(texto) => {
            setEmail(texto);
            if (texto.trim() === "") {
              setErroEmail("E-mail é obrigatório");
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto)) {
              setErroEmail("Digite um e-mail válido");
            } else {
              setErroEmail("");
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {erroEmail ? <Text style={estilos.textoErro}>{erroEmail}</Text> : null}
        
        <Text style={estilos.label}>Senha *</Text>
        <View style={estilos.containerSenha}>
          <TextInput
            placeholder="digite sua senha"
            secureTextEntry={!mostrarSenha}
            style={[estilos.inputSenha, erroSenha ? estilos.inputErro : null]}
            value={senha}
            onChangeText={(texto) => {
              setSenha(texto);
              if (texto.trim() === "") {
                setErroSenha("Senha é obrigatória");
              } else if (texto.length < 6) {
                setErroSenha("Senha deve ter pelo menos 6 caracteres");
              } else {
                setErroSenha("");
              }
              if (confirmarSenha && texto !== confirmarSenha) {
                setErroConfirmarSenha("As senhas não coincidem");
              } else if (confirmarSenha && texto === confirmarSenha) {
                setErroConfirmarSenha("");
              }
            }}
            accessibilityLabel="Campo de senha"
          />
          <TouchableOpacity 
            style={estilos.botaoMostrarSenha}
            onPress={() => setMostrarSenha(!mostrarSenha)}
            accessibilityLabel={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
          >
            <Ionicons 
              name={mostrarSenha ? "eye-off" : "eye"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
        {erroSenha ? <Text style={estilos.textoErro}>{erroSenha}</Text> : null}
        
        <Text style={estilos.label}>Confirme sua senha *</Text>
        <View style={estilos.containerSenha}>
          <TextInput
            placeholder="confirme sua senha"
            secureTextEntry={!mostrarConfirmarSenha}
            style={[estilos.inputSenha, erroConfirmarSenha ? estilos.inputErro : null]}
            value={confirmarSenha}
            onChangeText={(texto) => {
              setConfirmarSenha(texto);
              if (texto.trim() === "") {
                setErroConfirmarSenha("Confirmação de senha é obrigatória");
              } else if (senha !== texto) {
                setErroConfirmarSenha("As senhas não coincidem");
              } else {
                setErroConfirmarSenha("");
              }
            }}
            accessibilityLabel="Campo de confirmação de senha"
          />
          <TouchableOpacity 
            style={estilos.botaoMostrarSenha}
            onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
            accessibilityLabel={mostrarConfirmarSenha ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
          >
            <Ionicons 
              name={mostrarConfirmarSenha ? "eye-off" : "eye"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
        {erroConfirmarSenha ? <Text style={estilos.textoErro}>{erroConfirmarSenha}</Text> : null}
      </View>

      {/* Botão Cadastrar */}
      <Animated.View style={{ transform: [{ scale: animacaoBotao }] }}>
        <TouchableOpacity 
          onPress={fazerCadastro}
          disabled={carregando}
          accessibilityLabel="Botão de cadastro"
          accessibilityHint="Toque para criar sua conta"
        >
          <LinearGradient
            colors={carregando ? ['#ccc', '#999'] : ['#ff3366', '#ff5e5e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={estilos.botaoCta}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={estilos.textoBotao}>Cadastre-se</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Realizar cadastro com */}
      <Text style={estilos.realizarCadastro}>Realizar cadastro com</Text>
      
      {/* Botões sociais */}
      <View style={estilos.botoesContainer}>
        <TouchableOpacity style={estilos.botaoSocial}>
          <Text style={estilos.textoSocial}>G</Text>
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botaoSocial}>
          <Text style={estilos.textoSocial}>f</Text>
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  botaoVoltar: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  setaVoltar: {
    fontSize: 20,
    color: "#333",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 80,
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
  realizarCadastro: {
    textAlign: "center",
    color: "#666",
    fontSize: 13,
    marginBottom: 15,
  },
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
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
  inputErro: {
    borderColor: "#ff4757",
    borderWidth: 2,
  },
  textoErro: {
    color: "#ff4757",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  containerSenha: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
  },
  inputSenha: {
    flex: 1,
    padding: 14,
    fontSize: 15,
  },
  botaoMostrarSenha: {
    padding: 14,
  },
});