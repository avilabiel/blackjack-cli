import prompts from "prompts";

import StartGame from "@/app/use-cases/blackjack/start-game";
import config from "@/config";
import CreatePlayerBet from "@/app/use-cases/blackjack/create-player-bet";
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

  // round wraper
  let round = 0;
  let isGameFinished = false;

  while (!isGameFinished) {
    const isBetRound = round === 0;
    const isRoundToGiveCards = round > 0 && round <= 2;

    if (isBetRound) {
      for (let i = 1; i <= playersAmount.response; i++) {
        await prompts({
          type: "number",
          name: "response",
          message: `Player #${i}, please let us know your bet (any integer)`,
          validate: async (value) => {
            try {
              await CreatePlayerBet.execute({
                betAmount: value,
                playerId: i,
                gameId: newGame.id as number,
                gameRepository: config.repositories.gameRepository,
              });

              return true;
            } catch (error: any) {
              return error.message;
            }
          },
        });
      }
    }

    if (isRoundToGiveCards) {
      for (let i = 0; i <= playersAmount.response; i++) {
        const isDealer = i === 0;
        const playerDescription = isDealer ? "the dealer" : `the player #${i}`;

        console.log("\n");
        console.log(`Giving the card #${round} to ${playerDescription}...`);

        const givenCard = await GiveCard.execute({
          gameId: newGame.id,
          round,
          playerId: !isDealer ? i : undefined,
          gameRepository,
        });

        // TODO: display score
        console.log(`Your card is: ${givenCard.value} and your score is ${0}`);
      }
    }

    const updatedGame = await gameRepository.getGameById(newGame.id);

    console.dir({ updatedGame }, { depth: null });

    round++;
  }

  // 1st round: give one card for each player and dealer
  // 2nd round: give another card for each player and a card face down for the dealer
  // 3rd round: each player can Double, Hit, Stand, Split
  // 4th..END: each player has the focus until they decide to stop

  //
};

main();
