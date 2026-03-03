const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const minimapCanvas = document.getElementById("minimap");
const mm = minimapCanvas.getContext("2d");

let gameStarted = false;

// match CSS-størrelsen, men i “ekte” pixler:
const MINIMAP_SIZE = 400;
minimapCanvas.width = MINIMAP_SIZE;
minimapCanvas.height = MINIMAP_SIZE;

mm.imageSmoothingEnabled = false;
mm.webkitImageSmoothingEnabled = false;
mm.mozImageSmoothingEnabled = false;

// Viktig: unngå subpixel "blending" som lager streker mellom tiles
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;

// --- Menu / character screen refs ---
const screenMenu = document.getElementById("screen-menu");
const screenCharacter = document.getElementById("screen-character");

// NY start hub
const btnStart = document.getElementById("btn-start");
const btnCreateCharacter = document.getElementById("btn-create-character");

const startCharBox = document.getElementById("start-char-box");
const startCharName = document.getElementById("start-char-name");
const startCharLvl = document.getElementById("start-char-lvl");

const startSpriteImg = document.getElementById("start-char-sprite");
const startArmorImg = document.getElementById("start-char-armor");
const startNoChar = document.getElementById("start-no-char");

// modal create
const inputName = document.getElementById("input-name");
const btnFinishCharacter = document.getElementById("btn-finish-character");
const btnBackMenu = document.getElementById("btn-back-menu");
const inputGenderMale = document.getElementById("gender-male");
const inputGenderFemale = document.getElementById("gender-female");


const hudZone = document.getElementById("hud-zone");
const hudPos = document.getElementById("hud-pos");
// --- Context menu refs ---
const gameWrap = document.getElementById("game-wrap");
const contextMenu = document.getElementById("context-menu");
// --- Chat log refs ---
const chatLogEl = document.getElementById("chatlog-messages");
//--- Save Knapp ----
const btnSave = document.getElementById("btn-save");

// --- Pause menu refs ---
const pauseMenuEl = document.getElementById("pause-menu");
const pauseItemsEl = document.getElementById("pause-items");

// --- Dialog UI refs ---
const dialogEl = document.getElementById("dialog");
const dialogNameEl = document.getElementById("dialog-name");
const dialogTextEl = document.getElementById("dialog-text");
const dialogOptionsEl = document.getElementById("dialog-options");
const dialogPortraitEl = document.querySelector(".dialog-portrait");

// --- Skills UI refs ---
const btnSkills = document.getElementById("btn-skills");
const skillsWindowEl = document.getElementById("skills-window");
const skillsListEl = document.getElementById("skills-list");
const btnSkillsClose = document.getElementById("btn-skills-close");
const skillsTitleEl = document.querySelector("#skills-window .skills-title");

// --- Inventory UI refs ---
const btnInventory = document.getElementById("btn-inventory");
const inventoryWindowEl = document.getElementById("inventory-window");
const inventoryGridEl = document.getElementById("inventory-grid");
const btnInventoryClose = document.getElementById("btn-inventory-close");

// --- Equipment UI refs ---
const btnEquip = document.getElementById("btn-equip");
const equipWindowEl = document.getElementById("equip-window");
const equipStatsEl = document.getElementById("equip-stats");
const btnEquipClose = document.getElementById("btn-equip-close");

// --- Shop UI refs ---
const shopWindowEl = document.getElementById("shop-window");
const shopListEl = document.getElementById("shop-list");
const shopTitleEl = document.getElementById("shop-title");
const shopCoinsEl = document.getElementById("shop-coins");
const btnShopClose = document.getElementById("btn-shop-close");

// --- Bank UI refs (NY) ---
const bankWindowEl = document.getElementById("bank-window");
const bankGridEl = document.getElementById("bank-grid");
const btnBankClose = document.getElementById("btn-bank-close");

// --- Map UI refs (NY) ---
const btnMap = document.getElementById("btn-map");
const mapWindowEl = document.getElementById("map-window");
const mapCanvas = document.getElementById("map-canvas");
const mapCtx = mapCanvas ? mapCanvas.getContext("2d") : null;
const btnMapClose = document.getElementById("btn-map-close");

let mapOpen = false;

// cache: vi renderer hele level 1 gang til et offscreen canvas, så vi bare “blitter” det
let mapCache = null;      // { levelId, canvas }


// --- status effect emblemsrefs ---
const xpPopEl = document.getElementById("xp-pop");
const xpPopImgEl = document.getElementById("xp-pop-img");
const foodCdImgEl = document.getElementById("food-cd-img");


// xp-emblem er en kort animasjon, food-emblem er "on while cooldown"
let xpEmblemActive = false;


// --- Player hearts ---
const hpHeartTextEl = document.getElementById("hp-heart-text");

// --- Mat Cooldown ---
let foodCooldownUntilMs = 0;

// viktig
const VIEW_TILES_X = 20;
const VIEW_TILES_Y = 12;

// ---- PLAYER/NPC RENDER SIZE (visual only) ----
// Logisk størrelse (kollisjon) er fortsatt 1 tile.
const PLAYER_DRAW_W = TILE_SIZE;
const PLAYER_DRAW_H = TILE_SIZE * 2;

// Hvor mye vi flytter sprite opp (ankre ved føtter)
const PLAYER_DRAW_Y_OFFSET = TILE_SIZE;

let animTime = 0;

canvas.width = VIEW_TILES_X * TILE_SIZE;
canvas.height = VIEW_TILES_Y * TILE_SIZE;

//Loading screen teller
function collectAllImageUrls() {
  const urls = new Set();

  // Tiles
  for (const def of Object.values(TILE_DEFS)) {
    if (!def) continue;
    if (def.animated && Array.isArray(def.frames)) {
      for (const s of def.frames) if (s) urls.add(s);
    } else if (def.img) {
      urls.add(def.img);
    }
  }

  // Player anims
  function addAnimSet(animDef) {
    for (const d of Object.values(animDef || {})) {
      if (!d) continue;
      const idle = d.idle;
      if (Array.isArray(idle)) idle.forEach(s => s && urls.add(s));
      else if (idle) urls.add(idle);

      (d.walk || []).forEach(s => s && urls.add(s));
    }
  }
  addAnimSet(PLAYER_ANIMS_MALE);
  addAnimSet(PLAYER_ANIMS_FEMALE);

  // Armor anims (items)
  for (const def of Object.values(ITEM_DEFS)) {
    if (def?.type === "armor" && def?.playerAnims) {
      addAnimSet(def.playerAnims);
    }
  }

  // NPC sprites (fra LEVELS)
  for (const lvl of Object.values(LEVELS)) {
    const npcs = lvl?.npcs || [];
    for (const n of npcs) {
      if (Array.isArray(n.sprites)) n.sprites.forEach(s => s && urls.add(s));
      if (n.sprite) urls.add(n.sprite);
    }
  }

  return Array.from(urls);
}



//--- serviceWorker ---
//if ("serviceWorker" in navigator) {
//  window.addEventListener("load", () => {
//    navigator.serviceWorker.register("./sw.js").catch(console.warn);
//  });
//}

// -------------------- CAMERA (follow player) --------------------
let cameraPx = 0;
let cameraPy = 0;

function clampCam(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function updateCamera() {
  const worldW = level.width * TILE_SIZE;
  const worldH = level.height * TILE_SIZE;

  const viewW = canvas.width;
  const viewH = canvas.height;

  // mål: spilleren i midten
  const targetX = player.px + TILE_SIZE / 2 - viewW / 2;
  const targetY = player.py + TILE_SIZE / 2 - viewH / 2;

  // Viktig: denne støtter BOTH:
  // - store maps: clamp 0 .. (world - view)
  // - små maps: clamp (world - view) .. 0  (negativt)
  const minCamX = Math.min(0, worldW - viewW);
  const maxCamX = Math.max(0, worldW - viewW);

  const minCamY = Math.min(0, worldH - viewH);
  const maxCamY = Math.max(0, worldH - viewH);

  cameraPx = clampCam(targetX, minCamX, maxCamX);
  cameraPy = clampCam(targetY, minCamY, maxCamY);
}


function getVisibleTileBounds(camX, camY) {
  // Tegn litt utenfor skjermen for å unngå pop-in
  const startX = Math.floor(camX / TILE_SIZE) - 1;
  const startY = Math.floor(camY / TILE_SIZE) - 1;

  const endX = startX + VIEW_TILES_X + 2;
  const endY = startY + VIEW_TILES_Y + 2;

  return { startX, startY, endX, endY };
}


// Smooth movement settings
const BASE_MOVE_DURATION_MS = 200;   // hvor lang tid ett tile-steg tar (juster)
const STEP_REPEAT_DELAY_MS = 0; // 0 = start neste steg umiddelbart

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { bumpLoading(); resolve(img); };
    img.onerror = () => { bumpLoading(); resolve(img); }; // fortsatt fremdrift selv om en fil feiler
    img.src = src;
  });
}
const tileImages = {};

const playerSkins = {};
// Armor-overlay anims (separate fra base-skins)
const armorSkins = {}; // armorId { down/up/left/right: {idle: Image[], walk: Image[]} }
const playerImages = {}; // { idle: Image, walk: Image[] }

const PLAYER_ANIMS_MALE = {
  down: {
    idle: [ 
      "assets/player/male/male_down.png",
      "assets/player/male/male_down_idle.png",
    ],
    walk: [
      "assets/player/male/male_down_run_1.png",
      
      "assets/player/male/male_down_run_2.png",
    ],
  },
  up: {
    idle: [ 
      "assets/player/male/male_up.png",
      "assets/player/male/male_up_idle.png",
    ],
    walk: [
      "assets/player/male/male_up_run_1.png",
      "assets/player/male/male_up_run_2.png",
    ],
  },
  left: {
    idle: [ 
      "assets/player/male/male_left.png",
      "assets/player/male/male_left_idle.png",
    ],
    walk: [
      "assets/player/male/male_left_run.png",
      "assets/player/male/male_left_idle.png",
    ],
  },
  right: {
    idle: [ 
      "assets/player/male/male_right.png",
      "assets/player/male/male_right_idle.png",
    ],
    walk: [
      "assets/player/male/male_right_run.png",
      "assets/player/male/male_right.png",
    ],
  },
};

const PLAYER_ANIMS_FEMALE = {
  down: {
    idle: [
      "assets/player/female/female_down.png",
      "assets/player/female/female_down_idle.png",
    ],
    walk: [
      "assets/player/female/female_down_run_1.png",
      "assets/player/female/female_down.png",
      "assets/player/female/female_down_run_2.png",
    ],
  },
  up: {
    idle: [
      "assets/player/female/female_up.png",
      "assets/player/female/female_up_idle.png",
    ],
    walk: [
      "assets/player/female/female_up_run_1.png",
      "assets/player/female/female_up_run_2.png",
    ],
  },
  left: {
    idle: [
      "assets/player/female/female_left.png",
      "assets/player/female/female_left_idle.png",
    ],
    walk: [
      "assets/player/female/female_left_run_1.png",
      "assets/player/female/female_left.png",
    ],
  },
  right: {
    idle: [
      "assets/player/female/female_right.png",
      "assets/player/female/female_right_idle.png",
    ],
    walk: [
      "assets/player/female/female_right_run_1.png",
      "assets/player/female/female_right.png",
    ],
  },
};

const PLAYER_ANIMS_GNOME = {
  down: {
    idle: [
      "assets/player/gnome/gnome_down.png",
      "assets/player/gnome/gnome_down_idle.png",
    ],
    walk: [
      "assets/player/gnome/gnome_down_run_1.png",
      "assets/player/gnome/gnome_down_run_2.png",
    ],
  },
  up: {
    idle: [
      "assets/player/gnome/gnome_up.png",
      "assets/player/gnome/gnome_up_idle.png",
    ],
    walk: [
      "assets/player/gnome/gnome_up_run_1.png",
      "assets/player/gnome/gnome_up_run_2.png",
    ],
  },
  left: {
    idle: [
      "assets/player/gnome/gnome_left.png",
      "assets/player/gnome/gnome_left_idle.png",
    ],
    walk: [
      "assets/player/gnome/gnome_left_run.png",
      "assets/player/gnome/gnome_left.png",
    ],
  },
  right: {
    idle: [
      "assets/player/gnome/gnome_right.png",
      "assets/player/gnome/gnome_right_idle.png",
    ],
    walk: [
      "assets/player/gnome/gnome_right_run.png",
      "assets/player/gnome/gnome_right.png",
    ],
  },
};



// hvor “fort” walk-frame bytter mens du går/står
const PLAYER_IDLE_FRAME_MS = 350;
const PLAYER_WALK_FRAME_MS = 90;

const npcImages = {}; // id -> Image

async function loadNpcAssets() {
  for (const lvl of Object.values(LEVELS)) {
    const npcs = lvl.npcs || [];
    for (const n of npcs) {
      const paths = [];

      // Støtt både gammel "sprite" og ny "sprites"
      if (Array.isArray(n.sprites) && n.sprites.length) {
        paths.push(...n.sprites);
      } else if (n.sprite) {
        paths.push(n.sprite);
      }

      for (const p of paths) {
        if (!p) continue;
        if (!npcImages[p]) {
          npcImages[p] = await loadImage(p);
        }
      }
    }
  }
}

async function loadAllAssets() {
  for (const [key, def] of Object.entries(TILE_DEFS)) {
    if (def.animated && Array.isArray(def.frames)) {
      // Flere PNG-filer
      tileImages[key] = [];
      for (const src of def.frames) {
        tileImages[key].push(await loadImage(src));
      }
    } else {
      // Vanlig tile (enkeltbilde) ELLER spritesheet (img)
      tileImages[key] = await loadImage(def.img);
    }
  }

  // Cache så vi ikke laster samme fil flere ganger
  const imgCache = {};

  async function loadCached(src) {
    if (!src) return null;
    if (!imgCache[src]) imgCache[src] = await loadImage(src);
    return imgCache[src];
  }

  async function loadPlayerAnimSet(targetDict, skinId, animDef) {
    const out = {};
    for (const [dir, def] of Object.entries(animDef)) {

      let idleFrames = [];
      if (Array.isArray(def.idle)) {
        for (const src of def.idle) {
          const img = await loadCached(src);
          if (img) idleFrames.push(img);
        }
      } else {
        const img = await loadCached(def.idle);
        if (img) idleFrames = [img];
      }

      const walkFrames = [];
      for (const src of (def.walk || [])) {
        const img = await loadCached(src);
        if (img) walkFrames.push(img);
      }

      out[dir] = { idle: idleFrames, walk: walkFrames };
    }

    targetDict[skinId] = out;
  }

  // 1) Default skins
  await loadPlayerAnimSet(playerSkins, "male", PLAYER_ANIMS_MALE);
  await loadPlayerAnimSet(playerSkins, "female", PLAYER_ANIMS_FEMALE);
  await loadPlayerAnimSet(playerSkins, "gnome", PLAYER_ANIMS_GNOME);

  // Armor overlays (bruker samme playerAnims, men lagres i armorSkins)
  for (const def of Object.values(ITEM_DEFS)) {
    if (def?.type !== "armor") continue;

    // playerAnimsByGender
    if (def.playerAnimsByGender?.male) {
      await loadPlayerAnimSet(armorSkins, armorKey(def.id, "male"), def.playerAnimsByGender.male);
    }
    if (def.playerAnimsByGender?.female) {
      await loadPlayerAnimSet(armorSkins, armorKey(def.id, "female"), def.playerAnimsByGender.female);
    }

    // Bakoverkompatibel fallback: hvis det fortsatt er gamle armor som bare har playerAnims :)
    if (!def.playerAnimsByGender && def.playerAnims) {
      await loadPlayerAnimSet(armorSkins, armorKey(def.id, "male"), def.playerAnims);
      await loadPlayerAnimSet(armorSkins, armorKey(def.id, "female"), def.playerAnims);
    }
  }

  await loadNpcAssets();
  await loadFxAssets();
}

let respawnPoint = null; 
// format: { levelId: string, x: number, y: number }

let currentLevelId = "spenningsbyen";
let level = LEVELS[currentLevelId];

// -------------------- DEFAULT SPAWN (per race) --------------------
const DEFAULT_SPAWNS = {
  // male/female starter her
  human: { levelId: "spenningsbyen", x: 233, y: 236 },

  // gnome starter her (annen lokasjon) husk å endre!
  gnome: { levelId: "spenningsbyen", x: 233, y: 236 },
};

function getDefaultSpawnForGender(gender) {
  const g = normalizeGender(gender);
  if (g === "gnome") return DEFAULT_SPAWNS.gnome;
  return DEFAULT_SPAWNS.human;
}

const __bootSpawn = { levelId: "spenningsbyen", x: 233, y: 236 };

const player = {
  x: __bootSpawn.x,
  y: __bootSpawn.y,
  px: __bootSpawn.x * TILE_SIZE,
  py: __bootSpawn.y * TILE_SIZE,

  gender: "male",

  level: 1,
  xp: 0,

  maxHp: 6,
  hp: 6,

  facing: "down",

  // movement state
  moving: false,
  fromPx: 0,
  fromPy: 0,
  toPx: 0,
  toPy: 0,
  moveElapsed: 0,

  moveDuration: BASE_MOVE_DURATION_MS,
};

// -------------------- SKILLS --------------------
let skills = {
  combat: { level: 1, xp: 0 },
  mining: { level: 1, xp: 0 },
  woodcutting: { level: 1, xp: 0 },
  fishing: { level: 1, xp: 0 },
};

// Total level = summen av alle skill-levels 
function getTotalSkillLevel(srcSkills = skills) {
  if (!srcSkills || typeof srcSkills !== "object") return 0;
  let sum = 0;
  for (const id of ["combat", "mining", "woodcutting", "fishing"]) {
    const s = srcSkills[id];
    const lvl = Number(s?.level);
    if (Number.isFinite(lvl) && lvl > 0) sum += Math.floor(lvl);
  }
  return sum;
}

// hent total level fra save (bruk xp hvis det finnes, ellers level)
function getTotalSkillLevelFromSave(saveObj) {
  const sk = saveObj?.skills;
  if (!sk || typeof sk !== "object") return 0;

  let sum = 0;
  for (const id of ["combat", "mining", "woodcutting", "fishing"]) {
    const s = sk[id];
    if (!s || typeof s !== "object") continue;

    const xp = Number(s.xp);
    const lvl = Number(s.level);

    if (Number.isFinite(xp) && xp >= 0) sum += skillLevelFromXp(xp);
    else if (Number.isFinite(lvl) && lvl > 0) sum += Math.floor(lvl);
    else sum += 1;
  }
  return sum;
}

// Skill-curve (litt annerledes enn main level)
// Level 2 = 50xp, Level 3 = 200xp, Level 4 = 450xp, ...
const MAX_SKILL_LEVEL = 100;

function totalSkillXpForLevel(L) {
  const level = Math.max(1, Math.min(MAX_SKILL_LEVEL, Math.floor(L)));
  return (level - 1) * (level - 1) * 50;
}

function skillLevelFromXp(xp) {
  const x = Math.max(0, Math.floor(xp));
  const L = Math.floor(Math.sqrt(x / 50)) + 1;
  return Math.max(1, Math.min(MAX_SKILL_LEVEL, L));
}

let xpPopTimer = 0;

function showXpEmblem() {
  if (!xpPopEl) return;

  xpEmblemActive = true;
  syncXpPopContainer();

  // restart animasjonen hver gang vi får XP
  xpPopEl.classList.remove("show");
  void xpPopEl.offsetWidth;
  xpPopEl.classList.add("show");

  const totalMs = 1600; // må matche CSS animasjonstiden
  if (xpPopTimer) clearTimeout(xpPopTimer);

  xpPopTimer = setTimeout(() => {
    xpEmblemActive = false;
    xpPopTimer = 0;
    syncXpPopContainer();
  }, totalMs);
}

function syncXpPopContainer() {
  if (!xpPopEl) return;

  const foodActive = Date.now() < foodCooldownUntilMs;
  const anyActive = xpEmblemActive || foodActive;

  // container synlig kun hvis noe er aktivt
  xpPopEl.classList.toggle("hidden", !anyActive);
  xpPopEl.setAttribute("aria-hidden", anyActive ? "false" : "true");

  // XP-ikon kun når XP-emblem faktisk er aktivt
  if (xpPopImgEl) xpPopImgEl.classList.toggle("hidden", !xpEmblemActive);

  // food-ikon kun når cooldown er aktiv
  if (foodCdImgEl) foodCdImgEl.classList.toggle("hidden", !foodActive);

  // hvis vi ikke viser XP, så skal vi ikke stå fast i "show"-anim
  if (!xpEmblemActive) xpPopEl.classList.remove("show");
}


function addSkillXp(skillId, amount) {
  const s = skills[skillId];
  if (!s) return;

  const gain = Math.max(0, Math.floor(amount || 0));
  if (gain <= 0) return;

  const beforeLevel = s.level;
  s.xp += gain;

  const afterLevel = skillLevelFromXp(s.xp);
  if (afterLevel > beforeLevel) {
    s.level = afterLevel;
    logMessage(`${skillId.toUpperCase()} level up! You are now ${s.level}.`, "loot");
  }

  // Emblem pop hver gang vi får XP (skill eller vanlig)
  showXpEmblem();

  // Hvis skills-vindu er åpent: refresh
  if (skillsWindowEl && !skillsWindowEl.classList.contains("hidden")) {
    renderSkillsWindow();
  }
}

let skillsOpen = false;

function renderSkillsWindow() {
  if (!skillsListEl) return;

  // Header: total level (sum av skills) + STR
  if (skillsTitleEl) {
    const str = (typeof getPlayerStrength === "function") ? getPlayerStrength() : 1;
    const totalLvl = getTotalSkillLevel();

    skillsTitleEl.innerHTML = `
      Skills • Total lvl ${totalLvl}
      <span class="skills-subline skills-subline--str">STR: ${str}</span>
    `;
  }

  skillsListEl.innerHTML = "";

  const entries = [
    { label: "Combat", s: skills.combat },
    { label: "Mining", s: skills.mining }, 
    { label: "Woodcutting", s: skills.woodcutting },
    { label: "Fishing", s: skills.fishing },
  ];

  for (const e of entries) {
    const row = document.createElement("div");
    row.className = "skill-row";
    const nextSkillTotalXp = totalSkillXpForLevel(Math.min(MAX_SKILL_LEVEL, e.s.level + 1));
    const skillXpText = (e.s.level >= MAX_SKILL_LEVEL)
      ? `${e.s.xp} XP (MAX)`
      : `${e.s.xp}/${nextSkillTotalXp} XP`;

    row.innerHTML = `
      <div class="skill-name">${e.label}</div>
      <div class="skill-meta">Lvl ${e.s.level} • ${skillXpText}</div>
    `;
    skillsListEl.appendChild(row);
  }
}

function openSkillsWindow() {
  skillsOpen = true;
  renderSkillsWindow();
  skillsWindowEl.classList.remove("hidden");
  skillsWindowEl.setAttribute("aria-hidden", "false");

  // Slipp input umiddelbart
  held.up = held.down = held.left = held.right = false;
  lastIntent = null;

  closeContextMenu?.();
}

function closeSkillsWindow() {
  skillsOpen = false;
  skillsWindowEl.classList.add("hidden");
  skillsWindowEl.setAttribute("aria-hidden", "true");

  held.up = held.down = held.left = held.right = false;
  lastIntent = null;
}


// -------------------- INVENTORY --------------------
const INV_COLS = 4;
const INV_ROWS = 5;
const INV_SIZE = INV_COLS * INV_ROWS;

// inventory = array med lengde 20, hvert element er enten null eller item-objekt
// item-objekt: { id: "potion", name: "Potion", icon: "assets/items/potion.png" }
let inventory = Array(INV_SIZE).fill(null);

const ITEM_DEFS = {
  coins: {
    id: "coins",
    name: "Coins",
    icon: "assets/items/coin.png",      // <- lag dette bildet i assets, eller bytt til noe du har
    type: "currency",
    description: "Shiny coins used for trading.",
    stackable: true,
  },
  copperBar: {
    id: "copperBar",
    name: "Copper Bar",
    icon: "assets/items/metals/copperBar.png",
    type: "misc",
    description: "Used for trading and crafting.",
    stackable: true,
    max_stack: 10,
  },
  copperOre: {
    id: "copperOre",
    name: "Copper Ore",
    icon: "assets/items/metals/copperOre.png",
    type: "misc",
    description: "A chunk of copper ore.",
    stackable: true,
    max_stack: 50,
  },
  tinBar: {
    id: "tinBar",
    name: "Tin Bar",
    icon: "assets/items/metals/tinBar.png",
    type: "misc",
    description: "Used for trading and crafting.",
    stackable: true,
    max_stack: 10,
  },
  tinOre: {
    id: "tinOre",
    name: "Tin Ore",
    icon: "assets/items/metals/tinOre.png",
    type: "misc",
    description: "A chunk of tin ore.",
    stackable: true,
    max_stack: 50,
  },
  bronzeBar: {
    id: "bronzeBar",
    name: "Bronze Bar",
    icon: "assets/items/metals/bronzeBar.png",
    type: "misc",
    description: "Used for trading and crafting.",
    stackable: true,
    max_stack: 10,
  },

  woodLog: {
    id: "woodLog",
    name: "Wood Log",
    icon: "assets/items/woodLog.png",
    type: "misc",
    description: "Log from a cut down tree.",
    stackable: true,
    max_stack: 10,
  },

  pickaxe: {
    id: "pickaxe",
    name: "Pickaxe",
    icon: "assets/items/tools/pickaxe.png",
    fxSprite: "assets/items/tools/pickaxe.png",
    type: "tool",
    description: "A pickaxe for mining rocks.",
    toolActions: ["mining"],
    stackable: false,
  },

  axe: {
    id: "axe",
    name: "Axe",
    icon: "assets/items/tools/axe.png",
    fxSprite: "assets/items/tools/axe.png", 
    type: "tool",
    description: "Axe for chopping trees.",
    toolActions: ["woodcutting"],
    stackable: false,
  },

  fishingRod: {
    id: "fishingRod",
    name: "Fishing Rod",
    icon: "assets/items/tools/fishingRod.png",
    fxSprite: "assets/items/tools/fishingRod.png",
    type: "tool",
    description: "A fishing rod for catching fish.",
    toolActions: ["fishing"],
    stackable: false,
  },

  scroll: {
    id: "scroll",
    name: "Old Scroll",
    icon: "assets/ui/inventoryScroll.png",
    type: "misc",
    description: "An ancient scroll filled with faded runes.",
    stackable: false,
  },

  skelKnife: {
    id: "skelKnife",
    name: "Skeleton Knife",
    icon: "assets/items/skelKnife.png",
    fxSprite: "assets/items/skelKnife.png",
    type: "weapon",
    strength: 2,
    description: "A skeleton knife.",
    stackable: false,
  },

  club: {
    id: "club",
    name: "Club",
    icon: "assets/items/club.png",
    fxSprite: "assets/items/club.png",
    type: "weapon",
    strength: 1,
    enemyMaxHitMod: -1, 
    enemyHitChanceMod: -2, 
    description: "An ordinary club, BONK!.",
    stackable: false,
  },

  bronzeArmor: {
    id: "bronzeArmor",
    name: "Bronze Armor",
    icon: "assets/items/armor/bronze_armor_icon.png",
    type: "armor",
    description: "A sturdy set of bronze armor.",
    enemyMaxHitMod: -1, 
    enemyHitChanceMod: -2,  
    stackable: false,
    playerAnimsByGender: {
      male: {
        down: {
          idle: [ 
            "assets/armor/metals/bronze_armor/male/bronze_armor_down.png",
            "assets/armor/metals/bronze_armor/male/bronze_armor_down_idle.png",
          ],
          walk: [
            "assets/armor/metals/bronze_armor/male/bronze_armor_down_run_1.png",
            "assets/armor/metals/bronze_armor/male/bronze_armor_down_run_2.png",
          ],
        },
        up: {
          idle: [  
            "assets/armor/metals/bronze_armor/male/bronze_armor_up.png",
            "assets/armor/metals/bronze_armor/male/bronze_armor_up_idle.png",
          ],
          walk: [
            "assets/armor/metals/bronze_armor/male/bronze_armor_up_run_1.png",
            "assets/armor/metals/bronze_armor/male/bronze_armor_up_run_2.png",
          ],
        },
        left: {
          idle: [ 
            "assets/armor/metals/bronze_armor/male/bronze_armor_left.png",
            "assets/armor/metals/bronze_armor/male/bronze_armor_left_idle.png",
          ],
          walk: [
            "assets/armor/metals/bronze_armor/male/bronze_armor_left_run_1.png",
            "assets/armor/metals/bronze_armor/male/bronze_armor_left_idle.png",
          ],
        },
        right: {
          idle: [ 
            "assets/armor/metals/bronze_armor/male/bronze_armor_right.png",
            "assets/armor/metals/bronze_armor/male/bronze_armor_right_idle.png",
          ],
          walk: [
            "assets/armor/metals/bronze_armor/male/bronze_armor_right_run_1.png",
            "assets/armor/metals/bronze_armor/male/bronze_armor_right_idle.png",
          ],
        },
      },
      
      female: {
        down: {
          idle: [ 
            "assets/armor/metals/bronze_armor/female/bronze_armor_down.png",
            "assets/armor/metals/bronze_armor/female/bronze_armor_down_idle.png",
          ],
          walk: [
            "assets/armor/metals/bronze_armor/female/bronze_armor_down_run_1.png",
            "assets/armor/metals/bronze_armor/female/bronze_armor_down.png",
          ],
        },
        up: {
          idle: [  
            "assets/armor/metals/bronze_armor/female/bronze_armor_up.png",
            "assets/armor/metals/bronze_armor/female/bronze_armor_up_idle.png",
          ],
          walk: [
            "assets/armor/metals/bronze_armor/female/bronze_armor_up_run_1.png",
            "assets/armor/metals/bronze_armor/female/bronze_armor_up_run_2.png",
          ],
        },
        left: {
          idle: [ 
            "assets/armor/metals/bronze_armor/female/bronze_armor_left.png",
            "assets/armor/metals/bronze_armor/female/bronze_armor_left_idle.png",
          ],
          walk: [
            "assets/armor/metals/bronze_armor/female/bronze_armor_left_run_1.png",
            "assets/armor/metals/bronze_armor/female/bronze_armor_left_idle.png",
          ],
        },
        right: {
          idle: [ 
            "assets/armor/metals/bronze_armor/female/bronze_armor_right.png",
            "assets/armor/metals/bronze_armor/female/bronze_armor_right_idle.png",
          ],
          walk: [
            "assets/armor/metals/bronze_armor/female/bronze_armor_right_run_1.png",
            "assets/armor/metals/bronze_armor/female/bronze_armor_right_idle.png",
          ],
        },
      },
    },
  },


  //===================FOOD===================

  apple: {
    id: "apple",
    name: "Apple",
    icon: "assets/items/consumables/food/apple.png",
    description: "Used to eat and cook.",
    stackable: false,
    consumable: true,
    foodPoints: 1,
    foodCooldownMs: 20000,
  },

  meat_raw: {
    id: "meat_raw",
    name: "Raw Meat",
    icon: "assets/items/consumables/food/meat_raw.png",
    description: "Taste better cooked.",
    stackable: false,
    consumable: true,
    foodPoints: 1,
    foodCooldownMs: 50000,
  },

  meat_cooked: {
    id: "meat_cooked",
    name: "Cooked Meat",
    icon: "assets/items/consumables/food/meat_cooked.png",
    description: "Used to eat and cook.",
    stackable: false,
    consumable: true,
    foodPoints: 2,
    foodCooldownMs: 20000,
  },

  shrimp_raw: {
    id: "shrimp_raw",
    name: "Shrimp",
    icon: "assets/items/consumables/food/ocean/shrimp_raw.png",
    consumable: true,
    foodPoints: 1,
    foodCooldownMs: 20000,
    description: "Happy living shrimp.",
    stackable: false,
  },

  shrimp_cooked: {
    id: "shrimp_cooked",
    name: "Cooked Shrimp",
    icon: "assets/items/consumables/food/ocean/shrimp_cooked.png",
    consumable: true,
    foodPoints: 2,
    foodCooldownMs: 10000,
    description: "Sad cooked shrimp.",
    stackable: false,
  },

};

function normalizeInventory(arr) {
  const out = Array(INV_SIZE).fill(null);
  if (Array.isArray(arr)) {
    for (let i = 0; i < Math.min(arr.length, INV_SIZE); i++) {
      const it = arr[i];
      if (!it) continue;

      if (typeof it === "object" && typeof it.id === "string") {
        const def = ITEM_DEFS[it.id];
        if (!def) continue; // <- dropp ukjente items

        const qty = Number.isFinite(it.qty) ? Math.max(1, Math.floor(it.qty)) : 1;
        out[i] = { ...def, qty };
      }
    }
  }
  return out;
}

function addItemToInventory(itemId, qty = 1) {
  const def = ITEM_DEFS[itemId];
  if (!def) return false;

  let remaining = Math.max(1, Math.floor(qty || 1));
  const maxStack = def.stackable ? (def.max_stack ?? 999999) : 1;

  // fyll eksisterende stacks først
  for (let i = 0; i < inventory.length && remaining > 0; i++) {
    const slot = inventory[i];
    if (slot && slot.id === itemId && slot.qty < maxStack) {
      const space = maxStack - slot.qty;
      const add = Math.min(space, remaining);
      slot.qty += add;
      remaining -= add;
    }
  }

  // legg i nye slots
  for (let i = 0; i < inventory.length && remaining > 0; i++) {
    if (inventory[i] === null) {
      const add = Math.min(maxStack, remaining);
      inventory[i] = { ...def, qty: add };
      remaining -= add;
    }
  }

  renderInventoryWindow();
  saveGame?.();

  // true hvis alt fikk plass
  return remaining === 0;
}


// -------------------- BANK --------------------
const BANK_SIZE = 500;
let bank = Array(BANK_SIZE).fill(null);

function normalizeBank(arr) {
  const out = Array(BANK_SIZE).fill(null);
  if (Array.isArray(arr)) {
    for (let i = 0; i < Math.min(arr.length, BANK_SIZE); i++) {
      const it = arr[i];
      if (!it) continue;

      if (typeof it === "object" && typeof it.id === "string") {
        const def = ITEM_DEFS[it.id];
        if (!def) continue;

        const qty = Number.isFinite(it.qty) ? Math.max(1, Math.floor(it.qty)) : 1;
        out[i] = { ...def, qty };
      }
    }
  }
  return out;
}

let bankOpen = false;
let bankNpcRef = null;

function renderBankWindow() {
  if (!bankGridEl) return;

  bankGridEl.innerHTML = "";

  for (let i = 0; i < BANK_SIZE; i++) {
    const slot = document.createElement("div");
    slot.className = "bank-slot";
    slot.dataset.slot = String(i);

    // drag-drop swap bank slots
    slot.addEventListener("dragover", (e) => e.preventDefault());
    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      const from = Number(e.dataTransfer.getData("text/bank-from"));
      const to = Number(slot.dataset.slot);
      if (!Number.isFinite(from) || !Number.isFinite(to) || from === to) return;
      void swapBankSlotsServer(from, to);
    });

    const it = bank[i];
    if (it) {
      const itemEl = document.createElement("div");
      itemEl.className = "bank-item";
      itemEl.draggable = true;
      itemEl.dataset.slot = String(i);

      const img = document.createElement("img");
      img.src = it.icon;
      img.alt = it.name;
      itemEl.appendChild(img);

      if (it.stackable && (it.qty || 1) > 1) {
        const q = document.createElement("div");
        q.className = "bank-qty";
        q.textContent = String(it.qty);
        itemEl.appendChild(q);
      }

      itemEl.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/bank-from", String(i));
        e.dataTransfer.effectAllowed = "move";
      });

      // høyreklikk bank item -> Withdraw
      itemEl.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const entries = [
          { label: "Withdraw 1", onClick: () => void bankTransferServer("bank", i, 1) },
          { label: "Withdraw 10", onClick: () => void bankTransferServer("bank", i, 10) },
          { label: "Withdraw all", onClick: () => void bankTransferServer("bank", i, 0) },
          {
            label: "Examine",
            onClick: () => {
              const desc = it.description || "No information.";
              const stats = formatItemStats(it);
              logMessage(`${it.name}: ${desc}${stats}`, "system");
            }
          },
        ];

        openContextMenu(e.clientX, e.clientY, it.name, entries);
      });

      slot.appendChild(itemEl);
    }

    bankGridEl.appendChild(slot);
  }
}

function openBankForNpc(npc) {
  if (!npc || !npc.banker) return;
  bankOpen = true;
  bankNpcRef = npc;

  // Typisk MMO: bank + inv samtidig
  openInventoryWindow();

  renderBankWindow();
  bankWindowEl.classList.remove("hidden");
  bankWindowEl.setAttribute("aria-hidden", "false");

  held.up = held.down = held.left = held.right = false;
  lastIntent = null;

  closeContextMenu?.();
}

function closeBankWindow() {
  bankOpen = false;
  bankNpcRef = null;

  bankWindowEl.classList.add("hidden");
  bankWindowEl.setAttribute("aria-hidden", "true");
  closeContextMenu?.();
}

btnBankClose?.addEventListener("click", closeBankWindow);


function normalizeChance(chance) {
  // Støtter både 0..1 og 0..100
  if (typeof chance !== "number" || !Number.isFinite(chance)) return 0;
  if (chance <= 0) return 0;
  if (chance > 1) return Math.min(1, chance / 100);
  return Math.min(1, chance);
}

function randInt(min, max) {
  const a = Math.floor(min);
  const b = Math.floor(max);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 1;
  if (b <= a) return a;
  return a + Math.floor(Math.random() * (b - a + 1));
}

function giveItemToInventoryOrLose(itemId, npcName = "Enemy") {
  const ok = addItemToInventory(itemId);
  if (!ok) {
    // Siden vi ikke har items på bakken: vi mister looten hvis inventory er full
    logMessage(`No inventory space — you lose ${itemId} from ${npcName}.`, "error");
  }
  return ok;
}


let inventoryOpen = false;

function renderInventoryWindow() {
  if (!inventoryGridEl) return;

  inventoryGridEl.innerHTML = "";

  for (let i = 0; i < INV_SIZE; i++) {
    const slot = document.createElement("div");
    slot.className = "inv-slot";
    slot.dataset.slot = String(i);

    // Drop handlers (usynlig slot, men tar imot drop)
    slot.addEventListener("dragover", (e) => {
      e.preventDefault(); // må til for at drop skal funke
    });

    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      const from = Number(e.dataTransfer.getData("text/inv-from"));
      const to = Number(slot.dataset.slot);

      if (!Number.isFinite(from) || !Number.isFinite(to)) return;
      if (from === to) return;

      //bytt slot
      void swapInventorySlotsServer(from, to);
    });

    const it = inventory[i];
    if (it) {
      const itemEl = document.createElement("div");
      itemEl.className = "inv-item";
      itemEl.draggable = true;
      itemEl.dataset.slot = String(i);

      const img = document.createElement("img");
      img.src = it.icon;
      img.alt = it.name;
      itemEl.appendChild(img);

      // Vis antall hvis stackable
      if (it.stackable && (it.qty || 1) > 1) {
        const q = document.createElement("div");
        q.className = "inv-qty";
        q.textContent = String(it.qty);
        itemEl.appendChild(q);
      }

      // drag start
      itemEl.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/inv-from", String(i));
        // litt bedre “feel”
        e.dataTransfer.effectAllowed = "move";
      });

      // høyreklikk item -> context menu -> Examine / Destroy
      itemEl.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const desc = it.description || "No information.";

        const entries = [];

        // Equip bare hvis riktig type
        if (EQUIP_SLOTS.includes(it.type)) {
          entries.push({
            label: "Equip",
            onClick: () => {
              equipFromInventory(i);
            }
          });
        }

        // Eat/Drink (consumable)
        if (it.consumable) {
          entries.push({
            label: "Consume",
            onClick: () => {
              void consumeFromInventoryServer(i);
            }
          });
        }

        entries.push({
          label: "Examine",
          onClick: () => {
            const stats = formatItemStats(it);
            logMessage(`${it.name}: ${desc}${stats}`, "system");
          }
        });

        // Bank transfer entries (kun når bank er åpen)
        if (bankOpen) {
          entries.push(
            { label: "Transfer 1", onClick: () => void bankTransferServer("inventory", i, 1) },
            { label: "Transfer 10", onClick: () => void bankTransferServer("inventory", i, 10) },
            { label: "Transfer all", onClick: () => void bankTransferServer("inventory", i, 0) },
          );
        }

        if (it.stackable && (it.qty || 1) > 1) {
          entries.push({
            label: "Destroy 1",
            onClick: () => {
              void destroyInventorySlotServer(i, 1);
            }
          });

          entries.push({
            label: "Destroy all",
            onClick: () => {
              void destroyInventorySlotServer(i, 0); // 0 = all
            }
          });
        } else {
          entries.push({
            label: "Destroy",
            onClick: () => {
              void destroyInventorySlotServer(i, 0);
            }
          });
        }

        openContextMenu(e.clientX, e.clientY, it.name, entries);
      });

      slot.appendChild(itemEl);
    }

    inventoryGridEl.appendChild(slot);
  }
}

function openInventoryWindow() {
  if (!inventoryWindowEl) return;

  inventoryOpen = true;
  renderInventoryWindow();

  inventoryWindowEl.classList.remove("hidden");
  inventoryWindowEl.setAttribute("aria-hidden", "false");

  closeContextMenu?.();
}

function closeInventoryWindow() {
  if (!inventoryWindowEl) return;

  inventoryOpen = false;
  inventoryWindowEl.classList.add("hidden");
  inventoryWindowEl.setAttribute("aria-hidden", "true");

  closeContextMenu?.();
}

function toggleInventoryWindow() {
  if (!gameStarted) return;
  inventoryOpen ? closeInventoryWindow() : openInventoryWindow();
}


// -------------------- BIG MAP --------------------


function setMapOpen(open) {
  mapOpen = !!open;
  if (!mapWindowEl) return;

  mapWindowEl.classList.toggle("hidden", !mapOpen);
  mapWindowEl.setAttribute("aria-hidden", mapOpen ? "false" : "true");

  if (mapOpen) {
    resizeMapCanvas();
    buildMapCacheIfNeeded();
    drawWorldMap();
  }
}

function toggleMap() {
  setMapOpen(!mapOpen);
}

function resizeMapCanvas() {
  if (!mapCanvas || !mapCtx) return;

  const rect = mapCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  // faktisk oppløsning (skarpere)
  mapCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
  mapCanvas.height = Math.max(1, Math.floor(rect.height * dpr));

  mapCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  mapCtx.imageSmoothingEnabled = false;
}


function drawFullLayerToCtx(targetCtx, grid, flagsGrid) {
  if (!grid) return;

  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      const key = tileAtLayer(grid, x, y);
      const flags = flagsGrid ? tileAtLayer(flagsGrid, x, y) : 0;
      if (!key || key === EMPTY) continue;

      const def = TILE_DEFS[key];
      const imgOrFrames = tileImages[key];
      if (!imgOrFrames) continue;

      // Kart-cache: vi bruker alltid “første frame” på animasjoner (perf + ryddig kart)
      if (def?.animated && Array.isArray(imgOrFrames)) {
        targetCtx.drawImage(imgOrFrames[0], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        continue;
      }

      if (def?.animated && typeof def.frames === "number" && imgOrFrames instanceof Image) {
        targetCtx.drawImage(
          imgOrFrames,
          0, 0, TILE_SIZE, TILE_SIZE,
          x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE
        );
        continue;
      }

      if (imgOrFrames instanceof Image) {
        const dx = x * TILE_SIZE;
        const dy = y * TILE_SIZE;

        targetCtx.save();
        const transformed = applyTiledFlagsTransform(targetCtx, flags, dx, dy, TILE_SIZE, TILE_SIZE);
        if (transformed) targetCtx.drawImage(imgOrFrames, 0, 0, TILE_SIZE, TILE_SIZE);
        else targetCtx.drawImage(imgOrFrames, dx, dy, TILE_SIZE, TILE_SIZE);
        targetCtx.restore();
      }
    }
  }
}

function buildMapCacheIfNeeded() {
  // du har alltid "level" i spillet ditt (bredde/høyde osv)
  if (!level) return;

  // Finn et “level id” vi kan sammenligne på. (bruk det du faktisk har)
  const levelId = level.id || level.name || levelIdCurrent || "unknown";

  if (mapCache && mapCache.levelId === levelId) return;

  // bygg ny cache
  const off = document.createElement("canvas");
  off.width = level.width * TILE_SIZE;
  off.height = level.height * TILE_SIZE;

  const offCtx = off.getContext("2d");
  offCtx.imageSmoothingEnabled = false;

  // Hvis du har flags-grids, bruk dem. Hvis ikke: null (map.js nivåene har ofte ikke flags)
  const baseFlags = level.grid_base_flags || null;
  const midFlags  = level.grid_mid_flags || null;
  const topFlags  = level.grid_top_flags || null;

  drawFullLayerToCtx(offCtx, level.grid_base, baseFlags);
  drawFullLayerToCtx(offCtx, level.grid_mid,  midFlags);
  drawFullLayerToCtx(offCtx, level.grid_top,  topFlags);

  mapCache = { levelId, canvas: off };
}


function drawWorldMap() {
  if (!mapOpen || !mapCtx || !mapCanvas || !mapCache?.canvas) return;

  const cssW = mapCanvas.getBoundingClientRect().width;
  const cssH = mapCanvas.getBoundingClientRect().height;

  const PAD = 121; // TUNE: tilsvarer tykkelsen på ramma di
  const innerW = Math.max(1, cssW - PAD * 2);
  const innerH = Math.max(1, cssH - PAD * 2);

  // clear
  mapCtx.clearRect(0, 0, cssW, cssH);

  const worldW = level.width * TILE_SIZE;
  const worldH = level.height * TILE_SIZE;

  const scale = Math.min(innerW / worldW, innerH / worldH);
  const drawW = worldW * scale;
  const drawH = worldH * scale;

  const ox = Math.floor((innerW - drawW) / 2) + PAD;
  const oy = Math.floor((innerH - drawH) / 2) + PAD;

  // tegn cached map
  mapCtx.drawImage(mapCache.canvas, ox, oy, drawW, drawH);

  // spiller-prikk
  const px = (player.px + TILE_SIZE / 2) * scale + ox;
  const py = (player.py + TILE_SIZE / 2) * scale + oy;

  mapCtx.save();
  mapCtx.beginPath();
  mapCtx.arc(px, py, Math.max(2, 3 * scale), 0, Math.PI * 2);
  mapCtx.fillStyle = "rgba(255,255,255,0.95)";
  mapCtx.fill();
  mapCtx.restore();
}



// -------------------- SHOP --------------------

let shopOpen = false;
let shopNpcRef = null; 

function getCoinStackIndex() {
  return inventory.findIndex(it => it && it.id === "coins" && it.stackable);
}

function getCoinCount() {
  const idx = getCoinStackIndex();
  if (idx === -1) return 0;
  return Math.max(0, Math.floor(inventory[idx].qty || 0));
}

function spendCoins(amount) {
  const cost = Math.max(0, Math.floor(amount || 0));
  if (cost <= 0) return true;

  const idx = getCoinStackIndex();
  if (idx === -1) return false;

  const have = Math.max(0, Math.floor(inventory[idx].qty || 0));
  if (have < cost) return false;

  const left = have - cost;
  if (left <= 0) inventory[idx] = null;
  else inventory[idx].qty = left;

  renderInventoryWindow();
  saveGame?.();
  return true;
}

function openShopForNpc(npc) {
  if (!npc || !npc.trader) return;

  shopOpen = true;
  shopNpcRef = npc;

  renderShopWindow();

  shopWindowEl.classList.remove("hidden");
  shopWindowEl.setAttribute("aria-hidden", "false");

  // slipp input
  held.up = held.down = held.left = held.right = false;
  lastIntent = null;

  closeContextMenu?.();
}

function closeShopWindow() {
  shopOpen = false;
  shopNpcRef = null;

  shopWindowEl.classList.add("hidden");
  shopWindowEl.setAttribute("aria-hidden", "true");
}

function renderShopWindow() {
  if (!shopListEl || !shopNpcRef) return;

  const npc = shopNpcRef;
  const coins = getCoinCount();

  if (shopTitleEl) shopTitleEl.textContent = `${npc.name}'s Shop`;
  if (shopCoinsEl) shopCoinsEl.textContent = `Coins: ${coins}`;

  shopListEl.innerHTML = "";

  const stock = Array.isArray(npc.shop) ? npc.shop : [];
  for (const s of stock) {
    const def = ITEM_DEFS[s.itemId];
    if (!def) continue;

    const costList = getShopCosts(s);
    const costText = formatCostsText(costList);

    const row = document.createElement("div");
    row.className = "shop-row";

    const img = document.createElement("img");
    img.src = def.icon;
    img.alt = def.name;

    const meta = document.createElement("div");
    meta.className = "shop-meta";
    const desc = def.description || "No information.";

    const statsRaw = formatItemStats(def).trim(); // "(STR: +1)" eller ""
    const statsText = statsRaw ? statsRaw.replace(/^\(|\)$/g, "") : ""; // "STR: +1"

    meta.innerHTML = `
      <div class="shop-name">${def.name}</div>
      <div class="shop-price">price: ${costText}</div>
      <div class="shop-desc">${desc}</div>
      ${statsText ? `<div class="shop-stats">${statsText}</div>` : ""}
    `;

    const buy = document.createElement("button");
    buy.className = "shop-buy";
    buy.type = "button";
    buy.textContent = "Buy";
    buy.disabled = !canAffordCost(costList);

    buy.addEventListener("click", async () => {
      const ok = await shopBuyServer(npc.id, def.id, 1);
      if (ok) {
        // knapp-state / coins-text oppdateres når vi rerender
        renderShopWindow();
      }
    });


    row.appendChild(img);
    row.appendChild(meta);
    row.appendChild(buy);

    shopListEl.appendChild(row);
  }
}

btnShopClose?.addEventListener("click", () => {
  closeShopWindow();
});

function countItemInInventory(itemId) {
  let total = 0;
  for (const it of inventory) {
    if (!it || it.id !== itemId) continue;
    if (it.stackable) total += Math.max(1, Math.floor(it.qty || 1));
    else total += 1;
  }
  return total;
}

// Fjerner qty av et item fra inventory (stackable: trekk fra qty, ellers fjern slots)
// Returnerer true hvis det gikk, false hvis du ikke hadde nok
function removeItemsFromInventory(itemId, qty) {
  let need = Math.max(1, Math.floor(qty || 1));

  if (countItemInInventory(itemId) < need) return false;

  // 1) trekk fra stackables først (hvis finnes)
  for (let i = 0; i < inventory.length && need > 0; i++) {
    const it = inventory[i];
    if (!it || it.id !== itemId || !it.stackable) continue;

    const have = Math.max(1, Math.floor(it.qty || 1));
    const take = Math.min(have, need);
    const left = have - take;

    if (left <= 0) inventory[i] = null;
    else inventory[i].qty = left;

    need -= take;
  }

  // 2) fjern non-stackable slots
  for (let i = 0; i < inventory.length && need > 0; i++) {
    const it = inventory[i];
    if (!it || it.id !== itemId) continue;
    if (it.stackable) continue;

    inventory[i] = null;
    need -= 1;
  }

  renderInventoryWindow();
  saveGame?.();
  return true;
}

function normalizeShopCost(entry) {
  // Nytt format: cost: { itemId, qty }
  if (entry?.cost && typeof entry.cost === "object") {
    const id = entry.cost.itemId;
    const qty = Math.max(1, Math.floor(entry.cost.qty || 1));
    return [{ itemId: id, qty }];
  }

  // Bakoverkompatibel: price => coins
  const price = Math.max(0, Math.floor(entry?.price || 0));
  return [{ itemId: "coins", qty: price }];
}

function formatCostText(costList) {
  // f.eks. "20 Coins" eller "3 Club"
  return costList
    .map(c => {
      const name = ITEM_DEFS[c.itemId]?.name || c.itemId;
      return `${c.qty} ${name}`;
    })
    .join(" + ");
}

function canAffordCost(costList) {
  return costList.every(c => countItemInInventory(c.itemId) >= c.qty);
}

function getShopCosts(entry) {

  const out = [];

  if (Array.isArray(entry?.costs)) {
    for (const c of entry.costs) {
      const id = c?.itemId;
      const qty = Number(c?.qty);
      if (id && Number.isFinite(qty) && qty > 0) out.push({ itemId: id, qty });
    }
    return out;
  }

  // Gammel: entry.cost = {itemId, qty}
  if (entry?.cost?.itemId) {
    const qty = Number(entry.cost.qty ?? 1);
    out.push({ itemId: entry.cost.itemId, qty: Number.isFinite(qty) && qty > 0 ? qty : 1 });
  }

  if (entry?.cost_item_id_2) {
    const qty2 = Number(entry.cost_qty_2 ?? 1);
    out.push({ itemId: entry.cost_item_id_2, qty: Number.isFinite(qty2) && qty2 > 0 ? qty2 : 1 });
  }

  return out;
}

function formatCostsText(costs) {
  if (!Array.isArray(costs) || costs.length === 0) return "Free";

  return costs
    .map(c => {
      const def = ITEM_DEFS?.[c.itemId];
      const name = def?.name || c.itemId;
      return `${c.qty} ${name}`;
    })
    .join(" + ");
}

// -------------------- STATIC SHOPS (tile-based) --------------------
const STATIC_SHOPS = {
  campfire_01: {
    id: "campfire_01",
    name: "Campfire",
    shop: [
      {
        itemId: "meat_cooked",
        costs: [
          { itemId: "meat_raw", qty: 1 },
          { itemId: "woodLog", qty: 1 },
        ],
      },
    ],
  },
};

function openShopForStaticShopId(shopId) {
  const s = STATIC_SHOPS[shopId];
  if (!s) {
    logMessage("This object doesn't have a shop.", "system");
    return;
  }

  // Vi bruker samme shop UI som NPC-shop, men med en "fake npc ref"
  shopOpen = true;
  shopNpcRef = { id: s.id, name: s.name, trader: true, shop: s.shop };

  renderShopWindow();
  shopWindowEl.classList.remove("hidden");
  shopWindowEl.setAttribute("aria-hidden", "false");

  // slipp input
  held.up = held.down = held.left = held.right = false;
  lastIntent = null;

  closeContextMenu?.();
}



// -------------------- EQUIPPED STAT HELPERS --------------------
// Summer en numerisk stat fra alle equipped items (weapon/armor/ring/tool)
function getEquippedStatSum(statKey) {
  let sum = 0;
  for (const slot of EQUIP_SLOTS) {
    const it = equipped?.[slot];
    if (!it) continue;
    const v = it[statKey];
    if (typeof v === "number" && Number.isFinite(v)) sum += v;
  }
  return sum;
}

// Støtter at du skriver -10 (prosent) eller -0.10 (desimal)
function normalizeChanceDelta(v) {
  if (typeof v !== "number" || !Number.isFinite(v)) return 0;
  // hvis folk skriver 10/-10 osv -> tolk som prosent
  if (Math.abs(v) > 1) return v / 100;
  return v;
}

function getEnemyHitChanceMod() {
  return normalizeChanceDelta(getEquippedStatSum("enemyHitChanceMod"));
}

function getEnemyMaxHitMod() {
  // maxHit-mod er vanligvis heltall
  return Math.floor(getEquippedStatSum("enemyMaxHitMod"));
}


// -------------------- STRENGTH --------------------
const BASE_STRENGTH = 1;

function getEquippedStrengthBonus() {
  let bonus = 0;
  for (const slot of EQUIP_SLOTS) {
    const it = equipped?.[slot];
    if (!it) continue;
    if (typeof it.strength === "number" && Number.isFinite(it.strength)) {
      bonus += it.strength;
    }
  }
  return bonus;
}

function getPlayerStrength() {
  return BASE_STRENGTH + getEquippedStrengthBonus();
}

function getPlayerHitRange() {
  const str = getPlayerStrength();
  const minHit = Math.max(1, Math.floor(str - 1));
  const maxHit = Math.max(minHit, Math.floor(str + 1));
  return { minHit, maxHit, str };
}

function randIntInclusive(min, max) {
  const a = Math.floor(min);
  const b = Math.floor(max);
  if (b <= a) return a;
  return a + Math.floor(Math.random() * (b - a + 1));
}

function formatItemStats(it) {
  if (!it || typeof it !== "object") return "";

  const parts = [];

  if (typeof it.strength === "number" && Number.isFinite(it.strength) && it.strength !== 0) {
    const sign = it.strength > 0 ? "+" : "";
    parts.push(`STR: ${sign}${it.strength}`);
  }

  // Enemy hit chance modifier (display i %)
  if (typeof it.enemyHitChanceMod === "number" && Number.isFinite(it.enemyHitChanceMod) && it.enemyHitChanceMod !== 0) {
    const delta = (Math.abs(it.enemyHitChanceMod) > 1) ? it.enemyHitChanceMod : (it.enemyHitChanceMod * 100);
    const sign = delta > 0 ? "+" : "";
    parts.push(`E-HITCHANCE: ${sign}${Math.round(delta)}%`);
  }

  // Enemy max hit modifier
  if (typeof it.enemyMaxHitMod === "number" && Number.isFinite(it.enemyMaxHitMod) && it.enemyMaxHitMod !== 0) {
    const sign = it.enemyMaxHitMod > 0 ? "+" : "";
    parts.push(`E-MAXHIT: ${sign}${it.enemyMaxHitMod}`);
  }


  // (senere kan du legge til flere stats her, f.eks. DEF, ACC, osv.)
  return parts.length ? ` (${parts.join(", ")})` : "";
}


// -------------------- EQUIPMENT --------------------
const EQUIP_SLOTS = ["tool", "weapon", "armor", "ring"];

let equipped = {
  tool: null,
  weapon: null,
  armor: null,
  ring: null,
};

function normalizeEquipped(obj) {
  const out = { tool: null, weapon: null, armor: null, ring: null };
  if (!obj || typeof obj !== "object") return out;

  for (const k of EQUIP_SLOTS) {
    const it = obj[k];
    if (!it) continue;
    if (typeof it === "object" && typeof it.id === "string") {
      const def = ITEM_DEFS[it.id];
      out[k] = def ? { ...def } : { ...it };
    }
  }
  return out;
}

let equipOpen = false;

function renderEquipWindow() {
  if (!equipWindowEl) return;

  const slots = equipWindowEl.querySelectorAll(".equip-slot");
  slots.forEach(slotEl => {
    const key = slotEl.dataset.eq;
    slotEl.innerHTML = "";

    const it = equipped[key];
    if (!it) return;

    const wrap = document.createElement("div");
    wrap.className = "eq-item";

    const img = document.createElement("img");
    img.src = it.icon;
    img.alt = it.name;
    wrap.appendChild(img);

    // (valgfritt men nyttig) høyreklikk på equipped item -> examine + unequip
    wrap.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const desc = it.description || "No information.";
      openContextMenu(e.clientX, e.clientY, it.name, [
        {
          label: "Examine",
          onClick: () => {
            const stats = formatItemStats(it);
            logMessage(`${it.name}: ${desc}${stats}`, "system");
          },
        },
        {
          label: "Unequip",
          onClick: () => {
            const idx = inventory.findIndex(s => s === null);
            if (idx === -1) {
              logMessage("Inventory is full.", "error");
              return;
            }
            void unequipToInventoryServer(key, idx);
            if (skillsOpen) renderSkillsWindow();
          },
        }
      ]);
    });

    slotEl.appendChild(wrap);
  });

  // ---- Player stats (shown in equipment window) ----
  if (equipStatsEl) {
    const maxHp = player?.maxHp ?? 0;
    const { maxHit } = getPlayerHitRange();
    const hitChancePct = Math.round(getPlayerHitChance() * 100);

    equipStatsEl.innerHTML = `
      <div class="row"><span class="label">Max health</span><span class="value">${maxHp}</span></div>
      <div class="row"><span class="label">Max hit</span><span class="value">${maxHit}</span></div>
      <div class="row"><span class="label">Hit chance</span><span class="value">${hitChancePct}%</span></div>
    `;
  }

}

function openEquipWindow() {
  if (!equipWindowEl) return;
  equipOpen = true;

  renderEquipWindow();
  equipWindowEl.classList.remove("hidden");
  equipWindowEl.setAttribute("aria-hidden", "false");

  closeContextMenu?.();
}

function closeEquipWindow() {
  if (!equipWindowEl) return;
  equipOpen = false;

  equipWindowEl.classList.add("hidden");
  equipWindowEl.setAttribute("aria-hidden", "true");

  closeContextMenu?.();
}

function toggleEquipWindow() {
  if (!gameStarted) return;
  equipOpen ? closeEquipWindow() : openEquipWindow();
}

// Equip fra inventory index
function equipFromInventory(invIndex) {
  const it = inventory[invIndex];
  if (!it) return;

  const slot = it.type; // weapon/armor/tool/ring
  if (!EQUIP_SLOTS.includes(slot)) return;

  void equipFromInventoryServer(invIndex, slot);
}



// -------------------- COMBAT (tick) --------------------
const combat = {
  active: false,
  targetId: null,
  targetRef: null,       // peker på npc-objektet i level.npcs
  nextPlayerHitAt: 0,
  nextEnemyHitAt: 0,
};

const PLAYER_COMBAT = {
  attackSpeedMs: 3000,

};


// -------------------- MAX HP (derived from combat level) --------------------
// Design: starts at 6 HP at combat lvl 1.
// Smooth scaling with a hard cap of 100:
// maxHP = min(100, 6 + floor((combatLevel - 1) * 0.8))
function computeMaxHpFromCombatLevel(combatLevel) {
  const L = Math.max(1, Math.floor(Number(combatLevel) || 1));
  const raw = 6 + Math.floor((L - 1) * 0.8);
  return clamp(raw, 1, 100);
}

// --- Enemy regen når combat avsluttes (anti hit-and-run) ---
const ENEMY_DISENGAGE_REGEN_MS = 1200; // hvor fort den går tilbake til full

function renderHpHeart() {
  if (!hpHeartTextEl) return;
  hpHeartTextEl.textContent = String(player.hp ?? 0);
}

function syncDerivedPlayerHpLimits() {
  const combatLvl = Number(skills?.combat?.level) || 1;
  const newMax = computeMaxHpFromCombatLevel(combatLvl);
  player.maxHp = newMax;
  player.hp = clamp(player.hp, 0, player.maxHp);
  renderHpHeart();
}

function startEnemyDisengageRegen(npc, nowMs) {
  if (!npc || npc.dead) return;
  if (typeof npc.maxHp !== "number") return;

  const hp = getNpcHp(npc);
  if (hp >= npc.maxHp) return; // full hp -> ingenting å regen

  npc._regenStartMs = nowMs;
  npc._regenFromHp = hp;
  npc._regenEndMs = nowMs + ENEMY_DISENGAGE_REGEN_MS;
  npc._regenToHp = npc.maxHp;
}

// Kjøres hver frame (i update-loop)
function updateEnemyRegens(nowMs) {
  for (const n of (level.npcs || [])) {
    if (!n || n.dead) continue;
    if (!Number.isFinite(n._regenEndMs)) continue;

    // hvis du angriper den igjen, stopp regen (combat skal styre hp da)
    if (combat.active && combat.targetRef === n) continue;

    const t = (nowMs - n._regenStartMs) / (n._regenEndMs - n._regenStartMs);

    if (t >= 1) {
      setNpcHp(n, n._regenToHp);
      n._regenStartMs = n._regenFromHp = n._regenEndMs = n._regenToHp = null;
    } else if (t >= 0) {
      const newHp = n._regenFromHp + (n._regenToHp - n._regenFromHp) * t;
      setNpcHp(n, Math.ceil(newHp));
    }
  }
}

// -------------------- ENEMY RESPAWN --------------------
const DEFAULT_ENEMY_RESPAWN_MS = 20000;

function getRespawnMs(npc) {
  // kan overrides per enemy i map.js med respawnMs
  return (typeof npc.respawnMs === "number" ? npc.respawnMs : DEFAULT_ENEMY_RESPAWN_MS);
}

function killNpcAndScheduleRespawn(npc, nowMs) {
  npc.dead = true;
  npc._respawnAt = nowMs + getRespawnMs(npc);

  // sett HP til 0 (og nullstill kortvarige visuals)
  setNpcHp(npc, 0);
  npc._hitFlashUntil = 0;
}

// -------------------- COMBAT VISUALS (synced with ticks) --------------------
const COMBAT_VFX = {
  swingMs: 180,     // hvor lenge "swing" vises
  hitFlashMs: 120,  // hvor lenge "blink" vises på den som tar dmg
};

// (valgfritt) hvis du vil bruke et slash-bilde du legger inn selv:
const SLASH_FX_SPRITE = "";
const fxImages = {}; // path -> Image

async function loadFxAssets() {
  // Samle alle fx paths vi vil prøve å laste
  const paths = new Set();

  // default
  paths.add(SLASH_FX_SPRITE);

  // enemy weapons fra map.js (LEVELS)
  for (const lvl of Object.values(LEVELS)) {
    for (const n of (lvl.npcs || [])) {
      if (n?.weaponFxSprite) paths.add(n.weaponFxSprite);
    }
  }

  // player weapon fx fra ITEM_DEFS
  for (const def of Object.values(ITEM_DEFS)) {
    if (def?.fxSprite) paths.add(def.fxSprite);
  }

  // last alt (men tåler at filer mangler)
  for (const p of paths) {
    try {
      fxImages[p] = await loadImage(p);
    } catch {
      // ok at noen ikke finnes mens du bygger assets
    }
  }
}


// liste med aktive fx (slagsveip)
let combatFx = []; 
// element: { startMs, endMs, ax, ay, tx, ty, spritePath }


function isNpcAlive(n) {
  return !!n && !n.dead;
}

function getNpcById(id) {
  return (level.npcs || []).find(n => n.id === id) || null;
}

function getNpcHp(n) {
  // vi lagrer runtime hp i n._hp
  if (typeof n._hp !== "number") n._hp = (typeof n.maxHp === "number" ? n.maxHp : 3);
  return n._hp;
}

function setNpcHp(n, v) {
  n._hp = Math.max(0, v);
}



// -------------------- ACCURACY / MISS --------------------
// Regler:
// - skill level 1..100
// - aldri under 50% hit chance
// - skalerer pent mot lvl 100 (ikke 100%)
// Du kan tweake tallene her uten å røre resten av koden.
const PLAYER_MIN_HIT_CHANCE = 0.70; // 70% ved lavt level
const PLAYER_MAX_HIT_CHANCE = 0.97; // 97% ved lvl 100
const PLAYER_ACCURACY_EXP = 0.70;   // curve: lavere = mer boost tidlig, høyere = senere boost

function rollHitWithChance(maxHit, hitChance) {
  const mh = Math.max(0, Math.floor(maxHit || 0));
  if (mh <= 0) return 0;

  // først: hit/miss
  if (Math.random() > clamp01(hitChance)) return 0;

  // så: damage 1..maxHit
  return 1 + Math.floor(Math.random() * mh);
}

function getPlayerHitChance() {
  const L = Math.max(1, Math.min(100, skills?.combat?.level || 1));
  const t = (L - 1) / 99; // 0..1
  const eased = Math.pow(t, PLAYER_ACCURACY_EXP);

  const chance = PLAYER_MIN_HIT_CHANCE + (PLAYER_MAX_HIT_CHANCE - PLAYER_MIN_HIT_CHANCE) * eased;
  return clamp01(chance);
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

// støtter både 0..1 og 0..100 (så du kan skrive 75 eller 0.75)
function normalizeHitChance(v, fallback = 0.65) {
  if (typeof v !== "number" || !Number.isFinite(v)) return fallback;
  if (v <= 0) return 0;
  if (v > 1) return clamp01(v / 100);
  return clamp01(v);
}

function getNpcHitChance(npc) {
  // npc.hitChance kan settes i map.js
  return normalizeHitChance(npc?.hitChance, 0.65);
}

function rollHit(maxHit) {
  // 0 = miss, ellers 1..maxHit
  const r = Math.floor(Math.random() * (maxHit + 1));
  return r; 
}

function stopCombat(reasonText = null, nowMs = performance.now()) {
  if (!combat.active) return;

  const npc = combat.targetRef || getNpcById(combat.targetId);

  if (reasonText) logMessage(reasonText, "system");

  // Hvis vi forlater combat og fienden lever -> regen raskt til full
  if (npc && npc.hostile && !npc.dead && typeof npc.maxHp === "number") {
    startEnemyDisengageRegen(npc, nowMs);
  }

  combat.active = false;
  combat.targetId = null;
  combat.targetRef = null;
  combat.nextPlayerHitAt = 0;
  combat.nextEnemyHitAt = 0;
}

function startCombat(npc) {
  if (!npc || !npc.hostile) return;
  if (!isNpcAlive(npc)) return;

  // Må stå ved siden av fienden (samme som NPC/dør-reglene du har)
  if (!isAdjacentToPlayer(npc.x, npc.y)) {
    logMessage("You need to stand next to the enemy.", "error");
    return;
  }

  combat.active = true;
  combat.targetId = npc.id;
  combat.targetRef = npc;

  const now = performance.now();
  combat.nextPlayerHitAt = now + 800;
  combat.nextEnemyHitAt = now + 1200;

  logMessage(`You attack ${npc.name}.`, "system");
}

function updateCombat(nowMs) {
  if (!combat.active) return;

  const npc = combat.targetRef || getNpcById(combat.targetId);
  if (!npc || !isNpcAlive(npc)) {
    stopCombat("Target lost.");
    return;
  }

  // Hvis du ikke står ved siden av fienden lenger: stopp combat
  if (!isAdjacentToPlayer(npc.x, npc.y)) {
    stopCombat("You stop fighting.", nowMs);
    return;
  }

  // ---- Player tick ----
  if (nowMs >= combat.nextPlayerHitAt) {
    // SWING FX (uansett hit/miss) – alltid synced med tick
    const pC = playerCenterPx();
    const nC = tileCenterPx(npc.x, npc.y);
    triggerSwing(pC.x, pC.y, nC.x, nC.y, nowMs, getPlayerWeaponFxSprite());

    // 1) Hit chance basert på combat skill
    const hitChance = getPlayerHitChance();

    // 2) Damage range basert på total strength (base + equipped bonuses)
    const { minHit, maxHit } = getPlayerHitRange();

    // 3) Rull hit/miss, og hvis hit: rull damage i minHit..maxHit
    let dmg = 0;
    if (Math.random() <= hitChance) {
      dmg = randIntInclusive(minHit, maxHit);
    } else {
      dmg = 0; // miss
    }

    if (dmg <= 0) {
      logMessage(`You miss ${npc.name}.`, "system");
    } else {
      // HIT FLASH på NPC akkurat når dmg skjer
      triggerNpcHitFlash(npc, nowMs);

      setNpcHp(npc, getNpcHp(npc) - dmg);
      logMessage(`You hit ${npc.name} for ${dmg}.`, "system");

      if (getNpcHp(npc) <= 0) {
        logMessage(`${npc.name} dies.`, "loot");

        // Server-autoritet: først registrer kill (setter last_combat_kill_at),
        // deretter claim loot (leser npc_loot og legger i inventory).
        void (async () => {
          const ok = await grantCombatKillXpServer(npc.id);
          if (ok) {
            await claimNpcLootServer(npc.id, npc.name);
          }
        })();

        killNpcAndScheduleRespawn(npc, nowMs);
        stopCombat(null, nowMs);
        return;
      }
    }

    combat.nextPlayerHitAt = nowMs + PLAYER_COMBAT.attackSpeedMs;
  }

  // ---- Enemy tick ----

  // Enemy stats (fallback hvis de mangler i map.js)
  const enemySpeed = typeof npc.attackSpeedMs === "number" ? npc.attackSpeedMs : 1400;
  const enemyMaxHit = typeof npc.maxHit === "number" ? npc.maxHit : 1;

  if (nowMs >= combat.nextEnemyHitAt) {
    // SWING FX fra NPC -> player (uansett hit/miss)
    const nC = tileCenterPx(npc.x, npc.y);
    const pC = playerCenterPx();
    triggerSwing(nC.x, nC.y, pC.x, pC.y, nowMs, getEnemyWeaponFxSprite(npc));

    // Base stats fra enemy (map.js)
    const baseHitChance = getNpcHitChance(npc);
    const baseMaxHit = enemyMaxHit;

    // Modifikatorer fra equipped items
    const hitChanceMod = getEnemyHitChanceMod();   
    const maxHitMod = getEnemyMaxHitMod();       

    // Effektive stats
    const effectiveHitChance = clamp01(baseHitChance + hitChanceMod);
    const effectiveMaxHit = Math.max(1, baseMaxHit + maxHitMod);

    // Roll med effektive stats
    const dmg = rollHitWithChance(effectiveMaxHit, effectiveHitChance);

    if (dmg <= 0) {
      logMessage(`${npc.name} misses you.`, "system");
    } else {
      triggerPlayerHitFlash(nowMs);

      logMessage(`${npc.name} hits you for ${dmg}.`, "error");
      damagePlayer(dmg);

      //grantCombatHitXpServer?.(npc.id); ???
    }

    combat.nextEnemyHitAt = nowMs + enemySpeed;
  }
}


function updateRespawns(nowMs) {
  for (const n of (level.npcs || [])) {
    if (!n.dead) continue;
    if (!Number.isFinite(n._respawnAt)) continue;

    if (nowMs >= n._respawnAt) {
      n.dead = false;
      n._respawnAt = null;

      // full heal på respawn
      if (typeof n.maxHp === "number") {
        setNpcHp(n, n.maxHp);
      } else {
        setNpcHp(n, 3);
      }

      // Fiende respawner log i chat
      // logMessage(`${n.name} respawns.`, "system");
    }
  }
}

async function claimNpcLootServer(npcId, npcName = "Enemy") {
  const { data, error } = await sb.rpc("rpc_claim_npc_loot", { p_npc_id: npcId });
  if (error) {
    console.warn("[LOOT RPC]", error);
    return;
  }

  if (data?.inventory) {
    inventory = normalizeInventory(data.inventory);
    renderInventoryWindow?.();
  }

  const loot = Array.isArray(data?.loot) ? data.loot : [];
  if (!loot.length) return;

  // logg i chat
  const parts = loot.map(x => {
    const name = ITEM_DEFS?.[x.id]?.name || x.id;
    const q = Number(x.qty || 1);
    return q > 1 ? `${name} x${q}` : name;
  });

  logMessage(`Loot: ${parts.join(", ")}`, "loot");
}


async function grantCombatKillXpServer(npcId) {
  const { data, error } = await sb.rpc("rpc_combat_kill", { npc_id: npcId });
  if (error) {
    console.warn("[COMBAT KILL RPC]", error);
    return;
  }

  // data: { skill:'combat', gain, xp, level }
  if (!data) return;

  // Oppdater combat skill lokalt (samme pattern som mining/woodcutting/fishing)
  skills.combat = skills.combat || {};
  skills.combat.xp = data.xp;
  skills.combat.level = data.level;

  syncDerivedPlayerHpLimits();

  showXpEmblem();
  logMessage(`+${data.gain} COMBAT XP`, "loot");

  if (skillsOpen) renderSkillsWindow();
  return true;
}

async function grantCombatHitXpServer(npcId) {
  const { data, error } = await sb.rpc("rpc_combat_taken_hit", { npc_id: npcId });
  if (error) {
    console.warn("[COMBAT HIT RPC]", error);
    return;
  }
  if (!data?.granted) return;

  skills.combat.xp = data.combat_xp;
  skills.combat.level = data.combat_level;

  syncDerivedPlayerHpLimits();

  showXpEmblem();
  logMessage(`+${data.gain} COMBAT XP`, "loot");

  if (skillsOpen) renderSkillsWindow();
}

async function consumeFromInventoryServer(slotIndex) {
  try {
    const { data, error } = await sb.rpc("rpc_consume_inventory_item", {
      p_slot: slotIndex
    });

    if (error) {
      // Hvis cooldown aktiv: vis emblem litt
      if ((error?.message || "").toLowerCase().includes("cooldown")) {
        logMessage("You can't eat yet.", "error");
      } else {
        logMessage("You can't consume that.", "error");
      }
      console.warn("[CONSUME RPC]", error);
      return false;
    }

    // authoritative updates
    if (data?.inventory) inventory = normalizeInventory(data.inventory);
    if (typeof data?.hp === "number") player.hp = data.hp;
    if (typeof data?.maxHp === "number") player.maxHp = data.maxHp;

    syncDerivedPlayerHpLimits();

    if (typeof data?.food_until_ms === "number") {
      foodCooldownUntilMs = data.food_until_ms;

      syncXpPopContainer();   // oppdater visning umiddelbart
      startFoodCooldownLoop(); // holder food-emblemet aktivt mens cooldown varer
    }

    renderInventoryWindow?.();
    renderHpHeart?.();

    const name = ITEM_DEFS[data?.item_id]?.name || data?.item_id || "food";
    logMessage(`You consume ${name} (+${data.healed} HP).`, "loot");

    return true;
  } catch (e) {
    console.warn("[CONSUME RPC] failed", e);
    logMessage("Server error (consume).", "error");
    return false;
  }
}



//-------------------- MINING --------------------

async function grantMiningServer(nodeKey) {
  try {
    const { data, error } = await sb.rpc("rpc_mining_complete", { node_key: nodeKey });
    if (error) {
      console.warn("[MINING RPC] error", error);
      logMessage("Server rejected mining reward.", "error");
      return null;
    }

    // Oppdater mining skill
    if (data?.skill === "mining") {
      skills.mining.xp = data.xp;
      skills.mining.level = data.level;
      logMessage(`+${data.gain} MINING XP`, "system");
    }

    // Oppdater inventory 
    if (data?.inventory) {
      inventory = normalizeInventory(data.inventory);
      renderInventoryWindow();
    }

    // Logg drops 
    const drops = data?.drops || [];
    for (const d of drops) {
      const itemName = ITEM_DEFS[d.item_id]?.name || d.item_id;
      logMessage(`You mine ${d.qty} ${itemName}.`, "loot");
    }

    // (cache)
    if (skillsOpen) renderSkillsWindow();
    saveGame?.();
    return data;
  } catch (e) {
    console.warn("[MINING RPC] failed", e);
    logMessage("Server error (mining).", "error");
    return null;
  }
}

const mining = {
  active: false,
  tx: 0,
  ty: 0,
  xpReward: 0,
  minLevel: 1,
  layer: "mid",      // "mid" eller "base"
  originalKey: null, // f.eks "copst"
  hitsDone: 0,
  hitsRequired: 3,
  nextHitAt: 0,
  drop: null,        // { itemId, qtyMin, qtyMax }
  respawnMs: 20000,
};

function toolHasAction(action) {
  const t = equipped?.tool;
  if (!t) return false;
  const actions = t.toolActions || [];
  return Array.isArray(actions) && actions.includes(action);
}

function getPlayerToolFxSprite() {
  const t = equipped?.tool;
  if (t?.fxSprite) return t.fxSprite;
  return SLASH_FX_SPRITE; // fallback
}

function ensureTileRespawnList() {
  if (!level._tileRespawns) level._tileRespawns = [];
}

function depleteTileForRespawn(layer, tx, ty, originalKey, nowMs, respawnMs) {
  const gridName = (layer === "mid") ? "grid_mid" : "grid_base";
  const grid = level[gridName];
  if (!grid || !grid[ty]) return;

  // fjern tile visuelt og logisk
  grid[ty][tx] = EMPTY;

  ensureTileRespawnList();
  level._tileRespawns.push({
    at: nowMs + respawnMs,
    gridName,
    tx,
    ty,
    key: originalKey,
  });
}

function updateTileRespawns(nowMs) {
  ensureTileRespawnList();
  const list = level._tileRespawns;

  for (let i = list.length - 1; i >= 0; i--) {
    const r = list[i];
    if (nowMs < r.at) continue;

    const grid = level[r.gridName];
    if (grid && grid[r.ty]) {
      grid[r.ty][r.tx] = r.key;
    }
    list.splice(i, 1);
  }
}

function startMiningNode(tx, ty, layer, key, tileDef) {
  // må stå ved siden av
  if (!isAdjacentToPlayer(tx, ty)) {
    logMessage("You need to stand next to the rock.", "error");
    return;
  }

  // krever riktig tool
  const req = tileDef?.mining?.toolAction || "mining";
  if (!toolHasAction(req)) {
    logMessage("You need the correct tool to mine this.", "error");
    return;
  }

  // Krev riktig mining level
  const reqLevel = Math.max(1, Math.floor(tileDef?.mining?.minLevel || 1));
  const myLevel = skills?.mining?.level || 1;

  if (myLevel < reqLevel) {
    logMessage(`You need Mining level ${reqLevel} to mine this.`, "error");
    return;
  }

  // start mining
  mining.active = true;
  mining.tx = tx;
  mining.ty = ty;
  mining.layer = layer;
  mining.originalKey = key;
  mining.hitsDone = 0;

  mining.hitsRequired = Math.max(1, Math.floor(tileDef.mining.hitsRequired || 3));
  mining.respawnMs = Math.max(1000, Math.floor(tileDef.mining.respawnMs || 20000));
  mining.drop = tileDef.mining.drop || null;
  mining.xpReward = Math.max(0, Math.floor(tileDef?.mining?.xp || 0));
  mining.minLevel = Math.max(1, Math.floor(tileDef?.mining?.minLevel || 1));

  const now = performance.now();
  mining.nextHitAt = now + 250;

  // stopp bevegelse
  held.up = held.down = held.left = held.right = false;
  lastIntent = null;

  logMessage("You start mining...", "system");
}



function stopMining(reason = null) {
  if (reason) logMessage(reason, "system");
  mining.active = false;
  mining.originalKey = null;
  mining.drop = null;
}

function updateMining(nowMs) {
  if (!mining.active) return;

  // hvis du går bort: stopp
  if (!isAdjacentToPlayer(mining.tx, mining.ty)) {
    stopMining("You stop mining.");
    return;
  }

  // hvis tile er borte (depleted av noe annet): stopp
  const gridName = (mining.layer === "mid") ? "grid_mid" : "grid_base";
  const grid = level[gridName];
  const currentKey = grid?.[mining.ty]?.[mining.tx];
  if (currentKey !== mining.originalKey) {
    stopMining("The rock is gone.");
    return;
  }

  if (nowMs < mining.nextHitAt) return;

  // swing FX (som combat)
  const pC = playerCenterPx();
  const tC = tileCenterPx(mining.tx, mining.ty);
  triggerSwing(pC.x, pC.y, tC.x, tC.y, nowMs, getPlayerToolFxSprite());

  mining.hitsDone += 1;
  mining.nextHitAt = nowMs + 650; // mining tick speed (juster)

  if (mining.hitsDone < mining.hitsRequired) return;

  (async () => {
    await grantMiningServer(mining.originalKey);
  })();

  depleteTileForRespawn(mining.layer, mining.tx, mining.ty, mining.originalKey, nowMs, mining.respawnMs);
  stopMining(null);
}

// -------------------- WOODCUTTING --------------------

const woodcutting = {
  active: false,
  tx: 0,
  ty: 0,
  layer: "mid",
  originalKey: null,
  hitsDone: 0,
  hitsRequired: 3,
  nextHitAt: 0,
  respawnMs: 20000,
};

async function grantWoodcuttingServer(nodeKey) {
  try {
    const { data, error } = await sb.rpc("rpc_woodcutting_complete", { p_node_key: nodeKey })

    if (error) {
      console.warn("[WOODCUTTING RPC] error", error);
      logMessage(`Server rejected woodcutting reward: ${error.message || "unknown error"}`, "error");
      if (error.details) logMessage(`Details: ${error.details}`, "error");
      return null;
    }

    if (data?.skill === "woodcutting") {
      skills.woodcutting.xp = data.xp;
      skills.woodcutting.level = data.level;
      logMessage(`+${data.gain} WOODCUTTING XP`, "system");
    }

    if (data?.inventory) {
      inventory = normalizeInventory(data.inventory);
      renderInventoryWindow();
    }

    const drops = data?.drops || [];
    for (const d of drops) {
      const itemName = ITEM_DEFS[d.item_id]?.name || d.item_id;
      logMessage(`You cut ${d.qty} ${itemName}.`, "loot");
    }

    if (skillsOpen) renderSkillsWindow();
    saveGame?.();
    return data;
  } catch (e) {
    console.warn("[WOODCUTTING RPC] failed", e);
    logMessage("Server error (woodcutting).", "error");
    return null;
  }
}

function startWoodcuttingNode(tx, ty, layer, key, tileDef) {
  if (!isAdjacentToPlayer(tx, ty)) {
    logMessage("You need to stand next to the tree.", "error");
    return;
  }

  const req = tileDef?.woodcutting?.toolAction || "woodcutting";
  if (!toolHasAction(req)) {
    logMessage("You need an axe to cut this.", "error");
    return;
  }

  const reqLevel = Math.max(1, Math.floor(tileDef?.woodcutting?.minLevel || 1));
  const myLevel = skills?.woodcutting?.level || 1;
  if (myLevel < reqLevel) {
    logMessage(`You need Woodcutting level ${reqLevel} to cut this.`, "error");
    return;
  }

  woodcutting.active = true;
  woodcutting.tx = tx;
  woodcutting.ty = ty;
  woodcutting.layer = layer;
  woodcutting.originalKey = key;
  woodcutting.hitsDone = 0;

  woodcutting.hitsRequired = Math.max(1, Math.floor(tileDef.woodcutting.hitsRequired || 3));
  woodcutting.respawnMs = Math.max(1000, Math.floor(tileDef.woodcutting.respawnMs || 20000));

  const now = performance.now();
  woodcutting.nextHitAt = now + 250;

  held.up = held.down = held.left = held.right = false;
  lastIntent = null;

  logMessage("You start cutting...", "system");
}

function stopWoodcutting(reason = null) {
  woodcutting.active = false;
  woodcutting.originalKey = null;

  if (reason) logMessage(reason, "system");
}

function updateWoodcutting(nowMs) {
  if (!woodcutting.active) return;

  if (!isAdjacentToPlayer(woodcutting.tx, woodcutting.ty)) {
    stopWoodcutting(null);
    return;
  }

  const gridName = (woodcutting.layer === "mid") ? "grid_mid" : "grid_base";
  const grid = level[gridName];
  const currentKey = grid?.[woodcutting.ty]?.[woodcutting.tx];
  if (currentKey !== woodcutting.originalKey) {
    stopWoodcutting("The tree is gone.");
    return;
  }

  if (nowMs < woodcutting.nextHitAt) return;

  const pC = playerCenterPx();
  const tC = tileCenterPx(woodcutting.tx, woodcutting.ty);
  triggerSwing(pC.x, pC.y, tC.x, tC.y, nowMs, getPlayerToolFxSprite());

  woodcutting.hitsDone += 1;
  woodcutting.nextHitAt = nowMs + 650;

  if (woodcutting.hitsDone < woodcutting.hitsRequired) return;

  (async () => {
    await grantWoodcuttingServer(woodcutting.originalKey);
  })();

  depleteTileForRespawn(woodcutting.layer, woodcutting.tx, woodcutting.ty, woodcutting.originalKey, nowMs, woodcutting.respawnMs);
  stopWoodcutting(null);
}


// -------------------- FISHING --------------------

const fishing = {
  active: false,
  tx: 0,
  ty: 0,
  layer: "mid",
  originalKey: null,
  catchesDone: 0,
  catchesRequired: 4,
  nextCatchAt: 0,
  respawnMs: 12000,
};

async function grantFishingServer(spotKey) {
  try {
    const { data, error } = await sb.rpc("rpc_fishing_complete", { p_spot_key: spotKey });
    if (error) {
      console.warn("[FISHING RPC] error", error);
      logMessage(`Server rejected fishing reward: ${error.message || "unknown error"}`, "error");
      return null;
    }

    if (data?.skill === "fishing") {
      if (!skills.fishing) skills.fishing = { xp: 0, level: 1 };
      skills.fishing.xp = data.xp;
      skills.fishing.level = data.level;
      logMessage(`+${data.gain} FISHING XP`, "system");
    }

    if (data?.inventory) {
      inventory = normalizeInventory(data.inventory);
      renderInventoryWindow();
    }

    const drops = data?.drops || [];
    for (const d of drops) {
      const itemName = ITEM_DEFS[d.item_id]?.name || d.item_id;
      logMessage(`You catch ${d.qty} ${itemName}.`, "loot");
    }

    if (skillsOpen) renderSkillsWindow();
    saveGame?.();
    return data;
  } catch (e) {
    console.warn("[FISHING RPC] failed", e);
    logMessage("Server error (fishing).", "error");
    return null;
  }
}

function hasFreeInventorySlot() {
  return Array.isArray(inventory) && inventory.some(s => s === null);
}

function startFishingSpot(tx, ty, layer, key, tileDef) {
  if (!isAdjacentToPlayer(tx, ty)) {
    logMessage("You need to stand next to the fishing spot.", "error");
    return;
  }

  // må ha plass før vi starter
  if (!hasFreeInventorySlot()) {
    logMessage("Inventory is full.", "error");
    return;
  }

  // krever fishing rod (tool action)
  const req = tileDef?.fishing?.toolAction || "fishing";
  if (!toolHasAction(req)) {
    logMessage("You need a fishing rod to fish here.", "error");
    return;
  }

  // level gate
  const reqLevel = Math.max(1, Math.floor(tileDef?.fishing?.minLevel || 1));
  const myLevel = skills?.fishing?.level || 1;
  if (myLevel < reqLevel) {
    logMessage(`You need Fishing level ${reqLevel} to fish here.`, "error");
    return;
  }

  fishing.active = true;
  fishing.tx = tx;
  fishing.ty = ty;
  fishing.layer = layer;
  fishing.originalKey = key;
  fishing.catchesDone = 0;
  fishing.catchesRequired = Math.max(1, Math.floor(tileDef?.fishing?.catchesRequired || 4));
  fishing.respawnMs = Math.max(1000, Math.floor(tileDef?.fishing?.respawnMs || 12000));

  const now = performance.now();
  fishing.nextCatchAt = now + 350;

  // stopp bevegelse
  held.up = held.down = held.left = held.right = false;
  lastIntent = null;

  logMessage("You start fishing.", "system");
}

function stopFishing(reason = null) {
  fishing.active = false;
  fishing.originalKey = null;
  if (reason) logMessage(reason, "system");
}

function updateFishing(nowMs) {
  if (!fishing.active) return;

  if (!isAdjacentToPlayer(fishing.tx, fishing.ty)) {
    stopFishing("You stop fishing.");
    return;
  }

  const gridName = (fishing.layer === "mid") ? "grid_mid" : "grid_base";
  const grid = level[gridName];
  const currentKey = grid?.[fishing.ty]?.[fishing.tx];
  if (currentKey !== fishing.originalKey) {
    stopFishing("The fishing spot is gone.");
    return;
  }

  // Hvis inventory blir fullt mens du fisker -> stopp
  if (!hasFreeInventorySlot()) {
    stopFishing("Inventory is full.");
    return;
  }

  if (nowMs < fishing.nextCatchAt) return;

  // "bob"-FX: vi bruker swing FX sprite (fishing rod) mot tilen (samme system som mining/woodcutting)
  const pC = playerCenterPx();
  const tC = tileCenterPx(fishing.tx, fishing.ty);
  triggerSwing(pC.x, pC.y, tC.x, tC.y, nowMs, getPlayerToolFxSprite());

  fishing.catchesDone += 1;
  fishing.nextCatchAt = nowMs + 1100; // fishing tick speed (juster)

  // Award fra server hver catch (server bestemmer fish vs junk)
  void (async () => {
    await grantFishingServer(fishing.originalKey);

    // etter serveroppdatering: hvis inventory nå er fullt -> stopp
    if (!hasFreeInventorySlot() && fishing.active) {
      stopFishing("Inventory is full.");
    }
  })();

  // Etter N catches: spot går i cooldown (forsvinner og respawner)
  if (fishing.catchesDone >= fishing.catchesRequired) {
    depleteTileForRespawn(fishing.layer, fishing.tx, fishing.ty, fishing.originalKey, nowMs, fishing.respawnMs);
    stopFishing(null);
  }
}


// -------------------- ENEMY STATS (effective) --------------------

// Summer en numerisk stat fra alle equipped items (weapon/armor/ring/tool)
function getEquippedStatSum(statKey) {
  let sum = 0;
  for (const slot of EQUIP_SLOTS) {
    const it = equipped?.[slot];
    if (!it) continue;
    const v = it[statKey];
    if (typeof v === "number" && Number.isFinite(v)) sum += v;
  }
  return sum;
}

// Støtter at du skriver -10 (prosent) eller -0.10 (desimal)
function normalizeChanceDelta(v) {
  if (typeof v !== "number" || !Number.isFinite(v)) return 0;
  if (Math.abs(v) > 1) return v / 100;   // -10 -> -0.10
  return v;                              // -0.10 -> -0.10
}

function getEnemyHitChanceMod() {
  return normalizeChanceDelta(getEquippedStatSum("enemyHitChanceMod"));
}

function getEnemyMaxHitMod() {
  return Math.floor(getEquippedStatSum("enemyMaxHitMod"));
}

// Regner ut fiendens stats slik de faktisk er mot deg (med armor/ring osv.)
function getEffectiveEnemyStats(npc) {
  const hp = getNpcHp(npc);
  const maxHp = (typeof npc.maxHp === "number" ? npc.maxHp : 3);

  // Base stats fra NPC
  const baseHitChance = getNpcHitChance(npc); // 0..1
  const baseMaxHit = (typeof npc.maxHit === "number" ? npc.maxHit : 1);

  // Mod fra utstyr
  const hitChanceMod = getEnemyHitChanceMod(); // f.eks -0.10
  const maxHitMod = getEnemyMaxHitMod();       // f.eks -2

  // Effective stats
  const hitChance = clamp01(baseHitChance + hitChanceMod);
  const maxHit = Math.max(1, baseMaxHit + maxHitMod);

  return { hp, maxHp, hitChance, maxHit };
}



// -------------------- NPC + DIALOG DATA --------------------

// Dialog “scripts” (node-basert)
const DIALOGS = {
  guide_intro: {
    start: "start",
    nodes: {
      start: {
        speaker: "Oleander",
        text: "Good day to you, traveller.",
        options: [
          { label: "How do i play?", next: "howto" },
          { label: "Could you help me out? Im hurt.", next: "heal" },
          { label: "Goodbye.", end: true },
        ]
      },
      howto: {
        speaker: "Oleander",
        text: "WASD/piltaster for å gå. Høyreklikk for actions. Snakk med NPCer for quests.",
        options: [
          { label: "Back", next: "start" },
          { label: "Goodbye.", end: true },
        ]
      },
      heal: {
        speaker: "Oleander",
        text: "To help a fellow Path Seeker have always been my duty.",
        options: [
          { label: "I appreciate it!", action: "heal", next: "after_heal" },
          { label: "Back", next: "start" },
        ]
      },
      after_heal: {
        speaker: "Oleander",
        text: "You will always think of me in a place of need, my friend.",
        options: [
          { label: "Thanks!", end: true },
          { label: "Back", next: "start" },
        ]
      }
    }
  },
  trader_01: {
    start: "start",
    nodes: {
      start: {
        speaker: "Trader",
        text: "OY! You got some spare coins in exchange of valuable goods?",
        options: [
          { label: "Where have you got these items?", next: "whereItems" },
          { label: "I have to go", end: true },
        ]
      },
      whereItems: {
        speaker: "Trader",
        text: "You never ask a trader where the goods came from! I myself have endured great hardship in exchange of these items.",
        options: [
          { label: "Back", next: "start" },
          { label: "Im sorry, i have to go", end: true },
        ]
      },
    }
  },
  blacksmith_01: {
    start: "start",
    nodes: {
      start: {
        speaker: "Yorn",
        text: "hmmmm",
        options: [
          { label: "I am willing to bet that you know something about mining or metals?", next: "introMining" },
          { label: "I have to go", end: true },
        ]
      },
      introMining: {
        speaker: "Yorn",
        text: "Hmmm yes, need pickaxe for rock, some rock have metal. Bring raw metal to me, i forge bars, hmmm...",
        options: [
          { label: "Okey.. anything more?", next: "introMining2" },
          { label: "Back", next: "start" },
          { label: "I have to go", end: true },
        ]
      },
      introMining2: {
        speaker: "Yorn",
        text: "Hmmm yes, with great experience, pickaxe can go with better metals!",
        options: [
          { label: "Back", next: "introMining" },
          { label: "I have to go", end: true },
        ]
      },
    }
  },
  graveyard_warden: {
    start: "start",
    nodes: {
      start: {
        speaker: "Warden",
        text: "Nay a normal sight to mete a warrior alive nigh graves, what bringeth such pleasure?",
        options: [
          { label: "I have travelled far, if i should end my days, can i rest here?", next: "warden_intro" },
          { label: "I have to go", end: true },
        ]
      },
      warden_intro: {
        speaker: "Warden",
        text: "Sey the word, and I shal assure that thou rest in pees.",
        options: [
          { label: "Yes! I would like to rest here in the after life.", action: "set_respawn_here", end: true },
          { label: "Back", next: "start" },
          { label: "No never mind.", end: true },
        ]
      },
    }
  },

  banker_intro: {
    start: "start",
    nodes: {
      start: {
        speaker: "Banker",
        text: "Good day! Anything i can help you with?",
        options: [
          { label: "What is this place for?", next: "banker_intro_howto" },
          { label: "I have to go", end: true },
        ]
      },
      banker_intro_howto: {
        speaker: "Banker",
        text: "We at the bank help the people of voidlore with access and securing assets and items. We are proud of our banking system. You can keep your valuables and items safe here.",
        options: [
          { label: "Back", next: "start" },
          { label: "I have to go.", end: true },
        ]
      },
    }
  },


};

// Runtime state for dialog 
let dialogState = {
  open: false,
  npcId: null,
  dialogId: null,
  nodeId: null,
  optionIndex: 0,
};


//HELPERS

function getPortalAt(x, y) {
  const portals = level.portals || [];
  return portals.find(p => p.x === x && p.y === y) || null;
}

function getNpcsInLevel() {
  return (level.npcs || []).filter(isNpcAlive);
}

function getNpcAt(x, y) {
  return getNpcsInLevel().find(n => n.x === x && n.y === y) || null;
}

function isNpcBlocking(x, y) {
  return !!getNpcAt(x, y);
}

function openContextForFacedTileCentered() {
  const { x, y } = getFacedTileCoords();

  // Senter av canvas som posisjon for meny (kontroller)
  const rect = canvas.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const npc = getNpcAt(x, y);
  if (npc) {
    openContextMenu(cx, cy, npc.name, [
      { label: `Talk-to ${npc.name}`, onClick: () => openDialogForNpc(npc) },
      {
        label: "Examine",
        onClick: () => {
          if (npc.hostile) {
            const s = getEffectiveEnemyStats(npc);
            const pct = Math.round(s.hitChance * 100);
            logMessage(
              `${npc.name} — HP: ${s.hp}/${s.maxHp} • Hit chance: ${pct}% • Max hit: ${s.maxHit}`,
              "system"
            );
          } else {
            logMessage(`${npc.name} looks busy.`, "system");
          }
        }
      },
    ]);
    return;
  }

  logMessage("Ingenting å interagere med der.", "system");
}

function getNpcSpritePathForTime(n, nowMs) {
  // Hvis NPC har 2+ sprites: idle animasjon
  if (Array.isArray(n.sprites) && n.sprites.length > 0) {
    const speed = typeof n.idleMs === "number" ? n.idleMs : 400; // default 400ms
    const idx = Math.floor(nowMs / speed) % n.sprites.length;
    return n.sprites[idx];
  }

  // fallback: gammel "sprite"
  return n.sprite || null;
}

function setChatVisible(isVisible) {
  const chat = document.getElementById("chatlog");
  if (!chat) return;
  chat.classList.toggle("hidden", !isVisible);
}

function tileCenterPx(tx, ty) {
  return {
    x: tx * TILE_SIZE + TILE_SIZE / 2,
    y: ty * TILE_SIZE + TILE_SIZE / 2,
  };
}

function playerCenterPx() {
  return {
    x: player.px + TILE_SIZE / 2,
    y: player.py + TILE_SIZE / 2,
  };
}

function getPlayerWeaponFxSprite() {
  // Hvis du har equiped weapon og det har fxSprite, bruk den
  const w = equipped?.weapon;
  if (w?.fxSprite) return w.fxSprite;

  // (valgfritt) hvis du vil bruke icon som fallback:
  // if (w?.icon) return w.icon;

  // ellers: default slash
  return SLASH_FX_SPRITE;
}

function getEnemyWeaponFxSprite(npc) {
  // Hvis enemy har definert egen weaponFxSprite i map.js
  if (npc?.weaponFxSprite) return npc.weaponFxSprite;

  // ellers: default slash
  return SLASH_FX_SPRITE;
}


// Registrer et "swing" fra attacker -> target
function triggerSwing(attackerCx, attackerCy, targetCx, targetCy, nowMs, spritePath) {
  combatFx.push({
    startMs: nowMs,
    endMs: nowMs + COMBAT_VFX.swingMs,
    ax: attackerCx,
    ay: attackerCy,
    tx: targetCx,
    ty: targetCy,

    //  NY: hvilket bilde akkurat denne swingen skal bruke
    spritePath: spritePath || SLASH_FX_SPRITE,
  });
}

// Blink på NPC når den tar damage
function triggerNpcHitFlash(npc, nowMs) {
  npc._hitFlashUntil = nowMs + COMBAT_VFX.hitFlashMs;
}

// Blink på player når player tar damage
function triggerPlayerHitFlash(nowMs) {
  player._hitFlashUntil = nowMs + COMBAT_VFX.hitFlashMs;
}

// -------------------- SUPABASE --------------------
const Supa = window.supabase || window.Supabase;
const sb = window.__vq_sb || (window.__vq_sb = Supa.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
));

// Auth UI refs
const authEmailEl = document.getElementById("auth-email");
const authPassEl = document.getElementById("auth-pass");
const btnLogin = document.getElementById("btn-login");
const btnSignup = document.getElementById("btn-signup");
const authStatusEl = document.getElementById("auth-status");

function setAuthStatus(msg) {
if (authStatusEl) authStatusEl.textContent = msg || "";
}

async function requireSession() {
  const { data } = await sb.auth.getSession();
  const s = data?.session || null;
  myUserId = s?.user?.id || null;
  return s;
}

btnLogin?.addEventListener("click", async () => {
  const email = (authEmailEl?.value || "").trim();
  const password = (authPassEl?.value || "").trim();

  setAuthStatus("Logger inn...");

  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) { setAuthStatus(error.message); return; }

  await hydrateSaveFromCloud();
  showMenu();
  setAuthStatus("Innlogget!");
});

btnSignup?.addEventListener("click", async () => {
const email = (authEmailEl?.value || "").trim();
const password = (authPassEl?.value || "").trim();
setAuthStatus("Oppretter bruker...");

const { data, error } = await sb.auth.signUp({ email, password });
if (error) { setAuthStatus(error.message); return; }

setAuthStatus("Bruker opprettet! (Sjekk e-post hvis du har email-confirm på)");
});


async function acquireSessionLockOrBlock() {
  //  Allerede låst i denne taben → OK
  if (sessionLockAcquired) return true;

  //  Hindrer parallelle kall (dobbeltklikk / to init-funksjoner)
  if (acquiringSession) return false;
  acquiringSession = true;

  try {
    const session = await requireSession();
    if (!session) {
      blockGameWithMessage("You must be logged in.");
      return false;
    }

    const { data, error } = await sb.rpc("rpc_session_acquire", {
      p_session_id: clientSessionId,
      p_stale_seconds: SESSION_STALE_SECONDS,
    });

    if (error) throw error;

    if (!data?.ok) {
      // Hard deny
      const msg =
        data?.reason === "already_logged_in"
          ? "You are already logged in somewhere else."
          : "Could not start session.";

      blockGameWithMessage(msg);
      return false;
    }

    //  Vi har lock (eller eier den allerede)
    sessionLockAcquired = true;
    startSessionHeartbeat();
    return true;
  } catch (e) {
    console.error("[SESSION] acquire failed:", e);
    blockGameWithMessage("Could not verify session. Try again.");
    return false;
  } finally {
    acquiringSession = false;
  }
}

function startSessionHeartbeat() {
  stopSessionHeartbeat();

  sessionHeartbeatTimer = setInterval(async () => {
    if (!sessionLockAcquired) return;

    try {
      const { data, error } = await sb.rpc("rpc_session_heartbeat", {
        p_session_id: clientSessionId,
      });

      if (error) throw error;

      if (!data?.ok) {
        // Mistet lock (f.eks. logget inn et annet sted, eller stale takeover)
        sessionLockAcquired = false;
        stopSessionHeartbeat();
        blockGameWithMessage("Session lost. You are logged in elsewhere.");
      }
    } catch (e) {
      // Ikke blokker på én feil (nettflak). Heartbeat vil prøve igjen.
      console.warn("[SESSION] heartbeat failed:", e);
    }
  }, SESSION_HEARTBEAT_MS);
}

function stopSessionHeartbeat() {
  if (sessionHeartbeatTimer) {
    clearInterval(sessionHeartbeatTimer);
    sessionHeartbeatTimer = null;
  }
}

async function releaseSessionLock() {
  if (!sessionLockAcquired) return;

  sessionLockAcquired = false;
  stopSessionHeartbeat();

  try {
    await sb.rpc("rpc_session_release", { p_session_id: clientSessionId });
  } catch (e) {
    // best effort
    console.warn("[SESSION] release failed:", e);
  }
}

// Enkel “hard block” UI (lag gjerne penere senere)
function blockGameWithMessage(msg) {
  console.error(msg);
  alert(msg);

  // Stoppe spill-loop hvis du har en
  gameStarted = false;

  // skjul UI / disable input her hvis du har egne flags
}

// -------------------- MULTIPLAYER: Presence (light) --------------------

let presenceGeneration = 0;
let presenceSubscribing = false;
let presenceLastSubAt = 0;

const PRESENCE_STALE_SECONDS = 20;
const PRESENCE_PUSH_MIN_MS = 120; // throttling
let presenceLastPushAt = 0;

let presenceChannel = null; // realtime channel
const otherPlayers = new Map(); // user_id -> state

let presenceHeartbeatTimer = null;

function startPresenceHeartbeat() {
  stopPresenceHeartbeat();
  presenceHeartbeatTimer = setInterval(() => {
    presenceUpsert(false);
  }, 2000);
}

function stopPresenceHeartbeat() {
  if (presenceHeartbeatTimer) {
    clearInterval(presenceHeartbeatTimer);
    presenceHeartbeatTimer = null;
  }
}

// Hold Realtime JWT i sync med auth
sb.auth.onAuthStateChange((_event, session) => {
  try {
    const token = session?.access_token;
    if (token) sb.realtime.setAuth(token);
  } catch (e) {
    console.warn("[REALTIME] setAuth failed", e);
  }
});

function getMyNameForPresence() {
  // du har profile-name i save/profile flow
  const s = getSave?.();
  const fromSave = s?.profile?.name || s?.player?.name;
  const fromProfile = getProfileName?.();
  return (fromSave || fromProfile || "Player").toString().slice(0, 16);
}

function getMyGenderForPresence() {
  const s = getSave?.();
  const g = s?.profile?.gender ?? s?.player?.gender ?? player?.gender;
  return normalizeGender(g);
}

async function presenceUpsert(force = false) {
  if (!gameStarted) return;
  if (!sessionLockAcquired) return;

  const now = Date.now();
  if (!force && (now - presenceLastPushAt) < PRESENCE_PUSH_MIN_MS) return;
  presenceLastPushAt = now;

  const gender = getMyGenderForPresence();
  const armorId = getMyArmorIdForPresence();

  try {
    await sb.rpc("rpc_presence_upsert", {
      p_session_id: clientSessionId,
      p_level_id: currentLevelId,
      p_x: Math.floor(player.x),
      p_y: Math.floor(player.y),
      p_facing: player.facing || null,
      p_name: getMyNameForPresence(),
      p_gender: gender,
      p_armor_id: armorId,
    });
  } catch (e) {
    console.warn("[PRESENCE] upsert failed", e);
  }
}
async function presenceRemove() {
  try {
    await sb.rpc("rpc_presence_remove", { p_session_id: clientSessionId });
  } catch (e) {

  }
}

function clearOtherPlayers() {
  otherPlayers.clear();
}

function applyPresenceRow(row) {
  if (!row?.user_id) return;

  // Hvis denne raden gjelder et annet level enn jeg er i, skal den ikke ligge i otherPlayers
  if (row.level_id !== currentLevelId) {
    otherPlayers.delete(row.user_id);
    return;
  }

  const x = Number(row.x) || 0;
  const y = Number(row.y) || 0;

  const prev = otherPlayers.get(row.user_id);

  const px = x * TILE_SIZE;
  const py = y * TILE_SIZE;

  const prevTargetPx = prev?.targetPx ?? px;
  const prevTargetPy = prev?.targetPy ?? py;

  const changedTile = (px !== prevTargetPx) || (py !== prevTargetPy);

  // Startpos for smooth
  const startPx = prev?.px ?? px;
  const startPy = prev?.py ?? py;

  const next = {
    user_id: row.user_id,
    name: row.name || "Player",
    gender: normalizeGender(row.gender),
    level_id: row.level_id,
    x, y,
    facing: row.facing || "down",
    armor_id: row.armor_id || null,

    // render state
    px: startPx,
    py: startPy,
    targetPx: px,
    targetPy: py,

    // step state
    moving: prev?.moving ?? false,
    fromPx: prev?.fromPx ?? startPx,
    fromPy: prev?.fromPy ?? startPy,
    toPx: prev?.toPx ?? px,
    toPy: prev?.toPy ?? py,
    moveElapsed: prev?.moveElapsed ?? 0,
    moveDuration: prev?.moveDuration ?? BASE_MOVE_DURATION_MS,

    lastUpdateMs: Date.now(),
  };

  if (changedTile) {
    // Start ny step
    next.moving = true;
    next.fromPx = startPx;
    next.fromPy = startPy;
    next.toPx = px;
    next.toPy = py;
    next.moveElapsed = 0;
    next.moveDuration = BASE_MOVE_DURATION_MS;
  }

  otherPlayers.set(row.user_id, next);
}

function updateOtherPlayersSmooth(dtMs) {
  for (const p of otherPlayers.values()) {
    // Hvis vi er i en "step"
    if (p.moving) {
      p.moveElapsed += dtMs;
      const t = Math.min(1, p.moveElapsed / (p.moveDuration || BASE_MOVE_DURATION_MS));

      p.px = lerp(p.fromPx, p.toPx, t);
      p.py = lerp(p.fromPy, p.toPy, t);

      if (t >= 1) {
        p.px = p.toPx;
        p.py = p.toPy;
        p.moving = false;
      }

      continue;
    }

    // Hvis ikke moving, men ikke helt i mål (rare case):
    if (p.px !== p.targetPx || p.py !== p.targetPy) {
      // snap forsiktig, eller start en step
      p.moving = true;
      p.fromPx = p.px;
      p.fromPy = p.py;
      p.toPx = p.targetPx;
      p.toPy = p.targetPy;
      p.moveElapsed = 0;
      p.moveDuration = BASE_MOVE_DURATION_MS;
    }
  }
}

function getOtherPlayerBaseSprite(p) {
  const skinId = normalizeGender(p.gender);
  const skin = playerSkins[skinId];
  if (!skin) return null;

  const pack = skin[p.facing] || skin.down;
  return pickAnimFrame(pack, !!p.moving, p.moveElapsed || 0);
}

function armorKey(armorId, gender) {
  return `${armorId}::${gender}`;
}

function getOtherPlayerArmorSprite(p) {
  const armorId = p.armor_id;
  if (!armorId) return null;

  const gender = normalizeGender(p.gender);
  const skin = armorSkins[armorKey(armorId, gender)];
  if (!skin) return null;

  const pack = skin[p.facing] || skin.down;
  return pickAnimFrame(pack, !!p.moving, p.moveElapsed || 0);
}


function drawOtherPlayers(nowMs) {
  for (const p of otherPlayers.values()) {
    if (p.level_id !== currentLevelId) continue;

    const { w, h, xOffset, yOffset } = getPlayerDrawSpec(p.gender);

    const baseImg = getOtherPlayerBaseSprite(p);
    const armorImg = getOtherPlayerArmorSprite(p);

    const drawX = p.px - xOffset;
    const drawY = p.py - yOffset;

    if (baseImg) ctx.drawImage(baseImg, drawX, drawY, w, h);
    else {
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(drawX, drawY, w, h);
    }

    if (armorImg) ctx.drawImage(armorImg, drawX, drawY, w, h);
        
    const nameBoxY = drawY - 14;

    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(drawX - 2, nameBoxY, TILE_SIZE + 4, 12);
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText((p.name || "Player").slice(0, 12), drawX + TILE_SIZE / 2, nameBoxY + 10);
    ctx.restore();
  }
}


let myUserId = null;

async function ensureRealtimeAuth() {
  const { data } = await sb.auth.getSession();
  const session = data?.session || null;
  myUserId = session?.user?.id || null;

  // Viktig: realtime trenger JWT for RLS-beskyttede postgres_changes
  if (session?.access_token) {
    try { sb.realtime.setAuth(session.access_token); } catch {}
  }
  return session;
}


let presenceDesiredLevel = null;

let presenceRetry = 0;
let presenceRetryTimer = null;

function schedulePresenceResubscribe(reason) {
  clearTimeout(presenceRetryTimer);

  // enkel exponential backoff: 0.5s, 1s, 2s, 4s, ... max 10s
  const delay = Math.min(10000, 500 * Math.pow(2, presenceRetry));
  presenceRetry = Math.min(presenceRetry + 1, 6);

  console.warn(`[PRESENCE] resubscribe in ${delay}ms (${reason})`);

  presenceRetryTimer = setTimeout(() => {
    if (presenceDesiredLevel) subscribeToPresence(presenceDesiredLevel, true);
  }, delay);
}

async function resetRealtimeConnection() {
  try { sb.realtime.disconnect(); } catch {}
  try { sb.realtime.connect(); } catch {}
}

async function subscribeToPresence(levelId, isRetry = false) {
  presenceDesiredLevel = levelId;

  // anti-spam: ikke start ny subscribe for ofte
  const now = Date.now();
  if (now - presenceLastSubAt < 1500) return;
  presenceLastSubAt = now;

  // hindre overlappende subscribes
  if (presenceSubscribing) return;
  presenceSubscribing = true;

  const gen = ++presenceGeneration;

  try {
    await ensureRealtimeAuth();

    // fjern gammel kanal (CLOSED her er “forventet”)
    if (presenceChannel) {
      try { await sb.removeChannel(presenceChannel); } catch {}
      presenceChannel = null;
    }

    // bare “hard reconnect” etter noen retries
    if (isRetry && presenceRetry >= 2) {
      try { sb.realtime.disconnect(); } catch {}
      try { sb.realtime.connect(); } catch {}
      await ensureRealtimeAuth();
    }

    // snapshot
    try {
      const { data, error } = await sb.rpc("rpc_presence_snapshot", {
        p_level_id: levelId,
        p_stale_seconds: PRESENCE_STALE_SECONDS,
      });
      if (!error && Array.isArray(data)) {
        clearOtherPlayers();
        for (const row of data) applyPresenceRow(row);
      }
    } catch (e) {
      console.warn("[PRESENCE] snapshot failed", e);
    }

    presenceChannel = sb
      .channel(`presence:${levelId}`) // navnet kan være som før, men vi filtrerer ikke i realtime lenger
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "player_presence" }, // <-- fjernet filter
        (payload) => {
          if (gen !== presenceGeneration) return;

          const ev = payload.eventType;

          // DELETE: alltid fjern
          if (ev === "DELETE") {
            const uid = payload.old?.user_id;
            if (uid) otherPlayers.delete(uid);
            return;
          }

          const row = payload.new;
          if (!row?.user_id) return;

          // ignorer meg selv
          if (myUserId && row.user_id === myUserId) return;

          // VIKTIG: hvis spilleren er i et annet level nå, fjern den lokalt
          if (row.level_id !== currentLevelId) {
            otherPlayers.delete(row.user_id);
            return;
          }

          // ellers: oppdater/lagre for rendering
          applyPresenceRow(row);
        }
      )
      .subscribe((status) => {
        if (gen !== presenceGeneration) return;

        console.log("[PRESENCE] channel", status);

        if (status === "SUBSCRIBED") {
          presenceRetry = 0;
          return;
        }

        if (status === "TIMED_OUT" || status === "CHANNEL_ERROR") {
          schedulePresenceResubscribe(status);
        }
      });

    await presenceUpsert(true);
  } finally {
    presenceSubscribing = false;
  }
}

// ---------- NPC MULTIPLAYER (roaming sync) ----------
const NPC_DRIVER_STALE_SECONDS = 20;
const NPC_DRIVER_HEARTBEAT_MS = 5000;

const NPC_ACTIVE_RADIUS = 18;      // tiles: NPC oppdateres bare nær spillere
const NPC_SNAPSHOT_STALE_SECONDS = 60;

let npcChannel = null;
let npcGeneration = 0;
let npcDesiredLevel = null;

let npcIsDriver = false;
let npcDriverHeartbeatTimer = null;
let npcRoamTimer = null;
let npcLastTickById = new Map(); // npc_id -> nextTickAt (ms)

function distTiles(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.max(Math.abs(dx), Math.abs(dy)); // "chebyshev" (grid-følelse)
}

function anyPlayerNearTile(levelId, x, y, radius) {
  // sjekk meg selv
  if (currentLevelId === levelId) {
    if (distTiles(player.x, player.y, x, y) <= radius) return true;
  }

  // sjekk andre spillere du allerede har i otherPlayers
  for (const p of otherPlayers.values()) {
    if (p.level_id !== levelId) continue;
    if (distTiles(p.x, p.y, x, y) <= radius) return true;
  }
  return false;
}

function applyNpcRowToLocalLevel(row) {
  const id = row?.npc_id;
  if (!id) return;

  // kun relevant level
  if (row.level_id !== currentLevelId) return;

  const npc = (level.npcs || []).find(n => n.id === id);
  if (!npc) return;

  npc.x = row.x;
  npc.y = row.y;
  if (row.facing) npc.facing = row.facing;
}

async function subscribeToNpcPresence(levelId) {
  npcDesiredLevel = levelId;
  const gen = ++npcGeneration;

  await ensureRealtimeAuth();

  if (npcChannel) {
    try { await sb.removeChannel(npcChannel); } catch {}
    npcChannel = null;
  }

  // snapshot -> synk pos inn i level.npcs
  try {
    const { data, error } = await sb.rpc("rpc_npc_snapshot", {
      p_level_id: levelId,
      p_stale_seconds: NPC_SNAPSHOT_STALE_SECONDS,
    });

    if (!error && Array.isArray(data)) {
      for (const row of data) applyNpcRowToLocalLevel(row);
    }
  } catch (e) {
    console.warn("[NPC] snapshot failed", e);
  }

  npcChannel = sb
    .channel(`npc:${levelId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "npc_presence", filter: `level_id=eq.${levelId}` },
      (payload) => {
        if (gen !== npcGeneration) return;

        const ev = payload.eventType;
        if (ev === "DELETE") return; // vi sletter ikke NPC-er foreløpig
        applyNpcRowToLocalLevel(payload.new);
      }
    )
    .subscribe((status) => {
      console.log("[NPC] channel", status);
    });
}

let npcAcquireTimer = null;

async function npcDriverStart(levelId) {
  npcIsDriver = false;

  async function tryAcquire() {
    const { data, error } = await sb.rpc("rpc_npc_driver_acquire", {
      p_level_id: levelId,
      p_session_id: clientSessionId,
      p_stale_seconds: NPC_DRIVER_STALE_SECONDS,
    });
    if (!error) npcIsDriver = !!data?.is_driver;
    return npcIsDriver;
  }

  // prøv med en gang
  await tryAcquire();

  // hvis ikke driver, prøv igjen hvert 2. sekund til takeover skjer
  clearInterval(npcAcquireTimer);
  npcAcquireTimer = setInterval(async () => {
    if (currentLevelId !== levelId) return;
    if (npcIsDriver) return;

    const ok = await tryAcquire();
    if (ok) {
      // vi ble driver -> seed + start roaming
      const roamingNpcs = (level.npcs || [])
        .filter(n => n.roaming)
        .map(n => ({ id: n.id, x: n.x, y: n.y, facing: n.facing || null }));

      await sb.rpc("rpc_npc_init_level", {
        p_level_id: levelId,
        p_session_id: clientSessionId,
        p_npcs: roamingNpcs,
      });

      startNpcRoamingLoop(levelId);
    }
  }, 2000);

  // heartbeat som før
  clearInterval(npcDriverHeartbeatTimer);
  npcDriverHeartbeatTimer = setInterval(async () => {
    if (!npcIsDriver) return;
    await sb.rpc("rpc_npc_driver_heartbeat", {
      p_level_id: levelId,
      p_session_id: clientSessionId,
    });
  }, NPC_DRIVER_HEARTBEAT_MS);

  // hvis vi var driver allerede:
  if (npcIsDriver) {
    const roamingNpcs = (level.npcs || [])
      .filter(n => n.roaming)
      .map(n => ({ id: n.id, x: n.x, y: n.y, facing: n.facing || null }));

    await sb.rpc("rpc_npc_init_level", {
      p_level_id: levelId,
      p_session_id: clientSessionId,
      p_npcs: roamingNpcs,
    });

    startNpcRoamingLoop(levelId);
  }
}


function npcDriverStop(levelId) {
  clearInterval(npcDriverHeartbeatTimer);
  npcDriverHeartbeatTimer = null;

  clearInterval(npcAcquireTimer);
  npcAcquireTimer = null;

  clearTimeout(npcRoamTimer);
  npcRoamTimer = null;

  if (npcIsDriver && levelId) {
    (async () => {
      try {
        await sb.rpc("rpc_npc_driver_release", {
          p_level_id: levelId,
          p_session_id: clientSessionId,
        });
      } catch (_) {
        // Ignorer 
      }
    })();
  }

  npcIsDriver = false;
}

function startNpcRoamingLoop(levelId) {
  clearTimeout(npcRoamTimer);

  const tick = async () => {
    npcRoamTimer = setTimeout(tick, 250); // sjekk ofte, men flytt sjeldent per npc

    if (!npcIsDriver) return;
    if (currentLevelId !== levelId) return;
    if (isUiBlocked()) return;

    const now = performance.now();
    const updates = [];

    for (const n of (level.npcs || [])) {
      if (!n.roaming) continue;
      if (n.dead) continue;

      // ikke flytt NPC vi er i dialog med
      if (dialogState?.open && dialogState?.npcId === n.id) continue;

      // ikke flytt hvis den er combat target akkurat nå
      if (combat?.active && combat?.targetRef === n) continue;

      // proximity gating: ingen spillere nær -> ikke gjør noe
      if (!anyPlayerNearTile(levelId, n.x, n.y, NPC_ACTIVE_RADIUS)) continue;

      // per-npc timing (random wait)
      const nextAt = npcLastTickById.get(n.id) || 0;
      if (now < nextAt) continue;

      const minW = Number.isFinite(n.roamMinWaitMs) ? n.roamMinWaitMs : 900;
      const maxW = Number.isFinite(n.roamMaxWaitMs) ? n.roamMaxWaitMs : 1400;
      const wait = minW + Math.random() * Math.max(0, maxW - minW);
      npcLastTickById.set(n.id, now + wait);

      // velg et steg
      const originX = Number.isFinite(n.originX) ? n.originX : n._originX ?? n.x;
      const originY = Number.isFinite(n.originY) ? n.originY : n._originY ?? n.y;
      n._originX = originX;
      n._originY = originY;

      const r = Number.isFinite(n.roamRadius) ? n.roamRadius : 3;

      const dirs = [
        { dx: 0, dy: -1, facing: "up" },
        { dx: 0, dy:  1, facing: "down" },
        { dx: -1, dy: 0, facing: "left" },
        { dx:  1, dy: 0, facing: "right" },
      ];

      // shuffle litt
      for (let i = dirs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
      }

      let moved = false;

      for (const d of dirs) {
        const nx = n.x + d.dx;
        const ny = n.y + d.dy;

        // innenfor roam radius
        if (distTiles(originX, originY, nx, ny) > r) continue;

        // kollisjon (bruker din eksisterende isWalkable som allerede sjekker NPC blocking)
        if (!isWalkable(nx, ny)) continue;

        n.x = nx;
        n.y = ny;
        n.facing = d.facing;

        updates.push({ npc_id: n.id, x: nx, y: ny, facing: d.facing });
        moved = true;
        break;
      }

      // hvis den ikke fant move: gjør ingenting (står stille)
      if (!moved) {
        // valgfritt: bare snu litt (ikke nødvendig)
      }
    }

    if (updates.length) {
      try {
        await sb.rpc("rpc_npc_update_batch", {
          p_level_id: levelId,
          p_session_id: clientSessionId,
          p_updates: updates,
        });
      } catch (e) {
        console.warn("[NPC] update_batch failed", e);
      }
    }
  };

  tick();
}


// ---------- Session lock (single-login) ----------
const SESSION_STALE_SECONDS = 20;
const SESSION_HEARTBEAT_MS = 5000;

const clientSessionId = crypto.randomUUID();
let sessionHeartbeatTimer = null;
let sessionLockAcquired = false;
let acquiringSession = false;

// -------------------- PROFILE + SAVE KEYS --------------------
const PROFILE_KEY = "voidquest_profile_v1";

// --- Cloud save cache ---
let CLOUD_SAVE_CACHE = null;

async function hydrateSaveFromCloud() {
  try {
    const cloud = await cloudGetSave();
    if (cloud) {
      CLOUD_SAVE_CACHE = cloud;
      localStorage.setItem(SAVE_KEY, JSON.stringify(cloud));
      const cloudName = cloud?.profile?.name;
      if (cloudName && cloudName.trim().length >= 2) setProfileName(cloudName);
      return cloud;
    }
  } catch (e) {
    console.warn("[CLOUD] hydrate failed", e);
  }
  return null;
}

function getSave() {
  return CLOUD_SAVE_CACHE || null;
}

function hasSave() {
  return !!CLOUD_SAVE_CACHE && !!CLOUD_SAVE_CACHE.player;
}


function setProfileName(name) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ name }));
}

function getProfileName() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    return obj?.name || null;
  } catch {
    return null;
  }
}

function getCharacterNameFromSaveOrProfile() {
  // Hvis vi ikke har en cloud-save, finnes det ingen character enda
  if (!hasSave()) return null;

  const s = getSave();
  return s?.profile?.name || null;
}

async function destroyInventorySlotServer(slotIndex, qty = 0) {
  try {
    const { data, error } = await sb.rpc("rpc_inventory_destroy", {
      p_slot: slotIndex,
      p_qty: qty, // 0 = destroy all
    });

    if (error) {
      console.warn("[INV DESTROY RPC] error", error);
      logMessage("Server rejected destroy.", "error");
      return false;
    }

    if (data?.inventory) {
      inventory = normalizeInventory(data.inventory);
      renderInventoryWindow();
      if (shopOpen) renderShopWindow();
    }

    const itemName = ITEM_DEFS[data?.item_id]?.name || data?.item_id || "item";
    const removed = data?.removed ?? qty;
    logMessage(
      removed === 1 ? `Destroyed 1 ${itemName}.` : `${itemName} destroyed.`,
      "system"
    );

    return true;
  } catch (e) {
    console.warn("[INV DESTROY RPC] failed", e);
    logMessage("Server error (destroy).", "error");
    return false;
  }
}

async function swapInventorySlotsServer(from, to) {
  try {
    const { data, error } = await sb.rpc("rpc_inventory_swap", {
      p_from: from,
      p_to: to,
    });

    if (error) {
      console.warn("[INV SWAP RPC] error", error);
      logMessage("Server rejected inventory swap.", "error");
      return false;
    }

    if (data?.inventory) {
      inventory = normalizeInventory(data.inventory);
      renderInventoryWindow();
      if (shopOpen) renderShopWindow();
    }

    return true;
  } catch (e) {
    console.warn("[INV SWAP RPC] failed", e);
    logMessage("Server error (inventory swap).", "error");
    return false;
  }
}

async function equipFromInventoryServer(invIndex, slot) {
  try {
    const { data, error } = await sb.rpc("rpc_equip_from_inventory", {
      p_inv_slot: invIndex,
      p_slot: slot,
    });

    if (error) {
      console.warn("[EQUIP RPC] error", error);
      logMessage("Server rejected equip.", "error");
      return false;
    }

    if (data?.inventory) inventory = normalizeInventory(data.inventory);
    if (data?.equipped) equipped = normalizeEquipped(data.equipped);

    renderInventoryWindow();
    if (equipOpen) renderEquipWindow();
    if (skillsOpen) renderSkillsWindow();
    return true;
  } catch (e) {
    console.warn("[EQUIP RPC] failed", e);
    logMessage("Server error (equip).", "error");
    return false;
  }
}

async function unequipToInventoryServer(slot, toInvIndex) {
  try {
    const { data, error } = await sb.rpc("rpc_unequip_to_inventory", {
      p_slot: slot,
      p_to_slot: toInvIndex,
    });

    if (error) {
      console.warn("[UNEQUIP RPC] error", error);
      logMessage("Server rejected unequip.", "error");
      return false;
    }

    if (data?.inventory) inventory = normalizeInventory(data.inventory);
    if (data?.equipped) equipped = normalizeEquipped(data.equipped);

    renderInventoryWindow();
    if (equipOpen) renderEquipWindow();
    if (skillsOpen) renderSkillsWindow();
    return true;
  } catch (e) {
    console.warn("[UNEQUIP RPC] failed", e);
    logMessage("Server error (unequip).", "error");
    return false;
  }
}

async function swapBankSlotsServer(from, to) {
  try {
    const { data, error } = await sb.rpc("rpc_bank_swap", {
      p_from: from,
      p_to: to,
    });

    if (error) {
      console.warn("[BANK SWAP RPC] error", error);
      logMessage("Server rejected bank swap.", "error");
      return false;
    }

    if (data?.bank) {
      bank = normalizeBank(data.bank);
      renderBankWindow();
    }

    return true;
  } catch (e) {
    console.warn("[BANK SWAP RPC] failed", e);
    logMessage("Server error (bank swap).", "error");
    return false;
  }
}

async function bankTransferServer(from, slotIndex, qty = 0) {
  const to = from === "inventory" ? "bank" : "inventory";

  try {
    const { data, error } = await sb.rpc("rpc_bank_transfer", {
      p_from: from,
      p_slot: slotIndex,
      p_qty: qty, // 0 = all
      p_to: to,
    });

    if (error) {
      console.warn("[BANK TRANSFER RPC] error", error);
      logMessage("Server rejected bank transfer.", "error");
      return false;
    }

    if (data?.inventory) inventory = normalizeInventory(data.inventory);
    if (data?.bank) bank = normalizeBank(data.bank);

    if (inventoryOpen) renderInventoryWindow();
    if (bankOpen) renderBankWindow();

    const itemName = ITEM_DEFS[data?.item_id]?.name || data?.item_id || "item";
    const moved = data?.moved ?? qty;
    logMessage(
      to === "bank"
        ? `Deposited ${moved} ${itemName}.`
        : `Withdrew ${moved} ${itemName}.`,
      "loot"
    );

    return true;
  } catch (e) {
    console.warn("[BANK TRANSFER RPC] failed", e);
    logMessage("Server error (bank transfer).", "error");
    return false;
  }
}

async function shopBuyServer(npcId, itemId, qty = 1) {
  try {
    const { data, error } = await sb.rpc("rpc_shop_buy", {
      p_npc_id: npcId,
      p_item_id: itemId,
      p_qty: qty,
    });

    if (error) {
      console.warn("[SHOP BUY RPC]", error);

      const msg = (error.message || "").toLowerCase();
      if (msg.includes("not enough")) logMessage("You don't have the required items to pay.", "error");
      else if (msg.includes("no inventory space")) logMessage("Inventory is full.", "error");
      else logMessage("Shop purchase failed.", "error");

      return false;
    }

    if (data?.inventory) {
      inventory = normalizeInventory(data.inventory);
      if (inventoryOpen) renderInventoryWindow();
    }

    const name = ITEM_DEFS[data?.item_id]?.name || data?.item_id;
    logMessage(`You bought ${name} (x${data.qty}).`, "loot");

    renderShopWindow();
    return true;
  } catch (e) {
    console.warn("[SHOP BUY RPC] failed", e);
    logMessage("Server error (shop).", "error");
    return false;
  }
}



// -------------------- SAVE / LOAD (LocalStorage) --------------------
const SAVE_KEY = "voidquest_save_v1";

function buildSaveData() {
  return {
    v: 1,
    ts: Date.now(),

    profile: {
      name: getProfileName(),
      gender: player.gender || "male",
      respawn: respawnPoint || null,
    },

    // hvor du er
    levelId: currentLevelId,
    player: {
      x: player.x,
      y: player.y,
      level: getTotalSkillLevel(),
      xp: 0,
      hp: player.hp,
      maxHp: player.maxHp,
      facing: player.facing,
    },
    skills: skills,
    inventory: inventory,
    equipped: equipped,
    bank: bank,

  };
}

function applySaveData(data) {
  if (!data || typeof data !== "object") return false;

  // Gender 
  const sg = data?.profile?.gender ?? data?.player?.gender;
  if (sg) {
    player.gender = normalizeGender(sg);
  }

  respawnPoint = null;
  const r = data?.profile?.respawn;
  if (r && typeof r.levelId === "string" && Number.isFinite(+r.x) && Number.isFinite(+r.y)) {
    respawnPoint = { levelId: r.levelId, x: Math.floor(+r.x), y: Math.floor(+r.y) };
  }

  // fallback i stedet for å “miste” save
  let levelId = data.levelId;
  if (!levelId || !LEVELS[levelId]) {
    const fallback = Object.keys(LEVELS)[0]; // eller "spenningsbyen" hvis du vil hardkode
    console.warn("[SAVE] Unknown levelId in save:", levelId, "-> fallback:", fallback);
    levelId = fallback;
  }
  // 0) Player core stats
  player.maxHp = clamp(data.player.maxHp, 1, 100);
  if (Number.isFinite(data.player?.hp)) player.hp = clamp(data.player.hp, 0, player.maxHp);

  // 1) Total level = sum av skills.
  player.xp = 0;
  player.level = 1;

  renderHpHeart();

  // 2) Flytt til riktig level + pos
  const px = Number(data.player?.x);
  const py = Number(data.player?.y);
  if (!Number.isFinite(px) || !Number.isFinite(py)) return false;

  setLevel(levelId, null, { x: px, y: py });

  // 3) facing
  if (typeof data.player?.facing === "string") {
    player.facing = data.player.facing;
  }

  // 4) skills
  if (data.skills && typeof data.skills === "object") {
    for (const id of ["combat", "mining", "woodcutting", "fishing"]) {
      const s = data.skills[id];
      if (s && typeof s === "object") {
        skills[id] = {
          xp: Math.max(0, Math.floor(s.xp || 0)),
          level: 1,
        };
        skills[id].level = skillLevelFromXp(skills[id].xp);
        player.level = Math.max(1, getTotalSkillLevel());
        syncDerivedPlayerHpLimits();
      }
    }
  }

  // Total level (for UI/backwards compat)
  player.level = Math.max(1, getTotalSkillLevel());
  
  // 5) inventory
  inventory = normalizeInventory(data.inventory);
  if (inventoryOpen) renderInventoryWindow();

  // 6) equipped
  equipped = normalizeEquipped(data.equipped);
  if (equipOpen) renderEquipWindow();

  // 7) bank 
  bank = normalizeBank(data.bank);
  if (bankOpen) renderBankWindow();

  // 8) Consumable cooldown
  foodCooldownUntilMs = Number(data?.cooldowns?.food_until_ms || 0) || 0;
  if (Date.now() < foodCooldownUntilMs) startFoodCooldownLoop();

  return true;
}

function canWriteSave() {
  const name = getProfileName();
  return typeof name === "string" && name.trim().length >= 2 && gameStarted;
}

async function saveGame() {
  if (!canWriteSave()) return false;

  const session = await requireSession();
  if (!session) {
    logMessage("Du må være logget inn for å lagre.", "error");
    return false;
  }

  try {
    const data = buildSaveData();
    const ok = await cloudUpsertSave(data);
    if (!ok) throw new Error("cloud save failed");
    CLOUD_SAVE_CACHE = data;
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    console.log("[CLOUD] Game saved.", new Date().toLocaleTimeString());
    return true;
  } catch (err) {
    console.error("Save failed:", err);
    logMessage("Cloud save failed (see console).", "error");
    return false;
  }
}


// -------------------- SAVE / LOAD (Supabase) --------------------
async function cloudGetSave() {
  const session = await requireSession();
  if (!session) return null;

  const { data, error } = await sb
    .from("game_saves")
    .select("save, updated_at")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (error) {
    console.warn("[CLOUD] get save error", error);
    return null;
  }
  return data?.save || null;
}

async function cloudUpsertSave(saveObj) {
  const session = await requireSession();
  if (!session) return false;

  const { data, error } = await sb.rpc("rpc_save_upsert", { p_save: saveObj });
  if (error) {
    console.warn("[CLOUD] rpc_save_upsert error", error);
    return false;
  }
  return true;
}

async function loadGame() {
  try {
    const session = await requireSession();
    if (!session) return false;

    const data = await cloudGetSave();
    if (!data) return false;

    const ok = applySaveData(data);
    if (!ok) {
      logMessage("Cloud save invalid. Starting fresh.", "error");
      return false;
    }

    logMessage("Cloud save loaded.", "system");
    return true;
  } catch (err) {
    console.error("Load failed:", err);
    logMessage("Cloud load failed (see console).", "error");
    return false;
  }
}

// -------- Position autosave (cloud) --------
let lastPosSaveAt = 0;
let lastPosSent = { levelId: null, x: null, y: null, facing: null };

async function cloudSavePosition(force = false) {
  if (!gameStarted) return;
  const session = await requireSession();
  if (!session) return;

  const now = Date.now();
  if (!force && now - lastPosSaveAt < 2500) return; // rate limit: 2.5s

  const x = Math.floor(player.x);
  const y = Math.floor(player.y);
  const lvl = currentLevelId;
  const facing = player.facing || null;

  // Ikke send hvis ingenting har endret seg (spar DB)
  if (
    !force &&
    lastPosSent.levelId === lvl &&
    lastPosSent.x === x &&
    lastPosSent.y === y &&
    lastPosSent.facing === facing
  ) return;

  try {
    await sb.rpc("rpc_set_position", {
      p_level_id: lvl,
      p_x: x,
      p_y: y,
      p_facing: facing,
    });

    lastPosSaveAt = now;
    lastPosSent = { levelId: lvl, x, y, facing };
  } catch (e) {
    console.warn("[POS SAVE] rpc_set_position failed", e);
  }
}


// -------------------- MIGRATION: localStorage -> Supabase --------------------
async function migrateLocalSaveToCloudIfNeeded() {
  const session = await requireSession();
  if (!session) return;

  // 1. Finnes cloud save allerede?
  const cloudSave = await cloudGetSave();
  if (cloudSave) {
    console.log("[MIGRATE] Cloud save exists, skipping migration.");
    return;
  }

  // 2. Finnes gammel local save?
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    console.log("[MIGRATE] No local save found.");
    return;
  }

  try {
    const localSave = JSON.parse(raw);

    const ok = await cloudUpsertSave(localSave);
    if (ok) {
      console.log("[MIGRATE] Local save uploaded to cloud.");
    }
  } catch (err) {
    console.warn("[MIGRATE] Failed to migrate local save:", err);
  }
}



function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function setLevel(newLevelId, entryFromDirection = null, forcedSpawn = null) {
  currentLevelId = newLevelId;
  level = LEVELS[currentLevelId];

  // Velg tile-pos
  if (forcedSpawn) {
    player.x = forcedSpawn.x;
    player.y = forcedSpawn.y;
  } else if (entryFromDirection === "west") {
    player.x = 1;
    player.y = clamp(player.y, 1, level.height - 2);
  } else if (entryFromDirection === "east") {
    player.x = level.width - 2;
    player.y = clamp(player.y, 1, level.height - 2);
  } else if (entryFromDirection === "north") {
    player.y = 1;
    player.x = clamp(player.x, 1, level.width - 2);
  } else if (entryFromDirection === "south") {
    player.y = level.height - 2;
    player.x = clamp(player.x, 1, level.width - 2);
  } else {
    player.x = level.spawn.x;
    player.y = level.spawn.y;
  }

  // Snap pixel-pos til tile-pos
  player.px = player.x * TILE_SIZE;
  player.py = player.y * TILE_SIZE;

  // stopp eventuell bevegelse
  player.moving = false;
  player.moveElapsed = 0;

  updateHud();
  cloudSavePosition(true);

  // Multiplayer subscriptions for new level
  subscribeToPresence(currentLevelId, false);
  subscribeToNpcPresence(currentLevelId);
  npcDriverStop("__old__"); 
  npcDriverStart(currentLevelId);

}


async function changeLevel(newLevelId, entryFromDirection = null, forcedSpawn = null) {
  const oldLevelId = currentLevelId;

  // Player presence
  if (gameStarted && sessionLockAcquired) {
    await presenceRemove();
  }

  // NPC roaming/driver for gammelt level
  npcDriverStop(oldLevelId);

  // unsub realtime for npc presence på gammelt level
  if (npcChannel) {
    try { await sb.removeChannel(npcChannel); } catch {}
    npcChannel = null;
  }

  // ---- BYTT LEVEL ----
  setLevel(newLevelId, entryFromDirection, forcedSpawn);

  // ---- START ting for nytt level ----
  if (gameStarted && sessionLockAcquired) {
    // Player presence
    await subscribeToPresence(currentLevelId);
    await ensureRealtimeAuth();
    await presenceUpsert(true);

    // NPC presence + driver (roaming)
    await subscribeToNpcPresence(currentLevelId);
    await npcDriverStart(currentLevelId);
  } else {
    // Hvis du støtter "singleplayer før login" eller lignende:
    // Start NPC-sync uansett (om du vil at roaming skal virke uten presence)
    await subscribeToNpcPresence(currentLevelId);
    await npcDriverStart(currentLevelId);
  }
}



function tileAtLayer(grid, x, y) {
  if (!grid) return null;

  // Bruk level.width/height som “logisk verden”
  if (y < 0 || y >= level.height || x < 0 || x >= level.width) return null;

  // SAFE: grid kan mangle rader/kolonner når du har endret størrelse
  const row = grid[y];
  if (!row) return null;

  const v = row[x];
  return (v === undefined ? null : v);
}

function isWalkable(x, y) {
  // NPCer blokkerer ruten
  if (isNpcBlocking(x, y)) return false;

  const mid = tileAtLayer(level.grid_mid, x, y);
  if (mid && mid !== EMPTY) {
    const def = TILE_DEFS[mid];
    return !!def?.walkable;
  }

  const base = tileAtLayer(level.grid_base, x, y);
  if (!base || base === EMPTY) return false;
  const def = TILE_DEFS[base];
  return !!def?.walkable;
}

function getTopmostTileKeyAt(x, y) {
  // Prioritet: mid først (for trees), ellers base.
  const mid = tileAtLayer(level.grid_mid, x, y);
  if (mid && mid !== EMPTY) return { layer: "mid", key: mid };

  const base = tileAtLayer(level.grid_base, x, y);
  if (base && base !== EMPTY) return { layer: "base", key: base };

  return null;
}

function getFacedTileCoords() {
  let dx = 0, dy = 0;

  if (player.facing === "up") dy = -1;
  else if (player.facing === "down") dy = 1;
  else if (player.facing === "left") dx = -1;
  else if (player.facing === "right") dx = 1;

  return { x: player.x + dx, y: player.y + dy };
}

function describeFacedBlockedTile() {
  // ikke i menyer/pause
  if (!gameStarted) return;
  if (isUiBlocked()) return;

  const { x, y } = getFacedTileCoords();

  const top = getTopmostTileKeyAt(x, y);
  if (!top) {
    logMessage("Nothing interesting there.", "system");
    return;
  }

  const def = TILE_DEFS[top.key];
  const walkable = !!def?.walkable;

  // Kun “blocked” tiles som du ikke kan gå gjennom
  if (walkable) return;

  const text = def?.description || "Something is there.";
  logMessage(text, "system");
}


function isAdjacentToPlayer(tx, ty) {
  const dx = Math.abs(player.x - tx);
  const dy = Math.abs(player.y - ty);
  // “ved siden av” i 4-retning
  return (dx + dy) === 1;
}

function closeContextMenu() {
  contextMenu.classList.add("hidden");
  contextMenu.setAttribute("aria-hidden", "true");
  contextMenu.innerHTML = "";
}

function openContextMenu(px, py, title, entries) {
  // entries: [{label, onClick}]
  contextMenu.innerHTML = "";

  const titleEl = document.createElement("div");
  titleEl.className = "cm-title";
  titleEl.textContent = title;
  contextMenu.appendChild(titleEl);

  for (const entry of entries) {
    const btn = document.createElement("button");
    btn.className = "cm-item";
    btn.type = "button";
    btn.textContent = entry.label;
    btn.addEventListener("click", () => {
      closeContextMenu();
      entry.onClick();
    });
    contextMenu.appendChild(btn);
  }

  // posisjon inne i game-wrap
  const wrapRect = gameWrap.getBoundingClientRect();
  const menuRectWidth = 180; // approx for clamp
  const menuRectHeight = 120;

  let left = px - wrapRect.left;
  let top = py - wrapRect.top;

  // clamp så menyen ikke går utenfor game-wrap
  left = Math.max(8, Math.min(left, wrapRect.width - menuRectWidth - 8));
  top = Math.max(8, Math.min(top, wrapRect.height - menuRectHeight - 8));

  contextMenu.style.left = `${left}px`;
  contextMenu.style.top = `${top}px`;

  contextMenu.classList.remove("hidden");
  contextMenu.setAttribute("aria-hidden", "false");
}


const TILED_H = 0x80000000; // horizontal
const TILED_V = 0x40000000; // vertical
const TILED_D = 0x20000000; // diagonal

function applyTiledFlagsTransform(ctx, flags, dx, dy, dw, dh) {
  if (!flags) return false;

  const flipH = (flags & TILED_H) !== 0;
  const flipV = (flags & TILED_V) !== 0;
  const flipD = (flags & TILED_D) !== 0;

  if (!flipH && !flipV && !flipD) return false;

  // Vi tegner rundt center av tile
  ctx.translate(dx + dw / 2, dy + dh / 2);

  // Bygg 2x2 matrise (a b; c d)
  // Start = identity
  let a = 1, b = 0, c = 0, d = 1;

  // Tiled: diagonal-flip er "transpose" (speil over diagonal)
  // Representert som matrise: [0 1; 1 0]
  function mul(na, nb, nc, nd) {
    // left-multiply: N * M
    const ra = na * a + nb * c;
    const rb = na * b + nb * d;
    const rc = nc * a + nd * c;
    const rd = nc * b + nd * d;
    a = ra; b = rb; c = rc; d = rd;
  }

  if (flipD) mul(0, 1, 1, 0);
  if (flipH) mul(-1, 0, 0, 1);
  if (flipV) mul(1, 0, 0, -1);

  ctx.transform(a, b, c, d, 0, 0);

  // Etter transform tegner vi med origo i senter
  ctx.translate(-dw / 2, -dh / 2);

  return true;
}


// ----------- Rendering -----------
function drawLayer(grid, flagsGrid, imageDict, camX, camY) {
  const { startX, startY, endX, endY } = getVisibleTileBounds(camX, camY);

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const key = tileAtLayer(grid, x, y);
      const flags = flagsGrid ? tileAtLayer(flagsGrid, x, y) : 0;
      if (!key || key === EMPTY) continue;

      const def = TILE_DEFS[key];
      const imgOrFrames = imageDict[key];

      // 1) Separate PNG frames (Image[])
      if (def?.animated && Array.isArray(def.frames) && Array.isArray(imgOrFrames)) {
        const frameCount = imgOrFrames.length;
        const dur = def.frameDuration ?? 200;
        const frameIndex = Math.floor(animTime / dur) % frameCount;

        const frameImg = imgOrFrames[frameIndex];
        ctx.drawImage(frameImg, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        continue;
      }

      // 2) Spritesheet animasjon (ett bilde med frames på x-aksen)
      if (def?.animated && typeof def.frames === "number" && imgOrFrames instanceof Image) {
        const frameCount = def.frames;
        const dur = def.frameDuration ?? 200;
        const frameIndex = Math.floor(animTime / dur) % frameCount;

        ctx.drawImage(
          imgOrFrames,
          frameIndex * TILE_SIZE, 0,
          TILE_SIZE, TILE_SIZE,
          x * TILE_SIZE, y * TILE_SIZE,
          TILE_SIZE, TILE_SIZE
        );
        continue;
      }

      // 3) Vanlig tile
      if (imgOrFrames instanceof Image) {
        const dx = x * TILE_SIZE;
        const dy = y * TILE_SIZE;

        ctx.save();
        const transformed = applyTiledFlagsTransform(ctx, flags, dx, dy, TILE_SIZE, TILE_SIZE);

        if (transformed) {
          // vi er allerede flyttet til (dx,dy) inne i transform-funksjonen
          ctx.drawImage(imgOrFrames, 0, 0, TILE_SIZE, TILE_SIZE);
        } else {
          ctx.drawImage(imgOrFrames, dx, dy, TILE_SIZE, TILE_SIZE);
        }

        ctx.restore();
      } else {
        ctx.fillStyle = "#ff00ff";
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function drawMinimap() {
  if (!minimapCanvas) return;

  // Hvor mange tiles rundt spilleren minimap viser:
  // 6 => diameter 13 tiles (6 venstre + spiller + 6 høyre)
  const R = 16;
  const tilesAcross = R * 2 + 1;

  // Skala: minimap-pixler per world-pixel
  const scale = MINIMAP_SIZE / (tilesAcross * TILE_SIZE);

  const centerX = MINIMAP_SIZE / 2;
  const centerY = MINIMAP_SIZE / 2;
  const radiusPx = MINIMAP_SIZE / 2;

  // spilleren sin “world-pixel” pos (bruk px for smooth)
  const worldCenterX = player.px + TILE_SIZE / 2;
  const worldCenterY = player.py + TILE_SIZE / 2;

  // Topp-venstre world-pixel for minimap-utsnittet
  const viewWorldW = tilesAcross * TILE_SIZE;
  const viewWorldH = tilesAcross * TILE_SIZE;
  const viewWorldX = worldCenterX - viewWorldW / 2;
  const viewWorldY = worldCenterY - viewWorldH / 2;

  // ---- clear + sirkulær clip ----
  mm.clearRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

  mm.save();
  mm.beginPath();
  mm.arc(centerX, centerY, radiusPx, 0, Math.PI * 2);
  mm.clip();

  // Bakgrunn inni sirkelen
  mm.fillStyle = "rgba(0,0,0,0.25)";
  mm.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

  // ---- tegn tiles (base + mid + top) i et lite område ----
  const startTileX = Math.floor(viewWorldX / TILE_SIZE);
  const startTileY = Math.floor(viewWorldY / TILE_SIZE);
  const endTileX = startTileX + tilesAcross - 1;
  const endTileY = startTileY + tilesAcross - 1;

  // Helper: tegn en tile fra en grid
  function drawMiniLayer(grid) {
    for (let ty = startTileY; ty <= endTileY; ty++) {
      for (let tx = startTileX; tx <= endTileX; tx++) {
        const key = tileAtLayer(grid, tx, ty);
        if (!key || key === EMPTY) continue;

        const imgOrFrames = tileImages[key];
        if (!imgOrFrames) continue;

        // world-pixel -> minimap-pixel
        const wx = tx * TILE_SIZE;
        const wy = ty * TILE_SIZE;
        const mx = (wx - viewWorldX) * scale;
        const my = (wy - viewWorldY) * scale;
        const mSize = TILE_SIZE * scale;

        // Hvis animert tile (frames array), velg frame
        const def = TILE_DEFS[key];
        if (def?.animated && Array.isArray(def.frames) && Array.isArray(imgOrFrames)) {
          const frameCount = imgOrFrames.length;
          const dur = def.frameDuration ?? 200;
          const frameIndex = Math.floor(animTime / dur) % frameCount;
          const frameImg = imgOrFrames[frameIndex];
          mm.drawImage(frameImg, mx, my, mSize, mSize);
          continue;
        }

        // Hvis spritesheet animasjon (ett bilde med frames)
        if (def?.animated && typeof def.frames === "number" && imgOrFrames instanceof Image) {
          const frameCount = def.frames;
          const dur = def.frameDuration ?? 200;
          const frameIndex = Math.floor(animTime / dur) % frameCount;

          mm.drawImage(
            imgOrFrames,
            frameIndex * TILE_SIZE, 0,
            TILE_SIZE, TILE_SIZE,
            mx, my,
            mSize, mSize
          );
          continue;
        }

        // Vanlig tile
        if (imgOrFrames instanceof Image) {
          mm.drawImage(imgOrFrames, mx, my, mSize, mSize);
        }
      }
    }
  }

  drawMiniLayer(level.grid_base);
  drawMiniLayer(level.grid_mid);
  drawMiniLayer(level.grid_top);

  // ---- spiller-markør i sentrum ----
  mm.save();
  mm.fillStyle = "#ffffff";
  mm.beginPath();
  mm.arc(centerX, centerY, Math.max(2, 4 * (MINIMAP_SIZE / 160)), 0, Math.PI * 2);
  mm.fill();
  mm.restore();

  mm.restore(); // clip

  // ---- enkel border-ring (midlertidig, til du legger rammebilde) ----
  mm.save();
  mm.strokeStyle = "rgba(255,255,255,0.35)";
  mm.lineWidth = 3;
  mm.beginPath();
  mm.arc(centerX, centerY, radiusPx - 1.5, 0, Math.PI * 2);
  mm.stroke();
  mm.restore();
}

function normalizeGender(g) {
  if (g === "female") return "female";
  if (g === "gnome") return "gnome";
  return "male";
}

function getMyArmorIdForPresence() {
  const s = getSave?.();
  return s?.equipped?.armor?.id || equipped?.armor?.id || null;
}

function pickAnimFrame(pack, isMoving, moveElapsedMs) {
  if (!pack) return null;

  if (!isMoving) {
    const frames = pack.idle || [];
    if (!frames.length) return null;
    const idx = Math.floor(animTime / PLAYER_IDLE_FRAME_MS) % frames.length;
    return frames[idx];
  }

  if (pack.walk && pack.walk.length > 0) {
    const idx = Math.floor(moveElapsedMs / PLAYER_WALK_FRAME_MS) % pack.walk.length;
    return pack.walk[idx];
  }

  // fallback
  const frames = pack.idle || [];
  if (!frames.length) return null;
  const idx = Math.floor(animTime / PLAYER_IDLE_FRAME_MS) % frames.length;
  return frames[idx];
}

function getActiveSkinId() {
  return normalizeGender(player.gender);
}

function getPlayerDrawSpec(gender) {
  const g = normalizeGender(gender);

  // default: male/female = 1x2 tiles
  let wTiles = 1;
  let hTiles = 2;

  // gnome = 1x1 tile
  if (g === "gnome") {
    wTiles = 1;
    hTiles = 1;
  }

  const w = TILE_SIZE * wTiles;
  const h = TILE_SIZE * hTiles;

  // Ankres ved føtter: trekk opp (hTiles - 1)
  const yOffset = TILE_SIZE * (hTiles - 1);

  // (Hvis du senere vil ha bredere raser, kan du sentrere på samme måte)
  const xOffset = (w - TILE_SIZE) / 2;

  return { w, h, xOffset, yOffset };
}

function getPlayerBaseSprite() {
  const baseId = getActiveSkinId(); 
  const skin = playerSkins[baseId];
  if (!skin) return null;

  const pack = skin[player.facing];
  return pickAnimFrame(pack, player.moving, player.moveElapsed);
}

function getPlayerArmorSprite() {
  const armorId = equipped?.armor?.id;
  if (!armorId) return null;

  const s = getSave?.(); 
  const gender = normalizeGender(s?.profile?.gender ?? s?.player?.gender ?? player?.gender);

  const skin = armorSkins[armorKey(armorId, gender)];
  if (!skin) return null;

  const pack = skin[player.facing] || skin.down;
  return pickAnimFrame(pack, player.moving, player.moveElapsed);
}

function getPlayerSprite() {
  const skinId = getActiveSkinId();
  const skin = playerSkins[skinId];
  if (!skin) return null;

  const pack = skin[player.facing];
  if (!pack) return null;

  // Hvis ikke moving: idle
  if (!player.moving) {
    const frames = pack.idle || [];
    if (frames.length === 0) return null;
    const idx = Math.floor(animTime / PLAYER_IDLE_FRAME_MS) % frames.length;
    return frames[idx];
  }

  // Hvis moving og vi har walk-frames: velg frame
  if (pack.walk && pack.walk.length > 0) {
    const t = player.moveElapsed; // ms inn i steget
    const idx = Math.floor(t / PLAYER_WALK_FRAME_MS) % pack.walk.length;
    return pack.walk[idx];
  }

  return pack.idle;
}

// --- NPC RENDER SIZE (visual only) ---
function getNpcDrawSpec(n) {

  const preset = n.sizePreset || null;

  let wTiles = 1;
  let hTiles = 2;

  if (preset === "big") {
    wTiles = 2;
    hTiles = 2;
  } else if (preset === "tall") {
    wTiles = 1;
    hTiles = 2;
  }

  // Direkte override hvis du heller vil styre selv
  if (Number.isFinite(n.drawWTiles)) wTiles = n.drawWTiles;
  if (Number.isFinite(n.drawHTiles)) hTiles = n.drawHTiles;

  const w = TILE_SIZE * wTiles;
  const h = TILE_SIZE * hTiles;

  // Vi ankrer på "føtter" (n.x/n.y er bunn-tile)
  const yOffset = TILE_SIZE * (hTiles - 1);

  // Hvis den er bredere enn 1 tile: senter den rundt tile’n
  const xOffset = (w - TILE_SIZE) / 2;

  return { w, h, xOffset, yOffset };
}



function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // oppdater kamera før vi tegner
  updateCamera();

  // Snap kamera til hele piksler for å unngå seams
  const camX = Math.round(cameraPx);
  const camY = Math.round(cameraPy);

  ctx.save();
  ctx.translate(-camX, -camY);

  // base -> mid
  drawLayer(level.grid_base, level.grid_base_flags, tileImages, camX, camY);
  drawLayer(level.grid_mid,  level.grid_mid_flags,  tileImages, camX, camY);

  //NPC
  const nowMs = performance.now();

  drawMinimap();

  for (const n of getNpcsInLevel()) {
    const path = getNpcSpritePathForTime(n, nowMs);
    const img = path ? npcImages[path] : null;

    const nx = n.x * TILE_SIZE;
    const ny = n.y * TILE_SIZE;

    const { w, h, xOffset, yOffset } = getNpcDrawSpec(n);
    const drawX = nx - xOffset;
    const drawY = ny - yOffset;

    // --- draw npc sprite ---
    if (img) {
      ctx.drawImage(img, drawX, drawY, w, h);
    } else {
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(drawX, drawY, w, h);
    }

    // --- HIT FLASH (NPC) ---
    if (n._hitFlashUntil && nowMs < n._hitFlashUntil) {
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(drawX, drawY, w, h);
      ctx.restore();
    }

    // --- ENEMY HEALTH BAR ---
    if (n.hostile && typeof n.maxHp === "number") {
      const hp = getNpcHp(n);
      const max = n.maxHp;

      if (hp < max) {
        const barW = TILE_SIZE - 8; // behold samme bredde som før (ser ryddig ut)
        const barH = 5;

        const bx = nx + 4;        // låst til tile
        const by = drawY - 8;     // over hodet (bruk drawY)

        const pct = Math.max(0, Math.min(1, hp / max));
        const fillW = Math.floor(barW * pct);

        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = "#000000";
        ctx.fillRect(bx - 1, by - 1, barW + 2, barH + 2);

        ctx.fillStyle = "#400000";
        ctx.fillRect(bx, by, barW, barH);

        ctx.fillStyle = "#00c853";
        ctx.fillRect(bx, by, fillW, barH);
        ctx.restore();
      }
    }

    drawWorldMap();
  }


  drawOtherPlayers(nowMs);

  // player (base + armor overlay)
  const baseImg = getPlayerBaseSprite();
  const armorImg = getPlayerArmorSprite();

  const { w, h, xOffset, yOffset } = getPlayerDrawSpec(player.gender);

  const drawX = player.px - xOffset;
  const drawY = player.py - yOffset;

  if (baseImg) {
    ctx.drawImage(baseImg, drawX, drawY, w, h);
  } else {
    ctx.fillStyle = "#4cc9f0";
    ctx.fillRect(drawX, drawY, w, h);
  }

  // armor oppå base
  if (armorImg) {
    ctx.drawImage(armorImg, drawX, drawY, w, h);
  }

  // HIT FLASH (player) – bruk samme w/h og drawX/drawY
  if (player._hitFlashUntil && nowMs < player._hitFlashUntil) {
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(drawX, drawY, w, h);
    ctx.restore();
  }

  // --- FISHING TOOL (blink over player) ---
  // Forskjell fra mining/woodcutting: vi tegner selve fishing rod over hodet
  // og lar den fade sakte inn/ut for å vise at du fisker.
  if (fishing.active) {
    const t = equipped?.tool;
    const path = t?.icon || t?.fxSprite;
    const img = path ? fxImages[path] || tileImages[path] || null : null;

    // slow fade: 0.35..0.95
    const a = 0.35 + 0.60 * (0.5 + 0.5 * Math.sin(nowMs / 420));

    const size = 26; // px
    const ox = player.px + (TILE_SIZE / 2) - (size / 2);
    const oy = player.py - 18; // litt over hodet

    ctx.save();
    ctx.globalAlpha = a;
    if (img) {
      ctx.drawImage(img, ox, oy, size, size);
    } else {
      // fallback: liten prikk hvis bildet ikke finnes ennå
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillRect(ox, oy, size, size);
    }
    ctx.restore();
  }

  // --- COMBAT FX (slash) ---
  if (combatFx.length) {
    // fjern utløpte
    combatFx = combatFx.filter(fx => nowMs < fx.endMs);

    for (const fx of combatFx) {
      const t = (nowMs - fx.startMs) / (fx.endMs - fx.startMs); // 0..1
      if (t < 0 || t > 1) continue;

      const dx = fx.tx - fx.ax;
      const dy = fx.ty - fx.ay;

      // midtpunkt som "swing" beveger seg rundt
      const mx = fx.ax + dx * 0.55;
      const my = fx.ay + dy * 0.55;

      // hvis du har slash.png: tegn den
      const spriteKey = fx.spritePath || SLASH_FX_SPRITE;
      const slashImg = fxImages[spriteKey];
      if (slashImg) {
        ctx.save();
        ctx.translate(mx, my);
        // enkel “pop” (topp i midten av animasjonen)
        const s = 0.7 + Math.sin(t * Math.PI) * 0.6;
        ctx.scale(s, s);
        ctx.globalAlpha = 0.9;

        // roter litt i retning attacker->target
        const ang = Math.atan2(dy, dx);
        ctx.rotate(ang);

        // tegn midtstilt
        ctx.drawImage(slashImg, -TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);

        ctx.restore();
      } else {
        // fallback: tegn en rask strek i retning attacker->target
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(fx.ax, fx.ay);
        ctx.lineTo(fx.tx, fx.ty);
        ctx.stroke();
        ctx.restore();
      }
    }
  }


  // top layer (synlig område)
  const { startX, startY, endX, endY } = getVisibleTileBounds(camX, camY);
  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      const key = tileAtLayer(level.grid_top, x, y);
      if (!key || key === EMPTY) continue;

      const img = tileImages[key];
      if (img) {
        ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else {
        ctx.fillStyle = "#ff00ff";
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  ctx.restore();
}


canvas.addEventListener("contextmenu", (e) => {
  if (isUiBlocked()) return;
  e.preventDefault();

  // Finn tile-koordinat fra musepos
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const mouseX = (e.clientX - rect.left) * scaleX;
  const mouseY = (e.clientY - rect.top) * scaleY;

  const worldX = mouseX + cameraPx;
  const worldY = mouseY + cameraPy;

  const tx = Math.floor(worldX / TILE_SIZE);
  const ty = Math.floor(worldY / TILE_SIZE);

  console.log("Right-click tile:", tx, ty);

  // NPC target?
  const npc = getNpcAt(tx, ty);
  if (npc) {
    const entries = [];

    // Attack hvis hostile
    if (npc.hostile) {
      entries.push({
        label: `Attack ${npc.name}`,
        onClick: () => startCombat(npc)
      });
    }

    entries.push({
      label: `Talk-to ${npc.name}`,
      onClick: () => {
        if (!isAdjacentToPlayer(tx, ty)) {
          logMessage("You need to stand next to the NPC.", "error");
          return;
        }
        openDialogForNpc(npc);
      }
    });

    entries.push({
      label: "Examine",
      onClick: () => {
        // Bare enemy stats hvis hostile, ellers vanlig NPC tekst
        if (npc.hostile) {
          const s = getEffectiveEnemyStats(npc);
          const pct = Math.round(s.hitChance * 100);
          logMessage(
            `${npc.name} — HP: ${s.hp}/${s.maxHp} • Hit chance: ${pct}% • Max hit: ${s.maxHit}`,
            "system"
          );
        } else {
          logMessage(`${npc.name} looks busy.`, "system");
        }
      }
    });

    openContextMenu(e.clientX, e.clientY, npc.name, entries);
    return; //ikke fall gjennom til tile-meny
  }


  const target = getTopmostTileKeyAt(tx, ty);
  if (!target) {
    closeContextMenu();
    return;
  }

  const tileDef = TILE_DEFS[target.key];
  const desc = tileDef?.description || "No description.";

  const portal = getPortalAt(tx, ty);

  const entries = [];

  // 1) Description alltid
  entries.push({
    label: "Description",
    onClick: () => {
      // Foreløpig: bare alert. (Vi kan lage et fint UI-panel senere)
      logMessage(desc, "system");
    }
  });

  if (portal) {
    entries.push({
      label: "Enter",
      onClick: async () => {
        if (!isAdjacentToPlayer(portal.x, portal.y)) {
          logMessage("You need to stand next to the door.", "error");
          return;
        }

        await enterPortal(portal);
      }
    });
  }

  // shop on campfire etc
  if (tileDef?.useShopId) {
    entries.push({
      label: tileDef.useLabel || "Use",
      onClick: () => {
        // krever at du står ved siden av tile
        if (!isAdjacentToPlayer(tx, ty)) {
          logMessage("You need to stand next to it.", "error");
          return;
        }

        // stopp combat hvis aktiv
        if (combat.active) stopCombat("You stop fighting.", performance.now());

        openShopForStaticShopId(tileDef.useShopId);
      }
    });
  }


  // Mine option hvis tile er mineable
  if (tileDef?.mining) {
    entries.push({
      label: "Mine",
      onClick: () => {
        // stopp combat hvis aktiv
        if (combat.active) stopCombat("You stop fighting.", performance.now());

        // start mining på denne tilen
        startMiningNode(tx, ty, target.layer, target.key, tileDef);
      }
    });
  }

  // Cut option hvis tile er cuttable
  if (tileDef?.woodcutting) {
    entries.push({
      label: "Cut",
      onClick: () => {
        if (combat.active) stopCombat("You stop fighting.", performance.now());
        startWoodcuttingNode(tx, ty, target.layer, target.key, tileDef);
      }
    });
  }

  // Fish option hvis tile er fishable
  if (tileDef?.fishing) {
    entries.push({
      label: "Fish",
      onClick: () => {
        if (combat.active) stopCombat("You stop fighting.", performance.now());
        startFishingSpot(tx, ty, target.layer, target.key, tileDef);
      }
    });
  }

  openContextMenu(e.clientX, e.clientY, target.key, entries);
});

const CHAT_MAX_LINES = 20;

function formatTimeHHMM() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function logMessage(text, type = "system") {
  if (!chatLogEl) return;

  const wasNearBottom =
    chatLogEl.scrollHeight - chatLogEl.scrollTop - chatLogEl.clientHeight < 12;

  const line = document.createElement("div");
  line.className = `chatline ${type}`;

  line.textContent = text;

  chatLogEl.appendChild(line);

  while (chatLogEl.children.length > CHAT_MAX_LINES) {
    chatLogEl.removeChild(chatLogEl.firstChild);
  }

  if (wasNearBottom) {
    chatLogEl.scrollTop = chatLogEl.scrollHeight;
  }
}





// ----------- Input (hold-to-walk) -----------
const held = {
  up: false,
  down: false,
  left: false,
  right: false,
};

// Prioritet: sist trykte retning føles best.
// Vi sporer “lastIntent”.
let lastIntent = null;

function setFacingFromDelta(dx, dy) {
  if (dx === 1) player.facing = "right";
  else if (dx === -1) player.facing = "left";
  else if (dy === 1) player.facing = "down";
  else if (dy === -1) player.facing = "up";
}

function intentFromHeld() {
  if (lastIntent && held[lastIntent]) return lastIntent;

  if (held.up) return "up";
  if (held.down) return "down";
  if (held.left) return "left";
  if (held.right) return "right";

  return null;
}

function dirToDelta(dir) {
  if (dir === "up") return { dx: 0, dy: -1 };
  if (dir === "down") return { dx: 0, dy: 1 };
  if (dir === "left") return { dx: -1, dy: 0 };
  if (dir === "right") return { dx: 1, dy: 0 };
  return { dx: 0, dy: 0 };
}

// -------------------- PAUSE / START MENU --------------------
let pauseOpen = false;
let pauseIndex = 0;

const PAUSE_ITEMS = [
  { id: "resume", label: "Resume" },
];

function isUiBlocked() {
  const dialogEl = document.getElementById("dialog"); // kan være null
  const dialogOpen = dialogEl ? !dialogEl.classList.contains("hidden") : false;
  return pauseOpen || dialogOpen ||  shopOpen || bankOpen || mining.active || woodcutting.active || fishing.active;
}

function renderPauseMenu() {
  if (!pauseItemsEl) return;
  pauseItemsEl.innerHTML = "";

  for (let i = 0; i < PAUSE_ITEMS.length; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pause-item" + (i === pauseIndex && pauseIndex >= 0 ? " selected" : "");
    btn.textContent = PAUSE_ITEMS[i].label;

    // Mouse: hover skal ikke “låse” selection, men klikk skal velge
    btn.addEventListener("mouseenter", () => {
      // valgfritt: IKKE sett pauseIndex her, da forblir highlight kun CSS-hover
    });

    btn.addEventListener("click", () => {
      pauseIndex = i;
      renderPauseMenu();
      pauseSelect();
    });

    pauseItemsEl.appendChild(btn);
  }
}

function openPauseMenu() {
  pauseOpen = true;
  pauseIndex = -1;
  renderPauseMenu();

  pauseMenuEl.classList.remove("hidden");
  pauseMenuEl.setAttribute("aria-hidden", "false");

  // Slipp bevegelse umiddelbart
  held.up = held.down = held.left = held.right = false;
  lastIntent = null;

  // Lukk context menu hvis åpen (actions skal ikke kunne brukes)
  closeContextMenu?.();
}

function closePauseMenu() {
  pauseOpen = false;
  pauseMenuEl.classList.add("hidden");
  pauseMenuEl.setAttribute("aria-hidden", "true");

  // Slipp input for sikkerhet
  held.up = held.down = held.left = held.right = false;
  lastIntent = null;
}

function togglePauseMenu() {
  if (!gameStarted) return; // ikke i main menu / character screen
  pauseOpen ? closePauseMenu() : openPauseMenu();
}

btnInventory?.addEventListener("click", () => {
  toggleInventoryWindow();
});

btnInventoryClose?.addEventListener("click", () => {
  closeInventoryWindow();
});

function pauseMoveSelection(delta) {
  if (pauseIndex < 0) pauseIndex = 0;
  pauseIndex = (pauseIndex + delta + PAUSE_ITEMS.length) % PAUSE_ITEMS.length;
  renderPauseMenu();
}

function pauseSelect() {
  if (pauseIndex < 0) return; // ingenting valgt ennå
  const item = PAUSE_ITEMS[pauseIndex];
  if (!item) return;

  if (item.id === "resume") {
    closePauseMenu();
    return;
  }

}

function startMove(dx, dy) {
  if (isUiBlocked()) return;
  if (player.moving) return;
  closeContextMenu();

  // Hvis du beveger deg mens du fighter: stopp combat (enkelt retreat)
  if (combat.active) {
    stopCombat("You retreat.", performance.now());
  }

  // oppdater facing med en gang (selv om blokkert)
  setFacingFromDelta(dx, dy);

  const nx = player.x + dx;
  const ny = player.y + dy;

  // edge transitions (før vi sjekker walkable)
  if (nx < 0) {
    const target = level.edges.west;
    if (target) setLevel(target, "east");
    return;
  }
  if (nx >= level.width) {
    const target = level.edges.east;
    if (target) setLevel(target, "west");
    return;
  }
  if (ny < 0) {
    const target = level.edges.north;
    if (target) setLevel(target, "south");
    return;
  }
  if (ny >= level.height) {
    const target = level.edges.south;
    if (target) setLevel(target, "north");
    return;
  }

  // kollisjon
  if (!isWalkable(nx, ny)) return;

  // start smooth tween
  player.moving = true;
  player.moveElapsed = 0;

  player.fromPx = player.px;
  player.fromPy = player.py;

  player.toPx = nx * TILE_SIZE;
  player.toPy = ny * TILE_SIZE;

  // oppdater tile-pos med en gang eller ved slutt?
  // For kollisjon/logic: vi oppdaterer ved SLUTT (tryggere)
  player._targetX = nx;
  player._targetY = ny;
}

function updateHud() {
  hudZone.textContent = `${level.name} (${level.id})`;
  hudPos.textContent = `${player.x}, ${player.y}`;
}

const HEART_IMG = "assets/ui/heart.png"; // <--- hjerte bildet

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}


// -------------------- HP SYNC (server) --------------------
let hpSyncTimer = null;
let pendingHpValue = null;

function queueHpSyncToServer(newHp) {
  pendingHpValue = newHp;

  // debounce: ikke spam server på hvert combat-tick
  if (hpSyncTimer) return;

  hpSyncTimer = setTimeout(async () => {
    hpSyncTimer = null;

    const hpToSend = pendingHpValue;
    pendingHpValue = null;

    try {
      const { data, error } = await sb.rpc("rpc_set_player_hp", { p_hp: hpToSend });
      if (error) {
        console.warn("[HP SYNC RPC]", error);
        return;
      }

      // Server er “source of truth”
      if (typeof data?.hp === "number") player.hp = data.hp;
      if (typeof data?.maxHp === "number") player.maxHp = data.maxHp;

      renderHpHeart?.();
    } catch (e) {
      console.warn("[HP SYNC RPC] failed", e);
    }
  }, 250); // 250ms er fint (kan økes til 500ms)
}

function damagePlayer(amount = 1) {
  player.hp = clamp(player.hp - amount, 0, player.maxHp);
  renderHpHeart();

  // synk HP raskt til server, så consume-RPC ser riktig hp
  queueHpSyncToServer(player.hp);

  if (player.hp <= 0) {
    logMessage("You died!", "error");

    // respawn med full HP
    player.hp = player.maxHp;

    const fallback = getDefaultSpawnForGender(player.gender);

    if (respawnPoint && LEVELS[respawnPoint.levelId]) {
      setLevel(respawnPoint.levelId, null, { x: respawnPoint.x, y: respawnPoint.y });
    } else if (fallback && LEVELS[fallback.levelId]) {

      setLevel(fallback.levelId, null, { x: fallback.x, y: fallback.y });
    } else {
      // hard-safe
      setLevel("spenningsbyen", null, { x: 233, y: 236 });
    }

    player.hp = clamp(player.hp - amount, 0, player.maxHp);
    renderHpHeart();

    // synk respawn-hp også
    queueHpSyncToServer(player.hp);

    saveGame?.();
    return;
  }

  saveGame?.();
}

function healPlayer(amount = 1) {
  player.hp = clamp(player.hp + amount, 0, player.maxHp);
  renderHpHeart();
  saveGame?.();
}

// --- DIALOG NPC ---
function openDialogForNpc(npc) {
  const dialogId = npc.dialogId;
  const dialog = DIALOGS[dialogId];
  if (!dialog) {
    logMessage(`${npc.name} has nothing to say.`, "system");
    return;
  }

  setChatVisible(false);
  dialogState.open = true;
  dialogState.npcId = npc.id;
  dialogState.dialogId = dialogId;
  dialogState.nodeId = dialog.start;
  dialogState.optionIndex = -1;

  // stopp bevegelse / slipp input
  held.up = held.down = held.left = held.right = false;
  lastIntent = null;

  // Sett NPC-portrett (bruk sprite foreløpig)
  if (npc.sprite) {
    dialogPortraitEl.style.backgroundImage = `url(${npc.sprite})`;
  } else {
    dialogPortraitEl.style.backgroundImage = "";
  }

  closeContextMenu?.();
  renderDialog();
}

function closeDialog() {
  dialogState.open = false;
  dialogState.npcId = null;
  dialogState.dialogId = null;
  dialogState.nodeId = null;
  dialogState.optionIndex = 0;
  if (gameStarted) setChatVisible(true);

  dialogEl.classList.add("hidden");
  dialogEl.setAttribute("aria-hidden", "true");
  dialogOptionsEl.innerHTML = "";

  dialogPortraitEl.style.backgroundImage = ""; 
}

function runDialogAction(actionId) {
  if (actionId === "heal") {
    healPlayer(1);
    logMessage("You feel slightly healthier.", "system");
  }
  if (actionId === "open_shop") {
    const npc = getNpcById(dialogState.npcId);
    closeDialog();
    if (npc) openShopForNpc(npc);
    return;
  }
  if (actionId === "open_bank") {
    const npc = getNpcById(dialogState.npcId);
    closeDialog();
    if (npc) openBankForNpc(npc);
    return;
  }

  if (actionId === "set_respawn_here") {
    const npc = getNpcById(dialogState.npcId);
    if (!npc) return;

    // Sett respawn til der spilleren står nå 
    const levelId = currentLevelId;
    const x = player.x;
    const y = player.y;

    respawnPoint = { levelId, x: Math.floor(x), y: Math.floor(y) };

    saveGame?.(); 
    logMessage(`Respawn set to this warden in ${LEVELS[levelId]?.name || levelId}.`, "system");
    return;
  }

}

function renderDialog() {
  if (!dialogState.open) return;

  const dialog = DIALOGS[dialogState.dialogId];
  const node = dialog?.nodes?.[dialogState.nodeId];
  if (!node) {
    closeDialog();
    return;
  }

  dialogNameEl.textContent = node.speaker || "Unknown";
  dialogTextEl.textContent = node.text || "";

  dialogOptionsEl.innerHTML = "";

  const npc = getNpcById(dialogState.npcId); // du har getNpcById allerede i combat-seksjonen
  const opts = [...(node.options || [])];

  // Hvis trader: legg inn shop-option øverst
  if (npc?.trader && Array.isArray(npc.shop) && npc.shop.length > 0) {
    opts.unshift({ label: "What do you sell?", action: "open_shop" });
  }

  if (npc?.banker) {
    opts.unshift({ label: "I'd like to access my bank.", action: "open_bank" });
  }

  if (opts.length === 0) {
    // hvis ingen options: vis bare “Close”
    const btn = document.createElement("button");
    btn.className = "dialog-option selected";
    btn.textContent = "Lukk";
    btn.addEventListener("click", closeDialog);
    dialogOptionsEl.appendChild(btn);
    dialogState.optionIndex = 0;
  } else {
    // clamp index
    dialogState.optionIndex = Math.max(0, Math.min(dialogState.optionIndex, opts.length - 1));

    opts.forEach((o, i) => {
      const btn = document.createElement("button");
      btn.className =   "dialog-option" + (dialogState.optionIndex >= 0 && i === dialogState.optionIndex ? " selected" : "");
      btn.type = "button";
      btn.textContent = o.label;

      btn.addEventListener("click", () => {
        dialogState.optionIndex = i;
        selectDialogOption();
      });

      dialogOptionsEl.appendChild(btn);
    });
  }

  dialogEl.classList.remove("hidden");
  dialogEl.setAttribute("aria-hidden", "false");
}

function moveDialogSelection(delta) {
  if (!dialogState.open) return;
  const dialog = DIALOGS[dialogState.dialogId];
  const node = dialog?.nodes?.[dialogState.nodeId];
  const opts = node?.options || [];
  if (opts.length === 0) return;

  if (dialogState.optionIndex < 0) dialogState.optionIndex = 0;

  dialogState.optionIndex = (dialogState.optionIndex + delta + opts.length) % opts.length;
  renderDialog();
}

function selectDialogOption() {
  if (!dialogState.open) return;

  const dialog = DIALOGS[dialogState.dialogId];
  const node = dialog?.nodes?.[dialogState.nodeId];
  const npc = getNpcById(dialogState.npcId);
  const opts = [...(node?.options || [])];

  if (npc?.trader && Array.isArray(npc.shop) && npc.shop.length > 0) {
    opts.unshift({ label: "What do you sell?", action: "open_shop" });
  }

  if (npc?.banker) {
    opts.unshift({ label: "I'd like to access my bank.", action: "open_bank" });
    
  }

  const choice = opts[dialogState.optionIndex];

  if (!choice) return;

  if (choice.action) runDialogAction(choice.action);

  if (choice.end) {
    closeDialog();
    return;
  }

  if (choice.next) {
    dialogState.nodeId = choice.next;
    dialogState.optionIndex = -1;
    renderDialog();
    return;
  }
}

function tryTalkToFacedNpc() {
  if (!gameStarted) return;
  if (isUiBlocked()) return;

  const { x, y } = getFacedTileCoords();
  const npc = getNpcAt(x, y);
  if (!npc) {
    logMessage("Ingen å snakke med der.", "system");
    return;
  }

  // Må stå ved siden av NPCen (samme regel som dører)
  if (!isAdjacentToPlayer(x, y)) {
    logMessage("Du må stå ved siden av NPCen.", "error");
    return;
  }

  openDialogForNpc(npc);
}

//============================FOOD============================

let foodCdRaf = 0;

function startFoodCooldownLoop() {
  if (foodCdRaf) return;

  const tick = () => {
    syncXpPopContainer();

    if (Date.now() < foodCooldownUntilMs) {
      foodCdRaf = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(foodCdRaf);
      foodCdRaf = 0;
      syncXpPopContainer();
    }
  };

  foodCdRaf = requestAnimationFrame(tick);
}


// Key handling
function keyToDir(key) {
  const k = key.toLowerCase();
  if (k === "arrowup" || k === "w") return "up";
  if (k === "arrowdown" || k === "s") return "down";
  if (k === "arrowleft" || k === "a") return "left";
  if (k === "arrowright" || k === "d") return "right";
  return null;
}

function isTypingInInput() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}


window.addEventListener("keydown", (e) => {
  // Hvis du skriver i input (f.eks. navn), IKKE stjel WASD
  if (isTypingInInput()) return;

  if (isUiBlocked()) return;

  // Hvis spillet ikke har startet ennå (meny/character screen), IKKE beveg
  if (!gameStarted) return;

  const dir = keyToDir(e.key);
  if (!dir) return;

  e.preventDefault();

  held[dir] = true;
  lastIntent = dir;

  if (!player.moving) {
    const { dx, dy } = dirToDelta(dir);
    startMove(dx, dy);
  }
});

// Disable browser right-click context menu (game-wide)
window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

window.addEventListener("keyup", (e) => {
  if (isTypingInInput()) return;
  if (!gameStarted) return;

  if (isUiBlocked()) return;

  const dir = keyToDir(e.key);
  if (!dir) return;

  e.preventDefault();
  held[dir] = false;
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    e.preventDefault();

    // Lukk shop først
    if (shopOpen) {
      closeShopWindow();
      return;
    }

    // Så equip
    if (equipOpen) {
      closeEquipWindow();
      return;
    }

    // så inventory 
    if (inventoryOpen) {
      closeInventoryWindow();
      return;
    }

    // Så skills
    if (skillsOpen) {
      closeSkillsWindow();
      return;
    }



    togglePauseMenu();
  }
});

btnEquip?.addEventListener("click", () => {
  toggleEquipWindow();
});

btnEquipClose?.addEventListener("click", () => {
  closeEquipWindow();
});

window.addEventListener("keydown", (e) => {
  if (isTypingInInput()) return;

  // Hvis dialog er åpen: naviger i dialog
  if (dialogState.open) {
    if (e.key === "ArrowUp") { e.preventDefault(); moveDialogSelection(-1); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); moveDialogSelection(1); return; }
    if (e.key === "Enter") { e.preventDefault(); selectDialogOption(); return; }
    if (e.key === "Escape") { e.preventDefault(); closeDialog(); return; }
    return;
  }

  // E / Enter: snakk med NPC foran deg (når ikke i pause)
  if (!isUiBlocked() && gameStarted && (e.key === "e" || e.key === "E")) {
    e.preventDefault();
    tryTalkToFacedNpc();
  }
});

btnSave?.addEventListener("click", () => {
  saveGame();
});

btnSkills?.addEventListener("click", () => {
  if (!gameStarted) return;
  skillsOpen ? closeSkillsWindow() : openSkillsWindow();
});

btnSkillsClose?.addEventListener("click", () => {
  closeSkillsWindow();
});

btnEquipClose?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeEquipWindow();
});

window.addEventListener("beforeunload", () => {
  // Bare autosave hvis det faktisk er et ferdig spill (navn+startet)
  if (canWriteSave()) saveGame();
});

// Klikk hvor som helst: lukk meny
window.addEventListener("mousedown", (e) => {
  // hvis du klikker inne i menyen, ikke lukk her (knappene håndterer seg selv)
  if (!contextMenu.classList.contains("hidden") && !contextMenu.contains(e.target)) {
    closeContextMenu();
  }
});

if (btnMap) btnMap.addEventListener("click", toggleMap);
if (btnMapClose) btnMapClose.addEventListener("click", () => setMapOpen(false));

window.addEventListener("resize", () => {
    resizeMapCanvas();
    drawWorldMap(); 
});

window.addEventListener("keydown", (e) => {
  // M toggler map (ikke hvis du skriver i input)
  if ((e.key === "m" || e.key === "M") && document.activeElement?.tagName !== "INPUT") {
    e.preventDefault();
    toggleMap();
  }

  // Escape lukker map hvis åpen
  if (e.key === "Escape" && mapOpen) {
    e.preventDefault();
    setMapOpen(false);
  }
});



// ----------- Game loop (update + draw) -----------
let lastTime = performance.now();

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function update(dtMs) {
  animTime += dtMs;
  updateOtherPlayersSmooth(dtMs);

  const nowMs = performance.now();
  updateEnemyRegens(nowMs); 
  updateRespawns(nowMs);
  updateTileRespawns(nowMs);
  updateCombat(nowMs);
  updateMining(nowMs);
  updateWoodcutting(nowMs);
  updateFishing(nowMs);
  if (player.moving) {
    player.moveElapsed += dtMs;
    const t = Math.min(1, player.moveElapsed / player.moveDuration);
    // smooth interpolation
    player.px = lerp(player.fromPx, player.toPx, t);
    player.py = lerp(player.fromPy, player.toPy, t);

    if (t >= 1) {
      // bevegelse ferdig: snap og sett tile-pos
      player.px = player.toPx;
      player.py = player.toPy;

      player.x = player._targetX;
      player.y = player._targetY;

      player.moving = false;
      updateHud();
      presenceUpsert(false);

      // Hvis en retning fortsatt holdes: gå videre uten hakking
      const nextDir = intentFromHeld();
      if (nextDir) {
        const { dx, dy } = dirToDelta(nextDir);
        if (STEP_REPEAT_DELAY_MS > 0) {
          setTimeout(() => startMove(dx, dy), STEP_REPEAT_DELAY_MS);
        } else {
          startMove(dx, dy);
        }
      }
    }
  } else {
    // Hvis ikke moving, men en retning holdes: start walking
    const nextDir = intentFromHeld();
    if (nextDir) {
      const { dx, dy } = dirToDelta(nextDir);
      startMove(dx, dy);
    }
  }
}


function loop(now) {
  const dt = now - lastTime;
  lastTime = now;

  // Når pause er åpen: frys gameplay (ikke update)
  if (!pauseOpen) {
    update(dt);
  }

  draw();
  requestAnimationFrame(loop);
}

// -------------------- TILED (.tmj) LOADER --------------------
// Forventer at hvert LEVELS[levelId] har: mapFile: "noe.tmj"
// Og at layers i Tiled heter: "base", "mid", "top" (case-insensitive).
// Tom tile i Tiled er gid=0 -> vi mapper til EMPTY.

const TILED_FLIP_MASK =
  0x80000000 | // FLIPPED_HORIZONTALLY_FLAG
  0x40000000 | // FLIPPED_VERTICALLY_FLAG
  0x20000000;  // FLIPPED_DIAGONALLY_FLAG

function stripTiledFlags(gid) {
  // fjerner flip/rotasjons-bits fra GID
  return (gid >>> 0) & (~TILED_FLIP_MASK >>> 0);
}

function resolveRelativeUrl(baseUrl, rel) {
  // baseUrl = "maps/spenningsbyen.tmj", rel = "../tilesets/foo.tsj"
  return new URL(rel, new URL(baseUrl, window.location.href)).toString();
}

function parseTsxTilesetToJsonLike(tsxText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(tsxText, "application/xml");

  // Hvis XML-en er ugyldig kan DOMParser gi <parsererror>
  if (xml.querySelector("parsererror")) {
    throw new Error("Kunne ikke parse TSX (XML) tileset. Filen er ikke gyldig XML.");
  }

  const out = { tiles: [] };

  const tileNodes = Array.from(xml.querySelectorAll("tileset > tile"));
  for (const tileEl of tileNodes) {
    const idStr = tileEl.getAttribute("id");
    if (idStr == null) continue;

    const id = Number(idStr);
    const props = [];

    const propNodes = Array.from(tileEl.querySelectorAll("properties > property"));
    for (const p of propNodes) {
      const name = p.getAttribute("name");
      if (!name) continue;

      // TSX kan ha value="..." eller tekst inni (sjeldnere)
      const valueAttr = p.getAttribute("value");
      const value = valueAttr != null ? valueAttr : (p.textContent || "");

      props.push({ name, value });
    }

    out.tiles.push({ id, properties: props });
  }

  return out;
}


function buildGidToKeyMap(mapJson, mapUrl) {
  // Lager mapping: gid -> "grass"/"wate0"/... basert på tileset properties.key
  const gidToKey = {};

  async function fetchTileset(tilesetEntry) {
    // tilesetEntry: { firstgid, source? } eller embedded tileset
    const firstgid = tilesetEntry.firstgid;

    let ts = tilesetEntry;
    if (tilesetEntry.source) {
      const tsUrl = resolveRelativeUrl(mapUrl, tilesetEntry.source);
      const res = await fetch(tsUrl);
      if (!res.ok) throw new Error(`Failed to load tileset: ${tsUrl}`);

      const text = await res.text();
      const trimmed = text.trim();

      // 1) TSX (XML) → parse som XML
      if (tsUrl.toLowerCase().endsWith(".tsx") || trimmed.startsWith("<?xml") || trimmed.startsWith("<tileset")) {
        ts = parseTsxTilesetToJsonLike(text);
      } 
      // 2) TSJ (JSON) → parse som JSON
      else {
        try {
          ts = JSON.parse(text);
        } catch (e) {
          // Dette gjør debugging mye enklere hvis serveren returnerer HTML feilside etc.
          throw new Error(
            `Tileset var verken gyldig TSX eller JSON: ${tsUrl}\n` +
            `Start av fil: ${trimmed.slice(0, 80)}`
          );
        }
      }
    }

    // Tiled JSON tileset har ofte ts.tiles = [{id, properties:[{name,value}]}]
    const tiles = Array.isArray(ts.tiles) ? ts.tiles : [];
    for (const t of tiles) {
      const props = Array.isArray(t.properties) ? t.properties : [];
      const keyProp = props.find(p => p && p.name === "key");
      if (keyProp && typeof keyProp.value === "string" && keyProp.value) {
        gidToKey[firstgid + t.id] = keyProp.value;
      }
    }
  }

  const tilesets = Array.isArray(mapJson.tilesets) ? mapJson.tilesets : [];
  return (async () => {
    for (const tsEntry of tilesets) {
      await fetchTileset(tsEntry);
    }
    return gidToKey;
  })();
}

function findLayerByName(mapJson, wantedName) {
  const layers = Array.isArray(mapJson.layers) ? mapJson.layers : [];
  const want = wantedName.toLowerCase();

  return layers.find(l => (l?.name || "").toLowerCase() === want) || null;
}

function flattenTileLayerToGids(layer, width, height) {
  // Returnerer flat array lengde width*height med GIDs.
  // Støtter både vanlig map (layer.data) og infinite map (layer.chunks).
  const out = new Array(width * height).fill(0);

  if (!layer) return out;

  if (Array.isArray(layer.data)) {
    // Vanlig tilelayer: allerede flat array
    // layer.data lengde = width*height
    for (let i = 0; i < Math.min(out.length, layer.data.length); i++) {
      out[i] = layer.data[i] >>> 0;
    }
    return out;
  }

  if (Array.isArray(layer.chunks)) {
    // Infinite map: chunks med {x,y,width,height,data[]}
    for (const ch of layer.chunks) {
      const cw = ch.width, chh = ch.height;
      const data = ch.data || [];
      for (let cy = 0; cy < chh; cy++) {
        for (let cx = 0; cx < cw; cx++) {
          const gid = (data[cy * cw + cx] || 0) >>> 0;
          const wx = ch.x + cx;
          const wy = ch.y + cy;
          if (wx < 0 || wy < 0 || wx >= width || wy >= height) continue;
          out[wy * width + wx] = gid;
        }
      }
    }
    return out;
  }

  return out;
}

function flatToGridKeysAndFlags(flatGids, width, height, gidToKey) {
  const grid = [];
  const flagsGrid = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    const fRow = [];

    for (let x = 0; x < width; x++) {
      const raw = (flatGids[y * width + x] || 0) >>> 0;

      // behold flaggene (3 bits)
      const flags = raw & TILED_FLIP_MASK;

      // strip for å slå opp riktig gid->key
      const gid = stripTiledFlags(raw);

      if (!gid) {
        row.push(EMPTY);
        fRow.push(0);
      } else {
        row.push(gidToKey[gid] || EMPTY);
        fRow.push(flags);
      }
    }

    grid.push(row);
    flagsGrid.push(fRow);
  }

  return { grid, flagsGrid };
}


function tryReadSpawnFromObjects(mapJson) {
  // Ser etter objectlayer med et objekt som heter "spawn" eller type "spawn"
  const layers = Array.isArray(mapJson.layers) ? mapJson.layers : [];
  for (const l of layers) {
    if (l?.type !== "objectgroup") continue;
    const objs = Array.isArray(l.objects) ? l.objects : [];
    for (const o of objs) {
      const nm = (o?.name || "").toLowerCase();
      const tp = (o?.type || "").toLowerCase();
      if (nm === "spawn" || tp === "spawn") {
        // o.x/o.y er i pixler (top-left)
        return {
          x: Math.floor((o.x || 0) / TILE_SIZE),
          y: Math.floor((o.y || 0) / TILE_SIZE),
        };
      }
    }
  }
  return null;
}

async function loadTiledLevel(levelId) {
  const lvl = LEVELS[levelId];
  if (!lvl || !lvl.mapFile) return;

  const mapUrl = lvl.mapFile.includes("/")
    ? lvl.mapFile
    : `maps/${lvl.mapFile}`;
  const res = await fetch(mapUrl);
  if (!res.ok) throw new Error(`Failed to load map: ${mapUrl}`);
  const mapJson = await res.json();

  // Sett størrelse fra Tiled
  lvl.width = mapJson.width;
  lvl.height = mapJson.height;

  // Spawn fra object layers (valgfritt)
  const spawn = tryReadSpawnFromObjects(mapJson);
  if (spawn) lvl.spawn = spawn;

  // Bygg gid->key mapping fra tilesets
  const gidToKey = await buildGidToKeyMap(mapJson, mapUrl);

  // Finn layers (navn i Tiled: base/mid/top)
  const baseLayer = findLayerByName(mapJson, "base");
  const midLayer  = findLayerByName(mapJson, "mid");
  const topLayer  = findLayerByName(mapJson, "top");

  // Gjør om til grids i samme format som før (2D array med tile keys)
  const baseFlat = flattenTileLayerToGids(baseLayer, lvl.width, lvl.height);
  const midFlat  = flattenTileLayerToGids(midLayer,  lvl.width, lvl.height);
  const topFlat  = flattenTileLayerToGids(topLayer,  lvl.width, lvl.height);

  const basePack = flatToGridKeysAndFlags(baseFlat, lvl.width, lvl.height, gidToKey);
  const midPack  = flatToGridKeysAndFlags(midFlat,  lvl.width, lvl.height, gidToKey);
  const topPack  = flatToGridKeysAndFlags(topFlat,  lvl.width, lvl.height, gidToKey);

  lvl.grid_base = basePack.grid;
  lvl.grid_mid  = midPack.grid;
  lvl.grid_top  = topPack.grid;

  // flags-grid som matcher hver layer
  lvl.grid_base_flags = basePack.flagsGrid;
  lvl.grid_mid_flags  = midPack.flagsGrid;
  lvl.grid_top_flags  = topPack.flagsGrid;

}

async function loadAllTiledLevels() {
  const ids = Object.keys(LEVELS);
  for (const id of ids) {
    const lvl = LEVELS[id];
    if (lvl?.mapFile) {
      await loadTiledLevel(id);
    }
  }
}


// ----------- Validation -----------
function validateLevels() {
  for (const [id, lvl] of Object.entries(LEVELS)) {
    const grids = ["grid_base", "grid_mid", "grid_top"];
    for (const g of grids) {
      if (!lvl[g]) {
        console.warn(`[${id}] missing ${g}`);
        continue;
      }
      if (lvl.height !== lvl[g].length) {
        console.warn(`[${id}] ${g} height mismatch: expected=${lvl.height} got=${lvl[g].length}`);
      }
      if (lvl[g][0] && lvl.width !== lvl[g][0].length) {
        console.warn(`[${id}] ${g} width mismatch: expected=${lvl.width} got=${lvl[g][0].length}`);
      }
    }
  }
}

function ensureGridSize(lvl, gridName, fillKey) {
  if (!lvl[gridName]) lvl[gridName] = [];

  // Sørg for riktig antall rader
  while (lvl[gridName].length < lvl.height) {
    lvl[gridName].push([]);
  }

  // Sørg for riktig antall kolonner per rad
  for (let y = 0; y < lvl.height; y++) {
    if (!Array.isArray(lvl[gridName][y])) lvl[gridName][y] = [];
    while (lvl[gridName][y].length < lvl.width) {
      lvl[gridName][y].push(fillKey);
    }
  }
}

function normalizeLevelGrids(lvl) {
  // Base må alltid ha en gyldig tile (typisk grass)
  ensureGridSize(lvl, "grid_base", "grass");

  // Mid/top kan være tomt "."
  ensureGridSize(lvl, "grid_mid", EMPTY);
  ensureGridSize(lvl, "grid_top", EMPTY);
}

async function startGame(opts = { mode: "load" }) {
  if (gameStarted) return;

  // Hvis du prøver å starte uten gyldig navn: stopp
  const name = getCharacterNameFromSaveOrProfile();
  if (!name || name.trim().length < 2) {
    alert("Du må lage en character før du kan starte.");
    return;
  }

  const ok = await acquireSessionLockOrBlock();
  if (!ok) return; // stopp start hvis allerede logget inn

  gameStarted = true;
  hideAllScreensAndShowGameUI();
  showLoadingScreen({ backgroundUrl: "assets/ui/testMenyBack.png" });
  await loadAllTiledLevels();


  setInterval(() => {
    cloudSavePosition(false);
  }, 3000);

  // 1) Først: utvid grids så de matcher width/height (hindrer all “alt blir feil”)
  for (const lvl of Object.values(LEVELS)) {
    normalizeLevelGrids(lvl);
  }

  // 2) Så: valider (nå får du mye færre warnings)
  validateLevels();

  const urls = collectAllImageUrls();
  __loadingTotal = urls.length;
  updateLoadingUI(0, __loadingTotal);

  await loadAllAssets();

  if (opts.mode === "new") {
    setLevel(currentLevelId, null);
  } else {
    const ok = await loadGame();
    if (!ok) {
      showMenu();
      logMessage("No cloud save found. Create a character first.", "error");
      gameStarted = false;
      return;
    }
  }
  await subscribeToPresence(currentLevelId);
  hideLoadingScreen();
  startPresenceHeartbeat();
  requestAnimationFrame(loop);
}

async function enterPortal(portal) {
  const targetLevel = portal.toLevel;
  const spawn = portal.toSpawn;

  // 1) Server: delete old + insert new (gir DELETE-event i gammelt level)
  const { error } = await sb.rpc("rpc_presence_move_level", {
    p_session_id: clientSessionId,
    p_new_level_id: targetLevel,
    p_x: Math.floor(spawn.x),
    p_y: Math.floor(spawn.y),
    p_facing: spawn.facing || null,
    p_name: getMyNameForPresence(),
    p_gender: getMyGenderForPresence(),
  });

  if (error) {
    console.warn("[PRESENCE] move_level failed", error);
    logMessage("Could not enter (server error). Try again.", "error");
    return;
  }

  // 2) Lokal: bytt level
  setLevel(targetLevel, null, spawn);

  // 3) Klient: lytt i nytt level + snapshot
  await subscribeToPresence(currentLevelId);

  closeContextMenu?.();
}


// -------------------- LOG OUT --------------------

const btnLogoutMenu = document.getElementById("btn-logout-menu");

btnLogoutMenu?.addEventListener("click", async () => {
  try {
    // 1) stopp spillet
    gameStarted = false;

    // 2) stopp heartbeat 
    stopPresenceHeartbeat();

    // 3) fjern presence 
    await presenceRemove();

    // 4) slipp session-lock 
    await releaseSessionLock();

    // 5) lagre 
    if (canWriteSave()) {
      await saveGame();
    }

    // 6) sign out
    if (window.__vq_sb) {
      await window.__vq_sb.auth.signOut();
    }
  } catch (err) {
    console.warn("Logout error:", err);
  }

  // Redirect til login-portal 
  window.location.href = "index.html";
});

// --------------------- LOADING SCREEN -------------------------

let __loadingTotal = 0;
let __loadingDone = 0;

function setLoadingBackground(url) {
  const bg = document.getElementById("loading-bg");
  if (!bg) return;
  bg.style.backgroundImage = url ? `url("${url}")` : "";
}

function showLoadingScreen({ backgroundUrl } = {}) {
  const el = document.getElementById("loading-screen");
  if (!el) return;
  if (backgroundUrl) setLoadingBackground(backgroundUrl);

  __loadingDone = 0;
  updateLoadingUI(0, 0);

  el.classList.remove("hidden");
  el.setAttribute("aria-hidden", "false");
}

function hideLoadingScreen() {
  const el = document.getElementById("loading-screen");
  if (!el) return;
  el.classList.add("hidden");
  el.setAttribute("aria-hidden", "true");
}

function updateLoadingUI(done, total) {
  const fill = document.getElementById("loading-bar-fill");
  const txt = document.getElementById("loading-text");
  const cnt = document.getElementById("loading-count");

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  if (fill) fill.style.width = `${pct}%`;
  if (txt) txt.textContent = `${pct}%`;
  if (cnt) cnt.textContent = `${done} / ${total}`;
}

function bumpLoading() {
  __loadingDone++;
  updateLoadingUI(__loadingDone, __loadingTotal);
}



// ---------- Start hub helpers ----------
let previewTimer = null;
let previewFrame = 0;

function getIdleFramesForPreview() {
  const s = getSave?.();

  // ALLTID "front" i menyen.
  const dir = "down";

  // 0) Hent gender fra save (profilen din), fallback til player.gender
  const gender = normalizeGender(s?.profile?.gender ?? s?.player?.gender ?? player?.gender);

  // 1) Hent armorId fra save
  const armorId = s?.equipped?.armor?.id || null;

  // 2) Hvis armor finnes og har anims: bruk de idle-frames (front)
  if (armorId && ITEM_DEFS?.[armorId]?.playerAnims?.[dir]) {
    const idle = ITEM_DEFS[armorId].playerAnims[dir].idle;
    if (Array.isArray(idle) && idle.length) return idle;
    if (typeof idle === "string" && idle) return [idle];
  }

  // 3) Ellers: bruk riktig base anim-set basert på gender
  const baseSet = (gender === "female") ? PLAYER_ANIMS_FEMALE : PLAYER_ANIMS_MALE;
  const base = baseSet?.[dir] || baseSet?.down;
  const idle = base?.idle;

  if (Array.isArray(idle) && idle.length) return idle;
  if (typeof idle === "string" && idle) return [idle];

  // 4) Siste fallback (match gender)
  return gender === "female"
    ? ["assets/player/female/female_down.png"]
    : ["assets/player/male/pixelmannDown.png"];
}


function stopPreviewAnim() {
  if (previewTimer) clearInterval(previewTimer);
  previewTimer = null;
}

function getIdleFramesForPreviewBase() {
  const s = getSave?.();
  const dir = "down";

  const gender = normalizeGender(s?.profile?.gender ?? s?.player?.gender ?? player?.gender);

  const baseSet =
    (gender === "female") ? PLAYER_ANIMS_FEMALE :
    (gender === "gnome")  ? PLAYER_ANIMS_GNOME  :
    PLAYER_ANIMS_MALE;

  const base = baseSet?.[dir] || baseSet?.down;
  const idle = base?.idle;

  if (Array.isArray(idle) && idle.length) return idle;
  if (typeof idle === "string" && idle) return [idle];

  // fallback
  if (gender === "female") return ["assets/player/female/female_down.png"];
  if (gender === "gnome")  return ["assets/player/male/male_old/pixelmannDown.png"]; // din gnome fallback path
  return ["assets/player/male/male_down.png"];
}

function getIdleFramesForPreviewArmor() {
  const s = getSave?.();
  const dir = "down";

  const armorId = s?.equipped?.armor?.id || null;
  if (!armorId) return null;

  const gender = normalizeGender(s?.profile?.gender ?? s?.player?.gender ?? player?.gender);

  const def = ITEM_DEFS?.[armorId];

  const idle = def?.playerAnimsByGender?.[gender]?.[dir]?.idle;
  if (Array.isArray(idle) && idle.length) return idle;
  if (typeof idle === "string" && idle) return [idle];

  // fallback gammel struktur
  const oldIdle = def?.playerAnims?.[dir]?.idle;
  if (Array.isArray(oldIdle) && oldIdle.length) return oldIdle;
  if (typeof oldIdle === "string" && oldIdle) return [oldIdle];

  return null;
}

function startPreviewAnim() {
  stopPreviewAnim();

  const baseFrames = getIdleFramesForPreviewBase();
  const armorFrames = getIdleFramesForPreviewArmor(); // kan være null

  if (!baseFrames || baseFrames.length === 0) return;

  previewFrame = 0;

  // base
  startSpriteImg.src = baseFrames[0];
  startSpriteImg.classList.remove("hidden");

  // armor overlay
  if (startArmorImg) {
    if (armorFrames && armorFrames.length) {
      startArmorImg.src = armorFrames[0];
      startArmorImg.classList.remove("hidden");
    } else {
      startArmorImg.classList.add("hidden");
    }
  }

  previewTimer = setInterval(() => {
    previewFrame = (previewFrame + 1) % baseFrames.length;
    startSpriteImg.src = baseFrames[previewFrame];

    if (startArmorImg && armorFrames && armorFrames.length) {
      const af = armorFrames[previewFrame % armorFrames.length];
      startArmorImg.src = af;
    }
  }, 450);
}

function openCreateModal() {
  screenCharacter.classList.remove("hidden");
  screenCharacter.setAttribute("aria-hidden", "false");
  inputName.value = "";
  inputName.focus();
}

function closeCreateModal() {
  screenCharacter.classList.add("hidden");
  screenCharacter.setAttribute("aria-hidden", "true");
}

function refreshStartHubUI() {
  const s = getSave();
  const has = hasSave();

  if (has) {
    const nm = getCharacterNameFromSaveOrProfile() || "Unknown";
    const lvl = getTotalSkillLevelFromSave(s) || 1;

    startCharBox.classList.remove("hidden");
    startCharName.textContent = nm;
    startCharLvl.textContent = String(lvl);

    btnCreateCharacter.classList.add("hidden");

    startNoChar.classList.add("hidden");
    startSpriteImg.classList.remove("hidden");
    startPreviewAnim();

    btnStart.disabled = false;
  } else {
    startCharBox.classList.add("hidden");

    btnCreateCharacter.classList.remove("hidden");

    startSpriteImg.classList.add("hidden");
    if (startArmorImg) startArmorImg.classList.add("hidden");
    startNoChar.classList.remove("hidden");
    stopPreviewAnim();

    btnStart.disabled = true; // kan ikke starte uten character
  }
}

function showMenu() {
  screenMenu.classList.remove("hidden");
  closeCreateModal();

  // SKJUL selve spillet helt
  document.getElementById("game-wrap").classList.add("hidden");

  // skjul game UI mens du er i meny
  document.getElementById("hotbar").classList.add("hidden");
  document.getElementById("chatlog").classList.add("hidden");

  refreshStartHubUI();
}

function hideAllScreensAndShowGameUI() {
  screenMenu.classList.add("hidden");
  closeCreateModal();
  stopPreviewAnim();

  // VIS spillet når START trykkes
  document.getElementById("game-wrap").classList.remove("hidden");

  document.getElementById("hotbar").classList.remove("hidden");
  document.getElementById("chatlog").classList.remove("hidden");
}

// Lager en “ny character” save uten å auto-entre spillet
async function createCharacterSaveOnly(name, gender = "male") {
  name = (name || "").trim();
  if (name.length < 2) return false;

  // Sett profilnavn (dere bruker dette i canWriteSave() osv)
  setProfileName(name);
  player.gender = normalizeGender(gender);

  // Sett default spawn basert på rase/gender
  const sp = getDefaultSpawnForGender(player.gender);

  // Bytt level + pos (lagrer dette i save under)
  currentLevelId = sp.levelId;
  setLevel(sp.levelId, null, { x: sp.x, y: sp.y });

  // Total level kommer fra skills.
  player.xp = 0;
  player.level = 1;
  player.hp = player.maxHp;  // full heal på ny character

  // Reset skills
  skills = {
    combat: { level: 1, xp: 0 },
    mining: { level: 1, xp: 0 },
    woodcutting: { level: 1, xp: 0 },
    fishing: { level: 1, xp: 0 },
  };

  // Reset inventory/equip/bank til tomt
  try { inventory = normalizeInventory([]); } catch {}
  try { equipped  = normalizeEquipped({}); } catch {}
  try { bank      = normalizeBank([]); } catch {}

  // Bygg save-objektet
  const data = buildSaveData();

  // Prøv å skrive til cloud. Dette MÅ lykkes for at character skal finnes.
  const ok = await cloudUpsertSave(data);
  if (!ok) {
    console.warn("[CREATE] cloudUpsertSave failed");
    logMessage("Cloud save failed. Could not create character.", "error");
    return false;
  }

  // Cloud ok => oppdater lokal cache (for rask UI)
  CLOUD_SAVE_CACHE = data;
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));

  return true;
}

const btnExitToMenu = document.getElementById("btnExitToMenu");

btnExitToMenu?.addEventListener("click", exitToMenu);

async function exitToMenu() {
  // stopp spill
  gameStarted = false;

  // stopp presence heartbeat 
  stopPresenceHeartbeat();

  // fjern presence 
  await presenceRemove();

  // lagre før du går til meny
  if (canWriteSave()) {
    await saveGame();
  }

  // slipp lock 
  await releaseSessionLock();

  // gå til menyen 
  window.location.href = "index.html";
}

function showMainMenu() {
  // Skjul game UI hvis du har
  const hud = document.getElementById("hud");      // hvis finnes
  const menu = document.getElementById("menu");    // hvis finnes
  if (hud) hud.style.display = "none";
  if (menu) menu.style.display = "block";
  location.reload();

  // nullstill litt runtime state som kan skape rare ting ved ny start
  inventory = normalizeInventory([]);
  equipped = {};
  bank = [];

}


// ----------- App start (menu først) -----------
(async () => {
  await hydrateSaveFromCloud();
  showMenu();
})();

btnStart.addEventListener("click", () => {
  console.log("[START] clicked", { hasSave: hasSave(), cloud: !!CLOUD_SAVE_CACHE });

  if (!hasSave()) {
    logMessage("No cloud save found. Create a character first.", "error");
    return;
  }

  startGame({ mode: "load" });
});

btnCreateCharacter.addEventListener("click", () => {
  openCreateModal();
});

btnBackMenu.addEventListener("click", () => {
  closeCreateModal();
});

btnFinishCharacter.addEventListener("click", async () => {
  const name = (inputName.value || "").trim();
  if (name.length < 2) {
    alert("Navnet må være minst 2 tegn.");
    return;
  }

  const gender =
    document.querySelector('input[name="gender"]:checked')?.value || "male";

  const ok = await createCharacterSaveOnly(name, gender);
  if (!ok) return;

  closeCreateModal();
  refreshStartHubUI();
});


window.addEventListener("beforeunload", () => {
  releaseSessionLock();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    // ikke release her hvis tab i bakgrunn skal holde lock
    // releaseSessionLock();
  }
});



// ---------- DEV: teleport via console ----------
window.tp = function (x, y, levelId = null) {
  if (!player) {
    console.warn("[TP] Player not ready");
    return;
  }

  player.x = Number(x);
  player.y = Number(y);

  if (levelId && typeof setLevel === "function") {
    setLevel(levelId, { x: player.x, y: player.y });
  }

  console.log(`[TP] Teleported to x=${player.x}, y=${player.y}`, levelId ? `level=${levelId}` : "");
};