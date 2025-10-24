import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert, ActivityIndicator, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useRef } from "react";
import { Ionicons } from '@expo/vector-icons';
import CryptoJS from 'crypto-js';

export default function TelaLogin() {
  const navegacao = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const animacao = useRef(new Animated.Value(1)).current;

  const animar = () => Animated.sequence([Animated.timing(animacao, {toValue: 0.95, duration: 100, useNativeDriver: true}), Animated.timing(animacao, {toValue: 1, duration: 100, useNativeDriver: true})]).start();

  const fazerLogin = async () => {
    if (erroEmail || erroSenha || !email.trim() || !senha.trim()) {
      return Alert.alert("Erro", "Preencha todos os campos corretamente");
    }
    
    animar();
    setCarregando(true);
    
    try {
      // TODO: Substituir por chamada da API
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, senha })
      // });
      
      // Simulação temporária com AsyncStorage
      const usuario = await AsyncStorage.getItem("usuario");
      if (usuario) {
        const dados = JSON.parse(usuario);
        if (dados.email === email && dados.senha === CryptoJS.SHA256(senha).toString()) {
          // TODO: Salvar token de autenticação
          // await AsyncStorage.setItem('authToken', response.token);
          setCarregando(false);
          navegacao.replace("/(tabs)");
        } else {
          Alert.alert("Erro", "E-mail ou senha incorretos");
          setCarregando(false);
        }
      } else {
        Alert.alert("Erro", "Usuário não encontrado. Cadastre-se primeiro.");
        setCarregando(false);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert("Erro", "Falha na conexão. Tente novamente.");
      setCarregando(false);
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
        
        <Text style={estilos.label}>Senha</Text>
        <View style={estilos.containerSenha}>
          <TextInput
            placeholder="*********"
            secureTextEntry={!mostrarSenha}
            style={[estilos.inputSenha, erroSenha ? estilos.inputErro : null]}
            value={senha}
            onChangeText={(texto) => {
              setSenha(texto);
              if (texto.trim() === "") {
                setErroSenha("Senha é obrigatória");
              } else {
                setErroSenha("");
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
        <Text style={estilos.esqueceuSenha}>Esqueceu minha senha</Text>
      </View>

      {/* Botão Demo */}
      <TouchableOpacity 
        style={estilos.botaoDemo}
        onPress={() => {
          setEmail("demo@pontuei.com");
          setSenha("123456");
          setErroEmail("");
          setErroSenha("");
        }}
      >
        <Ionicons name="flash" size={16} color="#ff4757" />
        <Text style={estilos.textoBotaoDemo}>Preencher para Demo</Text>
      </TouchableOpacity>

      {/* Botão Login */}
      <Animated.View style={{ transform: [{ scale: animacao }] }}>
        <TouchableOpacity 
          onPress={fazerLogin}
          disabled={carregando}
          accessibilityLabel="Botão de login"
          accessibilityHint="Toque para fazer login com suas credenciais"
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
              <Text style={estilos.textoBotao}>Login</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

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
  botaoDemo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ff4757",
    gap: 6,
  },
  textoBotaoDemo: {
    color: "#ff4757",
    fontSize: 14,
    fontWeight: "500",
  },
});
