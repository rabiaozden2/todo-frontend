import re

with open('src/app/[locale]/page.tsx', 'r') as f:
    content = f.read()

# Add imports
imports_to_add = """import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';"""

content = content.replace("import { useTheme } from 'next-themes';", "import { useTheme } from 'next-themes';\n" + imports_to_add)

# Add hooks to Home
hooks = """
  const t = useTranslations('Home');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const i18nRouter = useRouter();
  const pathname = usePathname();

  const changeLocale = () => {
    const nextLocale = locale === 'tr' ? 'en' : 'tr';
    i18nRouter.replace(pathname, { locale: nextLocale });
  };
"""

content = re.sub(r'(export default function Home\(\) \{\n.*?const \{ theme, setTheme \} = useTheme\(\);)', r'\1' + hooks, content, count=1, flags=re.DOTALL)

# Add LanguageSwitcher button next to Theme button
btn_code = """          <Button variant="outline" size="sm" onClick={changeLocale}>
            {locale === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
          </Button>"""
          
content = content.replace("<Button variant=\"outline\" size=\"sm\" onClick={() => setTheme(isDark ? 'light' : 'dark')}>", btn_code + "\n          <Button variant=\"outline\" size=\"sm\" onClick={() => setTheme(isDark ? 'light' : 'dark')}>")

# Replace header text
content = content.replace("PERSONAL PLANNER", "{t('title').split(' ')[0]}")
content = content.replace("DT-Günlüğüm 📒", "{t('title')}")
content = content.replace("{dayName}, {dateStr} · Hoşgeldin, <strong>{user?.full_name || 'Kullanıcı'}</strong>", "{t('welcome', { dayName, dateStr, name: user?.full_name || 'Kullanıcı' }).replace('<bold>', '').replace('</bold>', '')}")
content = content.replace("{isDark ? '☀️ Aydınlık' : '🌙 Karanlık'}", "{isDark ? t('themeLight') : t('themeDark')}")
content = content.replace("Çıkış Yap", "{tCommon('logout')}")

with open('src/app/[locale]/page.tsx', 'w') as f:
    f.write(content)
