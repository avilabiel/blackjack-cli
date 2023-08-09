import IGameRepository from "@/app/contracts/i-game-repository";
import IUseCase from "@/app/contracts/i-use-case";
import {
  Card,
  DealerInRound,
  PlayerInRound,
  Round,
} from "@/entities/blackjack-game";
import Game from "@/entities/game";

class GiveCard implements IUseCase {
  async execute({
    gameId,
    round,
    playerId,
    gameRepository,
  }: {
    gameId: number;
    round: number;
    playerId?: number;
    gameRepository: IGameRepository;
  }): Promise<Card> {
    const isDealer = !playerId;
    const persistedGame = await gameRepository.getGameById(gameId);

    if (!persistedGame) {
      throw new Error("Game not found!");
    }

    if (persistedGame.bets.length === 0) {
      throw new Error("Not possible to give cards before bets");
    }

    const doesRoundExist = persistedGame.rounds[round - 1];

    if (!doesRoundExist) {
      const newRound = this.buildRound({ round, game: persistedGame });
      persistedGame.rounds.push(newRound);
    }

    const dealer = persistedGame.rounds[round - 1].dealer;

    const player = persistedGame.rounds[round - 1].players.find(
      (player) => player.player.id === playerId
    );

    if (isDealer) {
      const card = this.getRandomUniqueCard(dealer.score);
      this.giveCardToDealer({ dealer, card });

      await gameRepository.save(persistedGame);
      return card;
    }

    if (!player) {
      throw new Error(
        `Player #${playerId} not found in game #${persistedGame.id}`
      );
    }

    const card = this.getRandomUniqueCard(player.score);
    this.giveCardToPlayer({ player, card });

    await gameRepository.save(persistedGame);
    return card;
  }

  // TODO: refactor this part (create more methods)
  private buildRound({ round, game }: { round: number; game: Game }): Round {
    if (round > 1) {
      const previousRound = game.rounds[round - 2];
      const copyOfPreviousRound = JSON.parse(JSON.stringify(previousRound));

      return copyOfPreviousRound;
    }

    const players = game.players.map((player) => {
      return {
        player,
        cards: [],
        score: 0,
        isBlackjack: false,
      };
    });

    return {
      dealer: {
        cards: [],
        score: 0,
        isBlackjack: false,
      },
      players,
    };
  }

  private getRandomUniqueCard(handSum: number): Card {
    const possibleCards = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];
    const min = 0;
    const max = possibleCards.length - 1;
    const randomIndex = Math.floor(Math.random() * (max - min + 1) + min);

    const card = {
      value: possibleCards[randomIndex],
      isFaceUp: true,
      worth: +possibleCards[randomIndex],
      handSum: 0,
    };

    if (card.value === "A" && handSum <= 10) {
      card.worth = 11;
    }

    if (card.value === "A" && handSum > 10) {
      card.worth = 1;
    }

    if (["J", "Q", "K"].includes(card.value)) {
      card.worth = 10;
    }

    card.handSum = card.worth;

    return card;
  }

  private giveCardToDealer({
    dealer,
    card,
  }: {
    dealer: DealerInRound;
    card: Card;
  }): void {
    if (dealer.cards.length === 0) {
      card.isFaceUp = false;
    }

    const score = +dealer.score + card.worth;
    card.handSum = score;

    dealer.cards.push(card);
    dealer.score = score;
    dealer.isBlackjack = dealer.score === 21;
  }

  private giveCardToPlayer({
    player,
    card,
  }: {
    player: PlayerInRound;
    card: Card;
  }): void {
    const score = +player.score + card.worth;
    card.handSum = score;

    player.cards.push(card);
    player.score = score;
    player.isBlackjack = player.score === 21;
  }
}

export default new GiveCard();
