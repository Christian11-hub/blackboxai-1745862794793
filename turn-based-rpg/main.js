const player = {
  emoji: '🧙‍♂️',
  maxHealth: 100,
  health: 100,
  defending: false,
};

const enemyEmojis = ['👹', '🐉', '🧟‍♂️', '👺', '🦹‍♂️'];
const enemyNames = ['Orc', 'Dragão Ancião', 'Zumbi', 'Goblin', 'Assassino'];

const enemy = {
  emoji: enemyEmojis[Math.floor(Math.random() * enemyEmojis.length)],
  name: enemyNames[Math.floor(Math.random() * enemyNames.length)],
  maxHealth: 100 + Math.floor(Math.random() * 50),
  health: 100,
  defending: false,
};

const playerHealthBar = document.getElementById('player-health');
const playerHealthText = document.getElementById('player-health-text');
const enemyHealthBar = document.getElementById('enemy-health');
const enemyHealthText = document.getElementById('enemy-health-text');
const messageBox = document.getElementById('message');
const playerEmojiElem = document.getElementById('player-emoji');
const enemyEmojiElem = document.getElementById('enemy-emoji');

const attackBtn = document.getElementById('attack-btn');
const defendBtn = document.getElementById('defend-btn');
const spellBtn = document.getElementById('spell-btn');

let playerTurn = true;

function updateHealthBars() {
  playerHealthBar.style.width = (player.health / player.maxHealth) * 100 + '%';
  playerHealthText.textContent = `HP: ${player.health}`;
  enemyHealthBar.style.width = (enemy.health / enemy.maxHealth) * 100 + '%';
  enemyHealthText.textContent = `HP: ${enemy.health}`;
}

function animateAttack(attackerElem) {
  attackerElem.classList.add('attack-animation');
  setTimeout(() => {
    attackerElem.classList.remove('attack-animation');
  }, 500);
}

function playerAttack() {
  if (!playerTurn) return;
  let damage = Math.floor(Math.random() * 15) + 5;
  if (enemy.defending) {
    damage = Math.floor(damage / 2);
  }
  enemy.health = Math.max(enemy.health - damage, 0);
  animateAttack(playerEmojiElem);
  messageBox.textContent = `Você atacou o ${enemy.name} e causou ${damage} de dano!`;
  enemy.defending = false;
  updateHealthBars();
  checkGameOver();
  playerTurn = false;
  setTimeout(enemyTurn, 1500);
}

function playerDefend() {
  if (!playerTurn) return;
  player.defending = true;
  messageBox.textContent = 'Você está defendendo!';
  playerTurn = false;
  setTimeout(enemyTurn, 1500);
}

function playerSpell() {
  if (!playerTurn) return;
  let damage = Math.floor(Math.random() * 25) + 10;
  if (enemy.defending) {
    damage = Math.floor(damage / 2);
  }
  enemy.health = Math.max(enemy.health - damage, 0);
  animateAttack(playerEmojiElem);
  messageBox.textContent = `Você lançou uma magia e causou ${damage} de dano!`;
  enemy.defending = false;
  updateHealthBars();
  checkGameOver();
  playerTurn = false;
  setTimeout(enemyTurn, 1500);
}

function enemyTurn() {
  if (enemy.health <= 0 || player.health <= 0) return;
  const action = Math.random();
  if (action < 0.6) {
    enemyAttack();
  } else if (action < 0.8) {
    enemyDefend();
  } else {
    enemySpell();
  }
  playerTurn = true;
}

function enemyAttack() {
  let damage = Math.floor(Math.random() * 15) + 5;
  if (player.defending) {
    damage = Math.floor(damage / 2);
  }
  player.health = Math.max(player.health - damage, 0);
  animateAttack(enemyEmojiElem);
  messageBox.textContent = `${enemy.name} atacou você e causou ${damage} de dano!`;
  player.defending = false;
  updateHealthBars();
  checkGameOver();
}

function enemyDefend() {
  enemy.defending = true;
  messageBox.textContent = 'O inimigo está defendendo!';
}

function enemySpell() {
  let damage = Math.floor(Math.random() * 25) + 10;
  if (player.defending) {
    damage = Math.floor(damage / 2);
  }
  player.health = Math.max(player.health - damage, 0);
  animateAttack(enemyEmojiElem);
  messageBox.textContent = `O inimigo lançou uma magia e causou ${damage} de dano!`;
  player.defending = false;
  updateHealthBars();
  checkGameOver();
}

function spawnNewEnemy() {
  const index = Math.floor(Math.random() * enemyEmojis.length);
  enemy.emoji = enemyEmojis[index];
  enemy.name = enemyNames[index];
  enemy.maxHealth = 100 + Math.floor(Math.random() * 50);
  enemy.health = enemy.maxHealth;
  enemy.defending = false;
  enemy.attackBonus = 0;
  enemy.defenseBonus = 0;
  enemyEmojiElem.textContent = enemy.emoji;
  updateHealthBars();
  messageBox.textContent = `Um novo ${enemy.name} apareceu! Prepare-se para a batalha!`;
  playerTurn = true;
  enableButtons();
}

function checkGameOver() {
  if (player.health <= 0) {
    player.health = player.maxHealth; // Instant revive
    messageBox.textContent = 'Você foi derrotado, mas reviveu porque é Newba ,luta ai !';
    updateHealthBars();
  } else if (enemy.health <= 0) {
    spawnNewEnemy();
  }
}

function disableButtons() {
  attackBtn.disabled = true;
  defendBtn.disabled = true;
  spellBtn.disabled = true;
  attackBtn.classList.add('opacity-50', 'cursor-not-allowed');
  defendBtn.classList.add('opacity-50', 'cursor-not-allowed');
  spellBtn.classList.add('opacity-50', 'cursor-not-allowed');
}

document.addEventListener('DOMContentLoaded', () => {
  attackBtn.addEventListener('click', playerAttack);
  defendBtn.addEventListener('click', playerDefend);
  spellBtn.addEventListener('click', playerSpell);

  const restartBtn = document.getElementById('restart-btn');
  restartBtn.addEventListener('click', resetGame);

  enemy.health = enemy.maxHealth;
  updateHealthBars();
  messageBox.textContent = 'Sua vez! Escolha uma ação.';
});

function resetGame() {
  player.health = player.maxHealth;
  player.defending = false;
  player.attackBonus = 0;
  player.defenseBonus = 0;

  enemy.emoji = enemyEmojis[Math.floor(Math.random() * enemyEmojis.length)];
  enemy.maxHealth = 100 + Math.floor(Math.random() * 50);
  enemy.health = enemy.maxHealth;
  enemy.defending = false;
  enemy.attackBonus = 0;
  enemy.defenseBonus = 0;
  enemyEmojiElem.textContent = enemy.emoji;

  player.health = player.maxHealth; // Reset player health to full on restart
  enemy.health = enemy.maxHealth;   // Reset enemy health to full on restart

  inventory.length = 0;
  renderInventory();

  updateHealthBars();
  messageBox.textContent = 'Jogo reiniciado! Sua vez! Escolha uma ação.';
  playerTurn = true;
  enableButtons();
}

function enableButtons() {
  attackBtn.disabled = false;
  defendBtn.disabled = false;
  spellBtn.disabled = false;
  attackBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  defendBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  spellBtn.classList.remove('opacity-50', 'cursor-not-allowed');
}

const items = [
  {
    name: 'Espada Flamejante',
    emoji: '🔥🗡️',
    description: 'Você encontrou a Espada Flamejante! +10 de dano nos ataques.',
    effect: () => {
      player.attackBonus = (player.attackBonus || 0) + 10;
    }
  },
  {
    name: 'Escudo de Valíria',
    emoji: '🛡️❄️',
    description: 'Você encontrou o Escudo de Valíria! Reduz dano recebido em 5.',
    effect: () => {
      player.defenseBonus = (player.defenseBonus || 0) + 5;
    }
  },
  {
    name: 'Poção de Cura',
    emoji: '🧪',
    description: 'Você encontrou uma Poção de Cura! Recupera 20 HP.',
    effect: () => {
      player.health = Math.min(player.maxHealth, player.health + 20);
      updateHealthBars();
    }
  },
  {
    name: 'Martelo de Thorin',
    emoji: '🔨',
    description: 'O Martelo de Thorin aumenta seu ataque em 12.',
    effect: () => {
      player.attackBonus = (player.attackBonus || 0) + 12;
    }
  },
  {
    name: 'Anel de Baratheon',
    emoji: '💍',
    description: 'O Anel de Baratheon aumenta sua defesa em 8.',
    effect: () => {
      player.defenseBonus = (player.defenseBonus || 0) + 8;
    }
  },
  {
    name: 'Elixir de Winterfell',
    emoji: '❄️🧪',
    description: 'O Elixir de Winterfell recupera 25 HP.',
    effect: () => {
      player.health = Math.min(player.maxHealth, player.health + 25);
      updateHealthBars();
    }
  }
];

const events = [
  {
    name: 'Batalha Épica',
    emoji: '⚔️',
    description: 'Uma batalha épica começa! O inimigo fica mais agressivo.',
    effect: () => {
      enemy.attackBonus = (enemy.attackBonus || 0) + 5;
    }
  },
  {
    name: 'Névoa Misteriosa',
    emoji: '🌫️',
    description: 'Uma névoa misteriosa envolve o campo de batalha. Dano reduzido pela metade no próximo turno.',
    effect: () => {
      player.defending = true;
      enemy.defending = true;
    }
  },
  {
    name: 'Aliança Inesperada',
    emoji: '🤝',
    description: 'Uma aliança inesperada fortalece você! +15 HP e +5 de ataque.',
    effect: () => {
      player.health = Math.min(player.maxHealth, player.health + 15);
      player.attackBonus = (player.attackBonus || 0) + 5;
      updateHealthBars();
    }
  },
  {
    name: 'Dragão Ancião',
    emoji: '🐉',
    description: 'Um dragão ancião aparece, aumentando o ataque do inimigo em 10!',
    effect: () => {
      enemy.attackBonus = (enemy.attackBonus || 0) + 10;
    }
  },
  {
    name: 'Poção de Invisibilidade',
    emoji: '🧴',
    description: 'Você bebe uma poção de invisibilidade, evitando o próximo ataque inimigo.',
    effect: () => {
      player.defending = true;
    }
  },
  {
    name: 'Maldição do Necromante',
    emoji: '💀',
    description: 'O necromante lança uma maldição! Você perde 10 HP imediatamente.',
    effect: () => {
      player.health = Math.max(player.health - 10, 0);
      updateHealthBars();
    }
  },
  {
    name: 'Fogo de Dragão',
    emoji: '🔥🐉',
    description: 'O fogo de dragão incinera o campo de batalha! Dano aumentado para ambos os lados.',
    effect: () => {
      player.attackBonus = (player.attackBonus || 0) + 5;
      enemy.attackBonus = (enemy.attackBonus || 0) + 5;
    }
  },
  {
    name: 'Noite Longa',
    emoji: '🌑❄️',
    description: 'A Noite Longa cai, reduzindo o dano causado por ambos os lados pela metade.',
    effect: () => {
      player.defending = true;
      enemy.defending = true;
    }
  },
  {
    name: 'Aliança dos Stark',
    emoji: '🐺',
    description: 'A Aliança dos Stark fortalece você! +20 HP e +10 defesa.',
    effect: () => {
      player.health = Math.min(player.maxHealth, player.health + 20);
      player.defenseBonus = (player.defenseBonus || 0) + 10;
      updateHealthBars();
    }
  },
  {
    name: 'Anel do Poder',
    emoji: '💍',
    description: 'O Anel do Poder aumenta seu ataque em 15, mas cuidado com o preço!',
    effect: () => {
      player.attackBonus = (player.attackBonus || 0) + 15;
    }
  },
  {
    name: 'Luz de Galadriel',
    emoji: '✨',
    description: 'A Luz de Galadriel protege você, reduzindo o dano recebido pela metade no próximo turno.',
    effect: () => {
      player.defending = true;
    }
  },
  {
    name: 'Sombra de Mordor',
    emoji: '🌑',
    description: 'A sombra de Mordor enfraquece você, reduzindo seu ataque em 10.',
    effect: () => {
      player.attackBonus = Math.max((player.attackBonus || 0) - 10, 0);
    }
  }
];

function triggerRandomEvent() {
  if (player.health <= 0 || enemy.health <= 0) return;
  const chance = Math.random();
  if (chance < 0.4) { // 40% chance to trigger event
    if (Math.random() < 0.5) {
      // Trigger item
      const item = items[Math.floor(Math.random() * items.length)];
      showEventExplanation(`${item.emoji} ${item.description}`);
      item.effect();
      addItemToInventory(item);
    } else {
      // Trigger event
      const event = events[Math.floor(Math.random() * events.length)];
      showEventExplanation(`${event.emoji} ${event.description}`);
      event.effect();
    }
  }
}
