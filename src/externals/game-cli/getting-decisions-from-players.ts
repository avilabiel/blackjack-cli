import IGameRepository from "@/app/contracts/i-game-repository";
import GiveCard from "@/app/use-cases/blackjack/give-card";
import config from "@/config";
import Game from "@/entities/game";
import prompts from "prompts";

const gettingDecisionsFromPlayers = async ({
  game,
  gameRepository,
}: {
  game: Game;
  gameRepository: IGameRepository;
}): Promise<void> => {
  console.log(
    `\n===================== TIME TO MAKE YOUR DECISIONS! =====================`
  );

  for (let i = 1; i <= game.players.length; i++) {
    let doesPlayerCanAct = true;

    while (doesPlayerCanAct) {
      const updatedGame = await gameRepository.getGameById(game.id);
      const round = updatedGame.rounds.length + 1;
      const previousRoundIndex = updatedGame.rounds.length - 1;

      const playerState = updatedGame.rounds[previousRoundIndex].players[i - 1];
      const cardValues = playerState.cards.map((card) => card.value);

      console.log(
        `\nPLAYER #${i} | Cards: ${cardValues.join(",")} | Score: ${
          playerState.score
        }`
      );

      const actions = await prompts({
        type: "select",
        name: "response",
        message: `PLAYER #${i}: Pick your action`,
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
          gameId: game.id,
          round,
          playerId: i,
          gameRepository: config.repositories.gameRepository,
        });

        console.log(`Player #${i}: Your card is ${givenCard.value}`);
        console.log(`Player #${i}: Your total score is ${givenCard.handSum}`);

        if (givenCard.handSum > 21) {
          const isThereMorePlayers = i + 1 < game.players.length;
          const movingToTheNextPlayer = isThereMorePlayers
            ? `Moving to the Player #${i + 1}`
            : "";

          console.log(
            `Player #${i}: Your score is above 21, you LOSE! ${movingToTheNextPlayer}`
          );

          doesPlayerCanAct = false;
          break;
        }
      }
    }
  }
};

export default gettingDecisionsFromPlayers;
