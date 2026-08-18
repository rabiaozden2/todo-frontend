import json

langs = ['tr', 'en', 'de', 'es', 'fr', 'it', 'ru', 'ar', 'zh', 'ja', 'ko']
translations = {
    'tr': {'timesUp': 'Süre doldu!', 'hoursMins': '{hours}s {mins}dk', 'minsOnly': '{mins} dk'},
    'en': {'timesUp': 'Time is up!', 'hoursMins': '{hours}h {mins}m', 'minsOnly': '{mins} m'},
    'de': {'timesUp': 'Die Zeit ist um!', 'hoursMins': '{hours}Std {mins}m', 'minsOnly': '{mins} m'},
    'es': {'timesUp': '¡El tiempo se ha agotado!', 'hoursMins': '{hours}h {mins}m', 'minsOnly': '{mins} m'},
    'fr': {'timesUp': 'Le temps est écoulé!', 'hoursMins': '{hours}h {mins}m', 'minsOnly': '{mins} m'},
    'it': {'timesUp': 'Il tempo è scaduto!', 'hoursMins': '{hours}o {mins}m', 'minsOnly': '{mins} m'},
    'ru': {'timesUp': 'Время вышло!', 'hoursMins': '{hours}ч {mins}м', 'minsOnly': '{mins} м'},
    'ar': {'timesUp': 'انتهى الوقت!', 'hoursMins': '{hours}س {mins}د', 'minsOnly': '{mins} د'},
    'zh': {'timesUp': '时间到了！', 'hoursMins': '{hours}小时 {mins}分钟', 'minsOnly': '{mins} 分钟'},
    'ja': {'timesUp': '時間切れです！', 'hoursMins': '{hours}時間 {mins}分', 'minsOnly': '{mins} 分'},
    'ko': {'timesUp': '시간이 다 되었습니다!', 'hoursMins': '{hours}시간 {mins}분', 'minsOnly': '{mins} 분'}
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

print("Added keys successfully.")
