import Player from './player';

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
  amount: number;
};

export type Report = {
  player: Player;
  isWinner: boolean;
  prize: number;
  finalScore: number;
  cards: Card[];
};

export default class BlackjackGame {
  id?: number;

  players: Player[];

  bets: Bet[];

  rounds: Round[];

  reports: Report[];

  allPlayersReady?: boolean;

  createdAt?: Date;

  finishedAt?: Date;

  constructor(props: BlackjackGame) {
    this.id = props.id;
    this.players = props.players;
    this.bets = props.bets;
    this.rounds = props.rounds;
    this.reports = props.reports;
    this.allPlayersReady = props.allPlayersReady || false;
    this.createdAt = props.createdAt;
    this.finishedAt = props.finishedAt;
  }
}
