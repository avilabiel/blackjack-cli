import Game from "../../entities/game";
import Player from "../../entities/player";

export default interface IGameRepository {
  startGame(game: Game): Promise<Game>;

  getGameById(gameId: number): Promise<Game | null>;
}
