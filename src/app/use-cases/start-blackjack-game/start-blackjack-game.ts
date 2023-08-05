import BlackjackGame from "../../../entities/blackjack-game";
import Player from "../../../entities/player";
import IGameRepository from "../../contracts/i-game-repository";
import IUseCase from "../../contracts/i-use-case";

const START_AMOUNT_FOR_NEW_PLAYERS = 1000;

class StartBlackjackGame implements IUseCase {
  async execute({
    playersAmount,
    gameRepository,
  }: {
    playersAmount: number;
    gameRepository: IGameRepository;
  }): Promise<BlackjackGame> {
    const newPlayers = [];

    for (let index = 0; index < playersAmount; index++) {
      const newPlayer: Player = {
        id: index,
        balance: START_AMOUNT_FOR_NEW_PLAYERS,
      };

      newPlayers.push(newPlayer);
    }

    const blackjackGame = await gameRepository.startBlackjackGame(newPlayers);

    return blackjackGame;
  }
}

export default new StartBlackjackGame();
