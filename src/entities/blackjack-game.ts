import Player from "./player";

type Card = { value: number | string; suit: string };

type Round = {
  cardRevelead: Card;
  owner: Player;
};

export default class BlackjackGame {
  id?: string;
  dealer: Player;
  players: Player[];
  rounds: Round[];
  winner: Player;

  createdAt: string;
  finishedAt: string;
}
