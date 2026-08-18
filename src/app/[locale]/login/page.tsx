'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Box, Button, Input, VStack, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { loginRequest } from '../../../store/slices/authSlice';
import { RootState } from '../../../store/store';

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, loading, error } = useSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const t = useTranslations('Login');
  const tCommon = useTranslations('Common');

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
    <Box maxW="400px" mx="auto" mt={20} p={8} borderWidth={1} borderRadius="xl" boxShadow="xl" bg="bg.panel">
      <Heading mb={6} textAlign="center" size="2xl">{t('title')}</Heading>
      <VStack gap={5} align="stretch">
        <Field label={tCommon('email')}>
          <Input 
            placeholder={t('emailPlaceholder')}
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </Field>
        
        <Field label={tCommon('password')}>
          <Input 
            placeholder={t('passwordPlaceholder')} 
            type="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </Field>
        
        <Button colorPalette="blue" w="full" onClick={handleLogin} loading={loading} mt={2}>
          {t('title')}
        </Button>
        {error && <Text color="red.500" fontSize="sm" textAlign="center">{error}</Text>}
        
        <Text fontSize="sm" mt={4} textAlign="center" color="fg.muted">
          {t('noAccount')} {' '}
          <ChakraLink asChild color="blue.500" fontWeight="bold">
            <Link href="/register">{t('registerLink')}</Link>
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
}
