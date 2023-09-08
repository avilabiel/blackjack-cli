export default class Player {
  id?: number;

  balance: number;

  originalPlayerId?: number;

  constructor(props: Player) {
    this.id = props.id;
    this.balance = props.balance;
    this.originalPlayerId = props.originalPlayerId;
  }
}
