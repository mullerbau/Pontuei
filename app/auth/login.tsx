import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert, ActivityIndicator, Animated, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useRef } from "react";
import { Ionicons } from '@expo/vector-icons';
import { ApiService } from '../../services/api';

export default function TelaLogin() {
  const navegacao = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const animacao = useRef(new Animated.Value(1)).current;

  const animar = () => Animated.sequence([Animated.timing(animacao, {toValue: 0.95, duration: 100, useNativeDriver: true}), Animated.timing(animacao, {toValue: 1, duration: 100, useNativeDriver: true})]).start();

  const fazerLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      return Alert.alert("Erro", "Preencha todos os campos");
    }
    
    animar();
    setCarregando(true);
    
    try {
      const response = await ApiService.login(email, senha);
      
      if (response.success) {
        // Salvar token JWT
        await AsyncStorage.setItem('auth_token', response.access_token);
        
        // Salvar dados do usuário
        await AsyncStorage.setItem('usuario', JSON.stringify({
          id: response.client.id,
          name: response.client.name,
          email: response.client.email,
          cpf: response.client.cpf,
          points_balance: response.client.points_balance
        }));
        
        setCarregando(false);
        navegacao.replace("/(tabs)");
        return;
      }
      
      Alert.alert("Erro", "Email ou senha inválidos");
      setCarregando(false);
      
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert("Erro", "Falha na conexão com o servidor. Verifique sua internet.");
      setCarregando(false);
    }
  };

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.contentContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Logo */}
      <View style={estilos.logoContainer}>
        <Image 
          source={require('../../assets/images/pontuei logo.svg')} 
          style={{ width: 100, height: 100 }}
          resizeMode="contain"
        />
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
        <View style={estilos.containerSenha}>
          <TextInput
            placeholder="*********"
            secureTextEntry={!mostrarSenha}
            style={estilos.inputSenha}
            value={senha}
            onChangeText={setSenha}
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

        <Text style={estilos.esqueceuSenha}>Esqueceu minha senha</Text>
      </View>

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



      {/* Botão demo rápido */}
      <TouchableOpacity 
        style={estilos.botaoRapido}
        onPress={() => {
          setEmail("eric@pontuei.com");
          setSenha("1234Abcd!");
        }}
      >
        <Text style={estilos.textoRapido}>Demo</Text>
      </TouchableOpacity>

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
    paddingTop: 30,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
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
  botaoRapido: {
    backgroundColor: "#666",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    alignSelf: "center",
    marginBottom: 15,
  },
  textoRapido: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});