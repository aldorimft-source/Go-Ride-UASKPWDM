import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // PINDAHKAN FUNGSI KE DALAM SINI
  const handleRegister = async () => {
    if (!nama || !email || !password) {
      Alert.alert("Error", "Semua kolom harus diisi!");
      return;
    }

    try {
      // Gunakan localhost jika sudah melakukan adb reverse tcp:3000 tcp:3000
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sukses", "Akun berhasil dibuat! Silakan login.");
        navigation.navigate('Login');
      } else {
        Alert.alert("Gagal", data.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Gagal terhubung ke server. Pastikan 'node server.js' sudah jalan.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Daftar Akun Go-Ride</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Contoh: Budi Santoso" 
          placeholderTextColor="#999"
          value={nama}
          onChangeText={(txt) => setNama(txt)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="budi@email.com" 
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={(txt) => setEmail(txt)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Minimal 6 Karakter" 
          placeholderTextColor="#999"
          secureTextEntry={true}
          value={password}
          onChangeText={(txt) => setPassword(txt)}
        />
      </View>

      {/* GANTI ONPRESS MENJADI handleRegister */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Daftar Sekarang</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Kembali ke Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 25, backgroundColor: 'white', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ff5900ff', marginBottom: 30, textAlign: 'left' },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: { 
    borderWidth: 1, 
    borderColor: '#E8E8E8', 
    padding: 15, 
    borderRadius: 10, 
    fontSize: 16, 
    color: '#000',
    backgroundColor: '#FAFAFA' 
  },
  button: { backgroundColor: '#ff5900ff', padding: 18, borderRadius: 30, marginTop: 10 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#666', textAlign: 'center', marginTop: 20 }
});