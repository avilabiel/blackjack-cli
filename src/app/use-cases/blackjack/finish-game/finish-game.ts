import IGameRepository from "@/app/contracts/i-game-repository";
import IUseCase from "@/app/contracts/i-use-case";
import Game from "@/entities/game";

class FinishGame implements IUseCase {
  async execute({
    gameId,
    gameRepository,
  }: {
    gameId: number;
    gameRepository: IGameRepository;
  }): Promise<Game> {
    const persistedGame = await gameRepository.getGameById(gameId);

    if (!persistedGame) {
      throw new Error("Game not found!");
    }

    const lastRoundIndex = persistedGame.rounds.length - 1;
    const lastRound = persistedGame.rounds[lastRoundIndex];

    lastRound.players.forEach((playerInRound, index) => {
      const playerBet = persistedGame.bets.find(
        (bet) => bet.player.id === playerInRound.player.id
      );

      const playerInGame = persistedGame.players.find(
        (persistedPlayer) => persistedPlayer.id === playerInRound.player.id
      );

      if (playerInRound.score === lastRound.dealer.score) {
        return;
      }

      if (playerInRound.score < lastRound.dealer.score) {
        persistedGame.reports.push({
          player: playerInGame,
          isWinner: false,
          prize: -playerBet.amount,
        });

        return;
      }

      const prizeMultiplier = playerInRound.isBlackjack ? 1.5 : 1;
      const winnerPrize = playerBet.amount * prizeMultiplier;
      playerInGame.balance =
        playerInGame.balance + playerBet.amount + winnerPrize;

      persistedGame.reports.push({
        player: playerInGame,
        isWinner: true,
        prize: winnerPrize,
      });
    });

    await gameRepository.save(persistedGame);
    return persistedGame;
  }
}

export default new FinishGame();
