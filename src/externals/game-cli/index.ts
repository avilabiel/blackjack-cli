import prompts from "prompts";

import StartGame from "@/app/use-cases/blackjack/start-game";
import config from "@/config";

import placingBets from "./placing-bets";
import givingCards from "./giving-cards";
import GiveCard from "@/app/use-cases/blackjack/give-card";
import gettingDecisionsFromPlayers from "./getting-decisions-from-players";

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

    // console.dir(updatedGame, { depth: null });
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

    console.log("END GAME");
    break;

    // TODO: When all players decided to STAND: Reveal Dealer Score, Define Game Winners
    // TODO: Update player balances and display them at the end of the game
    // TODO: If the Dealer Score is below 16, Dealer can HIT
    // TODO: Double
    // TODO: Split
  }
};

main();
