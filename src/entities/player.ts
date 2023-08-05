export default class Player {
  id?: number;
  balance: number;

  constructor(props: Player) {
    this.id = props.id;
    this.balance = props.balance;
  }
}
