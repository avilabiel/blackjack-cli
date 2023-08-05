export default class Player {
  id?: string;
  nickname: string;
  isDealer: boolean;
  createdAt: Date;

  constructor(props: Player) {
    this.id = props.id;
    this.nickname = props.nickname;
    this.isDealer = props.isDealer;
    this.createdAt = props.createdAt;
  }
}
