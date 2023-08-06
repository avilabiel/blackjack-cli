import StartGame from ".";
import GameRepositoryInMemory from "../../../../externals/database/game-repository-in-memory";

describe("Blackjack", () => {
  describe("StartGame", () => {
    it("starts a new game with the given amount of players", async () => {
      const playersAmount = 4;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });

      expect(game.id).toBeDefined();
      expect(game.players).toHaveLength(4);
      expect(game.rounds).toHaveLength(0);
      expect(game.bets).toHaveLength(0);
    });

    it("starts a new game with players having $1000 on their balances", async () => {
      const playersAmount = 4;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });

      expect(game.id).toBeDefined();
      expect(game.players).toHaveLength(4);
      expect(game.players[0].balance).toEqual(1000);
      expect(game.players[1].balance).toEqual(1000);
      expect(game.players[2].balance).toEqual(1000);
      expect(game.players[3].balance).toEqual(1000);
    });

    it("throws an error when there are more than 6 players", async () => {
      try {
        const playersAmount = 40;
        const gameRepository = new GameRepositoryInMemory();

        const game = await StartGame.execute({ playersAmount, gameRepository });

        throw new Error("Should have thrown an error above");
      } catch (error: any) {
        expect(error.message).toEqual("Maximum players is 6");
      }
    });
  });
});
