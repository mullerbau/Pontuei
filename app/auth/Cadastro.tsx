import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert, ActivityIndicator, Animated, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useRef } from "react";
import { Ionicons } from '@expo/vector-icons';
import { ApiService } from '../../services/api';

export default function TelaCadastro() {
  const navegacao = useRouter();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const animacaoBotao = useRef(new Animated.Value(1)).current;

  const animar = () => Animated.sequence([Animated.timing(animacaoBotao, {toValue: 0.95, duration: 100, useNativeDriver: true}), Animated.timing(animacaoBotao, {toValue: 1, duration: 100, useNativeDriver: true})]).start();



  const fazerCadastro = async () => {
    console.log('Iniciando cadastro...');
    
    if (!nome.trim() || !cpf.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      return Alert.alert("Erro", "Preencha todos os campos");
    }
    
    animar();
    setCarregando(true);
    
    try {
      console.log('Tentando cadastro na API...');
      
      const userData = {
        name: nome,
        email: email,
        cpf: cpf,
        password: senha,
        date_of_birth: '1990-01-01'
      };
      
      console.log('Dados do usuário:', userData);
      
      try {
        const response = await ApiService.register(userData);
        console.log('Resposta da API:', response);
        
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
          
          // Login automático após cadastro
          Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
            { text: "OK", onPress: () => navegacao.replace("/(tabs)") }
          ]);
          setCarregando(false);
          return;
        }
        
      } catch (apiError: any) {
        console.log('API cadastro falhou:', apiError);
        
        if (apiError.message?.includes('already exists')) {
          Alert.alert("Erro", "Email ou CPF já cadastrado");
          setCarregando(false);
          return;
        }
        
        // Se API falhou, redirecionar para login
        Alert.alert("Erro", "Falha no cadastro. Tente novamente.");
        setCarregando(false);
        return;
      }
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      Alert.alert("Erro", "Falha ao cadastrar. Tente novamente.");
      setCarregando(false);
    }
  };

  return (
    <ScrollView style={estilos.container} contentContainerStyle={estilos.contentContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Botão voltar */}
      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => navegacao.replace('/auth/login')}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      
      {/* Logo */}
      <View style={estilos.logoContainer}>
        <Image 
          source={require('../../assets/images/pontuei logo.svg')}
          style={{ width: 100, height: 100 }}
          resizeMode="contain"
        />
      </View>

      {/* Título */}
      <Text style={estilos.titulo}>Crie sua conta</Text>
      <Text style={estilos.titulo}>no Pontuei!</Text>
      <Text style={estilos.subtitulo}>
        Preencha os dados abaixo para começar sua jornada de pontuação
      </Text>

      {/* Campos */}
      <View style={estilos.formContainer}>
        <Text style={estilos.label}>Nome Completo *</Text>
        <TextInput
          placeholder="Digite seu nome completo"
          style={estilos.input}
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />

        
        <Text style={estilos.label}>CPF *</Text>
        <TextInput
          placeholder="000.000.000-00"
          style={estilos.input}
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          maxLength={14}
        />

        
        <Text style={estilos.label}>E-Mail *</Text>
        <TextInput
          placeholder="seuemail@gmail.com"
          style={estilos.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        
        <Text style={estilos.label}>Senha *</Text>
        <View style={estilos.containerSenha}>
          <TextInput
            placeholder="digite sua senha"
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

        
        <Text style={estilos.label}>Confirme sua senha *</Text>
        <View style={estilos.containerSenha}>
          <TextInput
            placeholder="confirme sua senha"
            secureTextEntry={!mostrarConfirmarSenha}
            style={estilos.inputSenha}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
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

      {/* Botão demo rápido */}
      <TouchableOpacity 
        style={estilos.botaoRapido}
        onPress={() => {
          setNome("Eric Bauer");
          setCpf("12345678909");
          setEmail("eric@pontuei.com");
          setSenha("1234Abcd!");
          setConfirmarSenha("1234Abcd!");
        }}
      >
        <Text style={estilos.textoRapido}> Demo</Text>
      </TouchableOpacity>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
    marginTop: 20,
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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  botaoCta: {
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#ff4757",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },


  containerSenha: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputSenha: {
    flex: 1,
    padding: 16,
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