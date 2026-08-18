import json

langs = ['tr', 'en', 'de', 'es', 'fr', 'it', 'ru', 'ar', 'zh', 'ja', 'ko']
translations = {
    'tr': {'restore': 'Geri Al', 'deleteForever': 'Kalıcı Sil', 'confirmDelete': 'Kalıcı olarak silmek istediğine emin misin?'},
    'en': {'restore': 'Restore', 'deleteForever': 'Delete Forever', 'confirmDelete': 'Are you sure you want to permanently delete this?'},
    'de': {'restore': 'Wiederherstellen', 'deleteForever': 'Endgültig löschen', 'confirmDelete': 'Sind Sie sicher, dass Sie dies endgültig löschen möchten?'},
    'es': {'restore': 'Restaurar', 'deleteForever': 'Eliminar permanentemente', 'confirmDelete': '¿Estás seguro de que deseas eliminar esto permanentemente?'},
    'fr': {'restore': 'Restaurer', 'deleteForever': 'Supprimer définitivement', 'confirmDelete': 'Êtes-vous sûr de vouloir supprimer définitivement ceci ?'},
    'it': {'restore': 'Ripristina', 'deleteForever': 'Elimina definitivamente', 'confirmDelete': 'Sei sicuro di voler eliminare definitivamente questo elemento?'},
    'ru': {'restore': 'Восстановить', 'deleteForever': 'Удалить навсегда', 'confirmDelete': 'Вы уверены, что хотите навсегда удалить это?'},
    'ar': {'restore': 'استعادة', 'deleteForever': 'حذف نهائي', 'confirmDelete': 'هل أنت متأكد أنك تريد حذف هذا نهائياً؟'},
    'zh': {'restore': '恢复', 'deleteForever': '永久删除', 'confirmDelete': '您确定要永久删除吗？'},
    'ja': {'restore': '元に戻す', 'deleteForever': '完全に削除', 'confirmDelete': 'これを完全に削除してもよろしいですか？'},
    'ko': {'restore': '복원', 'deleteForever': '영구 삭제', 'confirmDelete': '영구적으로 삭제하시겠습니까?'}
}

for lang in langs:
    try:
        with open(f'messages/{lang}.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        if 'Home' not in data: data['Home'] = {}
        data['Home'].update(translations[lang])
        with open(f'messages/{lang}.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error on {lang}: {e}")

with open('src/app/[locale]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace("Geri Al</button>", "{t('restore')}</button>")
content = content.replace(">Kalıcı Sil<", ">{t('deleteForever')}<")
content = content.replace("confirm('Kalıcı olarak silmek istediğine emin misin?')", "confirm(t('confirmDelete'))")
content = content.replace(">İptal<", ">{tCommon('cancel')}<")
content = content.replace(">Kaydet<", ">{tCommon('save')}<")
content = content.replace(">Sil<", ">{tCommon('delete')}<")

with open('src/app/[locale]/page.tsx', 'w') as f:
    f.write(content)

print("Final words fixed.")
