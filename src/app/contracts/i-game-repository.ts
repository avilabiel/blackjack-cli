import BlackjackGame from "../../entities/blackjack-game";
import Player from "../../entities/player";

export default interface IGameRepository {
  startBlackjackGame(players: Player[]): Promise<BlackjackGame>;
}
