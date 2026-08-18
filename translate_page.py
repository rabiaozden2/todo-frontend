with open('src/app/[locale]/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    # Top level component helpers
    ("'tr-TR'", "locale === 'en' ? 'en-US' : 'tr-TR'"),
    
    # Text replacements in JSX (outside of curly braces)
    (">Etkinlik Hatırlatması<", ">{t('upcoming')}<"),
    (">Süre yaklaşıyor!<", ">Süre yaklaşıyor!<"), # Leave alone or hardcode
    (">✅ Yapıldı<", ">✅ {tCommon('done') || 'Done'}<"),
    (">⏰ 1 dk Hatırlat<", ">⏰ 1 min Remind<"),
    (">Bu gün için etkinlik yok.<", ">{t('noUpcoming')}<"),
    (">Tüm Günleri Göster<", ">{t('showAllDays')}<"),
    (">İlerleme<", ">{t('progress')}<"),
    (">Tüm görevleri tamam!<", ">{t('allTasksDone')}<"),
    (">Aktif<", ">{t('active')}<"),
    (">Bitti<", ">{t('done')}<"),
    (">⏰ Yaklaşan Etkinlikler<", ">{t('upcoming')}<"),
    (">Yaklaşan etkinlik yok.<", ">{t('noUpcoming')}<"),
    (">📋 Haftalık Görünüm<", ">{t('weeklyView')}<"),
    (">✏️ Yeni Görev Ekle<", ">{t('newTask')}<"),
    (">Tüm Yapılacaklar<", ">{t('allTodos')}<"),
    (">🎯 Şu an yapılacak bir görevin yok.<", ">{t('noTodos')}<"),
    (">Tüm Tamamlananlar<", ">{t('allCompleted')}<"),
    (">🗑️ Çöp Kutusu<", ">{t('trash')}<"),
    (">Çöp kutusu boş.<", ">{t('trashEmpty')}<"),
    (">🏷️ KATEGORİLER<", ">{t('categories')}<"),
    (">Ana Sayfaya Dön<", ">{t('backToHome')}<"),
    (">🗑️ Çöp Kutusunu Aç<", ">{t('openTrash')}<"),

    # Props and ternary operators
    ("placeholder=\"Görev başlığı...\"", "placeholder={t('taskTitle')}"),
    (">📌 Kategori<", ">{t('category')}<"),
    (">📅 Tarih ve Saat (opsiyonel)<", ">{t('dateOptional')}<"),
    
    # Fix the ternary operators that failed previously
    ("{loading ? '...' : '+ Ekle'}", "{loading ? '...' : tCommon('add')}"),
    ("{loading ? '...' : 'Kaydet'}", "{loading ? '...' : tCommon('save')}"),
    ("{loading ? '...' : 'Sil'}", "{loading ? '...' : tCommon('delete')}"),
]

for old, new in replacements:
    content = content.replace(old, new)

with open('src/app/[locale]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete.")
