import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert, ActivityIndicator, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useRef } from "react";
import { Ionicons } from '@expo/vector-icons';
import CryptoJS from 'crypto-js';

export default function TelaCadastro() {
  const navegacao = useRouter();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [erroCpf, setErroCpf] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroConfirmarSenha, setErroConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const animacaoBotao = useRef(new Animated.Value(1)).current;

  const animar = () => Animated.sequence([Animated.timing(animacaoBotao, {toValue: 0.95, duration: 100, useNativeDriver: true}), Animated.timing(animacaoBotao, {toValue: 1, duration: 100, useNativeDriver: true})]).start();

  const validarCPF = (cpf: string) => {
    const nums = cpf.replace(/\D/g, '');
    if (nums.length !== 11 || /^(\d)\1{10}$/.test(nums)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(nums[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(nums[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(nums[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(nums[10]);
  };

  const formatarCPF = (valor: string) => {
    const nums = valor.replace(/\D/g, '').slice(0, 11);
    return nums.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const validarSenha = (senha: string) => {
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /\d/.test(senha);
    const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    return senha.length >= 8 && temMaiuscula && temMinuscula && temNumero && temEspecial;
  };

  const fazerCadastro = async () => {
    if (!nome.trim() || !cpf.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      return Alert.alert("Erro", "Preencha todos os campos");
    }
    animar();
    setCarregando(true);
    try {
      // TODO: INTEGRAÇÃO BACK-END
      // Substituir por: const response = await AuthService.register({ name: nome, cpf, email, password: senha });
      // Response esperado: { message, user: { id, name, email } }
      
      // Simulação temporária com AsyncStorage (REMOVER QUANDO INTEGRAR)
      await AsyncStorage.setItem("usuario", JSON.stringify({
        nome,
        cpf: cpf.replace(/\D/g, ''),
        email,
        senha: CryptoJS.SHA256(senha).toString(),
        dataCadastro: new Date().toISOString()
      }));
      
      setCarregando(false);
      // TODO: Mostrar mensagem de sucesso da API
      Alert.alert("Sucesso", "Conta criada com sucesso!", [
        { text: "OK", onPress: () => navegacao.replace("/auth/login") }
      ]);
    } catch (error) {
      // TODO: Tratar erros específicos da API (email já existe, CPF inválido, etc.)
      Alert.alert("Erro", "Falha ao cadastrar. Tente novamente.");
      setCarregando(false);
    }
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
          style={[estilos.input, erroNome ? estilos.inputErro : null]}
          value={nome}
          onChangeText={(texto) => {
            setNome(texto);
            if (texto.trim() === "") {
              setErroNome("Nome é obrigatório");
            } else if (texto.trim().length < 2) {
              setErroNome("Nome deve ter pelo menos 2 caracteres");
            } else {
              setErroNome("");
            }
          }}
          autoCapitalize="words"
        />
        {erroNome ? <Text style={estilos.textoErro}>{erroNome}</Text> : null}
        
        <Text style={estilos.label}>CPF *</Text>
        <TextInput
          placeholder="000.000.000-00"
          style={[estilos.input, erroCpf ? estilos.inputErro : null]}
          value={cpf}
          onChangeText={(texto) => {
            const cpfFormatado = formatarCPF(texto);
            setCpf(cpfFormatado);
            if (texto.trim() === "") {
              setErroCpf("CPF é obrigatório");
            } else if (!validarCPF(cpfFormatado)) {
              setErroCpf("CPF inválido");
            } else {
              setErroCpf("");
            }
          }}
          keyboardType="numeric"
          maxLength={14}
        />
        {erroCpf ? <Text style={estilos.textoErro}>{erroCpf}</Text> : null}
        
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
              } else if (!validarSenha(texto)) {
                setErroSenha("Senha deve ter 8+ caracteres, maiúscula, minúscula, número e símbolo");
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
      
      {/* Botão demo rápido */}
      <TouchableOpacity 
        style={estilos.botaoRapido}
        onPress={() => {
          setNome("João Silva");
          setCpf("12345678909");
          setEmail("joao@pontuei.com");
          setSenha("123456");
          setConfirmarSenha("123456");
          setErroNome("");
          setErroCpf("");
          setErroEmail("");
          setErroSenha("");
          setErroConfirmarSenha("");
        }}
      >
        <Text style={estilos.textoRapido}>⚡ Demo</Text>
      </TouchableOpacity>
      
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
    paddingHorizontal: 24,
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
    marginBottom: 25,
    marginTop: 70,
  },
  logo: {
    width: 55,
    height: 55,
    backgroundColor: "#ff4757",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#ff4757",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
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