import prompts from "prompts";

import Game from "@/entities/game";
import CreatePlayerBet from "@/app/use-cases/blackjack/create-player-bet";
import config from "@/config";

const placingBets = async (game: Game) => {
  for (let i = 1; i <= game.players.length; i++) {
    await prompts({
      type: "number",
      name: "response",
      message: `Player #${i}, please let us know your bet (any integer)`,
      validate: async (value) => {
        try {
          await CreatePlayerBet.execute({
            betAmount: value,
            playerId: i,
            gameId: game.id as number,
            gameRepository: config.repositories.gameRepository,
          });

          return true;
        } catch (error: any) {
          return error.message;
        }
      },
    });
  }
};

export default placingBets;
