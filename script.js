// DATA

const creatures = require("./data/creatures.json")

const playerOne = {
name: "Player One",
playCreature: {},
creatureDeck: [],
playStatValue: 0
}

const playerTwo = {
  name: "Player Two",
  playCreature: {},
  creatureDeck: [],
  playStatValue: 0
  }

;

const gameState = {
  playerInTurn: playerOne,
  draftableCreatures: [...creatures],
  winner: {},
  gameOver: false,
  gameWinner: {},
  tieHoldDeck: []
}

// FUNCTIONS

// -- Game Setup Functions

const setupGame = function () {

  console.log(`Welcome ${playerOne.name} and ${playerTwo.name}!

First, draw your decks!
`)

draftCreatureDecks();

printDeckSize(playerOne);
printDeckSize(playerTwo);
}

// -- Game State Functions

const togglePlayerInTurn = function () {
  gameState.playerInTurn = (gameState.playerInTurn === playerOne ? playerTwo : playerOne)

  return gameState.playerInTurn;
}

const gameOverCheck = function () {
  gameState.gameOver = (playerOne.creatureDeck.length === 0 || playerTwo.creatureDeck.length === 0 ? true : false)

  return gameState.gameOver;
}

const playRound = function () {

  console.log(`
Player In Turn: ${gameState.playerInTurn.name}`)

setPlayCreature(playerOne);
setPlayCreature(playerTwo);

console.log(`
Fighters out!

${playerOne.name}: ${playerOne.playCreature.name}
${playerTwo.name}: ${playerTwo.playCreature.name}
`)

// -- Determine play stat

const playStat = returnHighestStat(gameState.playerInTurn.playCreature);

console.log(`Challenge Stat: ${playStat}
`);

// display stat level for each player's creature

playerOne.playStatValue = playerOne.playCreature[playStat];
playerTwo.playStatValue = playerTwo.playCreature[playStat];

console.log(`Player 1 ${playerOne.playCreature.name} ${playStat} value: ${playerOne.playStatValue}`);
console.log(`Player 2 ${playerTwo.playCreature.name} ${playStat} value: ${playerTwo.playStatValue}
`);

// decide winner

gameState.winner = (playerOne.playStatValue === playerTwo.playStatValue ? null : playerOne.playStatValue > playerTwo.playStatValue ? playerOne: playerTwo);

console.log((gameState.winner === null ? "It's a tie!" : "The winner is: " + gameState.winner.name));

// add winning creatures to deck

if (gameState.winner === playerOne) {
  addCardsToDeck(playerOne.creatureDeck, playerOne.playCreature, playerTwo.playCreature)
}
else if (gameState.winner === playerTwo) {
  addCardsToDeck(playerTwo.creatureDeck, playerOne.playCreature, playerTwo.playCreature)
}

// add cards to tie hold deck if there's a tie

if (!gameState.winner) {
  addCardsToDeck(gameState.tieHoldDeck, playerOne.playCreature, playerTwo.playCreature)
}

printDeckSize(playerOne);
printDeckSize(playerTwo);
}

// -- Deck Setup Functions

const draftCreature = function () {
  const index = Math.floor(Math.random() * gameState.draftableCreatures.length);

  //removes creature from draftableCreatures and saves spliced element as creature

  const creature = gameState.draftableCreatures.splice(index, 1);

  return creature[0];
};

const draftCreatureDecks = function () {
  
  while (gameState.draftableCreatures.length) {

    const draftedCreature = draftCreature();
  
    gameState.playerInTurn.creatureDeck.push(draftedCreature);
  
    togglePlayerInTurn();
  }

  return creatures;

}

// Gameplay Functions

const setPlayCreature = function (player) {

  player.playCreature = player.creatureDeck[0];

  player.creatureDeck.shift();

  return player.playCreature;
}

const returnHighestStat = function (creature) {
  // collect the stat values and store in an array

  const stats = [
    creature.power,
    creature.skill,
    creature.magic,
    creature.wit,
    creature.influence,
  ];

  // find the highest value in that array

  const max = Math.max(...stats);

  // find the stat equal to that value and return stat name

  return Object.keys(creature).find(key => creature[key] === max);
};

const addCardsToDeck = function (deck, card1, card2) {
  deck.push(card1)
  deck.push(card2);
  return deck;

}

// -- Display/Log Functions

const printDeckSize = function (player) {

  console.log(`${player.name} Deck Size: ${player.creatureDeck.length}`);

}

const declareWinner = function () {
  gameState.gameWinner = (playerOne.creatureDeck.length ? playerOne : playerTwo);

console.log(`
Congratulations! The Game Winner is ${gameState.gameWinner.name}`)
}

// EXECUTION
setupGame();

while (!gameState.gameOver) {

  playRound();
  gameOverCheck();
  togglePlayerInTurn();
}

declareWinner();