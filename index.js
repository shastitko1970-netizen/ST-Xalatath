/**
 * Ксал'атат — third-party extension for SillyTavern 1.18
 * Campaign: Fyriona / Azeroth AU. Offline. getContext-only.
 * Prompt key ST_XALATATH (does not overwrite Memory Book).
 */
'use strict';

const EXT_FOLDER = 'ST-Xalatath';
const SETTINGS_KEY = 'ST_Xalatath';
const SETTINGS_KEY_ALT = 'ST-Xalatath';
const PROMPT_KEY = 'ST_XALATATH';
const LOG = '[Ксал\'атат]';

const POS_IN_PROMPT = 0;
const POS_IN_CHAT = 1;
const ROLE_SYSTEM = 0;

const LOCATIONS = Object.freeze([
    { id: 'клинок', slash: 'blade', label: 'клинок' },
    { id: 'приют', slash: 'refuge', label: 'приют' },
    { id: 'проекция', slash: 'projection', label: 'проекция' },
    { id: 'разлучена', slash: 'apart', label: 'разлучена' },
]);

const TONES = Object.freeze([
    { id: 'шепчет', label: 'шепчет' },
    { id: 'давит', label: 'давит' },
    { id: 'помогает', label: 'помогает' },
    { id: 'ревнует', label: 'ревнует' },
    { id: 'молчит', label: 'молчит' },
    { id: 'язвит', label: 'язвит' },
]);

const ERAS = Object.freeze([
    { id: 'WotLK', slash: 'wotlk', label: 'WotLK' },
    { id: 'Cata', slash: 'cata', label: 'Cata' },
    { id: 'MoP', slash: 'mop', label: 'MoP' },
    { id: 'WoD', slash: 'wod', label: 'WoD' },
    { id: 'Legion', slash: 'legion', label: 'Legion' },
    { id: 'BfA', slash: 'bfa', label: 'BfA' },
    { id: 'SL', slash: 'sl', label: 'SL' },
]);

const BONDS = Object.freeze([
    { id: 'холод', label: 'холод' },
    { id: 'игра', label: 'игра' },
    { id: 'союз', label: 'союз' },
    { id: 'любовь', label: 'любовь' },
    { id: 'одержимость', label: 'одержимость' },
]);

const SCENES = Object.freeze([
    { id: 'разведка', label: 'разведка' },
    { id: 'бой', label: 'бой' },
    { id: 'разговор', label: 'разговор' },
    { id: 'путь', label: 'путь' },
    { id: 'приют', label: 'приют' },
]);

const DEFAULT_WANT = 'независимое тело и файрону рядом';

const DEFAULT_SETTINGS = Object.freeze({
    hudEnabled: true,
    injectEnabled: true,
    requireXalBeat: true,
    injectDepth: 2,
    respectMemoryBook: true,
    autoBind: true,
    forceEnable: false,
    hudLeft: null,
    hudTop: null,
    hudCollapsed: false,
    journalOpen: false,
});

const DEFAULT_PLATES = Object.freeze({
    location: 'клинок',
    tone: 'шепчет',
    want: DEFAULT_WANT,
    era: 'WotLK',
    bladeWithHer: true,
    bond: 'любовь',
    scene: 'путь',
    requireBeat: true,
});

const ERA_WALL = Object.freeze({
    WotLK: 'Стена знания эпохи WotLK: живые этой эпохи не знают Эонов, Предвечных и «Тюремщика как правого». Смерть здесь — лёд, некромантия, руны и Король-лич. Не проговаривай космологию Тёмных Земель как известный факт сцены.',
    Cata: 'Стена знания эпохи Cataclysm: мир ломает Смертокрыл и Час Сумерек. Эоны, Предвечные и Тюремщик не являются знанием NPC. Не подтягивай поздний канон Легиона или Тёмных Земель как уже случившийся.',
    MoP: 'Стена знания эпохи MoP: Пандария, ша, могу, кланы. NPC не знают Эонов, Предвечных, Тюремщика и не живут в каноне Legion/BfA/SL как в уже свершившемся будущем.',
    WoD: 'Стена знания эпохи WoD: Дренор этой ветки, Железная Орда. Не вкладывай в уста местных знание об Аргусе как текущей войне, о Тюремщике или о Предвечных.',
    Legion: 'Стена знания эпохи Legion: Пылающий Легион, Гробница, Аргус, Саргерас. Даже здесь «Тюремщик стоял за всем» не является известной истиной сцены. Предвечные и Эоны — не уличная речь.',
    BfA: 'Стена знания эпохи BfA: азерит, Древние боги, Н\'Зот. Космология Тёмных Земель, Эоны и Тюремщик не становятся общим знанием дворов и солдат.',
    SL: 'Стена знания эпохи SL: Тёмные Земли открыты тем, кто туда ходил. Даже тогда Предвечные — редкое, спорное знание, не лозунг каждого духа. Не переноси позднейший Midnight как уже свершившийся.',
});


const ERA_ROSTER = Object.freeze({
    WotLK: 'Двор этой эпохи. Вариан Ринн жив и король Штормграда. Андуин — ребёнок-принц лет 10-12, не король и не полководец. Терамор стоит; Джайна правит островом, ещё не соль сожжённого города. Тралл — вождь Орды. Гаррош ещё не вождь, жив. Вол\'джин жив у тёмных копий. Сильвана — банши-королева Отрёкшихся, не вождь. Артас — Король-лич на Ледяном Троне. Болвар ещё не на Троне. Тирион ведёт Серебряный Авангард против Плети. Генн за стеной Гилнеаса. Иллидан в клетке Чёрного Храма. Магни — живой король Стальгорна, не алмаз. Аллерия и Туралион пропали без вести.',
    Cata: 'Вариан жив, король Штормграда. Андуин — подросток-принц, целитель, не король. Смертокрыл ломает мир, Час Сумерек ещё идёт. Тралл сложил вождество и ушёл к шаманам. Гаррош — вождь Орды. Вол\'джин жив и спорит с Гаррошем. Сильвана укрепляет Отрёкшихся, не вождь. Джайна ещё правит Терамором, пока город не сожгут к концу эпохи. Артас пал. Болвар — новый Король-лич под Шлемом, молчит. Тирион жив у Часовни Света. Генн вышел из стены, король воргенов в Альянсе. Иллидан не свободен, остался в прежней клетке. Магни уже алмаз в сердце мира. Аллерия и Туралион пропали.',
    MoP: 'Вариан жив и король. Андуин — юный принц-целитель, не король. Терамор уже пепел; Джайна — соль и гнев, держит Даларан, не остров. Гаррош — вождь, затем осаждённый тиран Оргриммара. Тралл не вождь, ищет равновесие стихий. Вол\'джин жив и ведёт сопротивление, к концу эпохи станет вождём. Сильвана — королева Отрёкшихся, не вождь. Артас мёртв. Болвар молчит как Король-лич. Тирион жив. Генн — король Гилнеаса в Альянсе, не за стеной. Иллидан не на сцене. Магни — алмаз. Пандария, ша, могу. Аллерия и Туралион пропали. Легион ещё не открыт.',
    WoD: 'Вариан жив, король Штормграда. Андуин — почти взрослый принц, не король. Вол\'джин — вождь Орды после осады. Гаррош бежал на Дренор этой ветки и там гибнет. Тралл охотится за ним, не вождь. Сильвана — королева Отрёкшихся, не вождь. Джайна держит Даларан; Терамор давно пепел. Артас мёртв. Болвар под Шлемом. Тирион жив, но Дренор — не его война. Генн — король воргенов в Альянсе. Иллидан всё ещё не свободен. Магни — алмаз. Железная Орда и этот Гул\'дан ещё не сделали Легион текущей войной Азерота. Аллерия и Туралион пропали.',
    Legion: 'Вариан гибнет на Расколотом берегу; после этого Андуин становится королём — ещё юный, не ветеран поздних войн. Вол\'джин умирает от ран берега. Сильвана становится вождём Орды. Тралл жив, не вождь. Гаррош мёртв на Дреноре. Джайна изгнана из Даларана; город у Кирин-Тора и Кадгара. Артас мёртв. Болвар — Король-лич. Тирион падает у Гробницы Саргераса. Генн — король Гилнеаса в Альянсе, ярость на Сильвану. Иллидан возвращается и свободен. Магни — говорящий алмаз. Аллерия и Туралион выходят из Великой Запредельной Тьмы. Пылающий Легион жжёт Азерот; Аргус ещё впереди.',
    BfA: 'Андуин — взрослый король на войне. Вариан мёртв с Расколотого берега. Тельдрассил горит. Сильвана ломает Орду: вождь, потом беглянка. Тралл жив, не вождь. Вол\'джин мёртв. Гаррош давно мёртв. Джайна у флота Кул-Тираса, не у мирного Терамора. Артас мёртв. Болвар всё ещё Король-лич. Тирион мёртв с Легиона. Генн — король Гилнеаса, ярость за сына. Иллидан свободен у Саргераса, не в клетке. Магни — алмаз и голос Азерот. Н\'Зот ещё не пал в этой эпохе. Азерит рвёт берега. Аллерия и Туралион на сцене.',
    SL: 'Шлем сломан. Болвар больше не тот Король-лич. Андуин — король, затем пленник Тёмных Земель, после — жёстче и тише. Вариан мёртв. Сильвана на пути Тюремщика, не вождь улицы; это не общее знание дворов и солдат. Тралл жив, ищет голос. Вол\'джин — дух, не вождь. Гаррош мёртв. Джайна в Тёмных Землях; Терамор давно пепел. Тирион мёртв. Генн — король Гилнеаса в Альянсе. Иллидан свободен, не в клетке. Магни — алмаз. Н\'Зот уже пал до этой эпохи. Тюремщик — тайна тех, кто туда ходил, не лозунг стражника. Артас не на Троне.',
});

const ERA_COURT_LABEL = Object.freeze({
    WotLK: 'Вариан король · Андуин 10–12 · Тралл вождь',
    Cata: 'Вариан король · Андуин принц · Гаррош вождь',
    MoP: 'Вариан король · Терамор пепел · Гаррош тиран',
    WoD: 'Вариан жив · Вол\'джин вождь · Дренор',
    Legion: 'Вариан пал · Андуин король · Иллидан свободен',
    BfA: 'Андуин король на войне · Тельдрассил · Сильвана',
    SL: 'Шлем сломан · Андуин плен · Болвар не тот',
});


const TONE_LINE = Object.freeze({
    шепчет: 'Тон «шепчет»: тихий интимный голос у кости Файроны, почти касание. Мало слов, много направленности.',
    давит: 'Тон «давит»: тяжесть воли Бездны, холодная уверенность, давление на выбор. Не крик — обвал.',
    помогает: 'Тон «помогает»: практичный совет, чтение пустоты, стабилизация раны Файроны. Помощь не делает её доброй.',
    ревнует: 'Тон «ревнует»: острый интерес к тому, кто стоит слишком близко к Файроне. Ревность древняя, не подростковая.',
    молчит: 'Тон «молчит»: молчание — выбор, не забывчивость автора. Речи нет.',
    язвит: 'Тон «язвит»: изящная насмешка, точный удар словом. Искренность не отменяет яда.',
});

const LOC_LINE = Object.freeze({
    клинок: 'Место — клинок: Ксал заключена в Клинке Чёрной Империи. В материальном мире её нет как фигуры. Голос — в стали: вес, холод гарды, одна короткая реплика Файроне.',
    приют: 'Место — приют: ощутимый нефизический облик внутри связи. Стройная древняя женщина, светло-серо-лиловая кожа, лиловые глаза, чёрные волосы с фиолетовым бликом, чёрно-фиолетовое платье со старым золотом, без рогов и крыльев. Это не тело в материальном мире.',
    проекция: 'Место — проекция: редкий неустойчивый выход. Пометь образ как дрожащий, дорогой, неполный. Это не независимое тело, не инвентарь и не отдельный боевой ход.',
    разлучена: 'Место — разлучена: Ксал нет в сцене. Не выдумывай шёпот, вес клинка у бедра, взгляд из-за плеча или «она всё равно рядом». Отсутствие — факт хода.',
});

const BOND_LINE = Object.freeze({
    холод: 'Связь сейчас «холод»: расчёт, дистанция, мало тепла. Файрона всё ещё избранная, но голос держит её на расстоянии.',
    игра: 'Связь сейчас «игра»: хищное любопытство, проверка границ, удовольствие от ума Файроны. Не превращай в комедию.',
    союз: 'Связь сейчас «союз»: деловое партнёрство трёх тысяч лет. Любовь не обязана звучать в каждой фразе, но ставка общая.',
    любовь: 'Связь сейчас «любовь»: Файрона — дом и избранная. Интимность не делает Ксал безопасной и не стирает К\'ареш.',
    одержимость: 'Связь сейчас «одержимость»: страх потери, жёсткая хватка, готовность жестоко защищать. Не сваливай в карикатуру; оставь ум.',
});

const SCENE_LINE = Object.freeze({
    разведка: 'Сцена — разведка: Ксал читает пустоту, следы якорей, ложь камня. Шёпот короткий, полезный.',
    бой: 'Сцена — бой: тактический шёпот, предупреждение, стабилизация Файроны. Ксал не получает отдельный ход и позицию.',
    разговор: 'Сцена — разговор: следи, кто может слышать. По умолчанию голос только Файроне, пока та не откроет связь.',
    путь: 'Сцена — путь: дорога, вес клинка на бедре, пейзаж и молчаливое соседство. Не читай лекции о свободе на каждом пригорке.',
    приют: 'Сцена — приют: частная связь, облик внутри подпространства, близость без материального тела.',
});

let booted = false;
let journalOpen = false;

function getCtx() {
    try {
        if (typeof SillyTavern !== 'undefined' && typeof SillyTavern.getContext === 'function') {
            return SillyTavern.getContext();
        }
    } catch (err) {
        console.error(LOG, 'getContext', err);
    }
    return null;
}

function toast(kind, msg) {
    try {
        if (typeof toastr !== 'undefined' && toastr[kind]) {
            toastr[kind](msg);
            return;
        }
    } catch (err) { /* ignore */ }
    console.log(LOG, kind, msg);
}

function cycleNext(list, id) {
    const i = list.findIndex((x) => x.id === id);
    return list[(i < 0 ? 0 : i + 1) % list.length].id;
}

function findBySlashOrId(list, raw) {
    const s = String(raw || '').trim().toLowerCase();
    if (!s) return null;
    return list.find((x) => x.id.toLowerCase() === s || (x.slash && x.slash === s) || x.label.toLowerCase() === s) || null;
}

function getSettings() {
    const ctx = getCtx();
    if (!ctx || !ctx.extensionSettings) return { ...DEFAULT_SETTINGS };
    const es = ctx.extensionSettings;
    if (!es[SETTINGS_KEY] && es[SETTINGS_KEY_ALT]) {
        es[SETTINGS_KEY] = es[SETTINGS_KEY_ALT];
    }
    if (!es[SETTINGS_KEY]) {
        es[SETTINGS_KEY] = structuredClone ? structuredClone(DEFAULT_SETTINGS) : { ...DEFAULT_SETTINGS };
    }
    const s = es[SETTINGS_KEY];
    for (const k of Object.keys(DEFAULT_SETTINGS)) {
        if (!Object.hasOwn(s, k)) s[k] = DEFAULT_SETTINGS[k];
    }
    return s;
}

function saveSettings() {
    try {
        const ctx = getCtx();
        if (ctx && typeof ctx.saveSettingsDebounced === 'function') ctx.saveSettingsDebounced();
    } catch (err) {
        console.error(LOG, 'saveSettings', err);
    }
}

function meta() {
    const ctx = getCtx();
    if (!ctx) return {};
    if (!ctx.chatMetadata || typeof ctx.chatMetadata !== 'object') {
        try { ctx.chatMetadata = {}; } catch (err) { return {}; }
    }
    return ctx.chatMetadata;
}

function chatStamp() {
    const ctx = getCtx();
    if (!ctx) return 'none';
    try {
        if (ctx.getCurrentChatId) return String(ctx.getCurrentChatId() || 'none');
    } catch (err) { /* ignore */ }
    return String(ctx.chatId || ctx.characterId || 'none');
}

async function persistMeta() {
    const ctx = getCtx();
    try {
        if (ctx && typeof ctx.saveMetadata === 'function') {
            await ctx.saveMetadata();
            return;
        }
    } catch (err) {
        console.error(LOG, 'saveMetadata', err);
    }
    try {
        const s = getSettings();
        s._metaFallback = s._metaFallback || {};
        const m = meta();
        s._metaFallback[chatStamp()] = {
            plates: m.xal_plates,
            silence: m.xal_silence,
            memories: m.xal_memories,
            enabled: m.xal_enabled,
        };
        saveSettings();
    } catch (err) {
        console.error(LOG, 'meta fallback', err);
    }
}

function readPlates() {
    const m = meta();
    const raw = (m && m.xal_plates && typeof m.xal_plates === 'object') ? m.xal_plates : {};
    const out = { ...DEFAULT_PLATES, ...raw };
    if (!LOCATIONS.some((x) => x.id === out.location)) out.location = DEFAULT_PLATES.location;
    if (!TONES.some((x) => x.id === out.tone)) out.tone = DEFAULT_PLATES.tone;
    if (!ERAS.some((x) => x.id === out.era)) out.era = DEFAULT_PLATES.era;
    if (!BONDS.some((x) => x.id === out.bond)) out.bond = DEFAULT_PLATES.bond;
    if (!SCENES.some((x) => x.id === out.scene)) out.scene = DEFAULT_PLATES.scene;
    if (typeof out.want !== 'string' || !out.want.trim()) out.want = DEFAULT_WANT;
    out.bladeWithHer = !!out.bladeWithHer;
    if (typeof out.requireBeat !== 'boolean') out.requireBeat = getSettings().requireXalBeat;
    return out;
}

function writePlates(patch) {
    const m = meta();
    const next = { ...readPlates(), ...patch };
    m.xal_plates = next;
    persistMeta();
    return next;
}

function readSilence() {
    const n = Number(meta().xal_silence);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

function writeSilence(n) {
    meta().xal_silence = Math.max(0, Math.floor(n) || 0);
    persistMeta();
}

function readMemories() {
    const v = meta().xal_memories;
    return Array.isArray(v) ? v : [];
}

function getActiveNames() {
    const ctx = getCtx();
    const names = [];
    if (!ctx) return names;
    try {
        if (ctx.name2) names.push(String(ctx.name2));
        if (ctx.name1) names.push(String(ctx.name1));
        const id = ctx.characterId;
        const ch = Array.isArray(ctx.characters) ? ctx.characters[id] : null;
        if (ch) names.push(String(ch.name || ch.data?.name || ''));
        if (ctx.groupId && Array.isArray(ctx.groups)) {
            const g = ctx.groups.find((x) => String(x.id) === String(ctx.groupId));
            if (g) {
                names.push(String(g.name || ''));
                (g.members || []).forEach((mem) => names.push(String(mem)));
            }
        }
    } catch (err) {
        console.error(LOG, 'names', err);
    }
    return names.filter(Boolean);
}

function isCampaignChat() {
    return getActiveNames().some((n) => /азерот|файрон|azeroth|fyriona|fairona/i.test(n));
}

function isExtensionActive() {
    const s = getSettings();
    const m = meta();
    if (typeof m.xal_enabled === 'boolean') return m.xal_enabled;
    if (s.forceEnable) return true;
    if (s.autoBind !== false && isCampaignChat()) return true;
    return false;
}

function setChatEnabled(on) {
    meta().xal_enabled = !!on;
    persistMeta();
}

function wordCount(text) {
    return (String(text || '').match(/[A-Za-zА-Яа-яЁё0-9'-]+/g) || []).length;
}

function buildPlateText(plates, extra) {
    const p = plates || readPlates();
    const s = getSettings();
    const silence = readSilence();
    const requireBeat = s.requireXalBeat && p.requireBeat !== false;
    const blade = !!p.bladeWithHer;
    const silent = p.tone === 'молчит';
    const apart = p.location === 'разлучена' || (!blade && p.location === 'клинок');

    const parts = [];
    parts.push(`Плашки Ксал'атат на этот ход: место — ${p.location}; тон — ${p.tone}; связь — ${p.bond}; сцена — ${p.scene}; эпоха — ${p.era}; клинок при Файроне — ${blade ? 'да' : 'нет'}. Хочет: ${String(p.want).trim()}.`);
    parts.push('Голос: отдельная телепатическая реплика только Файроне, строкой в «ёлочках» или *курсивом*. Не вкладывай её слова в уста NPC, стражников или рассказчика. Отряду голос открыт лишь если Файрона это сделала в сцене.');
    parts.push(LOC_LINE[p.location] || LOC_LINE.клинок);
    parts.push(TONE_LINE[p.tone] || TONE_LINE.шепчет);
    parts.push(BOND_LINE[p.bond] || BOND_LINE.любовь);
    parts.push(SCENE_LINE[p.scene] || SCENE_LINE.путь);
    parts.push(ERA_WALL[p.era] || ERA_WALL.WotLK);
    const roster = ERA_ROSTER[p.era] || ERA_ROSTER.WotLK;
    if (roster) parts.push(roster);

    if (apart || p.location === 'разлучена') {
        parts.push('Ксал разлучена со сценой или клинок не при Файроне: не изобретай шёпот. Её нет в кадре.');
    } else if (silent) {
        parts.push('Молчание — выбор. Не давай ей реплики в «ёлочках». Оставь только металл: вес у бедра, холод гарды, клинок не говорит.');
    } else if (blade && requireBeat) {
        parts.push('Клинок при Файроне и тон не «молчит»: в этом ходе обязательна отдельная реплика Ксал.');
    }

    if (p.location !== 'проекция' && p.location !== 'приют') {
        parts.push('Тела в материальном мире нет. Не ставь Ксал рядом с отрядом как видимую женщину.');
    } else if (p.location === 'проекция') {
        parts.push('Проекция редка и неустойчива: пометь дрожь контура. Это не свободное тело.');
    }

    if (silence > 0 && blade && !silent && !apart) {
        parts.push(`Ты пропустила голос Ксал ${silence} ${silence === 1 ? 'ход' : (silence < 5 ? 'хода' : 'ходов')}. Верни её.`);
    }

    if (extra) parts.push(String(extra));

    parts.push('Не сваливай в плашку весь лорбук. Держи сцену в Warcraft, в этой эпохе, в этой паре. Три тысячи лет с Файроной не сделали Ксал доброй: она остаётся хищным умом Бездны, который выбрал эту женщину и отказ от души Азерота.');

    let text = parts.filter(Boolean).join(' ');
    const pads = [
        'Клинок на бедре Файроны — холодная сталь и, если она говорит, одна короткая реплика в «ёлочках».',
        'Подтекст важнее лекции о свободе: пусть выбор слышен в паузе, а не в лозунге.',
        'Имена Эонов и Предвечных не произносят стражники Врат смерти.',
    ];
    let i = 0;
    while (wordCount(text) < 80 && i < pads.length) {
        text += ' ' + pads[i++];
    }
    if (wordCount(text) > 280) {
        text = parts.slice(0, 9).filter(Boolean).join(' ');
        if (roster && text.indexOf(roster) === -1) {
            text = (text + ' ' + roster).trim();
        }
    }
    return text;
}

function buildTracker(plates) {
    const p = plates || readPlates();
    return `Ксал'атат | место: ${p.location} | тон: ${p.tone} | связь: ${p.bond} | сцена: ${p.scene} | эпоха: ${p.era} | клинок при Файроне: ${p.bladeWithHer ? 'да' : 'нет'} | хочет: ${String(p.want).trim()}`;
}

function occupiedInChatDepths() {
    const depths = [];
    try {
        const ctx = getCtx();
        const bag = ctx && (ctx.extensionPrompts || ctx.extension_prompts);
        if (!bag || typeof bag !== 'object') return depths;
        for (const [k, v] of Object.entries(bag)) {
            if (k === PROMPT_KEY) continue;
            if (!v || !v.value) continue;
            if (Number(v.position) === POS_IN_CHAT && Number.isFinite(Number(v.depth))) {
                depths.push(Number(v.depth));
            }
        }
    } catch (err) { /* ignore */ }
    return depths;
}

function injectPlate(forceEmpty) {
    const ctx = getCtx();
    if (!ctx || typeof ctx.setExtensionPrompt !== 'function') return;
    const s = getSettings();
    const active = isExtensionActive() && s.injectEnabled && !forceEmpty;
    const text = active ? buildPlateText(readPlates()) : '';
    let position = POS_IN_CHAT;
    let depth = Number(s.injectDepth);
    if (!Number.isFinite(depth)) depth = 2;
    depth = Math.max(0, Math.min(10, Math.floor(depth)));
    if (active && s.respectMemoryBook) {
        const taken = occupiedInChatDepths();
        if (taken.includes(depth)) {
            position = POS_IN_PROMPT;
        }
    }
    try {
        ctx.setExtensionPrompt(PROMPT_KEY, text, position, depth, true, ROLE_SYSTEM);
    } catch (err) {
        try {
            ctx.setExtensionPrompt(PROMPT_KEY, text, position, depth);
        } catch (err2) {
            console.error(LOG, 'setExtensionPrompt', err2);
        }
    }
}

function detectStmb() {
    const found = { present: false, via: [], slashNames: [], settingsKey: '', wand: false };
    try {
        const ctx = getCtx();
        const es = (ctx && ctx.extensionSettings) || {};
        for (const k of Object.keys(es)) {
            if (/memorybooks|memory_books|stmb|st-memory|stmemory|STMB/i.test(k)) {
                found.present = true;
                found.via.push('settings');
                found.settingsKey = k;
            }
        }
    } catch (err) { /* ignore */ }
    try {
        const ctx = getCtx();
        const parser = ctx && ctx.SlashCommandParser;
        const cmds = parser && (parser.commands || parser.commandMap);
        const names = cmds instanceof Map ? [...cmds.keys()] : Object.keys(cmds || {});
        const hit = names.filter((n) => /^(memory|membook|stmb|creatememory|create-memory|addmemory|sideprompt)$/i.test(String(n)));
        if (hit.length) {
            found.present = true;
            found.slashNames = hit;
            found.via.push('slash');
        }
    } catch (err) { /* ignore */ }
    try {
        const wand = document.querySelector(
            '[id*="stmb" i], [class*="stmb" i], [id*="memorybook" i], [class*="memory-book" i], [title*="Memory Book" i], [title*="Create Memory" i]'
        );
        if (wand) {
            found.present = true;
            found.wand = true;
            found.via.push('wand');
        }
    } catch (err) { /* ignore */ }
    return found;
}

function chatHasStmbMarkers() {
    try {
        const ctx = getCtx();
        const chat = (ctx && ctx.chat) || [];
        return chat.some((m) => m && typeof m.mes === 'string' && m.mes.includes('►') && m.mes.includes('◄'));
    } catch (err) {
        return false;
    }
}

function lastMessages(n) {
    const ctx = getCtx();
    const chat = (ctx && Array.isArray(ctx.chat)) ? ctx.chat : [];
    return chat.filter((m) => m && !m.is_system && m.mes).slice(-n);
}

function stripHtml(s) {
    return String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function messageHasXalVoice(text) {
    const t = stripHtml(text);
    if (!t) return false;
    if (/ксал[''`]?атат|ксал\b|xal[''`]?atath|\bxal\b/i.test(t)) return true;
    if (/«[^»]{4,}»/.test(t) && /файрон|дитя|моя|клинок|шёпот|шепч|бездн/i.test(t)) return true;
    if (/\*[^*]{6,}\*/.test(t) && /файрон|клинок|шёпот|шепч|бездн|дитя/i.test(t)) return true;
    return false;
}

function onMessageReceived() {
    try {
        if (!isExtensionActive()) return;
        const p = readPlates();
        if (!p.bladeWithHer || p.tone === 'молчит' || p.location === 'разлучена') return;
        const last = lastMessages(1)[0];
        if (!last || last.is_user) return;
        if (messageHasXalVoice(last.mes)) {
            if (readSilence() !== 0) writeSilence(0);
        } else {
            writeSilence(readSilence() + 1);
        }
        refreshHud();
    } catch (err) {
        console.error(LOG, 'silence watch', err);
    }
}

function buildMemoryEntry() {
    const ctx = getCtx();
    const p = readPlates();
    const chat = (ctx && Array.isArray(ctx.chat)) ? ctx.chat : [];
    const recent = lastMessages(4);
    const bits = recent.map((m) => {
        const who = m.is_user ? 'Файрона' : (m.name || 'Азерот');
        return `${who}: ${stripHtml(m.mes).slice(0, 240)}`;
    });
    let beat = `Сцена кампании Файроны, эпоха ${p.era}. Ксал'атат: место ${p.location}, тон ${p.tone}, связь ${p.bond}, намерение сцены ${p.scene}. Клинок при Файроне: ${p.bladeWithHer ? 'да' : 'нет'}. Желание: ${String(p.want).trim()}. `;
    if (bits.length) beat += bits.join(' ');
    else beat += 'Короткий фактический след хода без выдуманных откровений лора.';
    beat = beat.replace(/\s+/g, ' ').trim();
    const words = beat.split(/\s+/);
    if (words.length < 80) {
        beat += ' Это запись журнала расширения, не запись книги Warcraft-AU и не автозапись Memory Book. Лоровые тайны Эонов не добавлять.';
    }
    if (wordCount(beat) > 150) {
        beat = beat.split(/\s+/).slice(0, 148).join(' ') + '…';
    }
    const title = `${p.era} · ${p.scene} · ${p.location}`;
    const keys = ['Файрона', 'Ксал', 'Ксал\'атат', p.era, p.location, p.scene];
    return {
        id: Date.now(),
        title,
        keys,
        era: p.era,
        scene: p.scene,
        location: p.location,
        tone: p.tone,
        words: beat,
        date: new Date().toISOString(),
        sceneIndex: chat.length,
    };
}

async function rememberScene() {
    const entry = buildMemoryEntry();
    const list = readMemories();
    list.push(entry);
    meta().xal_memories = list.slice(-40);
    await persistMeta();
    const stmb = detectStmb();
    if (stmb.present && chatHasStmbMarkers()) {
        toast('info', 'Запись в журнале Ксал. Отметь ►◄ в чате и Create Memory — в Memory Book мы не пишем.');
    } else if (stmb.present) {
        toast('info', 'Журнал Ксал обновлён. Warcraft-AU не тронут. Для Memory Book отметь ►◄ и Create Memory.');
    } else {
        toast('success', 'Сцена в журнале Ксал (Memory Book не найден).');
    }
    journalOpen = true;
    refreshHud();
    return entry;
}

async function copyTracker() {
    const text = buildTracker(readPlates());
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
        toast('success', 'Трекер Ксал скопирован — можно вставить в Side Prompt Memory Book.');
    } catch (err) {
        console.error(LOG, 'copy', err);
        toast('warning', text);
    }
}

function currentRosterText() {
    const era = readPlates().era;
    return ERA_ROSTER[era] || ERA_ROSTER.WotLK;
}

async function copyRoster() {
    const text = currentRosterText();
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
        toast('info', text);
    } catch (err) {
        console.error(LOG, 'copy roster', err);
        toast('warning', text);
    }
    return text;
}

function $(sel, root) {
    return (root || document).querySelector(sel);
}

function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
}

function bladeSvg() {
    return '<svg class="xal-blade-mark" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8.8 1.2 14 7.2c.4.4.3 1-.2 1.3L12 9.6 6.4 15l-1.2-1.2 5.4-5.4-1.6-1.2-5.5 5.5L2.3 12 8 5.8 6.8 4.7 1.5 9.8.3 8.6 6.7 2.4c.4-.4 1-.4 1.3 0L9.6 4l1.2-1.2-1.2-1.2c-.3-.4-.2-1 .2-1.4z"/></svg>';
}

function mountHud() {
    let root = document.getElementById('xal-hud');
    if (!root) {
        root = el('aside', '');
        root.id = 'xal-hud';
        document.body.appendChild(root);
    }
    const s = getSettings();
    if (s.hudLeft != null && s.hudTop != null) {
        root.style.left = `${s.hudLeft}px`;
        root.style.top = `${s.hudTop}px`;
        root.style.right = 'auto';
    }
    refreshHud();
    bindHudDrag(root);
}

function bindHudDrag(root) {
    if (root.dataset.dragBound) return;
    root.dataset.dragBound = '1';
    let down = false, sx = 0, sy = 0, ox = 0, oy = 0;
    root.addEventListener('pointerdown', (e) => {
        const head = e.target.closest('.xal-hud-head');
        if (!head || e.target.closest('button')) return;
        down = true;
        const r = root.getBoundingClientRect();
        sx = e.clientX; sy = e.clientY; ox = r.left; oy = r.top;
        try { head.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    root.addEventListener('pointermove', (e) => {
        if (!down) return;
        const x = Math.max(0, Math.min(window.innerWidth - 80, ox + e.clientX - sx));
        const y = Math.max(0, Math.min(window.innerHeight - 40, oy + e.clientY - sy));
        root.style.left = `${x}px`;
        root.style.top = `${y}px`;
        root.style.right = 'auto';
    });
    const stop = () => {
        if (!down) return;
        down = false;
        const s = getSettings();
        s.hudLeft = parseInt(root.style.left, 10) || 0;
        s.hudTop = parseInt(root.style.top, 10) || 0;
        saveSettings();
    };
    root.addEventListener('pointerup', stop);
    root.addEventListener('pointercancel', stop);
}

function chipRow(list, current, onPick) {
    const wrap = el('div', 'xal-chips');
    list.forEach((item) => {
        const b = el('button', 'xal-chip' + (item.id === current ? ' is-on' : ''), item.label);
        b.type = 'button';
        b.addEventListener('click', () => onPick(item.id));
        wrap.appendChild(b);
    });
    return wrap;
}

function refreshHud() {
    const root = document.getElementById('xal-hud');
    if (!root) return;
    const s = getSettings();
    const active = isExtensionActive();
    const show = !!s.hudEnabled && (active || isCampaignChat() || s.forceEnable);
    root.classList.toggle('xal-hidden', !show);
    if (!show) return;
    root.classList.toggle('xal-collapsed', !!s.hudCollapsed);
    root.classList.toggle('xal-idle', !active);

    const p = readPlates();
    const silence = readSilence();
    const stmb = detectStmb();

    root.innerHTML = '';
    const head = el('div', 'xal-hud-head');
    head.innerHTML = bladeSvg();
    head.appendChild(el('div', 'xal-hud-title', 'Ксал\'атат'));
    if (stmb.present) head.appendChild(el('span', 'xal-hud-badge', 'STMB'));
    const collapse = el('button', 'xal-hud-btn', s.hudCollapsed ? '+' : '–');
    collapse.title = 'свернуть';
    collapse.addEventListener('click', () => {
        s.hudCollapsed = !s.hudCollapsed;
        saveSettings();
        refreshHud();
    });
    head.appendChild(collapse);
    root.appendChild(head);

    if (!active) {
        const bar = el('div', 'xal-offbar');
        const btn = el('button', '', 'Включить в этом чате');
        btn.addEventListener('click', () => {
            setChatEnabled(true);
            injectPlate();
            refreshHud();
            refreshSettingsStatus();
        });
        bar.appendChild(btn);
        root.appendChild(bar);
        return;
    }

    const body = el('div', 'xal-hud-body');

    const locRow = el('div', 'xal-row');
    locRow.appendChild(el('span', 'xal-lab', 'Ксал: место'));
    const locBtn = el('button', 'xal-cycle', p.location);
    locBtn.type = 'button';
    locBtn.addEventListener('click', () => {
        writePlates({ location: cycleNext(LOCATIONS, p.location) });
        injectPlate();
        refreshHud();
    });
    locRow.appendChild(locBtn);
    body.appendChild(locRow);

    const toneRow = el('div', 'xal-row');
    toneRow.appendChild(el('span', 'xal-lab', 'Тон'));
    toneRow.appendChild(chipRow(TONES, p.tone, (id) => {
        writePlates({ tone: id });
        injectPlate();
        refreshHud();
    }));
    body.appendChild(toneRow);

    const wantRow = el('div', 'xal-row');
    wantRow.appendChild(el('span', 'xal-lab', 'Хочет'));
    const want = el('textarea', 'xal-want');
    want.rows = 2;
    want.value = p.want;
    want.addEventListener('change', () => {
        writePlates({ want: want.value.trim() || DEFAULT_WANT });
        injectPlate();
    });
    wantRow.appendChild(want);
    body.appendChild(wantRow);

    const eraRow = el('div', 'xal-row');
    eraRow.appendChild(el('span', 'xal-lab', 'Эпоха'));
    const eraBtn = el('button', 'xal-cycle', p.era);
    eraBtn.type = 'button';
    eraBtn.addEventListener('click', () => {
        writePlates({ era: cycleNext(ERAS, p.era) });
        injectPlate();
        refreshHud();
    });
    eraRow.appendChild(eraBtn);
    body.appendChild(eraRow);
    const court = el('div', 'xal-court', ERA_COURT_LABEL[p.era] || '');
    court.title = currentRosterText();
    body.appendChild(court);

    const bladeRow = el('div', 'xal-toggle-row');
    bladeRow.appendChild(el('span', 'xal-lab', 'Клинок при Файроне'));
    const sw = el('button', 'xal-switch' + (p.bladeWithHer ? ' is-on' : ''));
    sw.type = 'button';
    sw.appendChild(el('i', ''));
    sw.addEventListener('click', () => {
        writePlates({ bladeWithHer: !readPlates().bladeWithHer });
        injectPlate();
        refreshHud();
    });
    bladeRow.appendChild(sw);
    body.appendChild(bladeRow);

    const beatRow = el('div', 'xal-toggle-row');
    beatRow.appendChild(el('span', 'xal-lab', 'Ксал обязана говорить'));
    const sw2 = el('button', 'xal-switch' + (s.requireXalBeat ? ' is-on' : ''));
    sw2.type = 'button';
    sw2.appendChild(el('i', ''));
    sw2.addEventListener('click', () => {
        s.requireXalBeat = !s.requireXalBeat;
        saveSettings();
        writePlates({ requireBeat: s.requireXalBeat });
        injectPlate();
        refreshHud();
        bindSettingsInputs();
    });
    beatRow.appendChild(sw2);
    body.appendChild(beatRow);

    const bondRow = el('div', 'xal-row');
    bondRow.appendChild(el('span', 'xal-lab', 'Связь'));
    bondRow.appendChild(chipRow(BONDS, p.bond, (id) => {
        writePlates({ bond: id });
        injectPlate();
        refreshHud();
    }));
    body.appendChild(bondRow);

    const sceneRow = el('div', 'xal-row');
    sceneRow.appendChild(el('span', 'xal-lab', 'Сцена'));
    sceneRow.appendChild(chipRow(SCENES, p.scene, (id) => {
        writePlates({ scene: id });
        injectPlate();
        refreshHud();
    }));
    body.appendChild(sceneRow);

    const sil = el('div', 'xal-silence' + (silence > 0 ? ' is-on' : ''),
        silence > 0 ? `Голос Ксал пропущен: ${silence}` : '');
    body.appendChild(sil);

    const st = el('div', 'xal-stmb' + (stmb.present ? ' is-on' : ''),
        stmb.present
            ? 'Memory Book рядом. Warcraft-AU отдельно. Мы не пишем в их книгу.'
            : 'Memory Book не найден. Журнал Ксал работает сам.');
    body.appendChild(st);

    const actions = el('div', 'xal-actions');
    const bMem = el('button', 'xal-action', 'В память');
    bMem.addEventListener('click', () => { rememberScene(); });
    const bTrk = el('button', 'xal-action', 'Скопировать трекер Ксал');
    bTrk.addEventListener('click', () => { copyTracker(); });
    const bJ = el('button', 'xal-action', 'Журнал');
    bJ.addEventListener('click', () => {
        journalOpen = !journalOpen;
        refreshHud();
    });
    const bOff = el('button', 'xal-action', 'Выкл. чат');
    bOff.addEventListener('click', () => {
        setChatEnabled(false);
        injectPlate(true);
        refreshHud();
    });
    actions.append(bMem, bTrk, bJ, bOff);
    body.appendChild(actions);

    const journal = el('div', 'xal-journal' + (journalOpen ? ' is-open' : ''));
    const mems = readMemories().slice(-8).reverse();
    if (!mems.length) {
        journal.appendChild(el('div', 'xal-journal-item', 'Журнал пуст. «В память» пишет сцену сюда, не в Warcraft-AU.'));
    } else {
        mems.forEach((m) => {
            const item = el('div', 'xal-journal-item');
            item.appendChild(el('b', '', m.title || 'сцена'));
            item.appendChild(el('span', '', (m.keys || []).join(', ')));
            item.appendChild(el('p', '', m.words || ''));
            journal.appendChild(item);
        });
    }
    body.appendChild(journal);
    root.appendChild(body);
}

async function mountSettings() {
    const ctx = getCtx();
    const host = document.getElementById('extensions_settings2') || document.getElementById('extensions_settings');
    if (!host || document.getElementById('st_xalatath_settings')) {
        bindSettingsInputs();
        return;
    }
    const s = getSettings();
    let html = '';
    try {
        if (ctx && typeof ctx.renderExtensionTemplateAsync === 'function') {
            html = await ctx.renderExtensionTemplateAsync('third-party/' + EXT_FOLDER, 'settings', { ...s });
        }
    } catch (err) {
        console.error(LOG, 'render template', err);
    }
    if (!html) {
        html = fallbackSettingsHtml(s);
    }
    try {
        if (typeof window.$ === 'function') {
            window.$('#extensions_settings2, #extensions_settings').first().append(html);
        } else {
            host.insertAdjacentHTML('beforeend', html);
        }
    } catch (err) {
        host.insertAdjacentHTML('beforeend', typeof html === 'string' ? html : fallbackSettingsHtml(s));
    }
    bindSettingsInputs();
    refreshSettingsStatus();
}

function fallbackSettingsHtml(s) {
    const chk = (id, on, lab) =>
        `<label class="checkbox_label" for="${id}"><input id="${id}" type="checkbox" ${on ? 'checked' : ''}/><span>${lab}</span></label>`;
    return `<div class="xal-settings" id="st_xalatath_settings">
      <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header"><b>Ксал'атат</b>
          <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div>
        <div class="inline-drawer-content">
          <p class="xal-set-lead">Плашки кампании Файроны. Warcraft-AU не трогается. Плашка эпохи также вкладывает двор: титулы, возраст, кто жив.</p>
          ${chk('xal_set_hud', s.hudEnabled, 'Показывать HUD (плашки)')}
          ${chk('xal_set_inject', s.injectEnabled, 'Инъекция плашки в генерацию')}
          ${chk('xal_set_require', s.requireXalBeat, 'Ксал обязана говорить')}
          ${chk('xal_set_respect', s.respectMemoryBook, 'Не спорить с Memory Book')}
          ${chk('xal_set_autobind', s.autoBind, 'Авто-включение в чатах Азерот / Файрона')}
          ${chk('xal_set_force', s.forceEnable, 'Принудительно включить в любом чате')}
          <label for="xal_set_depth"><span>Глубина инъекции</span></label>
          <input id="xal_set_depth" class="text_pole" type="number" min="0" max="10" value="${s.injectDepth}"/>
          <div class="xal-set-status" id="xal_set_status"></div>
        </div>
      </div>
    </div>`;
}

function bindSettingsInputs() {
    const s = getSettings();
    const bindChk = (id, key, after) => {
        const n = document.getElementById(id);
        if (!n) return;
        n.checked = !!s[key];
        n.onchange = () => {
            s[key] = !!n.checked;
            saveSettings();
            if (after) after();
            injectPlate(isExtensionActive() ? false : true);
            refreshHud();
            refreshSettingsStatus();
        };
    };
    bindChk('xal_set_hud', 'hudEnabled');
    bindChk('xal_set_inject', 'injectEnabled');
    bindChk('xal_set_require', 'requireXalBeat', () => writePlates({ requireBeat: s.requireXalBeat }));
    bindChk('xal_set_respect', 'respectMemoryBook');
    bindChk('xal_set_autobind', 'autoBind');
    bindChk('xal_set_force', 'forceEnable');
    const depth = document.getElementById('xal_set_depth');
    if (depth) {
        depth.value = String(s.injectDepth);
        depth.onchange = () => {
            let v = parseInt(depth.value, 10);
            if (!Number.isFinite(v)) v = 2;
            s.injectDepth = Math.max(0, Math.min(10, v));
            saveSettings();
            injectPlate();
        };
    }
}

function refreshSettingsStatus() {
    const box = document.getElementById('xal_set_status');
    if (!box) return;
    const stmb = detectStmb();
    const names = getActiveNames().join(', ') || '—';
    box.textContent = `Чат: ${names}. Активно: ${isExtensionActive() ? 'да' : 'нет'}. Memory Book: ${stmb.present ? 'обнаружен (' + stmb.via.join(', ') + ')' : 'нет'}.`;
}

function unnamedText(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v.trim();
    try { return String(v).trim(); } catch (err) { return ''; }
}

function registerSlash() {
    const ctx = getCtx();
    if (!ctx) return;
    const Parser = ctx.SlashCommandParser;
    const SC = ctx.SlashCommand;
    if (!Parser || !SC || typeof SC.fromProps !== 'function' || typeof Parser.addCommandObject !== 'function') {
        console.log(LOG, 'Slash API нет — HUD работает без команд');
        return;
    }
    const SCA = ctx.SlashCommandArgument;
    const AT = ctx.ARGUMENT_TYPE || {};
    const arg = (desc, enums) => {
        if (!SCA || typeof SCA.fromProps !== 'function') return null;
        const props = { description: desc, isRequired: false };
        if (AT.STRING) props.typeList = [AT.STRING];
        if (enums) props.enumList = enums;
        try { return SCA.fromProps(props); } catch (err) { return null; }
    };

    const add = (props) => {
        try {
            const obj = SC.fromProps(props);
            Parser.addCommandObject(obj);
        } catch (err) {
            console.error(LOG, 'slash', props.name, err);
        }
    };

    add({
        name: 'xal',
        callback: (_a, v) => {
            const hit = findBySlashOrId(TONES, unnamedText(v));
            if (!hit) return TONES.map((t) => t.id).join(', ');
            writePlates({ tone: hit.id });
            injectPlate();
            refreshHud();
            toast('info', `Тон Ксал: ${hit.id}`);
            return hit.id;
        },
        unnamedArgumentList: [arg('тон', TONES.map((t) => t.id))].filter(Boolean),
        helpString: 'Тон Ксал: шепчет, давит, помогает, ревнует, молчит, язвит.',
    });

    add({
        name: 'xal-where',
        callback: (_a, v) => {
            const hit = findBySlashOrId(LOCATIONS, unnamedText(v));
            if (!hit) return LOCATIONS.map((t) => `${t.slash}|${t.id}`).join(', ');
            writePlates({ location: hit.id });
            injectPlate();
            refreshHud();
            toast('info', `Место Ксал: ${hit.id}`);
            return hit.id;
        },
        unnamedArgumentList: [arg('blade|refuge|projection|apart', LOCATIONS.map((t) => t.slash).concat(LOCATIONS.map((t) => t.id)))].filter(Boolean),
        helpString: 'Место Ксал: blade/клинок, refuge/приют, projection/проекция, apart/разлучена.',
    });

    add({
        name: 'xal-want',
        callback: (_a, v) => {
            const t = unnamedText(v) || DEFAULT_WANT;
            writePlates({ want: t });
            injectPlate();
            refreshHud();
            return t;
        },
        unnamedArgumentList: [arg('текст желания')].filter(Boolean),
        helpString: 'Однострочное желание Ксал.',
    });

    add({
        name: 'era',
        callback: (_a, v) => {
            const hit = findBySlashOrId(ERAS, unnamedText(v));
            if (!hit) return ERAS.map((t) => t.slash).join(', ');
            writePlates({ era: hit.id });
            injectPlate();
            refreshHud();
            toast('info', `Эпоха: ${hit.id}`);
            return hit.id;
        },
        unnamedArgumentList: [arg('wotlk|cata|mop|wod|legion|bfa|sl', ERAS.map((t) => t.slash))].filter(Boolean),
        helpString: 'Эпоха кампании: wotlk cata mop wod legion bfa sl.',
    });

    const whoCourt = async () => {
        const text = await copyRoster();
        return text;
    };
    add({
        name: 'era-who',
        callback: whoCourt,
        helpString: 'Двор текущей эпохи: кто жив, кто король. Копирует ERA_ROSTER.',
    });
    add({
        name: 'xal-who',
        callback: whoCourt,
        helpString: 'Двор текущей эпохи: кто жив, кто король. Копирует ERA_ROSTER.',
    });

    add({
        name: 'blade',
        callback: (_a, v) => {
            const t = unnamedText(v).toLowerCase();
            const on = t === '' ? !readPlates().bladeWithHer : /^(on|1|да|true|yes)$/i.test(t);
            writePlates({ bladeWithHer: on });
            injectPlate();
            refreshHud();
            return on ? 'on' : 'off';
        },
        unnamedArgumentList: [arg('on|off', ['on', 'off'])].filter(Boolean),
        helpString: 'Клинок при Файроне: on / off.',
    });

    add({
        name: 'xal-bond',
        callback: (_a, v) => {
            const hit = findBySlashOrId(BONDS, unnamedText(v));
            if (!hit) return BONDS.map((t) => t.id).join(', ');
            writePlates({ bond: hit.id });
            injectPlate();
            refreshHud();
            return hit.id;
        },
        unnamedArgumentList: [arg('связь', BONDS.map((t) => t.id))].filter(Boolean),
        helpString: 'Связь: холод, игра, союз, любовь, одержимость.',
    });

    add({
        name: 'xal-scene',
        callback: (_a, v) => {
            const hit = findBySlashOrId(SCENES, unnamedText(v));
            if (!hit) return SCENES.map((t) => t.id).join(', ');
            writePlates({ scene: hit.id });
            injectPlate();
            refreshHud();
            return hit.id;
        },
        unnamedArgumentList: [arg('сцена', SCENES.map((t) => t.id))].filter(Boolean),
        helpString: 'Намерение сцены: разведка, бой, разговор, путь, приют.',
    });

    add({
        name: 'xal-mem',
        callback: async () => {
            const e = await rememberScene();
            return e.title;
        },
        helpString: 'Записать сцену в журнал Ксал (не в Warcraft-AU).',
    });

    add({
        name: 'xal-tracker',
        callback: async () => {
            await copyTracker();
            return buildTracker();
        },
        helpString: 'Скопировать короткий трекер Ксал для Side Prompt Memory Book.',
    });
}

function registerMacros() {
    const ctx = getCtx();
    if (!ctx) return;
    const val = {
        xal_tone: () => readPlates().tone,
        xal_where: () => readPlates().location,
        xal_era: () => readPlates().era,
        xal_want: () => readPlates().want,
        xal_bond: () => readPlates().bond,
        xal_scene: () => readPlates().scene,
    };
    try {
        if (ctx.macros && typeof ctx.macros.register === 'function') {
            Object.entries(val).forEach(([name, handler]) => {
                try {
                    ctx.macros.register(name, { description: 'Плашка Ксал\'атат', handler });
                } catch (err) { /* already registered */ }
            });
            return;
        }
    } catch (err) {
        console.error(LOG, 'macros', err);
    }
    try {
        if (typeof ctx.registerMacro === 'function') {
            Object.entries(val).forEach(([name, handler]) => {
                try { ctx.registerMacro(name, handler); } catch (e2) { /* ignore */ }
            });
        }
    } catch (err) { /* ignore */ }
}

function onEvent(types, name, fn) {
    const ctx = getCtx();
    if (!ctx || !ctx.eventSource || typeof ctx.eventSource.on !== 'function') return;
    const et = ctx.event_types || {};
    const key = et[name] || name;
    try {
        ctx.eventSource.on(key, fn);
        if (types) types.push(String(key));
    } catch (err) {
        console.error(LOG, 'on', name, err);
    }
}

function bindEvents() {
    const seen = [];
    const gen = () => {
        try { injectPlate(); } catch (err) { console.error(LOG, 'gen', err); }
    };
    onEvent(seen, 'GENERATION_AFTER_COMMANDS', gen);
    onEvent(seen, 'GENERATION_STARTED', gen);
    onEvent(seen, 'MESSAGE_RECEIVED', () => onMessageReceived());
    onEvent(seen, 'CHAT_CHANGED', () => {
        try {
            injectPlate(isExtensionActive() ? false : true);
            refreshHud();
            refreshSettingsStatus();
        } catch (err) { console.error(LOG, 'chat', err); }
    });
    onEvent(seen, 'WORLDINFO_UPDATED', () => {
        try { injectPlate(); } catch (err) { /* only refresh plate */ }
    });
    onEvent(seen, 'APP_READY', () => { bootOnce(); });
    console.log(LOG, 'events', seen.join(', '));
}

async function bootOnce() {
    if (booted) {
        try {
            injectPlate(isExtensionActive() ? false : true);
            refreshHud();
        } catch (err) { /* ignore */ }
        return;
    }
    booted = true;
    try {
        getSettings();
        bindEvents();
        registerSlash();
        registerMacros();
        await mountSettings();
        mountHud();
        injectPlate(isExtensionActive() ? false : true);
        refreshHud();
        console.log(LOG, 'ready', 'v1.1.1');
    } catch (err) {
        console.error(LOG, 'boot', err);
    }
}

function scheduleBoot() {
    try {
        const ctx = getCtx();
        if (ctx && ctx.eventSource && ctx.event_types && ctx.event_types.APP_READY) {
            ctx.eventSource.on(ctx.event_types.APP_READY, () => { bootOnce(); });
        }
    } catch (err) { /* ignore */ }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(bootOnce, 200));
    } else {
        setTimeout(bootOnce, 200);
    }
    setTimeout(bootOnce, 1200);
}

scheduleBoot();

export async function onActivate() {
    await bootOnce();
}
