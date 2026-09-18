import promptSync from 'prompt-sync';
const prompt = promptSync();

let moneyvalue = 1000;
let isGameOver :boolean = false;

const reset = "\x1b[0m";
const Bright = "\x1b[1m"
const Dim = "\x1b[2m"
const red = "\x1b[31m";
const yellow = "\x1b[33m";
const blue = "\x1b[34m";
const green = "\x1b[32m";
const orange = "\x1b[38;5;208m";


console.log("Wir Spielen hir blackjack Sie haben" + green+" 1000€ "+reset+"als Startgeld");
console.log("du kannst jeder zeit mit dem Befehl /money dein Geldstand sehen");

let startGamepro = prompt("Möchten Sie das Spiel starten? (y/N): ");

if (startGamepro.toLowerCase() === "y") {
    console.log(green+"Das Spiel startet jetzt!\n"+reset);
} else {
    console.log(red+"Das Spiel wird beendet."+reset);
    isGameOver = true;

}

function randCard(totaldealer :number , totalplayer :number) {
    let randomCard :number = Math.floor(Math.random() * 10) + 2;
    if (randomCard === 11) {
        if (totaldealer > 10) {
            randomCard = 1;
        }
        if (totalplayer > 10) {
            randomCard = 1;
        }
    } 

    return randomCard;
}

while (!isGameOver) {
    if (moneyvalue <= 0) {
        console.log(red+"Du hast kein Geld mehr! Das Spiel ist vorbei."+reset);
        break;
    }

    let setMoneypro = prompt("Wie Viel möchtest du setzen? ");

    if (setMoneypro === null || setMoneypro.toLowerCase() === "exit") {
        console.log("Spiel beendet.");
        break;
    }

    if (setMoneypro.toLowerCase() === "/money") {
        console.log("Kontostand: " + moneyvalue + "€\n");
        continue;
    }
        

    
    let setedMoney = +setMoneypro;

    if (isNaN(setedMoney) || setedMoney <= 0) {
        console.log(red+"Ungültiger Betrag! Bitte geben Sie eine positive Zahl ein.\n");
        continue;
    }

    if (setedMoney > moneyvalue) {
        console.log(orange+"Du hast nicht genug Geld um so viel zu setzen. Dein Kontostand ist: "+reset + moneyvalue + "€\n");
        continue;
    }

    moneyvalue -= setedMoney;
    
    let playerCard1 = randCard(0,0);
    let playerCard2 = randCard(0,0);
    let dealerCard1 = randCard(0,0);
   
    let playerTotal = playerCard1 + playerCard2;

    console.log("\nDeine karten: " + playerCard1 + " und " + playerCard2 + " (Summe: " + playerTotal + ")");
    console.log("Die erste Karte des Dealers ist: " + dealerCard1 + "\n");

    if (playerTotal === 21) {
        console.log(green+"Blackjack! Du hast gewonnen!"+reset);
        moneyvalue += setedMoney * 2.5;
        console.log(green+"Neuer Kontostand: " +blue + moneyvalue + "€\n"+reset);
        continue;
    }
   
    let playerBust = false;

    while (true) {
        let choice = prompt("Möchten Sie: hit oder Stand: ");
        if (!choice) choice.toLowerCase() === "stand" || choice.toLowerCase() === "s";
        if (choice.toLowerCase() === "hit" || choice.toLowerCase() === "h") {
            let newCard = randCard(0 , playerTotal);
            playerTotal += newCard
            console.log("Du ziehst: " + newCard + " (Neue Summe: " + playerTotal);
            if (playerTotal > 21) {
                console.log("Überkauft! Du hast verloren.");
                playerBust = true;
                break;
            } else if (playerTotal == 21) {
                console.log("Du hast 21 erreicht!")
                break;
            }
        } else if (choice.toLowerCase() == "stand" || choice.toLowerCase() === "s") {
            break;
        } else {
            console.log(orange+"Ungültige Eingabe. Bitte 'hit' oder 'stand' eingeben."+reset)
        }
    }

    if (playerBust) {
        console.log ('Neuer Kontostand:' + moneyvalue + '€\n');
        continue;
    }

    let dealerCard2 = randCard(0,0);
    let dealerTotal = dealerCard1 + dealerCard2;
    console.log("Die zweite Karte des Dealers ist: " + dealerCard2 + " (Summe: " + dealerTotal + ")")

    while (dealerTotal < 17) {
        let newDealerCard = randCard(dealerTotal, 0);
        dealerTotal += newDealerCard
        console.log("Dealer zieht: " + newDealerCard + "(Neue Dealer Summe:" + dealerTotal);
    } 
    //Ergebniss auswärtuing
    if (dealerTotal > 21) {
        console.log("Dealer hat überkauft! Du gewinnst!")
        moneyvalue += setedMoney * 2;
    } else if (dealerTotal >= playerTotal) {
        console.log("Dealer gewinnt mit " + dealerTotal + " gegen deine " + playerTotal + ".");
        console.error();
        
    } else if (playerTotal > dealerTotal) {
        console.log("Du gewinnst mit " + playerTotal + " gegen " + dealerTotal + " des Dealers!");
        moneyvalue += setedMoney * 2;
        console.error();
    }

    console.log("Neuer Kontostand: " + moneyvalue + "€\n");
}






// Dubble noch in Arbeit