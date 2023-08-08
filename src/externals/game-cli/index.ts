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
    const isRoundWhereSomeoneCanWin = round > 2;

    if (isBetRound) {
      await placingBets(newGame);
    }

    if (isRoundToGiveCards) {
      await givingCards(newGame, round);
    }

    if (isRoundWhereSomeoneCanWin) {
      console.log(
        `\n===================== ROUND #${round} =====================`
      );

      // TODO: Implement actions
      for (let i = 1; i <= newGame.players.length; i++) {
        // TODO: probably we need to stay on that player until they decide to stand
        const updatedGame = await gameRepository.getGameById(newGame.id);

        console.log("ROUND INDEX", round - 2);
        console.dir(updatedGame, { depth: null });
        const dealerState = updatedGame.rounds[round - 2].dealer;
        const playerState = updatedGame.rounds[round - 2].players[i - 1];
        const cardValues = playerState.cards.map((card) => card.value);

        console.log(
          `PLAYER #${i} | Cards: ${cardValues.join(",")} | Score: ${
            playerState.score
          }`
        );

        if (playerState.score > 21) {
          console.log(`PLAYER #${i} you LOSE!`);
          continue;
        }

        const actions = await prompts({
          type: "select",
          name: "response",
          message: "Pick your action",
          choices: [
            { title: "Hit", value: "hit" },
            { title: "Stand", value: "stand" },
            // { title: "Double", value: "#0000ff" },
            // { title: "Split", value: "#0000ff" },
          ],
        });

        if (actions.response === "stand") {
          if (dealerState.score < playerState.score) {
            updatedGame.players[i - 1].balance += updatedGame.bets[i - 1].bet;
            const finalBalance = updatedGame.players[i - 1].balance;

            console.log(
              `PLAYER #${i} you WON! Your final balance: ${finalBalance}`
            );
          }

          // TODO: generate a history on game.rounds[]
          continue;
        }

        if (actions.response === "hit") {
          const givenCard = await GiveCard.execute({
            gameId: newGame.id,
            round,
            playerId: i,
            gameRepository: config.repositories.gameRepository,
          });

          console.log(`Player #${i}: Your card is ${givenCard.value}`);
          console.log(`Player #${i}: Your total score is ${givenCard.handSum}`);

          // TODO: check game?
          continue;
        }

        console.log(`Player #${i} picks ${actions.response}`);
      }

      // Dealer does nothing

      // Dealer rules => if < 16, HIT
    }

    if (round === 5) {
      isGameFinished = true;
    }

    round++;
  }

  // Suggestions for new use cases: check-game-result, create-hit-action, create-stand-action
  // 3rd round: each player can Double, Hit, Stand, Split
  // 4th..END: each player has the focus until they decide to stop

  //
};

main();
