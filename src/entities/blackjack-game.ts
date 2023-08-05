import Player from "./player";

enum CardSuit {
  CLUBS = "♣",
  SPADES = "♠",
  HEARTS = "♥",
  DIAMONDS = "♦",
}

type Card = { value: number | string; suit: CardSuit };

type Round = {
  cardRevelead: Card;
  owner: Player;
};

export default class BlackjackGame {
  id?: string;
  dealer: Player;
  players: Player[];
  rounds: Round[];
  winners: Player[];
  createdAt: string;
  finishedAt: string;

  constructor(props: BlackjackGame) {
    this.id = props.id;
    this.dealer = props.dealer;
    this.players = props.players;
    this.rounds = props.rounds;
    this.winners = props.winners;
    this.createdAt = props.createdAt;
    this.finishedAt = props.finishedAt;
  }
}
