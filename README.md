# Ксал'атат — расширение SillyTavern 1.18

Третья сторона для кампании Файроны / ветки Азерота. Не универсальный ящик: плашки, голос и стена знания заточены под эту пару.

## Установка

1. Текущий пользователь: папку `ST-Xalatath` в `data/<handle>/extensions/ST-Xalatath`.
2. Или для всех: `public/scripts/extensions/third-party/ST-Xalatath`.
3. Перезагрузи ST → Manage Extensions → включи «Ксал'атат».
4. Открой чат с **Азерот** (или Файрона). HUD появится; генерация съест плашку сама.

## Memory Book (обязательно раздельно)

- **Warcraft-AU** = книга персонажа / чата. Кампанейский лор. Это расширение **никогда** в неё не пишет.
- **Memory Book** (aikohanasaki/SillyTavern-MemoryBooks) = **отдельная** авто-книга сцен. Не сливай её с Warcraft-AU и не давай ей перезаписывать кампанию.
- Lorebook Ordering: сначала Warcraft-AU, Memory Book — после.
- Плашка Ксал идёт как `setExtensionPrompt` (ключ `ST_XALATATH`), не как constant WI: так не душит recursion / STMB.
- «В память» пишет наш журнал в `chatMetadata`. Если в чате есть маркеры STMB `►◄` — тост «отметь ►◄ и Create Memory». В их lorebook мы не пишем.
- «Скопировать трекер Ксал» — короткий текст в Side Prompt STMB.
- Мы **не** прячем сообщения.

## Команды

`/xal` `/xal-where` `/xal-want` `/era` `/blade` `/xal-bond` `/xal-scene` `/xal-mem` `/xal-tracker`

Макросы: `{{xal_tone}}` `{{xal_where}}` `{{xal_era}}` `{{xal_want}}` `{{xal_bond}}` `{{xal_scene}}`
