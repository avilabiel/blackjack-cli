import prompts from "prompts";

import StartGame from "@/app/use-cases/blackjack/start-game";
import config from "@/config";

import placingBets from "./placing-bets";
import givingCards from "./giving-cards";
import gettingDecisionsFromPlayers from "./getting-decisions-from-players";
import FinishGame from "@/app/use-cases/blackjack/finish-game";

// TODO: improve clean code here
const main = async () => {
  const gameTitle =
    " ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______  \r\n|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______| \r\n ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______  \r\n|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______| \r\n ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______  \r\n|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______| \r\n __   __   __   __   __   __   __   __     .______    __          ___       ______  __  ___        __       ___       ______  __  ___     __   __   __   __   __   __   __   __  \r\n|  | |  | |  | |  | |  | |  | |  | |  |    |   _  \\  |  |        /   \\     /      ||  |/  /       |  |     /   \\     /      ||  |/  /    |  | |  | |  | |  | |  | |  | |  | |  | \r\n|  | |  | |  | |  | |  | |  | |  | |  |    |  |_)  | |  |       /  ^  \\   |  ,----'|  '  /        |  |    /  ^  \\   |  ,----'|  '  /     |  | |  | |  | |  | |  | |  | |  | |  | \r\n|  | |  | |  | |  | |  | |  | |  | |  |    |   _  <  |  |      /  /_\\  \\  |  |     |    <   .--.  |  |   /  /_\\  \\  |  |     |    <      |  | |  | |  | |  | |  | |  | |  | |  | \r\n|  | |  | |  | |  | |  | |  | |  | |  |    |  |_)  | |  `----./  _____  \\ |  `----.|  .  \\  |  `--'  |  /  _____  \\ |  `----.|  .  \\     |  | |  | |  | |  | |  | |  | |  | |  | \r\n|  | |  | |  | |  | |  | |  | |  | |  |    |______/  |_______/__/     \\__\\ \\______||__|\\__\\  \\______/  /__/     \\__\\ \\______||__|\\__\\    |  | |  | |  | |  | |  | |  | |  | |  | \r\n|__| |__| |__| |__| |__| |__| |__| |__|                                                                                                  |__| |__| |__| |__| |__| |__| |__| |__| \r\n ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______  \r\n|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______| \r\n ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______  \r\n|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______| \r\n ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______  \r\n|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______|______| \r\n                                                                                                                                                                        ";

  console.log(gameTitle + "\n\n");

  const playersAmount = await prompts({
    type: "number",
    name: "response",
    message: "Please, tell us how many players will play?",
    validate: (value) => (value > 6 ? "Max players per game is 6" : true),
  });

  console.log(`Starting the game #1 with ${playersAmount.response} players`);
  console.log("Players start with $1,000 \n");

  const gameRepository = config.repositories.gameRepository;

  const newGame = await StartGame.execute({
    playersAmount: playersAmount.response,
    gameRepository,
  });

  let isGameFinished = false;

  while (!isGameFinished) {
    const updatedGame = await gameRepository.getGameById(newGame.id);

    const isBetRound = updatedGame.bets.length === 0;
    const isRoundToGiveCards = !isBetRound && updatedGame.rounds.length < 2;

    if (isBetRound) {
      await placingBets(updatedGame);
      continue;
    }

    if (isRoundToGiveCards) {
      await givingCards(updatedGame);
      continue;
    }

    if (!updatedGame.allPlayersReady) {
      await gettingDecisionsFromPlayers({ game: updatedGame, gameRepository });
    }

    const finishedGame = await FinishGame.execute({
      gameId: newGame.id,
      gameRepository,
    });

    const lastRound = finishedGame.rounds[finishedGame.rounds.length - 1];
    const dealerCards = lastRound.dealer.cards.map((card) => card.value);

    console.log("\n================== END GAME ==================\n");
    console.log(
      `Dealer | Cards: ${dealerCards.join(",")} | Score: ${
        lastRound.dealer.score
      }`
    );

    for (let i = 0; i < finishedGame.players.length; i++) {
      const playerCards = finishedGame.reports[i].cards.map(
        (card) => card.value
      );

      console.log(
        `Player #${i} | Cards: ${playerCards.join(",")} | Score: ${
          finishedGame.reports[i].finalScore
        } | Winner: ${finishedGame.reports[i].isWinner} | Prize: ${
          finishedGame.reports[i].prize
        } | Final Balance: ${finishedGame.players[i].balance}`
      );
    }

    isGameFinished = true;
    console.log("\n\n\nThank you for playing!");

    // TODO: If the Dealer Score is below 16, Dealer can HIT
    // TODO: Double
    // TODO: Split
    // TODO: Start game using REST + maybe fix the HIDDEN on REST response (think)
  }
};

main();
