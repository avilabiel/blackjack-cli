import IGameRepository from "../../app/contracts/i-game-repository";
import BlackjackGame from "../../entities/blackjack-game";
import Player from "../../entities/player";

export default class GameRepositoryInMemory implements IGameRepository {
  private games: BlackjackGame[] | any[] = [];

  startBlackjackGame(players: Player[]): Promise<BlackjackGame> {
    const newGame = new BlackjackGame({
      id: this.games.length + 1,
      players,
      rounds: [],
      winners: [],
      createdAt: new Date(),
    });

    this.games.push(newGame);

    return Promise.resolve(newGame);
  }
}
