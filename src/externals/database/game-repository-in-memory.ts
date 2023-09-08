import IGameRepository from '@/app/contracts/i-game-repository';
import Game from '@/entities/game';

export default class GameRepositoryInMemory implements IGameRepository {
  private games: Game[] = [];

  startGame(game: Game): Promise<Game> {
    const persistedGame = {
      ...game,
      id: this.games.length + 1,
      createdAt: new Date(),
    };

    this.games.push(persistedGame);

    return Promise.resolve(persistedGame);
  }

  getGameById(gameId: number): Promise<Game | null> {
    const persistedGame = this.games.find((game) => game.id === gameId);

    if (!persistedGame) {
      return null;
    }

    const persistedGameCopy = JSON.parse(JSON.stringify(persistedGame));

    return Promise.resolve(persistedGameCopy);
  }

  save(game: Game): Promise<void> {
    const gameIndex = this.games.findIndex(
      (persistedGame) => persistedGame.id === game.id,
    );

    this.games[gameIndex] = game;

    return Promise.resolve();
  }
}
