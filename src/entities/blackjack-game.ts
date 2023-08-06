import Player from "./player";

export type Card = {
  value: number | string;
  worth: number;
  isFaceUp: boolean;
};

type Action = {
  doubled: boolean;
  stand: boolean;
  hit: boolean;
  split: boolean;
};

export type Round = {
  dealer: {
    cards: Card[];
    score: number;
    isBlackjack: boolean;
    action: Action | null;
  };
  players: {
    player: Player;
    cards: Card[];
    score: number;
    isBlackjack: boolean;
    action: Action | null;
  }[];
};

export type Bet = {
  player: Player;
  bet: number;
};

// {
//   bets: [
//     {
//       player: { id: 1, balance: 800 },
//       bet: 200,
//     },
//     // ...
//   ],
//   rounds: [
//     {
//       dealer: { cards: [{ value: 2, suit: CardSuit.CLUBS, value: 'J', suit: CardSuit.DIAMONDS }], score: 12, isBlackjack: false },
//       players: [
//         {
//           player: { id: 1, balance: 800 },
//           cards: [ {value: "A", suit: CardSuit.CLUBS } ],
//           score: 11,
//           isBlackjack: false,
//           action: {
//             doubled: false,
//             stand: false,
//             hit: false,
//             split: false,
//           }
//         }
//       ],
//     }
//   ]
// }

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
