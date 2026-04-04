import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { login, signup } from '../lib/firebaseAuth';

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
        await login(email, password); // Auto-login after signup
      }

      router.replace('/'); // Redirect to Home
    } catch (err: any) {
      const message = err?.message || 'Something went wrong';

      if (message.includes('A user with the same userId or email already exists')) {
        Alert.alert('Account Exists', 'This email is already registered. Please log in instead.');
        setIsLogin(true);
      } else if (message.includes('Invalid credentials')) {
        Alert.alert('Login Failed', 'Incorrect email or password.');
      } else if (message.includes('Invalid email')) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
      } else {
        Alert.alert('Error', message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.form}>
        <Image
          source={require('../assets/images/10X_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

        {!isLogin && (
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />
        )}

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />
        <Button mode="contained" onPress={handleAuth} style={styles.button}>
          {isLogin ? 'Login' : 'Register'}
        </Button>

        <Button
          mode="text"
          onPress={() => setIsLogin(!isLogin)}
          labelStyle={styles.buttonText}
        >
          {isLogin ? 'No account? Sign Up' : 'Already have an account? Sign In'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  form: {
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#ff4800ff',
  },
  buttonText: {
    color: '#ff4800ff',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
