import BlackjackGame, { Bet } from "@/entities/blackjack-game";
import IGameRepository from "@/app/contracts/i-game-repository";
import IUseCase from "@/app/contracts/i-use-case";

// TODO: implement other use cases
// TODO: finish CLI
// TODO: implement the start game on REST
// TODO: Apply linter
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

    if (persistedGame.rounds.length > 0) {
      throw new Error("Bets round already passed");
    }

    persistedPlayer.balance -= betAmount;

    const bet = { bet: betAmount, player: persistedPlayer };
    persistedGame.bets.push(bet);

    await gameRepository.save(persistedGame);
    return bet;
  }
}

export default new CreatePlayerBet();
