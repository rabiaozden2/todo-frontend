import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const locales = ['tr', 'en', 'de', 'es', 'fr', 'it', 'ru', 'ar', 'zh', 'ja', 'ko'] as const;

export const routing = defineRouting({
  locales: locales,
  defaultLocale: 'tr'
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
