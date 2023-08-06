import IGameRepository from "@/app/contracts/i-game-repository";
import IUseCase from "@/app/contracts/i-use-case";
import { Card, Round } from "@/entities/blackjack-game";
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

    if (round === 0) {
      throw new Error("Not possible to give cards before bets");
    }

    const persistedGame = await gameRepository.getGameById(gameId);

    if (!persistedGame) {
      throw new Error("Game not found!");
    }

    const doesRoundExist = persistedGame.rounds[round - 1];

    if (!doesRoundExist) {
      const newRound = this.buildRound({ round, game: persistedGame });

      persistedGame.rounds.push(newRound);
    }

    const card = this.getRandomUniqueCard();

    if (isDealer) {
      this.giveCardToDealer({ game: persistedGame, round, card });
    } else {
      this.giveCardToPlayer({ game: persistedGame, round, card, playerId });
    }

    await gameRepository.save(persistedGame);

    return card;
  }

  private buildRound({ round, game }: { round: number; game: Game }): Round {
    if (round > 1) {
      return game.rounds[round - 2];
    }

    const players = game.players.map((player) => {
      return {
        player,
        cards: [],
        score: 0,
        isBlackjack: false,
        action: null,
      };
    });

    return {
      dealer: {
        cards: [],
        score: 0,
        isBlackjack: false,
        action: null,
      },
      players,
    };
  }

  private getRandomUniqueCard(): Card {
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

    // We must identify if the total score is above 21 to define ACE as 1
    if (card.value === "A") {
      card.worth = 11;
    }

    if (["J", "Q", "K"].includes(card.value)) {
      card.worth = 10;
    }

    card.handSum = card.worth;

    return card;
  }

  private giveCardToDealer({
    game,
    round,
    card,
  }: {
    game: Game;
    round: number;
    card: Card;
  }): void {
    const dealer = game.rounds[round - 1].dealer;

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
    game,
    round,
    card,
    playerId,
  }: {
    game: Game;
    round: number;
    card: Card;
    playerId: number;
  }): void {
    const player = game.rounds[round - 1].players.find(
      (player) => player.player.id === playerId
    );

    if (!player) {
      throw new Error(`Player #${playerId} not found in game #${game.id}`);
    }

    const score = +player.score + card.worth;
    card.handSum = score;

    player.cards.push(card);
    player.score = score;
    player.isBlackjack = player.score === 21;
  }
}

export default new GiveCard();
