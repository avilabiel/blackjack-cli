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

    if (persistedGame.rounds.length < 2) {
      throw new Error("Not possible to finish a game without giving all cards");
    }

    const updatedGameWithReportPerPlayer =
      this.updateGameFinalReport(persistedGame);

    await gameRepository.save(updatedGameWithReportPerPlayer);
    return persistedGame;
  }

  private updateGameFinalReport(game: Game): Game {
    const lastRoundIndex = game.rounds.length - 1;
    const lastRound = game.rounds[lastRoundIndex];

    lastRound.players.forEach((playerInRound) => {
      const playerBet = game.bets.find(
        (bet) => bet.player.id === playerInRound.player.id
      );

      const playerInGame = game.players.find(
        (persistedPlayer) => persistedPlayer.id === playerInRound.player.id
      );

      const didPlayerPush = playerInRound.score === lastRound.dealer.score;
      const didPlayerLose =
        playerInRound.score < lastRound.dealer.score ||
        playerInRound.score > 21;
      const didPlayerWin = playerInRound.score > lastRound.dealer.score; // NB: whenever Dealer hits, we must check if it is bigger than 21

      if (didPlayerPush) {
        playerInGame.balance += playerBet.amount;

        game.reports.push({
          player: playerInGame,
          isWinner: false,
          prize: 0,
          finalScore: playerInRound.score,
          cards: playerInRound.cards,
        });

        return;
      }

      if (didPlayerLose) {
        game.reports.push({
          player: playerInGame,
          isWinner: false,
          prize: -playerBet.amount,
          finalScore: playerInRound.score,
          cards: playerInRound.cards,
        });

        return;
      }

      if (didPlayerWin) {
        const prizeMultiplier = playerInRound.isBlackjack ? 1.5 : 1;
        const winnerPrize = playerBet.amount * prizeMultiplier;
        playerInGame.balance =
          playerInGame.balance + playerBet.amount + winnerPrize;

        game.reports.push({
          player: playerInGame,
          isWinner: true,
          prize: winnerPrize,
          finalScore: playerInRound.score,
          cards: playerInRound.cards,
        });
      }
    });

    return game;
  }
}

export default new FinishGame();
