console.log("Pocker Exercise");

let fileName = "poker-hands.txt";

var fs = require("fs");
var array = fs.readFileSync(fileName).toString().split("\n");

let player1HandsWinCount = 0;
let player2HandsWinCount = 0;
for (let i in array) {
  const line = array[i];
  console.log(line);
  const hands = line.split(" ");
  if (hands.length != 10) {
    continue;
  }
  const player1Cards = hands.slice(0, 5);
  const player2Cards = hands.slice(5);

  let player1Rank = calculateRank(player1Cards);
  let player2Rank = calculateRank(player2Cards);

  if (player1Rank.rank == player2Rank.rank) {
    if (player1Rank.cardNumber > player2Rank.cardNumber) {
      player1HandsWinCount++;
    } else if (player1Rank.cardNumber < player2Rank.cardNumber) {
      player2HandsWinCount++;
    } else {
      let player1CardVal = transformCardVal(player1Cards);
      let player2CardVal = transformCardVal(player2Cards);
      const player1HighestCardVal = player1CardVal[player1CardVal.length - 1];
      for (let m = player1CardVal.length - 1; m >= 0; m--) {
        if (player1HighestCardVal > player2CardVal[m]) {
          player1HandsWinCount++;
          break;
        } else if (player1HighestCardVal < player2CardVal[m]) {
          player2HandsWinCount++;
          break;
        }
      }
    }
  } else if (player1Rank.rank > player2Rank.rank) {
    player1HandsWinCount++;
  } else if (player1Rank.rank < player2Rank.rank) {
    player2HandsWinCount++;
  }
}

console.log("Player 1: " + player1HandsWinCount);
console.log("Player 2: " + player2HandsWinCount);

function cardValVsOcurrence(playerCards) {
  var map = {};
  for (let i in playerCards) {
    const card = playerCards[i];
    const cardVal = card.charAt(0);
    if (map[cardVal] == null || map[cardVal] == "undefined") {
      map[cardVal] = 1;
    } else {
      map[cardVal] = map[cardVal] + 1;
    }
  }
  return map;
}

function calculateRank(playerCards) {
  const cardValVsCount = cardValVsOcurrence(playerCards);
  let cardValMatchCount = Object.values(cardValVsCount)
    .filter((c) => c > 1)
    .reduce((a, b) => a + b, 0);

  let rankDetails = {
    rank: 0,
  };

  if (cardValMatchCount == 2) {
    rankDetails.rank = 2;
    rankDetails.cardNumber = findCardVal(cardValVsCount, cardValMatchCount);
  }

  if (cardValMatchCount == 3) {
    rankDetails.rank = 4;
    rankDetails.cardNumber = findCardVal(cardValVsCount, cardValMatchCount);
  }

  //console.log("Object.keys(cardValVsCount).length="+Object.keys(cardValVsCount).length)
  if (Object.keys(cardValVsCount).length == 2) {
    rankDetails.rank = 3;
    rankDetails.cardNumber = findCardVal(cardValVsCount, 2);
    poker - hand0;
  }

  if (cardValMatchCount == 3 && Object.keys(cardValVsCount).length == 2) {
    rankDetails.rank = 7;
    rankDetails.cardNumber = findCardVal(cardValVsCount, 2);
  }

  if (Object.keys(cardValVsCount).length == 1) {
    rankDetails.rank = 8;
    rankDetails.cardNumber = findCardVal(cardValVsCount, 5);
  }

  if (isAllConsucutiveCard(playerCards)) {
    rankDetails.rank = 5;
    if (isAllCardOfSameSuite(playerCards)) {
      rankDetails.rank = 9;
    }
  } else if (isAllCardOfSameSuite(playerCards)) {
    rankDetails.rank = 6;
  }

  let allCardsVal = transformCardVal(playerCards);
  if (
    allCardsVal.reduce((a, b) => a + b) == 60 &&
    isAllCardOfSameSuite(playerCards)
  ) {
    rankDetails.rank = 10;
  }

  return rankDetails;
}

function findCardVal(cardValVsCount, count) {
  for (let i in cardValVsCount) {
    if (cardValVsCount[i] == count) {
      return i;
    }
  }
  return -1;
}

function transformCardVal(playerCards) {
  return playerCards
    .map((c) => {
      if (c.startsWith("T")) {
        return 10;
      } else if (c.startsWith("J")) {
        return 11;
      } else if (c.startsWith("Q")) {
        return 12;
      } else if (c.startsWith("K")) {
        return 13;
      } else if (c.startsWith("A")) {
        return 14;
      } else {
        return parseInt(c.charAt(0));
      }
    })
    .sort((a, b) => a - b);
}

function isAllCardOfSameSuite(allCardsVal) {
  const firstCard = allCardsVal[0].charAt(1);
  for (let i = 1; i < allCardsVal.length; i++) {
    if (firstCard != allCardsVal[i].charAt(0)) {
      return false;
    }
  }

  return true;
}

function isAllConsucutiveCard(allCardsVal) {
  for (let k = 0; k < allCardsVal.length - 1; k++) {
    if (allCardsVal[k + 1] - allCardsVal[k] != 1) {
      return false;
    }
  }
  return true;
}
