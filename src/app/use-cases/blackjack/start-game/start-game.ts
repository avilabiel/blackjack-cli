import BlackjackGame from "../../../../entities/blackjack-game";
import Player from "../../../../entities/player";
import IGameRepository from "../../../contracts/i-game-repository";
import IUseCase from "../../../contracts/i-use-case";

const START_AMOUNT_FOR_NEW_PLAYERS = 1000;

class StartGame implements IUseCase {
  async execute({
    playersAmount,
    gameRepository,
  }: {
    playersAmount: number;
    gameRepository: IGameRepository;
  }): Promise<BlackjackGame> {
    if (playersAmount > 6) {
      throw new Error("Maximum players is 6");
    }

    const newPlayers = this.buildNewPlayers(playersAmount);

    const blackjackGame = await gameRepository.startBlackjackGame(newPlayers);

    return blackjackGame;
  }

  private buildNewPlayers(playersAmount: number): Player[] {
    const newPlayers = [];

    for (let index = 1; index <= playersAmount; index++) {
      const newPlayer: Player = {
        id: index,
        balance: START_AMOUNT_FOR_NEW_PLAYERS,
      };

      newPlayers.push(newPlayer);
    }

    return newPlayers;
  }
}

export default new StartGame();
