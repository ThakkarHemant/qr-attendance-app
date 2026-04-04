'use client';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAttendeeStore } from '../store/attendeeStore';
import WebQRScanner from './webQRScanner';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [statusMessage, setStatusMessage] = useState('');

  const { attendees, fetchAttendees, markAttended } = useAttendeeStore();
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== 'web' && !permission?.granted) requestPermission();
    fetchAttendees();
  }, []);

  const handleScannedData = async (data: string) => {
    if (scanned) return;
    setScanned(true);

    try {
      let event_id = "";
      let name = "";

      // ✅ Handle JSON QR OR plain text QR
      try {
        const parsed = JSON.parse(data);
        event_id = parsed.event_id;
        name = parsed.name;
      } catch {
        event_id = data;
      }

      if (!event_id) throw new Error("Invalid QR");

      const matched = attendees.find(
        (a) => a.event_id.toLowerCase() === event_id.toLowerCase()
      );

      if (!matched) {
        setStatusType('error');
        setStatusMessage('❌ Invalid QR');
      } else if (matched.isPresent) {
        setStatusType('error');
        setStatusMessage(`⚠️ ${matched.name} already marked`);
      } else {
        await markAttended(event_id);
        setStatusType('success');
        setStatusMessage(`✅ ${matched.name} marked`);
      }
    } catch {
      setStatusType('error');
      setStatusMessage('❌ Invalid QR');
    }

    setTimeout(() => {
      setScanned(false);
      setStatusType('');
      setStatusMessage('');
    }, 1200);
  };

  const getBorderColor = () => {
    if (statusType === 'success') return '#28a745'; // green
    if (statusType === 'error') return '#dc3545';   // red
    return '#007AFF'; // blue
  };

  if (Platform.OS !== 'web' && !permission?.granted) {
    return <Text>No camera permission</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/10X_logo.png')}
        style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 20 }}
        resizeMode="contain"
      />

      <View style={[styles.cameraBox, { borderColor: getBorderColor() }]}>
        {Platform.OS === 'web' ? (
          <WebQRScanner onResult={handleScannedData} />
        ) : (
          <CameraView
            style={styles.camera}
            onBarcodeScanned={({ data }) => handleScannedData(data)}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />
        )}
      </View>

      {/* ✅ CLEAN TEXT FEEDBACK */}
      {statusMessage !== '' && (
        <Text
          style={{
            marginTop: 10,
            fontSize: 16,
            color: statusType === 'success' ? '#28a745' : '#dc3545',
            fontWeight: 'bold',
          }}
        >
          {statusMessage}
        </Text>
      )}

      <Text style={styles.instruction}>Align QR code within the box</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000ff',
  },
  cameraBox: {
    width: 200,
    height: 200,
    borderWidth: 4,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  camera: {
    flex: 1,
  },
  instruction: {
    marginTop: 10,
    fontSize: 16,
    color: '#eee',
  },
  button: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ff4800ff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});