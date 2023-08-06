import BlackjackGame, { Bet } from "../../../../entities/blackjack-game";
import IGameRepository from "../../../contracts/i-game-repository";
import IUseCase from "../../../contracts/i-use-case";

// TODO: put absolute path
// TODO: improve tests for create bet
// TODO: save the game state
// TODO: implement other use cases
// TODO: finish CLI
// TODO: implement the start game on REST
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

    if (persistedPlayer.balance < betAmount) {
      throw new Error("Player does not have enough balance!");
    }

    persistedPlayer.balance -= betAmount;
    const bet = { bet: betAmount, player: persistedPlayer };
    persistedGame.bets.push(bet);

    // gameRepository.save(game)
    return bet;
  }
}

export default new CreatePlayerBet();
