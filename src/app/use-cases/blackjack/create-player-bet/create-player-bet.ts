import BlackjackGame, { Bet } from "../../../../entities/blackjack-game";
import Player from "../../../../entities/player";
import IGameRepository from "../../../contracts/i-game-repository";
import IUseCase from "../../../contracts/i-use-case";

class CreatePlayerBet implements IUseCase {
  async execute({
    betAmount,
    playerId,
    gameId,
    gameRepository,
  }: {
    betAmount: number;
    playerId: number;
    gameId: number;
    gameRepository: IGameRepository;
  }): Promise<Bet> {
    const persistedGame = (await gameRepository.getGameById(
      gameId
    )) as BlackjackGame;

    if (!persistedGame) {
      throw new Error("Game not found!");
    }

    const persistedPlayer = persistedGame.players.find(
      (player) => player.id === playerId
    );

    if (!persistedPlayer) {
      throw new Error("Player not found in this game!");
    }

    const bet = { bet: betAmount, player: persistedPlayer };
    persistedGame.bets.push(bet);

    // gameRepository.save(game)
    return bet;
  }
}

export default new CreatePlayerBet();
