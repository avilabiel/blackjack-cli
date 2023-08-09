import IGameRepository from "@/app/contracts/i-game-repository";
import CreatePlayerDoubleAction from "@/app/use-cases/blackjack/create-player-double-action";
import CreatePlayerSplitAction from "@/app/use-cases/blackjack/create-player-split-action";
import GiveCard from "@/app/use-cases/blackjack/give-card";
import config from "@/config";
import { Card } from "@/entities/blackjack-game";
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

  let gamePlayersLength = game.players.length;

  for (let i = 1; i <= gamePlayersLength; i++) {
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
          { title: "Double", value: "Double" },
          { title: "Split", value: "Split" },
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

        displayGivenCard(givenCard, i);

        if (givenCard.handSum > 21) {
          const isThereANextPlayer = i + 1 < game.players.length;
          const movingToTheNextPlayer = isThereANextPlayer
            ? `Moving to the Player #${i + 1}`
            : "";

          console.log(
            `Player #${i}: Your score is above 21, you LOSE! ${movingToTheNextPlayer}`
          );

          doesPlayerCanAct = false;
          break;
        }
      }

      if (actions.response === "Double") {
        const givenCardFromDouble = await CreatePlayerDoubleAction.execute({
          gameId: game.id,
          round,
          playerId: i,
          gameRepository: config.repositories.gameRepository,
        });

        displayGivenCard(givenCardFromDouble, i);

        doesPlayerCanAct = false;
        break;
      }

      if (actions.response === "Split") {
        await CreatePlayerSplitAction.execute({
          gameId: game.id,
          playerId: i,
          gameRepository,
        });

        gamePlayersLength++;

        console.log(`Now we are splitting your cards...`);
        console.log(
          `Player #${i} now has a new player as a second hand. New player: PLAYER #${gamePlayersLength}`
        );
      }
    }
  }
};

const displayGivenCard = (card: Card, playerIndex: number): void => {
  console.log(`Player #${playerIndex}: Your card is ${card.value}`);
  console.log(`Player #${playerIndex}: Your total score is ${card.handSum}`);
};

export default gettingDecisionsFromPlayers;
