import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const navegacao = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState('');

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    try {
      const usuario = await AsyncStorage.getItem('usuario');
      if (usuario) {
        const dados = JSON.parse(usuario);
        const nome = dados.email.split('@')[0];
        setNomeUsuario(nome.charAt(0).toUpperCase() + nome.slice(1));
      }
    } catch {}
  };

  return (
    <View style={estilos.container}>
      {/* Header */}
      <View style={estilos.header}>
        <View style={estilos.logoContainer}>
          <View style={estilos.logo}>
            <Text style={estilos.logoText}></Text>
          </View>
          <Text style={estilos.pontueiText}></Text>
        </View>
        
        <TouchableOpacity 
          style={estilos.botaoPerfil}
          onPress={() => navegacao.push('/perfil')}
          accessibilityLabel="Botão de perfil"
        >
          <Ionicons name="person-outline" size={24} color="#ff3366" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo Principal */}
      <View style={estilos.conteudoPrincipal}>
        <Text style={estilos.boasVindas}>Olá, {nomeUsuario}! 👋</Text>
        <Text style={estilos.subtitulo}>Bem-vindo ao seu app de pontos</Text>
        
        <View style={estilos.cardPontos}>
          <Ionicons name="star" size={32} color="#ff3366" />
          <Text style={estilos.pontosTexto}>Seus Pontos</Text>
          <Text style={estilos.pontosNumero}>0</Text>
          <Text style={estilos.pontosDescricao}>Comece a pontuar fazendo suas compras!</Text>
        </View>

        <View style={estilos.acoes}>
          <TouchableOpacity style={estilos.botaoAcao}>
            <LinearGradient
              colors={['#ff3366', '#ff5e5e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={estilos.gradienteBotao}
            >
              <Ionicons name="storefront" size={20} color="#fff" />
              <Text style={estilos.textoBotaoAcao}>Explorar Lojas</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={estilos.botaoAcao}>
            <LinearGradient
              colors={['#ff3366', '#ff5e5e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={estilos.gradienteBotao}
            >
              <Ionicons name="gift" size={20} color="#fff" />
              <Text style={estilos.textoBotaoAcao}>Resgatar Pontos</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: '#ff3366',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  pontueiText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  botaoPerfil: {
    padding: 8,
  },
  conteudoPrincipal: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  boasVindas: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  cardPontos: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pontosTexto: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  pontosNumero: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ff3366',
    marginVertical: 10,
  },
  pontosDescricao: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  acoes: {
    gap: 15,
  },
  botaoAcao: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  gradienteBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 10,
  },
  textoBotaoAcao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});