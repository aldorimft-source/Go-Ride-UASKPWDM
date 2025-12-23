import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert, Modal } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const THEME_COLOR = '#ff5900';

const HomeScreen = ({ navigation }) => {
  const [alamatList, setAlamatList] = useState([]);
  const [label, setLabel] = useState('');
  const [detail, setDetail] = useState('');
  
  // State Edit
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editDetail, setEditDetail] = useState('');

  const fetchAlamat = async () => {
    try {
      const res = await fetch('http://localhost:3000/alamat');
      const data = await res.json();
      setAlamatList(data);
    } catch (e) { console.log("Fetch Error:", e); }
  };

  useEffect(() => { fetchAlamat(); }, []);

  const handleAddAlamat = async () => {
    if (!label || !detail) return Alert.alert("Error", "Isi semua kolom!");
    await fetch('http://localhost:3000/alamat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, detail }),
    });
    setLabel(''); setDetail('');
    fetchAlamat();
  };

  const handleUpdate = async () => {
    await fetch(`http://localhost:3000/alamat/${selectedId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: editLabel, detail: editDetail }),
    });
    setIsEditModal(false);
    fetchAlamat();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/alamat/${id}`, { method: 'DELETE' });
    fetchAlamat();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: THEME_COLOR }]}>
        <Text style={styles.headerTitle}>Gojek Oranye</Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Menu dengan SVG */}
        <View style={styles.menuGrid}>
          <MenuItem name="GoRide" color={THEME_COLOR} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          <MenuItem name="GoCar" color={THEME_COLOR} d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z" />
          <MenuItem name="GoFood" color="#EE2737" d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7z" />
          <MenuItem name="Lainnya" color="#555" d="M4 12h16M4 6h16M4 18h16" />
        </View>

        {/* Form Tambah (CREATE) */}
        <View style={styles.crudBox}>
          <Text style={styles.sectionTitle}>Tambah Alamat Baru</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Label (ex: Rumah)" 
            placeholderTextColor="#999"
            value={label} 
            onChangeText={setLabel} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Detail Alamat" 
            placeholderTextColor="#999"
            value={detail} 
            onChangeText={setDetail} 
          />
          <TouchableOpacity style={[styles.btnAction, {backgroundColor: THEME_COLOR}]} onPress={handleAddAlamat}>
            <Text style={styles.btnText}>Simpan Alamat</Text>
          </TouchableOpacity>

          {/* List Data (READ & DELETE) */}
          <Text style={[styles.sectionTitle, {marginTop: 25}]}>Daftar Alamat Tersimpan:</Text>
          {alamatList.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={{flex: 1}}>
                <Text style={{fontWeight: 'bold', color: '#000'}}>{item.label}</Text>
                <Text style={{color: '#666', fontSize: 12}}>{item.detail}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => {
                  setSelectedId(item.id); setEditLabel(item.label); setEditDetail(item.detail); setIsEditModal(true);
                }}>
                  <Text style={{color: THEME_COLOR, fontWeight: 'bold', marginRight: 15}}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={{color: 'red', fontWeight: 'bold'}}>Hapus</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* MODAL EDIT (UPDATE) */}
      <Modal visible={isEditModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.sectionTitle}>Update Alamat</Text>
            <TextInput style={styles.input} value={editLabel} onChangeText={setEditLabel} placeholderTextColor="#999" />
            <TextInput style={styles.input} value={editDetail} onChangeText={setEditDetail} placeholderTextColor="#999" />
            <TouchableOpacity style={[styles.btnAction, {backgroundColor: THEME_COLOR}]} onPress={handleUpdate}>
              <Text style={styles.btnText}>Simpan Perubahan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditModal(false)} style={{marginTop: 15}}>
              <Text style={{textAlign: 'center', color: '#999'}}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const MenuItem = ({ name, color, d }) => (
  <View style={styles.menuItem}>
    <View style={[styles.iconBox, { borderColor: color }]}>
      <Svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <Path d={d} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
    <Text style={{fontSize: 11, marginTop: 5, color: '#333'}}>{name}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  menuGrid: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  menuItem: { width: '25%', alignItems: 'center' },
  iconBox: { width: 50, height: 50, borderRadius: 15, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  crudBox: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#000' },
  input: { 
    backgroundColor: '#FAFAFA', 
    borderWidth: 1, 
    borderColor: '#DDD', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 10, 
    color: '#000' // Pastikan teks hitam
  },
  btnAction: { padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' },
  card: { flexDirection: 'row', padding: 15, backgroundColor: '#FFF', borderRadius: 10, marginBottom: 10, elevation: 2, alignItems: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: 'white', borderRadius: 20, padding: 25 }
});

export default HomeScreen;