import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      showCustomAlert("Masukkan email dan password!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        navigation.replace('Home'); // Berhasil masuk
      } else {
        showCustomAlert(data.error || "Email/Password salah");
      }
    } catch (error) {
      setLoading(false);
      showCustomAlert("Gagal terhubung ke server!");
    }
  };

  const showCustomAlert = (msg) => {
    setAlertMsg(msg);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Go-Ride</Text>
      <Text style={styles.subTitle}>Selamat datang kembali!</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        placeholderTextColor="#999"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        placeholderTextColor="#999"
        secureTextEntry 
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Masuk</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Belum punya akun? <Text style={{fontWeight: 'bold'}}>Daftar</Text></Text>
      </TouchableOpacity>

      {/* CUSTOM ALERT MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>{alertMsg}</Text>
            <TouchableOpacity style={styles.alertButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 30, justifyContent: 'center' },
  logo: { fontSize: 35, fontWeight: 'bold', color: '#ff5900ff', marginBottom: 10 },
  subTitle: { fontSize: 16, color: '#666', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#eee', padding: 15, borderRadius: 10, marginBottom: 15, color: '#333', backgroundColor: '#fafafa' },
  button: { backgroundColor: '#ff5900ff', padding: 15, borderRadius: 30, marginTop: 10, height: 55, justifyContent: 'center' },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#333', textAlign: 'center', marginTop: 25 },
  
  // Styling Alert Custom
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  alertBox: { width: '80%', backgroundColor: 'white', padding: 25, borderRadius: 20, alignItems: 'center' },
  alertText: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#333' },
  alertButton: { backgroundColor: '#EE2737', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20 },
  alertButtonText: { color: 'white', fontWeight: 'bold' }
});