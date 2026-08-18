import re

with open('src/app/[locale]/page.tsx', 'r') as f:
    content = f.read()

# Fix KATEGORILER
content = content.replace(
    "<p className=\"heading-sub\" style={{ marginBottom: '16px' }}>🏷️ KATEGORİLER {filterByDate && !showTrash && `(${selectedCalDate.getDate()}/${selectedCalDate.getMonth() + 1})`}</p>",
    "<p className=\"heading-sub\" style={{ marginBottom: '16px' }}>{t('categories')} {filterByDate && !showTrash && `(${selectedCalDate.getDate()}/${selectedCalDate.getMonth() + 1})`}</p>"
)

# Fix back to home / open trash
content = content.replace(
    "{showTrash ? 'Ana Sayfaya Dön' : '🗑️ Çöp Kutusunu Aç'}",
    "{showTrash ? t('backToHome') : t('openTrash')}"
)

# Fix formatRemaining definition
content = content.replace(
    "function formatRemaining(ms: number): string {",
    "function formatRemaining(ms: number, t: any): string {"
)

# Fix formatRemaining logic
content = content.replace("return 'Süre doldu!';", "return t('timesUp');")
content = content.replace("return `${hours}s ${mins}dk`;", "return t('hoursMins', { hours, mins });")
content = content.replace("return `${mins} dk`;", "return t('minsOnly', { mins });")

# Fix formatRemaining calls
content = content.replace(
    "formatRemaining(new Date(task.due_date).getTime() - Date.now())",
    "formatRemaining(new Date(task.due_date).getTime() - Date.now(), t)"
)
content = content.replace(
    "formatRemaining(new Date(task.due_date!).getTime() - Date.now())",
    "formatRemaining(new Date(task.due_date!).getTime() - Date.now(), t)"
)

with open('src/app/[locale]/page.tsx', 'w') as f:
    f.write(content)

print("page.tsx updated.")
