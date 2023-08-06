import IUseCase from "../../../contracts/i-use-case";

class CreatePlayerBet implements IUseCase {
  async execute(params: unknown): Promise<void> {
    console.log("Bet");
  }
}

export default new CreatePlayerBet();
