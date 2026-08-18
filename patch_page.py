with open('src/app/[locale]/page.tsx', 'r') as f:
    content = f.read()

import_statement = "import { LanguageSwitcher } from '@/components/LanguageSwitcher';\n"
if "LanguageSwitcher" not in content:
    content = content.replace("import { useTranslations, useLocale } from 'next-intl';", import_statement + "import { useTranslations, useLocale } from 'next-intl';")

old_button = """<Button variant="outline" size="sm" onClick={changeLocale}>
            {locale === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
          </Button>"""
new_component = "<LanguageSwitcher />"

content = content.replace(old_button, new_component)

with open('src/app/[locale]/page.tsx', 'w') as f:
    f.write(content)
