import { Link } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { useAttendeeStore } from '../store/attendeeStore';

type Attendee = {
  name: string;
  event_id: string;
  isPresent: boolean;
};

export default function AttendeesScreen() {
  const attendees = useAttendeeStore((state) => state.attendees);
  const fetchAttendees = useAttendeeStore((state) => state.fetchAttendees);

  const loading = attendees.length === 0;

  // 🔥 FETCH FROM STORE
  useEffect(() => {
    fetchAttendees();
  }, []);

  const renderItem = ({ item }: { item: Attendee }) => (
    <View style={[styles.card, item.isPresent && styles.markedCard]}>
      <Text style={styles.details}>{item.name}</Text>
      <Text style={styles.details}>Event ID: {item.event_id}</Text>
    </View>
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#007AFF"
        style={{ marginTop: 100 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/10X_logo.png')}
        style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 20 }}
      />

      <Text style={styles.title}>Attendees List</Text>

      <FlatList
        data={attendees}
        keyExtractor={(item) => item.event_id}
        renderItem={renderItem}
      />

      <Link href="/" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  title: { fontSize: 24, color: '#fff', marginBottom: 20, textAlign: 'center' },
  card: {
    backgroundColor: '#2C2F38',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  markedCard: {
    backgroundColor: '#28a745',
  },
  details: { color: '#ccc', fontSize: 16 },
  button: {
    backgroundColor: '#ff4800',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});