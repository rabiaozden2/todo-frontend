import re
import json

# 1. Update JSON files with missing category keys (We will just add them to en and tr, others will fallback to en or tr if missing, or we can just add basic translations to all of them)
langs = ['tr', 'en', 'de', 'es', 'fr', 'it', 'ru', 'ar', 'zh', 'ja', 'ko']
cat_trans = {
    'tr': {'catEducation': 'Eğitim', 'catWork': 'İş', 'catPersonal': 'Kişisel', 'catSports': 'Spor'},
    'en': {'catEducation': 'Education', 'catWork': 'Work', 'catPersonal': 'Personal', 'catSports': 'Sports'},
    'de': {'catEducation': 'Bildung', 'catWork': 'Arbeit', 'catPersonal': 'Persönlich', 'catSports': 'Sport'},
    'es': {'catEducation': 'Educación', 'catWork': 'Trabajo', 'catPersonal': 'Personal', 'catSports': 'Deportes'},
    'fr': {'catEducation': 'Éducation', 'catWork': 'Travail', 'catPersonal': 'Personnel', 'catSports': 'Des sports'},
    'it': {'catEducation': 'Educazione', 'catWork': 'Lavoro', 'catPersonal': 'Personale', 'catSports': 'Sport'},
    'ru': {'catEducation': 'Образование', 'catWork': 'Работа', 'catPersonal': 'Личное', 'catSports': 'Спорт'},
    'ar': {'catEducation': 'تعليم', 'catWork': 'عمل', 'catPersonal': 'شخصي', 'catSports': 'رياضة'},
    'zh': {'catEducation': '教育', 'catWork': '工作', 'catPersonal': '个人', 'catSports': '体育'},
    'ja': {'catEducation': '教育', 'catWork': '仕事', 'catPersonal': '個人', 'catSports': 'スポーツ'},
    'ko': {'catEducation': '교육', 'catWork': '일', 'catPersonal': '개인의', 'catSports': '스포츠'}
}

for lang in langs:
    try:
        with open(f'messages/{lang}.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        if 'Home' not in data: data['Home'] = {}
        data['Home'].update(cat_trans[lang])
        with open(f'messages/{lang}.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Failed to update {lang}.json: {e}")

# 2. Patch page.tsx
with open('src/app/[locale]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Welcome String (Rich text rendering)
content = content.replace(
    "{t('welcome', { dayName, dateStr, name: user?.full_name || 'Kullanıcı' }).replace('<bold>', '').replace('</bold>', '')}",
    "{t.rich('welcome', { dayName, dateStr, name: user?.full_name || 'Kullanıcı', bold: (chunks) => <strong>{chunks}</strong> })}"
)

# Fix Takvim
content = content.replace(">📅 Takvim<", ">{t('calendar')}<")

# Fix MiniCalendar days
content = re.sub(
    r"const dayLabels = \['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'\];",
    r"const dayLabels = Array.from({ length: 7 }, (_, i) => new Date(2021, 0, 4 + i).toLocaleDateString(locale === 'en' ? 'en-US' : locale, { weekday: 'short' }));",
    content
)

# Fix WeeklyPlanner days
content = re.sub(
    r"const dayNames = \['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'\];",
    r"const dayNames = Array.from({ length: 7 }, (_, i) => new Date(2021, 0, 4 + i).toLocaleDateString(locale === 'en' ? 'en-US' : locale, { weekday: 'short' }));",
    content
)

# Fix Categories Rendering
# 1. New Task Form category select options:
content = re.sub(
    r"<option key=\{cat\} value=\{cat\}>\{cat\}</option>",
    r"<option key={cat} value={cat}>{t(cat === 'Eğitim' ? 'catEducation' : cat === 'İş' ? 'catWork' : cat === 'Kişisel' ? 'catPersonal' : 'catSports') || cat}</option>",
    content
)

# 2. Category list in sidebar
content = re.sub(
    r"<div style={{ flex: 1, fontWeight: 500 }}>\{cat\}</div>",
    r"<div style={{ flex: 1, fontWeight: 500 }}>{t(cat === 'Eğitim' ? 'catEducation' : cat === 'İş' ? 'catWork' : cat === 'Kişisel' ? 'catPersonal' : 'catSports') || cat}</div>",
    content
)

with open('src/app/[locale]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch successful!")
