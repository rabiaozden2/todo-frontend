'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Box, Button, Input, VStack, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';
import { registerRequest } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';

export default function Register() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (fullName && email && password) {
      dispatch(registerRequest({ full_name: fullName, email, password }));
      // In a real app, you would wait for registerSuccess action to push.
      // We will assume it redirects on success via saga or just show success toast.
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt={20} p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
      <Heading mb={6} textAlign="center" size="lg">Kayıt Ol</Heading>
      <VStack gap={4}>
        <Input 
          placeholder="Ad Soyad" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
        />
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
          onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
        />
        <Button colorScheme="green" width="full" onClick={handleRegister} loading={loading}>
          Kayıt Ol
        </Button>
        {error && <Text color="red.500" fontSize="sm">{error}</Text>}
        
        <Text fontSize="sm" mt={4}>
          Zaten hesabın var mı?{' '}
          <ChakraLink as={Link} href="/login" color="blue.500">
            Giriş Yap
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
}
