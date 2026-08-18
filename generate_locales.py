import json
import os

langs = {
    'de': {
        "Common": {"login": "Anmelden", "register": "Registrieren", "logout": "Abmelden", "email": "E-Mail", "password": "Passwort", "fullName": "Vollständiger Name", "save": "Speichern", "cancel": "Abbrechen", "delete": "Löschen", "add": "+ Hinzufügen", "loading": "Wird geladen..."},
        "Login": {"title": "Anmelden", "emailPlaceholder": "beispiel@email.com", "passwordPlaceholder": "Dein Passwort", "noAccount": "Kein Konto?", "registerLink": "Registrieren"},
        "Register": {"title": "Registrieren", "fullNamePlaceholder": "Max Mustermann", "emailPlaceholder": "beispiel@email.com", "passwordPlaceholder": "Starkes Passwort", "hasAccount": "Hast du bereits ein Konto?", "loginLink": "Anmelden"},
        "Home": {"title": "DT-Tagebuch 📒", "welcome": "{dayName}, {dateStr} · Willkommen, <bold>{name}</bold>", "themeLight": "☀️ Hell", "themeDark": "🌙 Dunkel", "calendar": "📅 Kalender", "showAllDays": "Alle Tage anzeigen", "progress": "Fortschritt", "allTasksDone": "🎉 Alle Aufgaben erledigt!", "active": "Aktiv", "done": "Erledigt", "upcoming": "⏰ Anstehende Ereignisse", "noUpcoming": "Keine anstehenden Ereignisse.", "weeklyView": "📋 Wochenansicht", "newTask": "✏️ Neue Aufgabe hinzufügen", "taskTitle": "Aufgabentitel...", "category": "📌 Kategorie", "dateOptional": "📅 Datum und Uhrzeit (optional)", "allTodos": "Alle Aufgaben", "noTodos": "🎯 Du hast gerade keine Aufgaben.", "allCompleted": "Alle Abgeschlossenen", "trash": "🗑️ Papierkorb", "trashEmpty": "Papierkorb ist leer.", "categories": "🏷️ KATEGORIEN", "backToHome": "Zurück zur Startseite", "openTrash": "🗑️ Papierkorb öffnen"}
    },
    'es': {
        "Common": {"login": "Iniciar sesión", "register": "Registrarse", "logout": "Cerrar sesión", "email": "Correo", "password": "Contraseña", "fullName": "Nombre completo", "save": "Guardar", "cancel": "Cancelar", "delete": "Eliminar", "add": "+ Añadir", "loading": "Cargando..."},
        "Login": {"title": "Iniciar sesión", "emailPlaceholder": "ejemplo@correo.com", "passwordPlaceholder": "Tu Contraseña", "noAccount": "¿No tienes cuenta?", "registerLink": "Registrarse"},
        "Register": {"title": "Registrarse", "fullNamePlaceholder": "Juan Pérez", "emailPlaceholder": "ejemplo@correo.com", "passwordPlaceholder": "Contraseña Fuerte", "hasAccount": "¿Ya tienes una cuenta?", "loginLink": "Iniciar sesión"},
        "Home": {"title": "DT-Diario 📒", "welcome": "{dayName}, {dateStr} · Bienvenido, <bold>{name}</bold>", "themeLight": "☀️ Claro", "themeDark": "🌙 Oscuro", "calendar": "📅 Calendario", "showAllDays": "Mostrar todos", "progress": "Progreso", "allTasksDone": "🎉 ¡Todas las tareas listas!", "active": "Activo", "done": "Hecho", "upcoming": "⏰ Próximos eventos", "noUpcoming": "Sin eventos próximos.", "weeklyView": "📋 Vista Semanal", "newTask": "✏️ Nueva Tarea", "taskTitle": "Título de la tarea...", "category": "📌 Categoría", "dateOptional": "📅 Fecha y Hora (opcional)", "allTodos": "Todas las Tareas", "noTodos": "🎯 No tienes tareas ahora.", "allCompleted": "Todo Completado", "trash": "🗑️ Papelera", "trashEmpty": "La papelera está vacía.", "categories": "🏷️ CATEGORÍAS", "backToHome": "Volver al Inicio", "openTrash": "🗑️ Abrir Papelera"}
    },
    'fr': {
        "Common": {"login": "Connexion", "register": "S'inscrire", "logout": "Déconnexion", "email": "E-mail", "password": "Mot de passe", "fullName": "Nom complet", "save": "Enregistrer", "cancel": "Annuler", "delete": "Supprimer", "add": "+ Ajouter", "loading": "Chargement..."},
        "Login": {"title": "Connexion", "emailPlaceholder": "exemple@email.com", "passwordPlaceholder": "Votre mot de passe", "noAccount": "Pas de compte ?", "registerLink": "S'inscrire"},
        "Register": {"title": "S'inscrire", "fullNamePlaceholder": "Jean Dupont", "emailPlaceholder": "exemple@email.com", "passwordPlaceholder": "Mot de passe fort", "hasAccount": "Déjà un compte ?", "loginLink": "Connexion"},
        "Home": {"title": "DT-Journal 📒", "welcome": "{dayName}, {dateStr} · Bienvenue, <bold>{name}</bold>", "themeLight": "☀️ Clair", "themeDark": "🌙 Sombre", "calendar": "📅 Calendrier", "showAllDays": "Afficher tous", "progress": "Progrès", "allTasksDone": "🎉 Toutes les tâches terminées !", "active": "Actif", "done": "Terminé", "upcoming": "⏰ Événements à venir", "noUpcoming": "Aucun événement à venir.", "weeklyView": "📋 Vue Hebdomadaire", "newTask": "✏️ Nouvelle tâche", "taskTitle": "Titre de la tâche...", "category": "📌 Catégorie", "dateOptional": "📅 Date et heure (facultatif)", "allTodos": "Toutes les Tâches", "noTodos": "🎯 Vous n'avez pas de tâches.", "allCompleted": "Tout Terminé", "trash": "🗑️ Corbeille", "trashEmpty": "La corbeille est vide.", "categories": "🏷️ CATÉGORIES", "backToHome": "Retour à l'accueil", "openTrash": "🗑️ Ouvrir la corbeille"}
    },
    'it': {
        "Common": {"login": "Accedi", "register": "Registrati", "logout": "Esci", "email": "Email", "password": "Password", "fullName": "Nome completo", "save": "Salva", "cancel": "Annulla", "delete": "Elimina", "add": "+ Aggiungi", "loading": "Caricamento..."},
        "Login": {"title": "Accedi", "emailPlaceholder": "esempio@email.com", "passwordPlaceholder": "La tua password", "noAccount": "Non hai un account?", "registerLink": "Registrati"},
        "Register": {"title": "Registrati", "fullNamePlaceholder": "Mario Rossi", "emailPlaceholder": "esempio@email.com", "passwordPlaceholder": "Password forte", "hasAccount": "Hai già un account?", "loginLink": "Accedi"},
        "Home": {"title": "DT-Diario 📒", "welcome": "{dayName}, {dateStr} · Benvenuto, <bold>{name}</bold>", "themeLight": "☀️ Chiaro", "themeDark": "🌙 Scuro", "calendar": "📅 Calendario", "showAllDays": "Mostra tutti", "progress": "Progresso", "allTasksDone": "🎉 Tutte le attività completate!", "active": "Attivo", "done": "Fatto", "upcoming": "⏰ Prossimi eventi", "noUpcoming": "Nessun evento in arrivo.", "weeklyView": "📋 Vista Settimanale", "newTask": "✏️ Nuova attività", "taskTitle": "Titolo attività...", "category": "📌 Categoria", "dateOptional": "📅 Data e ora (opzionale)", "allTodos": "Tutte le Attività", "noTodos": "🎯 Non hai attività al momento.", "allCompleted": "Tutto Completato", "trash": "🗑️ Cestino", "trashEmpty": "Il cestino è vuoto.", "categories": "🏷️ CATEGORIE", "backToHome": "Torna alla Home", "openTrash": "🗑️ Apri Cestino"}
    },
    'ru': {
        "Common": {"login": "Войти", "register": "Регистрация", "logout": "Выйти", "email": "Эл. почта", "password": "Пароль", "fullName": "Полное имя", "save": "Сохранить", "cancel": "Отмена", "delete": "Удалить", "add": "+ Добавить", "loading": "Загрузка..."},
        "Login": {"title": "Войти", "emailPlaceholder": "пример@email.com", "passwordPlaceholder": "Ваш пароль", "noAccount": "Нет аккаунта?", "registerLink": "Регистрация"},
        "Register": {"title": "Регистрация", "fullNamePlaceholder": "Иван Иванов", "emailPlaceholder": "пример@email.com", "passwordPlaceholder": "Сложный пароль", "hasAccount": "Уже есть аккаунт?", "loginLink": "Войти"},
        "Home": {"title": "DT-Дневник 📒", "welcome": "{dayName}, {dateStr} · Добро пожаловать, <bold>{name}</bold>", "themeLight": "☀️ Светлая", "themeDark": "🌙 Темная", "calendar": "📅 Календарь", "showAllDays": "Показать все", "progress": "Прогресс", "allTasksDone": "🎉 Все задачи выполнены!", "active": "Актив", "done": "Готово", "upcoming": "⏰ Предстоящие", "noUpcoming": "Нет предстоящих событий.", "weeklyView": "📋 Неделя", "newTask": "✏️ Новая задача", "taskTitle": "Название...", "category": "📌 Категория", "dateOptional": "📅 Дата и время", "allTodos": "Все задачи", "noTodos": "🎯 Нет задач.", "allCompleted": "Завершенные", "trash": "🗑️ Корзина", "trashEmpty": "Корзина пуста.", "categories": "🏷️ КАТЕГОРИИ", "backToHome": "На главную", "openTrash": "🗑️ Открыть корзину"}
    },
    'ar': {
        "Common": {"login": "تسجيل الدخول", "register": "تسجيل", "logout": "خروج", "email": "البريد", "password": "كلمة المرور", "fullName": "الاسم الكامل", "save": "حفظ", "cancel": "إلغاء", "delete": "حذف", "add": "+ إضافة", "loading": "جار التحميل..."},
        "Login": {"title": "تسجيل الدخول", "emailPlaceholder": "example@email.com", "passwordPlaceholder": "كلمة المرور", "noAccount": "ليس لديك حساب؟", "registerLink": "تسجيل"},
        "Register": {"title": "تسجيل", "fullNamePlaceholder": "الاسم", "emailPlaceholder": "example@email.com", "passwordPlaceholder": "كلمة مرور قوية", "hasAccount": "لديك حساب؟", "loginLink": "تسجيل الدخول"},
        "Home": {"title": "DT-يوميات 📒", "welcome": "{dayName}, {dateStr} · أهلاً بك, <bold>{name}</bold>", "themeLight": "☀️ فاتح", "themeDark": "🌙 داكن", "calendar": "📅 التقويم", "showAllDays": "عرض الكل", "progress": "التقدم", "allTasksDone": "🎉 جميع المهام منجزة!", "active": "نشط", "done": "تم", "upcoming": "⏰ أحداث قادمة", "noUpcoming": "لا توجد أحداث.", "weeklyView": "📋 عرض أسبوعي", "newTask": "✏️ مهمة جديدة", "taskTitle": "عنوان المهمة...", "category": "📌 فئة", "dateOptional": "📅 التاريخ (اختياري)", "allTodos": "كل المهام", "noTodos": "🎯 لا توجد مهام.", "allCompleted": "المكتملة", "trash": "🗑️ المهملات", "trashEmpty": "المهملات فارغة.", "categories": "🏷️ الفئات", "backToHome": "الرئيسية", "openTrash": "🗑️ المهملات"}
    },
    'zh': {
        "Common": {"login": "登录", "register": "注册", "logout": "登出", "email": "电子邮件", "password": "密码", "fullName": "全名", "save": "保存", "cancel": "取消", "delete": "删除", "add": "+ 添加", "loading": "加载中..."},
        "Login": {"title": "登录", "emailPlaceholder": "example@email.com", "passwordPlaceholder": "您的密码", "noAccount": "没有账户？", "registerLink": "注册"},
        "Register": {"title": "注册", "fullNamePlaceholder": "姓名", "emailPlaceholder": "example@email.com", "passwordPlaceholder": "强密码", "hasAccount": "已有账户？", "loginLink": "登录"},
        "Home": {"title": "DT-日记 📒", "welcome": "{dayName}, {dateStr} · 欢迎, <bold>{name}</bold>", "themeLight": "☀️ 亮色", "themeDark": "🌙 暗色", "calendar": "📅 日历", "showAllDays": "显示所有", "progress": "进度", "allTasksDone": "🎉 任务已完成！", "active": "进行中", "done": "已完成", "upcoming": "⏰ 即将到来", "noUpcoming": "没有即将到来的事件。", "weeklyView": "📋 周视图", "newTask": "✏️ 新任务", "taskTitle": "任务标题...", "category": "📌 类别", "dateOptional": "📅 日期和时间", "allTodos": "所有任务", "noTodos": "🎯 暂无任务。", "allCompleted": "已完成", "trash": "🗑️ 回收站", "trashEmpty": "回收站是空的。", "categories": "🏷️ 类别", "backToHome": "回到首页", "openTrash": "🗑️ 打开回收站"}
    },
    'ja': {
        "Common": {"login": "ログイン", "register": "登録", "logout": "ログアウト", "email": "メール", "password": "パスワード", "fullName": "氏名", "save": "保存", "cancel": "キャンセル", "delete": "削除", "add": "+ 追加", "loading": "読み込み中..."},
        "Login": {"title": "ログイン", "emailPlaceholder": "example@email.com", "passwordPlaceholder": "パスワード", "noAccount": "アカウントをお持ちでないですか？", "registerLink": "登録"},
        "Register": {"title": "登録", "fullNamePlaceholder": "山田 太郎", "emailPlaceholder": "example@email.com", "passwordPlaceholder": "強力なパスワード", "hasAccount": "すでにアカウントをお持ちですか？", "loginLink": "ログイン"},
        "Home": {"title": "DT-日記 📒", "welcome": "{dayName}, {dateStr} · ようこそ, <bold>{name}</bold>", "themeLight": "☀️ ライト", "themeDark": "🌙 ダーク", "calendar": "📅 カレンダー", "showAllDays": "すべて表示", "progress": "進行状況", "allTasksDone": "🎉 全てのタスクが完了しました！", "active": "アクティブ", "done": "完了", "upcoming": "⏰ 予定", "noUpcoming": "予定はありません。", "weeklyView": "📋 週間ビュー", "newTask": "✏️ 新しいタスク", "taskTitle": "タスク名...", "category": "📌 カテゴリ", "dateOptional": "📅 日時 (任意)", "allTodos": "すべてのタスク", "noTodos": "🎯 現在タスクはありません。", "allCompleted": "完了済み", "trash": "🗑️ ゴミ箱", "trashEmpty": "ゴミ箱は空です。", "categories": "🏷️ カテゴリ", "backToHome": "ホームに戻る", "openTrash": "🗑️ ゴミ箱を開く"}
    },
    'ko': {
        "Common": {"login": "로그인", "register": "가입하기", "logout": "로그아웃", "email": "이메일", "password": "비밀번호", "fullName": "성명", "save": "저장", "cancel": "취소", "delete": "삭제", "add": "+ 추가", "loading": "로딩 중..."},
        "Login": {"title": "로그인", "emailPlaceholder": "example@email.com", "passwordPlaceholder": "비밀번호", "noAccount": "계정이 없으신가요?", "registerLink": "가입하기"},
        "Register": {"title": "가입하기", "fullNamePlaceholder": "홍길동", "emailPlaceholder": "example@email.com", "passwordPlaceholder": "강력한 비밀번호", "hasAccount": "이미 계정이 있으신가요?", "loginLink": "로그인"},
        "Home": {"title": "DT-일기 📒", "welcome": "{dayName}, {dateStr} · 환영합니다, <bold>{name}</bold>", "themeLight": "☀️ 라이트", "themeDark": "🌙 다크", "calendar": "📅 달력", "showAllDays": "모두 보기", "progress": "진행률", "allTasksDone": "🎉 모든 작업 완료!", "active": "진행 중", "done": "완료", "upcoming": "⏰ 다가오는 이벤트", "noUpcoming": "예정된 이벤트가 없습니다.", "weeklyView": "📋 주간 보기", "newTask": "✏️ 새 작업", "taskTitle": "작업 제목...", "category": "📌 카테고리", "dateOptional": "📅 날짜 및 시간", "allTodos": "모든 작업", "noTodos": "🎯 현재 작업이 없습니다.", "allCompleted": "완료된 작업", "trash": "🗑️ 휴지통", "trashEmpty": "휴지통이 비어 있습니다.", "categories": "🏷️ 카테고리", "backToHome": "홈으로", "openTrash": "🗑️ 휴지통 열기"}
    }
}

messages_dir = 'messages'
if not os.path.exists(messages_dir):
    os.makedirs(messages_dir)

for lang, data in langs.items():
    with open(os.path.join(messages_dir, f'{lang}.json'), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Translation files generated successfully.")
