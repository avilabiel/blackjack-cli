import BlackjackGame from '@/entities/blackjack-game';
import Game from '@/entities/game';
import Player from '@/entities/player';
import IGameRepository from '@/app/contracts/i-game-repository';
import IUseCase from '@/app/contracts/i-use-case';
import AppError from '@/app/errors/app-error';

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
      throw new AppError('Maximum players is 6');
    }

    const newPlayers = this.buildNewPlayers(playersAmount);

    const newGame: Game = {
      players: newPlayers,
      bets: [],
      rounds: [],
      reports: [],
    };

    const blackjackGame = await gameRepository.startGame(newGame);

    return blackjackGame;
  }

  private buildNewPlayers(playersAmount: number): Player[] {
    const newPlayers = [];

    for (let index = 1; index <= playersAmount; index += 1) {
      const newPlayer: Player = {
        id: index,
        balance: START_AMOUNT_FOR_NEW_PLAYERS,
        originalPlayerId: index,
      };

      newPlayers.push(newPlayer);
    }

    return newPlayers;
  }
}

export default new StartGame();
