export default class Player {
  id?: string;
  nickname: string;
  createdAt: Date;

  constructor(props: Player) {
    this.id = props.id;
    this.nickname = props.nickname;
    this.createdAt = props.createdAt;
  }
}
