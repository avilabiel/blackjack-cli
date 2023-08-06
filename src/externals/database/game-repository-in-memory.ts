import IGameRepository from "../../app/contracts/i-game-repository";
import BlackjackGame from "../../entities/blackjack-game";
import Player from "../../entities/player";

export default class GameRepositoryInMemory implements IGameRepository {
  private blackjackGames: BlackjackGame[] = [];

  startBlackjackGame(players: Player[]): Promise<BlackjackGame> {
    const newGame = new BlackjackGame({
      id: this.blackjackGames.length + 1,
      players,
      bets: [],
      rounds: [],
      winners: [],
      createdAt: new Date(),
    });

    this.blackjackGames.push(newGame);

    return Promise.resolve(newGame);
  }
}
