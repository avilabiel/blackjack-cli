import IGameRepository from "@/app/contracts/i-game-repository";
import FinishGame from "@/app/use-cases/blackjack/finish-game";
import Game from "@/entities/game";

const finishingGame = async ({
  game,
  gameRepository,
}: {
  game: Game;
  gameRepository: IGameRepository;
}): Promise<void> => {
  const finishedGame = await FinishGame.execute({
    gameId: game.id,
    gameRepository,
  });

  const lastRound = finishedGame.rounds[finishedGame.rounds.length - 1];
  const dealerCards = lastRound.dealer.cards.map((card) => card.value);

  console.log("\n================== END GAME ==================\n");
  console.log(
    `Dealer | Cards: ${dealerCards.join(",")} | Score: ${
      lastRound.dealer.score
    }`
  );

  for (let i = 0; i < finishedGame.players.length; i++) {
    const playerCards = finishedGame.reports[i].cards.map((card) => card.value);

    console.log(
      `Player #${i + 1} | Cards: ${playerCards.join(",")} | Score: ${
        finishedGame.reports[i].finalScore
      } | Winner: ${finishedGame.reports[i].isWinner} | Prize: ${
        finishedGame.reports[i].prize
      } | Final Balance: ${finishedGame.players[i].balance}`
    );
  }
};

export default finishingGame;
