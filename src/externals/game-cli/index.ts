import prompts from "prompts";

import StartGame from "@/app/use-cases/blackjack/start-game";
import config from "@/config";

import placingBets from "./placing-bets";
import givingCards from "./giving-cards";
import GiveCard from "@/app/use-cases/blackjack/give-card";

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

  let round = 0;
  let isGameFinished = false;

  while (!isGameFinished) {
    const isBetRound = round === 0;
    const isRoundToGiveCards = round > 0 && round <= 2;

    if (isBetRound) {
      await placingBets(newGame);

      round++;
      continue;
    }

    if (isRoundToGiveCards) {
      await givingCards(newGame, round);

      round++;
      continue;
    }

    console.log(
      `\n===================== ROUND #${round} =====================`
    );

    for (let i = 1; i <= newGame.players.length; i++) {
      let doesPlayerCanAct = true;

      while (doesPlayerCanAct) {
        const updatedGame = await gameRepository.getGameById(newGame.id);
        const previousRoundIndex = round - 2;

        console.dir({ updatedGame, round }, { depth: null });

        const playerState =
          updatedGame.rounds[previousRoundIndex].players[i - 1];
        const cardValues = playerState.cards.map((card) => card.value);

        console.log(
          `PLAYER #${i} | Cards: ${cardValues.join(",")} | Score: ${
            playerState.score
          }`
        );

        const actions = await prompts({
          type: "select",
          name: "response",
          message: "Pick your action",
          choices: [
            { title: "Hit", value: "Hit" },
            { title: "Stand", value: "Stand" },
            // { title: "Double", value: "#0000ff" },
            // { title: "Split", value: "#0000ff" },
          ],
        });

        console.log(`Player #${i} picks ${actions.response}`);

        if (actions.response === "Stand") {
          doesPlayerCanAct = false;
          break;
        }

        if (actions.response === "Hit") {
          const givenCard = await GiveCard.execute({
            gameId: newGame.id,
            round,
            playerId: i,
            gameRepository: config.repositories.gameRepository,
          });

          console.log(`Player #${i}: Your card is ${givenCard.value}`);
          console.log(`Player #${i}: Your total score is ${givenCard.handSum}`);

          if (givenCard.handSum > 21) {
            const isThereMorePlayers = i + 1 < newGame.players.length;
            const movingToTheNextPlayer = isThereMorePlayers
              ? `Moving to the Player #${i + 1}`
              : "";

            console.log(
              `Player #${i}: Your score is above 21, you LOSE! ${movingToTheNextPlayer}`
            );

            doesPlayerCanAct = false;
            round++;
            break;
          }

          round++;
        }
      }

      // TODO: Make Game Rounds.actions easier (maybe remove it)
      // TODO: When all players decided to STAND: Reveal Dealer Score, Define Game Winners
      // TODO: Update player balances and display them at the end of the game
      // TODO: If the Dealer Score is below 16, Dealer can HIT
      // TODO: Double
      // TODO: Split
    }

    if (round === 5) {
      isGameFinished = true;
    }
  }
};

main();
