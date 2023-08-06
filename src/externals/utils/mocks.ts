import IGameRepository from "../../app/contracts/i-game-repository";
import StartGame from "../../app/use-cases/blackjack/start-game";

export async function startNewGame(
  playersAmount: number,
  gameRepository: IGameRepository
) {
  return await StartGame.execute({ playersAmount, gameRepository });
}
