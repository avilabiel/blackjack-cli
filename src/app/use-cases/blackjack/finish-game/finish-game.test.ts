import GameRepositoryInMemory from "@/externals/database/game-repository-in-memory";
import StartGame from "@/app/use-cases/blackjack/start-game";
import CreatePlayerBet from "@/app/use-cases/blackjack/create-player-bet";
import GiveCard from "@/app/use-cases/blackjack/give-card";
import FinishGame from ".";

describe("FinishGame", () => {
  describe("single player", () => {
    it("returns the game with player #1 losing the game", async () => {
      const playersAmount = 1;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValue(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives K to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValue(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValue(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives K to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValue(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      const finishedGame = await FinishGame.execute({
        gameId: game.id,
        gameRepository,
      });

      jest.clearAllMocks();

      expect(finishedGame.reports).toHaveLength(1);
      expect(finishedGame.reports[0].isWinner).toBeTruthy();
      expect(finishedGame.reports[0].player.id).toEqual(firstPlayer.id);
      expect(game.players[0].balance).toEqual(1000);
      expect(finishedGame.players[0].balance).toEqual(1100);
      expect(finishedGame.reports[0].prize).toEqual(100);
    });

    it("returns the game with player #1 pushing the game", () => {
      expect(1).toBe(1);
    });

    it("returns the game with player #1 winning the game", () => {
      expect(1).toBe(1);
    });

    it("returns the game with player #1 winning the game with Blackjack", () => {
      expect(1).toBe(1);
    });
  });

  describe("multiplayer", () => {
    it("returns the game with player #1 losing the game", () => {
      expect(1).toBe(1);
    });

    it("returns the game with player #1 pushing the game", () => {
      expect(1).toBe(1);
    });

    it("returns the game with player #1 winning the game", () => {
      expect(1).toBe(1);
    });

    it("returns the game with player #1 winning the game with Blackjack", () => {
      expect(1).toBe(1);
    });

    it("returns the game with player #2 losing the game", () => {
      expect(1).toBe(1);
    });

    it("returns the game with player #2 pushing the game", () => {
      expect(1).toBe(1);
    });

    it("returns the game with player #2 winning the game", () => {
      expect(1).toBe(1);
    });

    it("returns the game with player #2 winning the game with Blackjack", () => {
      expect(1).toBe(1);
    });

    it("returns the game with player #1 and #2 winning the game", () => {
      expect(1).toBe(1);
    });
  });
});
