const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 40;

let menuOpen = false;

// === Tiles ===
const tileImages = {
  grass: new Image(),
  coblestone: new Image(),
  tree: new Image(),
  brick: new Image(),
  plank: new Image(),
  fence: new Image(),
  table: new Image(),
  door: new Image(),
  water: new Image(),
  sand: new Image(),
  stoneSingle: new Image(),
  voidgate: new Image(),
  npcShop: new Image()
};

tileImages.grass.src = 'images/grassTile.png';
tileImages.tree.src = 'images/treeTile.png';
tileImages.brick.src = 'images/brickTile.png';
tileImages.plank.src = 'images/plankTile.png';
tileImages.door.src = 'images/doorTile.png';
tileImages.fence.src = 'images/fenceTile.png';
tileImages.table.src = 'images/tableTile.png';
tileImages.coblestone.src = 'images/coblestoneTile.png';
tileImages.water.src = 'images/waterTile.png';
tileImages.npcShop.src = 'images/npcShopTile.png';
tileImages.sand.src = 'images/sandTile.png';
tileImages.stoneSingle.src = 'images/stoneSingleTile.png';
tileImages.voidgate.src = 'images/voidgateTile.png';

const tileMapping = {
  'G': 'grass',
  'C': 'coblestone',
  'T': 'tree',
  'B': 'brick',
  'P': 'plank',
  'F': 'fence',
  't': 'table',
  'D': 'door',
  'W': 'water',
  'S': 'sand',
  's': 'stoneSingle',
  'N': 'npcShop',
  'V': 'voidgate',
};

const nonWalkableTiles = ['tree', 'brick', 'fence', 'table', 'water', 'stoneSingle'];

const characterImages = {
  up: new Image(),
  down: new Image(),
  left: new Image(),
  right: new Image(),
};

characterImages.up.src = 'images/pixelmannUp.png';
characterImages.down.src = 'images/pixelmanndown.png';
characterImages.left.src = 'images/pixelmannLeft.png';
characterImages.right.src = 'images/pixelmannRight.png';

const fishPools = {
  0: [ // Utenfor
    { name: "Grodr", rarity: "common", image: "images/grodr.png", chance: 800, price: 5 },
    { name: "Grauder", rarity: "common", image: "images/grauder.png", chance: 500, price: 30 },
    // { name: "Mørkål", rarity: "rare", image: "images/morkaal.png", chance: 2, price: 55 }
  ],
  2: [ // Cave
    { name: "Grodr", rarity: "common", image: "images/grodr.png", chance: 800, price: 5 },
    { name: "Grauder", rarity: "common", image: "images/grauder.png", chance: 500, price: 10 },
    { name: "Deep Void Lure", rarity: "legendary", image: "images/deepVoidLure.png", chance: 10, price: 1000 },
    { name: "Skuggosk", rarity: "rare", image: "images/skuggosk.png", chance: 80, price: 60 }
  ]
};

const raritySettings = {
  common: { time: 8000, color: "gray", border: "#999" },
  rare: { time: 5000, color: "blue", border: "#3af" },
  legendary: { time: 2000, color: "gold", border: "gold" }
};

let trophies = []; // Navn på fiskene du har fanget før

const character = {
  x: 0, y: 0,
  pixelX: 0, pixelY: 0,
  direction: 'down',
  moving: false
};

const keys = { w: false, a: false, s: false, d: false };

const doorMap = {
  0: { //SPENNINGSBYEN
    '2,9': { targetLevel: 1, targetX: 10, targetY: 2 }, // TIL HUS
    '22,3': { targetLevel: 2, targetX: 5, targetY: 1 },  // TIL CAVE
    '23,5': { targetLevel: 4, targetX: 1, targetY: 3 }  // TIL STI-1
  },
  1: { //HUS HUB SPENNINGSBYEN
    '10,1': { targetLevel: 0, targetX: 2, targetY: 10 }, // TIL UTE 
    '7,1': { targetLevel: 3, targetX: 7, targetY: 6 } // TIL TROFEROM
  },
  2: { //CAVE1 SPENNINGSBYEN
    '5,0': { targetLevel: 0, targetX: 22, targetY: 4 }  // TIL UTE 
  },
  3: { //TROFEROM HUS HUB SPENNINGSBYEN
    '7,7': { targetLevel: 1, targetX: 7, targetY: 2 }  // TIL HUS HUB
  },
  4: { //STI-1
    '0,3': { targetLevel: 0, targetX: 22, targetY: 5 }  // TIL HUS HUB
  }
};

const levels = [
  {
    //Spenningsbyen
    layout: [
      'TTTTTTTTTTTTTTTTTTsCCCBC',
      'TGGGGGGGGGGGGGGGGGGsCBBB',
      'TGTTGGGGGGGGGGGGGGGsCPPP',
      'TGGGGGGGGGGGGGGGGGGGsPDP',
      'TGGGTGGTGGGGGGGGGGGGGsGs',
      'TGGGGGGGGGGGGGGGGGGGGGGV',
      'TGBBGGGGGGGGGGGGGGGGGGGT',
      'TBBBBGTTGGGGGGGGGGGGGGGT',
      'TBBBBTTTTTTGGGGGGGGGSSSS',
      'TBDBBFFFFFGGGGGGGGGSWWWW',
      'TGGGGGGGGGGGGGGGGGSWWWWW',
      'TTTTTTTTTTTTTTTTTSWWWWWW'
    ],
    startX: 4,
    startY: 10,
    background: 'grass'
  },
  {
    //HUS HUB
    layout: [
      'BBBBBBBBBBBB',
      'BBBBBBBDBBDB',
      'BPNPPPPPPPPB',
      'BtttPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB'
    ],
    startX: 5,
    startY: 5,
    background: 'plank'
  },
  {
    // CAVE1 SPENNINGSBYEN
    layout: [
      'CCsssVssCsWW',
      'CsCssCCsCCsW',
      'CsCCCCCCCCCC',
      'CCCsCCCCCCsC',
      'CsCsssCCCCsC',
      'CCCCsCCssCsC',
      'CCCCsCCCCCsC',
      'CCCCsCCCCCCC'
    ],
    startX: 5,
    startY: 5,
    background: 'coblestone'
  },
  {
    // HUS HUB TROFE ROM
    layout: [
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BBBBBBBDBBBB'
    ],
    startX: 5,
    startY: 5,
    background: 'plank'
  },
  {
    // STI-1
    layout: [
      'TTTTTTTTTTTTTTTTTTTTTTTT',
      'TGGGGGGGGGGGGGGGGGGGGGGG',
      'TGGGGGGGGGGGGGGGGGGGGGGG',
      'VGGGGGGGGGGGGGGGGGGGGGGG',
      'TGGGGGGGGGGGGGGGGGGGGGGG',
      'TGGGGGGGGGGGGGGGGGGGGGGG',
      'TTTTTTTTTTTTTTTTTTTTTTTT'
    ],
    startX: 5,
    startY: 5,
    background: 'grass'
  }
];

// ========= LYD =========
const sounds = {
  music: {
    //0: new Audio("musikk/introVoidQuestMusic.wav"),
    //1: new Audio("audio/music_house.mp3"),
    //2: new Audio("audio/music_cave.mp3")
  },
  sfx: {
    startFishing: new Audio("lyder/kasteFiskeStang.wav"),
    gotBite: new Audio("lyder/fiskNapper.wav"),
    catchSuccess: new Audio("lyder/fangetFisk.wav"),
    catchFail: new Audio("lyder/mistetFisk.wav")
  }
};

let masterVolume = 0.5;

function toggleSettings() {
  const settings = document.getElementById('settingsMenu');
  settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
}

function updateVolume(value) {
  masterVolume = parseFloat(value);

  // Juster volum på alle lyder og musikk
  Object.values(sounds.music).forEach(audio => {
    audio.volume = masterVolume;
  });

  Object.values(sounds.sfx).forEach(audio => {
    audio.volume = masterVolume;
  });

  // Lagre volumvalg i localStorage
  localStorage.setItem('voidquest_volume', masterVolume);
}

// ========= LYD FERDIG =========
let currentMusic = null;

let currentLevel = 0, map = [], mapWidth = 0, mapHeight = 0;
let currentBackground = 'grass';

let isFishing = false;
let fishingBox = null;
let fishTimeout = null;
let biteTimeout = null;
let currentFish = null;
let fishCaught = false;

let inventory = [];
let inventoryOpen = false;
let gold = 0;

function loadLevel(levelIndex, startX = null, startY = null) {
  const levelNames = {
    0: "Spenningsbyen",
    1: "Hus-Hub",
    2: "Cave-1",
    3: "Troférom",
    4: "Sti-1"
  };
  
  const level = levels[levelIndex];
  currentLevel = levelIndex;

  const locationLabel = document.getElementById("locationLabel");
  locationLabel.innerText = levelNames[levelIndex] || `Område ${levelIndex}`;

  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
  }

  currentMusic = sounds.music[levelIndex];
  if (currentMusic) {
    currentMusic.loop = true;
    currentMusic.volume = 0.5;
    currentMusic.play();
  }

  map = level.layout.map(row => row.split('').map(char => tileMapping[char]));
  mapHeight = map.length;
  mapWidth = map[0].length;

  canvas.width = mapWidth * tileSize;
  canvas.height = mapHeight * tileSize;

  currentBackground = level.background || 'grass';

  character.x = startX !== null ? startX : level.startX;
  character.y = startY !== null ? startY : level.startY;

  character.pixelX = character.x * tileSize;
  character.pixelY = character.y * tileSize;

  gameLoop();
  // Fjern tidligere trofévisning hvis den finnes
  const existingTrophy = document.getElementById("trophyRoom");
  if (existingTrophy) existingTrophy.remove();

  // Vis troférom hvis vi er i rom 3
  if (levelIndex === 3) {
    setTimeout(() => {
      renderTrophyRoom();
    }, 100);
  }
}

function drawMap() {
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const tileType = map[y][x];
      ctx.drawImage(tileImages[currentBackground], x * tileSize, y * tileSize, tileSize, tileSize);
      if (tileType !== 'grass') {
        ctx.drawImage(tileImages[tileType], x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
}

// === KARAKTERVALG ===
// Vi lagrer karaktervalg her etter character creation
let playerData = {
  gender: null,
  name: null,
  
};

// === Karaktervalgskjerm ===
function showCharacterCreation() {
  const container = document.createElement("div");
  container.id = "charCreation";
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.background = "rgba(0,0,0,0.9)";
  container.style.zIndex = "50";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.color = "white";
  container.style.fontFamily = "monospace";

  container.innerHTML = `
    <h2>Lag din karakter</h2>
    <label>Kallenavn: <input id="charName" /></label><br>
    <label>Kjønn:
      <select id="charGender">
        <option value="male">Mann</option>
        <option value="female">Kvinne</option>
      </select>
    </label><br><br>
    <button onclick="finishCharacterCreation()">Start spill</button>
  `;

  document.body.appendChild(container);
}

function finishCharacterCreation() {
  const gender = document.getElementById("charGender").value;
  const name = document.getElementById("charName").value.trim();

  if (!name) {
    alert("Du må velge et navn!");
    return;
  }

  playerData.gender = gender;
  playerData.name = name;

  // Nå: Ikke lagre enda – be spilleren velge slot
  document.getElementById("charCreation").remove();
  showSaveSlotSelection("create"); // Egen modus for å opprette ny karakter direkte
}

function applyCharacterAppearance() {
  if (!playerData || !playerData.gender) return;

  if (playerData.gender === 'male') {
    characterImages.up.src = 'images/pixelmannUp.png';
    characterImages.down.src = 'images/pixelmanndown.png';
    characterImages.left.src = 'images/pixelmannLeft.png';
    characterImages.right.src = 'images/pixelmannRight.png';
  } else {
    characterImages.up.src = 'images/pixelwomanUp.png';
    characterImages.down.src = 'images/pixelwomanDown.png';
    characterImages.left.src = 'images/pixelwomanLeft.png';
    characterImages.right.src = 'images/pixelwomanRight.png';
  }
}

// === Karakter tegning ===
function drawCharacter() {
  const img = characterImages[character.direction];
  ctx.drawImage(img, character.pixelX, character.pixelY, tileSize, tileSize);
}

function canMoveTo(x, y) {
  if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) return false;
  return !nonWalkableTiles.includes(map[y][x]);
}

function moveCharacter(dx, dy) {
  if (character.moving) return;

  const newX = character.x + dx;
  const newY = character.y + dy;
  if (!canMoveTo(newX, newY)) return;

  character.direction = dx === -1 ? 'left' : dx === 1 ? 'right' : dy === -1 ? 'up' : 'down';
  character.moving = true;
  character.x = newX;
  character.y = newY;

  const targetX = character.x * tileSize;
  const targetY = character.y * tileSize;
  const speed = 2;

  function animate() {
    let doneX = false, doneY = false;
    if (character.pixelX < targetX) {
      character.pixelX += speed;
      if (character.pixelX >= targetX) { character.pixelX = targetX; doneX = true; }
    } else if (character.pixelX > targetX) {
      character.pixelX -= speed;
      if (character.pixelX <= targetX) { character.pixelX = targetX; doneX = true; }
    } else { doneX = true; }

    if (character.pixelY < targetY) {
      character.pixelY += speed;
      if (character.pixelY >= targetY) { character.pixelY = targetY; doneY = true; }
    } else if (character.pixelY > targetY) {
      character.pixelY -= speed;
      if (character.pixelY <= targetY) { character.pixelY = targetY; doneY = true; }
    } else { doneY = true; }

    gameLoop();

    if (!doneX || !doneY) {
      requestAnimationFrame(animate);
    } else {
      character.moving = false;
      const tile = map[character.y][character.x];
      if (tile === 'door' || tile === 'voidgate') {
        const key = `${character.x},${character.y}`;
        const door = doorMap[currentLevel]?.[key];
        if (door) loadLevel(door.targetLevel, door.targetX, door.targetY);
      }
    }
  }

  requestAnimationFrame(animate);
}

function getAllUniqueFish() {
  const allFish = Object.values(fishPools).flat();
  const seen = {};
  return allFish.filter(f => {
    if (seen[f.name]) return false;
    seen[f.name] = true;
    return true;
  });
}

function tryInteract() {
  if (character.moving || isFishing) return;
  let tx = character.x, ty = character.y;
  if (character.direction === 'up') ty -= 1;
  if (character.direction === 'down') ty += 1;
  if (character.direction === 'left') tx -= 1;
  if (character.direction === 'right') tx += 1;
  const tile = map[ty]?.[tx];
  if (tile === 'water') startFishing();
  else if (tile === 'npcShop') openShop();
}

function startFishing() {
  isFishing = true;

  if (sounds.sfx.startFishing) sounds.sfx.startFishing.play();

  fishCaught = false;
  showFishingBox("Fisker...");
  const wait = Math.floor(Math.random() * 8000) + 2000;
  fishTimeout = setTimeout(fishGotBite, wait);
}

function showFishingBox(text) {
  if (!fishingBox) {
    fishingBox = document.createElement('div');
    fishingBox.id = 'fishingBox';
    fishingBox.style.position = 'absolute';
    fishingBox.style.bottom = '50px';
    fishingBox.style.left = '50%';
    fishingBox.style.transform = 'translateX(-50%)';
    fishingBox.style.background = '#333';
    fishingBox.style.color = '#fff';
    fishingBox.style.padding = '10px';
    fishingBox.style.border = '2px solid #aaa';
    fishingBox.style.fontFamily = 'monospace';
    fishingBox.style.zIndex = '10';
    document.body.appendChild(fishingBox);
  }
  fishingBox.innerHTML = `${text}<br><button onclick="cancelFishing()">Avbryt</button>`;
}

function hideFishingBox() {
  if (fishingBox) {
    document.body.removeChild(fishingBox);
    fishingBox = null;
  }
}

function cancelFishing() {
  clearTimeout(fishTimeout);
  clearTimeout(biteTimeout);
  hideFishingBox();
  isFishing = false;
}

function fishGotBite() {
  currentFish = getRandomFish();
  const rarity = currentFish.rarity;
  const settings = raritySettings[rarity] || { time: 4000, color: "white" };
  const totalTime = settings.time;
  const color = settings.color;

  const prompt = `
    <div style="margin-bottom: 10px;">
      <div style="border: 2px solid ${color}; padding: 4px; display:inline-block;">
        <img src="${currentFish.image}" width="64" height="64" alt="${currentFish.name}">
      </div>
      <div>${currentFish.name}</div>
    </div>
    <div style="margin-bottom: 10px;">NAPP! Trykk riktig knapp:</div>
    <button style="background:gray;" onclick="tryCatchFish('common')">Common</button>
    <button style="background:blue;" onclick="tryCatchFish('rare')">Rare</button>
    <button style="background:gold;" onclick="tryCatchFish('legendary')">Legendary</button>
    <div id="biteTimerBar" style="width: 100%; height: 15px; background: #222; margin-top: 10px; position: relative;">
      <div id="biteTimerFill" style="position: absolute; top: 0; left: 0; height: 100%; width: 100%; background: ${color}; transition: width 0.1s linear;"></div>
    </div>
    
  `;

  if (sounds.sfx.gotBite) sounds.sfx.gotBite.play();

  fishingBox.innerHTML = prompt;

  const fill = document.getElementById("biteTimerFill");
  let elapsed = 0;
  const interval = 50;

  const countdown = setInterval(() => {
    if (fishCaught) {
      clearInterval(countdown);
      return;
    }

    elapsed += interval;
    const progress = Math.max(0, 1 - (elapsed / totalTime));
    fill.style.width = (progress * 100) + "%";

    if (elapsed >= totalTime) {
      clearInterval(countdown);
      showFishingBox("Fisken stakk av!");
      if (sounds.sfx.catchFail) sounds.sfx.catchFail.play();
      setTimeout(cancelFishing, 1200);
    }
  }, interval);
}

function tryCatchFish(choice) {
  if (currentFish && currentFish.rarity === choice) {
    showFishingBox(`Du fanget en ${currentFish.name}!`);
    if (sounds.sfx.catchSuccess) sounds.sfx.catchSuccess.play();
    addToInventory(currentFish);
  } else {
    showFishingBox("Bom! Du mistet fisken.");
    if (sounds.sfx.catchFail) sounds.sfx.catchFail.play();
  }
  fishCaught = true;
  setTimeout(cancelFishing, 2000);
}

function getRandomFish() {
  const pool = fishPools[currentLevel] || [];

  const totalChance = pool.reduce((sum, fish) => sum + fish.chance, 0);
  const roll = Math.random() * totalChance;
  let sum = 0;

  for (const fish of pool) {
    sum += fish.chance;
    if (roll < sum) {
      return {
        name: fish.name,
        rarity: fish.rarity,
        image: fish.image,
        price: fish.price
      };
    }
  }

  return { name: "???", rarity: "common", image: "images/defaultFish.png", price: 0 };
}

function addToInventory(fish) {
  let item = inventory.find(i => i.name === fish.name);
  if (item) {
    item.count += 1;
  } else {
    inventory.push({ ...fish, count: 1 });
  }

  // Legg til i trophies hvis det er første gang du fanger denne
  if (!trophies.includes(fish.name)) {
    trophies.push(fish.name);
  }

  if (inventoryOpen) renderInventory();
}

function openShop() {
  const shopBox = document.getElementById('shopBox');
  let shopHTML = `<h3 style="font-family: Cursive;">Butikk</h3><p>Selg fisken din for gull</p>`;
  let hasFish = false;

  inventory.forEach(item => {
    const allFish = Object.values(fishPools).flat();
    const fishInfo = allFish.find(f => f.name === item.name);

    if (fishInfo) {
      hasFish = true;
      shopHTML += `<button onclick="sellFish('${item.name}', ${fishInfo.price})">Selg ${item.name} (${fishInfo.price} gull)</button><br>`;
    }
  });

  if (!hasFish) {
    shopHTML += `<p>Du har ingen fisk å selge.</p>`;
  }

  shopHTML += `<br><button onclick="closeShop()">Lukk</button>`;
  shopBox.innerHTML = shopHTML;
  shopBox.style.display = 'block';
}

function closeShop() {
  document.getElementById('shopBox').style.display = 'none';
}

function sellFish(fishName, price) {
  const itemIndex = inventory.findIndex(i => i.name === fishName);
  if (itemIndex !== -1) {
    inventory[itemIndex].count--;
    gold += price;
    if (inventory[itemIndex].count <= 0) {
      inventory.splice(itemIndex, 1);
    }
    renderInventory();
    openShop(); // Refresh shop UI
  }
}

function renderTrophyRoom() {
  if (currentLevel !== 3) return;

  const allFish = getAllUniqueFish();

  const trophyDiv = document.createElement("div");
  trophyDiv.style.position = "absolute";
  trophyDiv.style.top = "50px";
  trophyDiv.style.left = "50%";
  trophyDiv.style.transform = "translateX(-50%)";
  trophyDiv.style.background = "#111";
  trophyDiv.style.border = "2px solid #888";
  trophyDiv.style.padding = "20px";
  trophyDiv.style.zIndex = "15";
  trophyDiv.style.color = "white";
  trophyDiv.style.fontFamily = "monospace";

  trophyDiv.id = "trophyRoom";

  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(6, 64px)";
  grid.style.gap = "12px";

  allFish.forEach(fish => {
    const hasCaught = trophies.includes(fish.name);

    const cell = document.createElement("div");
    cell.style.width = "64px";
    cell.style.height = "64px";
    cell.style.background = "#222";
    const rarity = raritySettings[fish.rarity];
    const borderColor = hasCaught && rarity ? rarity.border : "#444";
    cell.style.border = `2px solid ${borderColor}`;
    cell.style.display = "flex";
    cell.style.alignItems = "center";
    cell.style.justifyContent = "center";

    const img = document.createElement("img");
    img.src = fish.image;
    img.width = 48;
    img.height = 48;
    if (!hasCaught) {
      img.style.filter = "grayscale(100%) brightness(50%)";
      img.title = "???";
    } else {
      img.title = fish.name;
    }

    cell.appendChild(img);
    grid.appendChild(cell);
  });

  const title = document.createElement("h3");
  const caught = trophies.length;
  const total = allFish.length;
  title.innerText = `Troféer: ${caught} av ${total}`;
  trophyDiv.appendChild(title);

  trophyDiv.appendChild(grid);
  document.body.appendChild(trophyDiv);
}

// === Kart: Lokasjoner og visning ===
const mapData = [
  { name: "Spenningsbyen", x: 20, y: 20, type: "city", color: "dodgerblue" },
  { name: "Sti-1", x: 35, y: 20, type: "road", color: "#8B4513" },
  { name: "Sti-1", x: 50, y: 20, type: "road", color: "#8B4513" },
  { name: "Sti-1", x: 65, y: 20, type: "road", color: "#8B4513" },
  { name: "Sti-1", x: 80, y: 20, type: "road", color: "#8B4513" },
  
];

let showMap = false;
const mouse = { x: 0, y: 0 };
let hoveredLocation = null;

canvas.addEventListener("mousemove", (e) => {
  if (!showMap) return;
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;

  gameLoop(); 
});

function renderWorldMap() {
  const mapX = canvas.width - 200 - 20;
  const mapY = 10;
  const mapWidth = 200;
  const mapHeight = 200;

  ctx.fillStyle = "#111";
  ctx.fillRect(mapX, mapY, mapWidth, mapHeight);
  ctx.strokeStyle = "#888";
  ctx.strokeRect(mapX, mapY, mapWidth, mapHeight);

  hoveredLocation = null;

  mapData.forEach(loc => {
    const lx = mapX + loc.x;
    const ly = mapY + loc.y;
    const size = loc.type === "city" ? 10 : 6;
    const shape = loc.type === "city" ? "rect" : "circle";

    const isHovered = (
      mouse.x >= lx - size && mouse.x <= lx + size &&
      mouse.y >= ly - size && mouse.y <= ly + size
    );

    if (isHovered) hoveredLocation = loc.name;

    ctx.fillStyle = loc.color;
    if (shape === "rect") {
      ctx.fillRect(lx - size / 2, ly - size / 2, size, size);
    } else {
      ctx.beginPath();
      ctx.arc(lx, ly, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  if (hoveredLocation) {
    ctx.fillStyle = "#fff";
    ctx.font = "12px monospace";
    ctx.fillText(hoveredLocation, mapX + 5, mapY + mapHeight - 5);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "m") {
    showMap = !showMap;
    gameLoop();
  }
});

// === Overstyr gameLoop med kart ===
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawCharacter();
  if (showMap) renderWorldMap();
}


function renderInventory() {
  const inv = document.getElementById('inventory');
  inv.innerHTML = `<h3 style="color:white;font-family: Cursive;">Inventory (${playerData.name})</h3><p style="color:gold;font-family: Cursive;">Gull: ${gold}</p>`;  

  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(5, 64px)';
  grid.style.gap = '8px';

  inventory.forEach(item => {
    const cell = document.createElement('div'); 
    const rarity = raritySettings[item.rarity];
    const borderColor = rarity ? rarity.border : "#666";

    cell.style.width = '64px';
    cell.style.height = '64px';
    cell.style.background = '#111';
    cell.style.border = `2px solid ${borderColor}`;
    cell.style.display = 'flex';
    cell.style.flexDirection = 'column';
    cell.style.alignItems = 'center';
    cell.style.justifyContent = 'center';
    cell.innerHTML = `<img src="${item.image}" width="32" height="32"><div style="color:white;">x${item.count}</div>`;
    grid.appendChild(cell);
  });

  inv.appendChild(grid);
}

function toggleInventory() {
  inventoryOpen = !inventoryOpen;
  document.getElementById('inventory').style.display = inventoryOpen ? 'block' : 'none';
  if (inventoryOpen) renderInventory();
}

document.addEventListener('keydown', (e) => {
  if (character.moving) return;
  switch (e.key) {
    case 'w': moveCharacter(0, -1); break;
    case 's': moveCharacter(0, 1); break;
    case 'a': moveCharacter(-1, 0); break;
    case 'd': moveCharacter(1, 0); break;
    case 'e': tryInteract(); break;
    case 'i': toggleInventory(); break;
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    toggleMenu();
  }
});

function toggleMenu() {
  menuOpen = !menuOpen;
  document.getElementById('gameMenu').style.display = menuOpen ? 'flex' : 'none';
}

function closeMenu() {
  menuOpen = false;
  document.getElementById('gameMenu').style.display = 'none';
}

function saveGame() {
  const saveData = {
    inventory: inventory,
    trophies: trophies,
    level: currentLevel,
    position: {
      x: character.x,
      y: character.y,
      direction: character.direction
    },
    gold: gold,
    playerLevel: playerLevel,
    playerXP: playerXP
  };

  localStorage.setItem('voidquest_save', JSON.stringify(saveData));
  alert("Spillet er lagret!");
}

function loadGame() {
  try {
    const saved = localStorage.getItem('voidquest_save');
    if (saved) {
      const data = JSON.parse(saved);
      inventory = data.inventory || [];
      trophies = data.trophies || [];
      gold = data.gold || 0;

      // Last nivå og XP
      playerLevel = data.playerLevel || 1;
      playerXP = data.playerXP || 0;

      xpToNextLevel = Math.floor(100 * Math.pow(1.25, playerLevel - 1)); // beregn riktig threshold

      const level = data.level ?? 0;
      const x = data.position?.x ?? levels[level].startX;
      const y = data.position?.y ?? levels[level].startY;
      const dir = data.position?.direction ?? 'down';

      character.direction = dir;
      loadLevel(level, x, y);
      renderInventory();
      updateXPUI(); // oppdater UI etter load
    } else {
      loadLevel(0);
    }
  } catch (e) {
    console.error("Feil ved lasting av lagring:", e);
    loadLevel(0);
  }
}

// === XP & LEVEL SYSTEM ===
let playerLevel = 1;
let playerXP = 0;
let xpToNextLevel = 100;

// Hvor mye XP hver type fisk gir
defineFishXP();
function defineFishXP() {
  const pool = Object.values(fishPools).flat();
  pool.forEach(fish => {
    if (!fish.xp) {
      if (fish.rarity === "common") fish.xp = 10;
      else if (fish.rarity === "rare") fish.xp = 25;
      else if (fish.rarity === "legendary") fish.xp = 75;
    }
  });
}

function gainXP(amount) {
  playerXP += amount;
  if (playerXP >= xpToNextLevel) {
    playerXP -= xpToNextLevel;
    playerLevel++;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.25);
    alert(`Du har gått opp til nivå ${playerLevel}!`);
    if (sounds.sfx.levelUp) sounds.sfx.levelUp.play();
  }
  updateXPBar();
}

function updateXPBar() {
  const bar = document.getElementById("xpBar");
  const percent = Math.floor((playerXP / xpToNextLevel) * 100);
  if (bar) {
    bar.style.width = percent + "%";
    bar.innerText = `XP: ${playerXP} / ${xpToNextLevel}`;
  }
}

// === Legg til HTML XP-Bar et sted i DOM ===
function createXPUI() {
  const xpBarWrapper = document.createElement("div");
  xpBarWrapper.style.position = "absolute";
  xpBarWrapper.style.bottom = "50px";
  xpBarWrapper.style.left = "50%";
  xpBarWrapper.style.transform = "translateX(-50%)";
  xpBarWrapper.style.width = "300px";
  xpBarWrapper.style.background = "#222";
  xpBarWrapper.style.border = "2px solid #888";
  xpBarWrapper.style.color = "white";
  xpBarWrapper.style.fontFamily = "monospace";
  

  const xpBar = document.createElement("div");
  xpBar.id = "xpBar";
  xpBar.style.height = "20px";
  xpBar.style.width = "0%";
  xpBar.style.background = "lime";
  xpBar.style.textAlign = "center";
  xpBar.style.fontSize = "14px";
  xpBar.style.lineHeight = "20px";

  xpBarWrapper.appendChild(xpBar);
  document.body.appendChild(xpBarWrapper);
  updateXPBar();
}

// === Spill av lyd for level up ===
sounds.sfx.levelUp = new Audio("lyder/levelUp.wav");

// === Legg til XP når du fanger fisk ===
function addToInventory(fish) {
  let item = inventory.find(i => i.name === fish.name);
  if (item) {
    item.count += 1;
  } else {
    inventory.push({ ...fish, count: 1 });
  }
  if (!trophies.includes(fish.name)) {
    trophies.push(fish.name);
  }
  gainXP(fish.xp || 10); // Få XP basert på fisken
  if (inventoryOpen) renderInventory();
}

// === Vis nivå i inventory ===
function renderInventory() {
  const inv = document.getElementById('inventory');
  inv.innerHTML = `<h3 style="color:white;font-family: Cursive;">Inventory (${playerData.name}) – Nivå ${playerLevel}</h3><p style="color:gold;font-family: Cursive;">Gull: ${gold}</p>`;

}

// === Start XP UI ved spillets start ===
createXPUI();


// ============ MULTIPLE SAVE SYSTEM ============
const MAX_SLOTS = 3;

function showSaveSlotSelection(mode) {
  const slotMenu = document.createElement("div");
  slotMenu.id = "slotMenu";
  slotMenu.style.position = "absolute";
  slotMenu.style.top = "0";
  slotMenu.style.left = "0";
  slotMenu.style.width = "100%";
  slotMenu.style.height = "100%";
  slotMenu.style.background = "rgba(0,0,0,0.85)";
  slotMenu.style.zIndex = "50";
  slotMenu.style.display = "flex";
  slotMenu.style.flexDirection = "column";
  slotMenu.style.alignItems = "center";
  slotMenu.style.justifyContent = "center";
  slotMenu.style.color = "white";
  slotMenu.style.fontFamily = "monospace";

  const title = document.createElement("h2");
  title.innerText =
    mode === "save" ? "Velg en lagreslot" :
    mode === "load" ? "Velg en karakter" :
    "Slett en karakter";
  slotMenu.appendChild(title);

  for (let i = 0; i < MAX_SLOTS; i++) {
    const slotKey = `voidquest_slot_${i}`;
    const data = JSON.parse(localStorage.getItem(slotKey) || "null");

    const saveSlot = document.createElement("div");
    saveSlot.style.border = "2px solid white";
    saveSlot.style.padding = "10px";
    saveSlot.style.margin = "10px";
    saveSlot.style.cursor = "pointer";
    saveSlot.style.width = "250px";
    saveSlot.style.display = "flex";
    saveSlot.style.alignItems = "center";
    saveSlot.style.gap = "10px";
    saveSlot.style.background = "#222";

    if (data) {
      const img = document.createElement("img");
      img.src = data.character.gender === "male"
        ? "images/pixelmanndown.png"
        : "images/pixelwomanDown.png";
      img.width = 32;
      img.height = 32;

      const text = document.createElement("div");
      const caught = (data.trophies || []).length;
      const total = getAllUniqueFish().length;
      text.innerHTML = `<strong>${data.character.name}</strong><br>${caught} av ${total} troféer`;

      saveSlot.appendChild(img);
      saveSlot.appendChild(text);
    } else {
      saveSlot.innerHTML = "<em>Tom slot – klikk for å lage karakter</em>";
      saveSlot.style.opacity = 0.7;
    }

    // === Klikk-handling ===
    if (mode === "save") {
      saveSlot.onclick = () => {
        if (!playerData?.name || !playerData?.gender) {
          alert("Du må lage en karakter først.");
          return;
        }
      
        const saveData = {
          character: playerData,
          inventory,
          trophies,
          gold,
          level: currentLevel,
          position: {
            x: character.x,
            y: character.y,
            direction: character.direction
          },
          playerLevel,
          playerXP,
          xpToNextLevel
        };
      
        localStorage.setItem(`voidquest_slot_${i}`, JSON.stringify(saveData));
        localStorage.setItem("voidquest_active_slot", i);
        alert(`Spillet ble lagret til slot ${i + 1}`);
        slotMenu.remove();
      };

    } else if (mode === "load") {
      saveSlot.onclick = () => {
        if (!data) {
          const confirmed = confirm("Denne sloten er tom. Vil du lage en ny karakter her?");
          if (confirmed) {
            localStorage.setItem("voidquest_active_slot", i);
            slotMenu.remove();
            showCharacterCreationWithSlot(`voidquest_slot_${i}`);
          }
          return;
        }

        // Last data
        playerData = data.character;
        applyCharacterAppearance();
        inventory = data.inventory || [];
        trophies = data.trophies || [];
        gold = data.gold || 0;

        playerLevel = data.playerLevel || 1;
        playerXP = data.playerXP || 0;
        xpToNextLevel = data.xpToNextLevel || 100;
        updateXPBar();

        const pos = data.position || { x: 0, y: 0, direction: "down" };

        localStorage.setItem("voidquest_active_slot", i);
        slotMenu.remove();

        loadLevel(data.level || 0, pos.x, pos.y);
        character.direction = pos.direction;
        renderInventory();
      };

    } else if (mode === "delete") {
      saveSlot.onclick = () => {
        if (!data) {
          alert("Sloten er allerede tom.");
          return;
        }

        const confirmed = confirm(`Slett karakteren "${data.character.name}"?`);
        if (confirmed) {
          localStorage.removeItem(slotKey);
          const active = parseInt(localStorage.getItem("voidquest_active_slot"));
          if (active === i) {
            localStorage.removeItem("voidquest_active_slot");
            location.reload();
          } else {
            slotMenu.remove();
          }
        }
      };
    }

    slotMenu.appendChild(saveSlot);
  }

  const cancel = document.createElement("button");
  cancel.innerText = "Avbryt";
  cancel.style.marginTop = "20px";
  cancel.onclick = () => slotMenu.remove();
  slotMenu.appendChild(cancel);

  document.body.appendChild(slotMenu);
}

function showCharacterCreationWithSlot(slotKey) {
  showCharacterCreation();
  
  // Vent til neste "tick" så DOM-innholdet er på plass
  setTimeout(() => {
    const button = document.querySelector("#charCreation button");
    if (button) {
      button.onclick = () => finishCharacterCreationToSlot(slotKey);
    } else {
      console.error("Fant ikke startknappen for karakteropprettelse!");
    }
  }, 0);
}

function finishCharacterCreationToSlot(slotKey) {
  const gender = document.getElementById("charGender").value;
  const name = document.getElementById("charName").value.trim();

  if (!name) {
    alert("Du må velge et navn!");
    return;
  }

  playerData.gender = gender;
  playerData.name = name;
  applyCharacterAppearance();

  localStorage.setItem(slotKey + '_character', JSON.stringify(playerData));
  document.getElementById("charCreation").remove();

  loadLevel(0);
}

// ========= MULTIPLE SAVE SYSTEM FERDIG =========

// Prevent movement/inventory while menu is open or fishing
document.addEventListener('keydown', (e) => {
  if (menuOpen || isFishing) return;
  // Your existing movement + inventory toggle logic here
});


// Startspill: sjekk om det finnes en aktiv slot med karakterdata
const activeSlot = localStorage.getItem("voidquest_active_slot");
if (activeSlot !== null) {
  const slotKey = `voidquest_slot_${activeSlot}`;
  const data = JSON.parse(localStorage.getItem(slotKey) || "{}");

  if (data.character) {
    playerData = data.character;
    applyCharacterAppearance();

    inventory = data.inventory || [];
    trophies = data.trophies || [];
    gold = data.gold || 0;

    const level = data.level ?? 0;
    const pos = data.position || { x: 0, y: 0, direction: 'down' };

    character.direction = pos.direction;
    loadLevel(level, pos.x, pos.y);
    renderInventory();
  } else {
    // Hvis sloten finnes, men mangler karakterdata, start ny karakter
    showCharacterCreation();
  }
} else {
  // Ingen aktiv slot valgt – be spiller velge en
  showSaveSlotSelection('load');
}

