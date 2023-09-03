import Game from '@/entities/game';

export default interface IGameRepository {
  startGame(game: Game): Promise<Game>;

  getGameById(gameId: number): Promise<Game | null>;

  save(game: Game): Promise<void>;
}
