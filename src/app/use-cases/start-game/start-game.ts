import IUseCase from "../../contracts/i-use-case";

class StartGame implements IUseCase {
  async execute(): Promise<void> {
    console.log("Test 22344!!");
  }
}

export default new StartGame();
