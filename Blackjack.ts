import { startSoftLoader } from './loader.js';
import promptSync from 'prompt-sync';

const prompt = promptSync();

let moneyvalue = 1000;
let isGameOver = false;

const reset = '\x1b[0m';
const red = '\x1b[31m';
const blue = '\x1b[34m';
const green = '\x1b[32m';
const orange = '\x1b[38;5;208m';
 
console.log("██████╗ ██╗      █████╗  ██████╗██╗  ██╗     ██╗ █████╗  ██████╗██╗  ██╗ ");
console.log("██╔══██╗██║     ██╔══██╗██╔════╝██║ ██╔╝     ██║██╔══██╗██╔════╝██║ ██╔╝ ");
console.log("██████╔╝██║     ███████║██║     █████╔╝      ██║███████║██║     █████╔╝  ");
console.log("██╔══██╗██║     ██╔══██║██║     ██╔═██╗ ██   ██║██╔══██║██║     ██╔═██╗  ");
console.log("██████╔╝███████╗██║  ██║╚██████╗██║  ██╗╚█████╔╝██║  ██║╚██████╗██║  ██╗ ");
console.log("╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ");

console.log('Wir spielen Blackjack. Sie haben ' + green + '1000€ ' + reset + 'als Startgeld');
console.log('Du kannst nach jeder Runde mit dem Befehl /money deinen Geldstand sehen.');

const startGamepro = prompt('Möchten Sie das Spiel starten? (' + green + 'y' + reset + '/' + red + 'N' + reset + '): ');
const startAnswer = startGamepro?.trim().toLowerCase() ?? '';

if (startAnswer === 'y' || startAnswer === 'yes' || startAnswer === 'ja' || startAnswer === 'j') {
  const loader = startSoftLoader('Das Spiel wird gestartet', 300);
  setTimeout(() => {
    loader.stop();
    console.log(green + 'Das Spiel startet jetzt!\n' + reset);
    startGameLoop();
  }, 3000);
} else {
  console.log(red + 'Das Spiel wird beendet.' + reset);
  isGameOver = true;
}

function randCard(currentTotal: number): number {
  const randomCard = Math.floor(Math.random() * 10) + 2;
  const cardValue = randomCard === 11 ? 11 : randomCard;

  if (cardValue === 11 && currentTotal + cardValue > 21) {
    return 1;
  }

  return cardValue;
}

function startGameLoop() {
  while (!isGameOver) {
    if (moneyvalue <= 0) {
      console.log('Du hast kein Geld mehr! Das Spiel ist vorbei.' + reset);
      break;
    }

    const setMoneypro = prompt('Wie viel möchtest du setzen? (z. B. 1k für 1000) ');

    if (setMoneypro === null || setMoneypro.toLowerCase() === 'exit') {
      console.log('Spiel beendet.');
      break;
    }

    if (setMoneypro.toLowerCase() === '/money') {
      console.log('Kontostand: ' + moneyvalue + '€\n');
      continue;
    }

    const normalizedSetMoney = setMoneypro.trim();
    const setedMoney = normalizedSetMoney.toLowerCase().endsWith('k')
      ? Number(normalizedSetMoney.slice(0, -1)) * 1000
      : Number(normalizedSetMoney);

    if (!Number.isFinite(setedMoney) || setedMoney <= 0) {
      console.error(red + 'Ungültiger Betrag! Bitte geben Sie eine positive Zahl ein.\n' + reset);
      continue;
    }

    if (setedMoney > moneyvalue) {
      console.log(orange + 'Du hast nicht genug Geld, um so viel zu setzen. Dein Kontostand ist: ' + reset + moneyvalue + '€\n');
      continue;
    }

    moneyvalue -= setedMoney;

    const playerCard1 = randCard(0);
    const playerCard2 = randCard(playerCard1);
    const dealerCard1 = randCard(0);

    let playerTotal = playerCard1 + playerCard2;

    console.log('\nDeine Karten: ' + playerCard1 + ' und ' + playerCard2 + ' (Summe: ' + playerTotal + ')');
    console.log('Die erste Karte des Dealers ist: ' + dealerCard1 + '\n');

    if (playerTotal === 21) {
      console.log(green + 'Blackjack! Du hast gewonnen!' + reset);
      moneyvalue += setedMoney * 2.5;
      console.log(green + 'Neuer Kontostand: ' + blue + moneyvalue + '€\n' + reset);
      continue;
    }

    let playerBust = false;

    while (true) {
      const choice = prompt('Möchten Sie hit oder stand? ');
      const normalizedChoice = choice?.trim().toLowerCase() ?? '';

      if (normalizedChoice === 'hit' || normalizedChoice === 'h') {
        const newCard = randCard(playerTotal);
        playerTotal += newCard;
        console.log('Du ziehst: ' + newCard + ' (Neue Summe: ' + playerTotal + ')');

        if (playerTotal > 21) {
          console.log(red + 'Überkauft! Du hast verloren.' + reset);
          playerBust = true;
          break;
        }

        if (playerTotal === 21) {
          console.log(green + 'Du hast 21 erreicht!' + reset + green + "+" + setedMoney + "€" + reset);
        }
      } else if (normalizedChoice === 'stand' || normalizedChoice === 's') {
        break;
      } else {
        console.log(orange + "Ungültige Eingabe. Bitte 'hit' oder 'stand' eingeben." + reset);
      }
    }

    if (playerBust) {
      console.log('Neuer Kontostand: ' + moneyvalue + '€\n' + red + "-" + setedMoney + '€' + reset);
      continue;
    }

    const dealerCard2 = randCard(dealerCard1);
    let dealerTotal = dealerCard1 + dealerCard2;

    console.log('Die zweite Karte des Dealers ist: ' + dealerCard2 + ' (Summe: ' + dealerTotal + ')');

    while (dealerTotal < 17) {
      const newDealerCard = randCard(dealerTotal);
      dealerTotal += newDealerCard;
      console.log('Dealer zieht: ' + newDealerCard + ' (Neue Dealer-Summe: ' + dealerTotal + ')');
    }

    if (dealerTotal > 21) {
      console.log(green + 'Dealer hat überkauft! Du gewinnst!' + reset + green + "+" + setedMoney + '€' + reset);
      moneyvalue += setedMoney * 2;
    } else if (dealerTotal >= playerTotal) {
      console.log(orange + 'Dealer gewinnt' + reset + ' mit ' + dealerTotal + ' gegen deine ' + playerTotal + '.'+ red + "-" + setedMoney + '€' + reset);
    } else {
      console.log(green + 'Du gewinnst mit ' + playerTotal + ' gegen ' + dealerTotal + ' des Dealers!' + reset+ green + "+" + setedMoney + '€' + reset);
      moneyvalue += setedMoney * 2;
    }

    console.log('Neuer Kontostand: ' + moneyvalue + '€\n');
  }
}

// Dubble noch in Arbeit
