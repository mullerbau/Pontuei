import { View, Text, StyleSheet, StatusBar, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export default function TelaBoasVindas() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Redirecionar após 2.5 segundos
    const timer = setTimeout(() => {
      router.replace("/auth/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={estilos.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <Animated.View 
        style={[
          estilos.conteudo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Logo */}
        <View style={estilos.logo}>
          <Text style={estilos.logoText}>P</Text>
        </View>
        
        <Text style={estilos.pontueiText}>Pontuei.</Text>
        
        {/* Mensagem de boas-vindas */}
        <Text style={estilos.boasVindas}>Seja bem-vindo!</Text>
        <Text style={estilos.subtitulo}>
          Sua jornada de pontuação começa aqui
        </Text>
        
        {/* Indicador de carregamento */}
        <View style={estilos.indicadorContainer}>
          <View style={estilos.indicador} />
        </View>
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  conteudo: {
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: "#ff4757",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#ff4757",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  pontueiText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333",
    marginBottom: 40,
  },
  boasVindas: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 60,
  },
  indicadorContainer: {
    width: 40,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
  },
  indicador: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ff4757",
    borderRadius: 2,
  },
});
