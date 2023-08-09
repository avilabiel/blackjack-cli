import Player from "./player";

export type Card = {
  value: number | string;
  worth: number;
  isFaceUp: boolean;
  handSum: number;
};

export type DealerInRound = {
  cards: Card[];
  score: number;
  isBlackjack: boolean;
};

export type PlayerInRound = {
  player: Player;
  cards: Card[];
  score: number;
  isBlackjack: boolean;
};

export type Round = {
  dealer: DealerInRound;
  players: PlayerInRound[];
};

export type Bet = {
  player: Player;
  bet: number;
};

export default class BlackjackGame {
  id?: number;
  players: Player[];
  bets: Bet[];
  rounds: Round[];
  winners: Player[];
  createdAt?: Date;
  finishedAt?: Date;

  constructor(props: BlackjackGame) {
    this.id = props.id;
    this.players = props.players;
    this.bets = props.bets;
    this.rounds = props.rounds;
    this.winners = props.winners;
    this.createdAt = props.createdAt;
    this.finishedAt = props.finishedAt;
  }
}
