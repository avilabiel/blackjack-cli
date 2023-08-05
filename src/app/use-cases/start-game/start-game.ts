import IUseCase from "../../contracts/i-use-case";

class StartGame implements IUseCase {
  async execute(): Promise<void> {
    console.log("Test!!");
  }
}

export default new StartGame();
