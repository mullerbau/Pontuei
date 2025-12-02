import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserHeaderProps {
  showWelcome?: boolean;
}

export default function UserHeader({ showWelcome = false }: UserHeaderProps) {
  const [userData, setUserData] = useState({ name: 'Carregando...', email: 'Carregando...' });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('usuario');
      if (userDataString) {
        const user = JSON.parse(userDataString);
        setUserData({
          name: user.name || 'Usuário',
          email: user.email || 'email@exemplo.com'
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  return (
    <View style={styles.headerContent}>
      <View style={styles.welcomeContainer}>
        <Image 
          source={require('@/assets/images/pontuei logo.svg')}
          style={styles.profileImage}
        />
        <View style={styles.welcomeTexts}>
          <Text style={styles.welcomeText}>{showWelcome ? 'Seja bem-vindo,' : userData.email}</Text>
          <Text style={styles.userName}>{userData.name}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '10vh',
    paddingTop: 20,
    marginTop: 10,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  welcomeTexts: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.9)',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 1,
  },
  userName: {
    fontSize: 24,
    color: '#E94057',
    fontFamily: 'Poppins_600SemiBold',
    fontWeight: 'bold',
  },
});