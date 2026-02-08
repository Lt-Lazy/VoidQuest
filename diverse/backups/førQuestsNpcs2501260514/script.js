const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// --- Menu / character screen refs ---
const screenMenu = document.getElementById("screen-menu");
const screenCharacter = document.getElementById("screen-character");

const btnPlay = document.getElementById("btn-play");
const btnBackMenu = document.getElementById("btn-back-menu");

const hasSaveBox = document.getElementById("char-has-save");
const createBox = document.getElementById("char-create");

const charNameEl = document.getElementById("char-name");
const charLastSavedEl = document.getElementById("char-last-saved");

const inputName = document.getElementById("input-name");
const btnFinishCharacter = document.getElementById("btn-finish-character");
const btnStartGame = document.getElementById("btn-start-game");


const hudZone = document.getElementById("hud-zone");
const hudPos = document.getElementById("hud-pos");
// --- Inventory UI refs ---
const invPanel = document.getElementById("inventory");
const invGridEl = document.getElementById("inventory-grid");
const btnInventory = document.getElementById("btn-inventory");
// --- Context menu refs ---
const gameWrap = document.getElementById("game-wrap");
const contextMenu = document.getElementById("context-menu");
// --- Chat log refs ---
const chatLogEl = document.getElementById("chatlog-messages");
//--- Save Knapp ----
const btnSave = document.getElementById("btn-save");



const VIEW_TILES_X = 20;
const VIEW_TILES_Y = 12;

let animTime = 0;

canvas.width = VIEW_TILES_X * TILE_SIZE;
canvas.height = VIEW_TILES_Y * TILE_SIZE;

// Smooth movement settings
const BASE_MOVE_DURATION_MS = 200;   // hvor lang tid ett tile-steg tar (juster)
const STEP_REPEAT_DELAY_MS = 0; // 0 = start neste steg umiddelbart

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const tileImages = {};
const itemImages = {};

const playerImages = {};
const PLAYER_SPRITES = {
  down: "assets/player/pixelmannDown.png",
  up: "assets/player/pixelmannUp.png",
  left: "assets/player/pixelmannLeft.png",
  right: "assets/player/pixelmannRight.png",
};

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

  for (const [key, def] of Object.entries(ITEM_DEFS)) {
    itemImages[key] = await loadImage(def.img);
  }

  for (const [dir, src] of Object.entries(PLAYER_SPRITES)) {
    playerImages[dir] = await loadImage(src);
  }
}

let currentLevelId = "spenningsbyen";
let level = LEVELS[currentLevelId];

const player = {
  // tile coords (logisk)
  x: level.spawn.x,
  y: level.spawn.y,

  // pixel coords (smooth rendering)
  px: level.spawn.x * TILE_SIZE,
  py: level.spawn.y * TILE_SIZE,

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

//HELPERS

function getPortalAt(x, y) {
  const portals = level.portals || [];
  return portals.find(p => p.x === x && p.y === y) || null;
}

// --- Inventory system (4x6) ---
const INV_COLS = 4;
const INV_ROWS = 6;
const INV_SIZE = INV_COLS * INV_ROWS;

// Foreløpig: ingen items (null). Senere blir dette objects.
const inventory = Array.from({ length: INV_SIZE }, () => null);


// -------------------- PROFILE + SAVE KEYS --------------------
const PROFILE_KEY = "voidquest_profile_v1";

function getSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function hasSave() {
  const s = getSave();
  const name = s?.profile?.name;

  // Save er kun "gyldig" hvis den har pos + level + et ordentlig navn
  return !!(
    s &&
    typeof s === "object" &&
    s.player &&
    s.levelId &&
    typeof name === "string" &&
    name.trim().length >= 2
  );
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
  const s = getSave();
  const fromSave = s?.profile?.name || null;
  return fromSave || getProfileName();
}

function showMenu() {
  screenMenu.classList.remove("hidden");
  screenCharacter.classList.add("hidden");
  screenCharacter.setAttribute("aria-hidden", "true");

  // skjul game UI mens du er i meny
  document.getElementById("hotbar").classList.add("hidden");
  document.getElementById("chatlog").classList.add("hidden");
}

function showCharacterScreen() {
  screenMenu.classList.add("hidden");
  screenCharacter.classList.remove("hidden");
  screenCharacter.setAttribute("aria-hidden", "false");

  const s = getSave();

  if (hasSave()) {
    // vis eksisterende character
    hasSaveBox.classList.remove("hidden");
    hasSaveBox.setAttribute("aria-hidden", "false");

    createBox.classList.add("hidden");
    createBox.setAttribute("aria-hidden", "true");

    charNameEl.textContent = getCharacterNameFromSaveOrProfile() || "Unknown";
    charLastSavedEl.textContent = s?.ts ? new Date(s.ts).toLocaleString() : "-";
  } else {
    // create character
    hasSaveBox.classList.add("hidden");
    hasSaveBox.setAttribute("aria-hidden", "true");

    createBox.classList.remove("hidden");
    createBox.setAttribute("aria-hidden", "false");

    inputName.value = "";
    held.up = held.down = held.left = held.right = false;
    lastIntent = null;
    inputName.focus();
  }
}

function hideAllScreensAndShowGameUI() {
  screenMenu.classList.add("hidden");
  screenCharacter.classList.add("hidden");
  screenCharacter.setAttribute("aria-hidden", "true");

  document.getElementById("hotbar").classList.remove("hidden");
  document.getElementById("chatlog").classList.remove("hidden");
}



// -------------------- SAVE / LOAD (LocalStorage) --------------------
const SAVE_KEY = "voidquest_save_v1";

function buildSaveData() {
  return {
    v: 1,
    ts: Date.now(),

    profile: {
      name: getProfileName(),
    },

    // hvor du er
    levelId: currentLevelId,
    player: {
      x: player.x,
      y: player.y,
      facing: player.facing,
    },

    // inventory (array av slots)
    // slot = null eller {id,name,icon,stack}
    inventory: inventory,
  };
}

function applySaveData(data) {
  if (!data || typeof data !== "object") return false;
  if (!data.levelId || !LEVELS[data.levelId]) return false;

  // 1) flytt til riktig level + pos
  const px = Number(data.player?.x);
  const py = Number(data.player?.y);

  if (!Number.isFinite(px) || !Number.isFinite(py)) return false;

  setLevel(data.levelId, null, { x: px, y: py });

  // 2) facing
  if (typeof data.player?.facing === "string") {
    player.facing = data.player.facing;
  }

  // 3) inventory (kopier inn i eksisterende array)
  if (Array.isArray(data.inventory) && data.inventory.length === INV_SIZE) {
    for (let i = 0; i < INV_SIZE; i++) {
      inventory[i] = data.inventory[i] ?? null;
    }
  } else {
    // hvis save mangler inventory riktig, nullstill
    for (let i = 0; i < INV_SIZE; i++) inventory[i] = null;
  }

  return true;
}

function canWriteSave() {
  const name = getProfileName();
  return typeof name === "string" && name.trim().length >= 2 && gameStarted;
}

function saveGame() {
  // IKKE lag save før character er ferdig (navn + game startet)
  if (!canWriteSave()) return false;

  try {
    const data = buildSaveData();
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    logMessage("Game saved.", "system");
    return true;
  } catch (err) {
    console.error("Save failed:", err);
    logMessage("Save failed (see console).", "error");
    return false;
  }
}


function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;

    const data = JSON.parse(raw);
    const ok = applySaveData(data);

    if (!ok) {
      logMessage("Save file invalid. Starting fresh.", "error");
      return false;
    }

    logMessage("Save loaded.", "system");
    return true;
  } catch (err) {
    console.error("Load failed:", err);
    logMessage("Load failed (see console).", "error");
    return false;
  }
}


let inventoryOpen = false;

function openInventory() {
  inventoryOpen = true;
  invPanel.classList.remove("hidden");
  invPanel.setAttribute("aria-hidden", "false");
  btnInventory.setAttribute("aria-pressed", "true");
  // Valgfritt: stopp input til spill når inventory er åpen
}

function closeInventory() {
  inventoryOpen = false;
  invPanel.classList.add("hidden");
  invPanel.setAttribute("aria-hidden", "true");
  btnInventory.setAttribute("aria-pressed", "false");
}

function toggleInventory() {
  if (inventoryOpen) closeInventory();
  else openInventory();
}

function buildInventoryUI() {
  invGridEl.innerHTML = "";

  for (let i = 0; i < INV_SIZE; i++) {
    const slot = document.createElement("div");
    slot.className = "inv-slot";
    slot.dataset.slot = String(i);

    // Drag-over styling
    slot.addEventListener("dragenter", () => slot.classList.add("drag-over"));
    slot.addEventListener("dragleave", () => slot.classList.remove("drag-over"));
    slot.addEventListener("dragend", () => slot.classList.remove("drag-over"));

    // Må ha preventDefault for å tillate drop
    slot.addEventListener("dragover", (e) => e.preventDefault());

    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.classList.remove("drag-over");

      const from = Number(e.dataTransfer.getData("text/inv-from"));
      const to = Number(slot.dataset.slot);

      if (Number.isNaN(from) || Number.isNaN(to)) return;

      // Bytt plass (swap)
      const tmp = inventory[to];
      inventory[to] = inventory[from];
      inventory[from] = tmp;

      renderInventoryUI();
    });

    invGridEl.appendChild(slot);
  }

  renderInventoryUI();
}

function renderInventoryUI() {
  // oppdater hver slot basert på inventory-array
  const slots = invGridEl.querySelectorAll(".inv-slot");

  slots.forEach((slotEl) => {
    const i = Number(slotEl.dataset.slot);
    const item = inventory[i];

    slotEl.innerHTML = "";

    if (!item) return;

    // Senere: item = { id, iconSrc, name, stack, ... }
    // Foreløpig: hvis du tester, kan du sette item = { icon: "assets/items/..." }
    const itemEl = document.createElement("div");
    itemEl.className = "inv-item";
    itemEl.draggable = true;

    itemEl.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/inv-from", String(i));
      e.dataTransfer.effectAllowed = "move";
    });

    // Hvis item har ikon:
    if (item.icon) {
      const img = document.createElement("img");
      img.src = item.icon;
      img.alt = item.name || "Item";
      itemEl.appendChild(img);
    }

    slotEl.appendChild(itemEl);
  });
}

function addItemToInventory(itemId, amount = 1) {
  const def = ITEM_DEFS[itemId];
  if (!def) return { ok: false, reason: "unknown_item" };

  for (let n = 0; n < amount; n++) {
    const emptyIndex = inventory.findIndex((x) => x === null);
    if (emptyIndex === -1) {
      return { ok: false, reason: "full" };
    }

    inventory[emptyIndex] = {
      id: itemId,
      name: def.name || itemId,
      icon: def.img,
      stack: 1,
    };
  }

  renderInventoryUI();
  return { ok: true };
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
}


function tileAtLayer(grid, x, y) {
  if (!grid) return null;
  if (y < 0 || y >= level.height || x < 0 || x >= level.width) return null;
  return grid[y][x];
}

function isWalkable(x, y) {
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


// ----------- Rendering -----------
function drawLayer(grid, imageDict) {
  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      const key = grid[y][x];
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
        ctx.drawImage(imgOrFrames, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else {
        // fallback hvis mangler
        ctx.fillStyle = "#ff00ff";
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // base -> mid
  drawLayer(level.grid_base, tileImages);
  drawLayer(level.grid_mid, tileImages);

  // player sprite (smooth pixel coords)
  const pImg = playerImages[player.facing];
  if (pImg) {
    ctx.drawImage(pImg, player.px, player.py, TILE_SIZE, TILE_SIZE);
  } else {
    ctx.fillStyle = "#4cc9f0";
    ctx.fillRect(player.px, player.py, TILE_SIZE, TILE_SIZE);
  }

  // top (items/overlays) - prøv items først, så tiles
  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      const key = level.grid_top[y][x];
      if (!key || key === EMPTY) continue;

      const img = itemImages[key] || tileImages[key];
      if (img) {
        ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else {
        ctx.fillStyle = "#ff00ff";
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  // Hvis inventory er åpen og du vil blokkere world-actions:
  // if (inventoryOpen) return;

  // Finn tile-koordinat fra musepos
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const mouseX = (e.clientX - rect.left) * scaleX;
  const mouseY = (e.clientY - rect.top) * scaleY;

  const tx = Math.floor(mouseX / TILE_SIZE);
  const ty = Math.floor(mouseY / TILE_SIZE);

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
      label: portal.label || "Enter",
      onClick: () => {
        // Må stå ved døra
        if (!isAdjacentToPlayer(tx, ty)) {
          logMessage("You need to stand next to the door.", "error");
          return;
        }

        setLevel(portal.toLevel, null, portal.toSpawn);
        logMessage(`You enter ${LEVELS[portal.toLevel]?.name || portal.toLevel}.`, "system");
      }
    });
  }

  // 2) Actions hvis tile har det
  const actions = tileDef?.actions || [];
  if (actions.includes("gather_wood")) {
    entries.push({
      label: "Gather wood",
      onClick: () => {
        // Må stå ved treet
        if (!isAdjacentToPlayer(tx, ty)) {
          logMessage("You need to stand next to the tree.", "error");
          return;
        }
        const res = addItemToInventory("wood_log", 1);
        if (!res.ok) {
          renderInventoryUI();
          const itemName = def.name || itemId;
          logMessage(`You received x${amount} ${itemName}.`, "loot");
          return { ok: true };
        }
      }
    });
  }

  openContextMenu(e.clientX, e.clientY, target.key, entries);
});

const CHAT_MAX_LINES = 8;

function formatTimeHHMM() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function logMessage(text, type = "system") {
  if (!chatLogEl) return;

  const line = document.createElement("div");
  line.className = `chatline ${type}`;

  const time = document.createElement("span");
  time.className = "time";
  time.textContent = `[${formatTimeHHMM()}]`;

  const msg = document.createElement("span");
  msg.textContent = text;

  line.appendChild(time);
  line.appendChild(msg);

  chatLogEl.appendChild(line);

  // hold max lines
  while (chatLogEl.children.length > CHAT_MAX_LINES) {
    chatLogEl.removeChild(chatLogEl.firstChild);
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
  // hvis lastIntent fortsatt holdes, bruk den
  if (lastIntent && held[lastIntent]) return lastIntent;

  // ellers: velg en som holdes (enkelt)
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

function startMove(dx, dy) {
  if (player.moving) return;
  closeContextMenu();

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

  // Hvis spillet ikke har startet ennå (meny/character screen), IKKE beveg
  if (!gameStarted) return;

  // Hvis inventory er åpen, vil du kanskje blokkere bevegelse
  if (inventoryOpen) return;

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


window.addEventListener("keyup", (e) => {
  if (isTypingInInput()) return;
  if (!gameStarted) return;

  const dir = keyToDir(e.key);
  if (!dir) return;

  e.preventDefault();
  held[dir] = false;
});

btnInventory.addEventListener("click", () => {
  toggleInventory();
});

btnSave.addEventListener("click", () => {
  saveGame();
});

window.addEventListener("beforeunload", () => {
  // Bare autosave hvis det faktisk er et ferdig spill (navn+startet)
  if (canWriteSave()) saveGame();
});

// ESC lukker inventory hvis åpen
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && inventoryOpen) {
    e.preventDefault();
    closeInventory();
  }
});

// Klikk hvor som helst: lukk meny
window.addEventListener("mousedown", (e) => {
  // hvis du klikker inne i menyen, ikke lukk her (knappene håndterer seg selv)
  if (!contextMenu.classList.contains("hidden") && !contextMenu.contains(e.target)) {
    closeContextMenu();
  }
});
// Hvis du begynner å gå: lukk meny
// (legg dette helt i starten av startMove(dx,dy) hvis du har den funksjonen)


// ----------- Game loop (update + draw) -----------
let lastTime = performance.now();

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function update(dtMs) {
  animTime += dtMs;
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

  update(dt);
  draw();

  requestAnimationFrame(loop);
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

let gameStarted = false;

async function startGame(opts = { mode: "load" }) {
  if (gameStarted) return;

  // Hvis du prøver å starte uten gyldig navn: stopp
  const name = getProfileName();
  if (!name || name.trim().length < 2) {
    alert("Du må skrive inn et navn før du kan starte.");
    return;
  }

  gameStarted = true;
  hideAllScreensAndShowGameUI();

  validateLevels();
  await loadAllAssets();

  if (opts.mode === "new") {
    // NY character: start på spawn, tom inventory, etc.
    setLevel(currentLevelId, null);
    for (let i = 0; i < INV_SIZE; i++) inventory[i] = null;
  } else {
    // Last existing save hvis den er gyldig, ellers ny start
    const ok = loadGame();
    if (!ok) {
      setLevel(currentLevelId, null);
      for (let i = 0; i < INV_SIZE; i++) inventory[i] = null;
    }
  }

  logMessage("Welcome to VoidQuest.", "system");

  buildInventoryUI();
  renderInventoryUI();
  closeInventory();

  // VIKTIG: lag første save med en gang når spillet starter
  // (nå er gameStarted=true og name finnes => canWriteSave() blir true)
  saveGame();

  requestAnimationFrame(loop);
}


// ----------- App start (menu først) -----------
showMenu();

btnPlay.addEventListener("click", () => {
  showCharacterScreen();
});

btnBackMenu.addEventListener("click", () => {
  showMenu();
});

btnStartGame.addEventListener("click", () => {
  // Kun hvis save faktisk er gyldig (har navn)
  if (!hasSave()) {
    showCharacterScreen();
    return;
  }
  startGame({ mode: "load" });
});


btnFinishCharacter.addEventListener("click", () => {
  const name = (inputName.value || "").trim();

  if (name.length < 2) {
    alert("Navnet må være minst 2 tegn.");
    return;
  }

  setProfileName(name);

  // Start som ny character + lag første save før spill
  startGame({ mode: "new" });
});


