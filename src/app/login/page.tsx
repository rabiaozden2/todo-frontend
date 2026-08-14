'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Box, Button, Input, VStack, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';
import { loginRequest } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, loading, error } = useSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (token) {
      router.push('/');
    }
  }, [token, router]);

  const handleLogin = () => {
    if (email && password) {
      dispatch(loginRequest({ email, password }));
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={20} p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
      <Heading mb={6} textAlign="center" size="lg">Giriş Yap</Heading>
      <VStack gap={4}>
        <Input 
          placeholder="Email" 
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <Input 
          placeholder="Şifre" 
          type="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        <Button colorScheme="blue" width="full" onClick={handleLogin} loading={loading}>
          Giriş
        </Button>
        {error && <Text color="red.500" fontSize="sm">{error}</Text>}
        
        <Text fontSize="sm" mt={4}>
          Hesabın yok mu?{' '}
          <ChakraLink as={Link} href="/register" color="blue.500">
            Kayıt Ol
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
}
