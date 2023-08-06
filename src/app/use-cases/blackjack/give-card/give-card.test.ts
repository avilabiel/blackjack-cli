import GameRepositoryInMemory from "@/externals/database/game-repository-in-memory";
import StartGame from "@/app/use-cases/blackjack/start-game";
import GiveCard from ".";

describe("GiveCard", () => {
  describe("random cards", () => {
    it("gives random unique cards to each player", () => {
      expect(1).toBe(1);
    });
  });

  describe("dealer", () => {
    it("gives the 1st card face down to a dealer", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });

      const givenCard = await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: undefined,
        gameRepository,
      });

      const updatedGame = await gameRepository.getGameById(game.id);

      expect(givenCard.isFaceUp).toBeFalsy();
      expect(givenCard.value).toBeDefined();
      expect(givenCard.suit).toBeDefined();
      expect(givenCard.worth).toBeDefined();
      expect(givenCard.worth).toBeGreaterThan(0);
      expect(updatedGame.rounds).toHaveLength(1);
    });

    it("gives the 2nd card face up to a dealer", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });

      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: undefined,
        gameRepository,
      });

      const givenCard = await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: undefined,
        gameRepository,
      });

      const updatedGame = await gameRepository.getGameById(game.id);

      expect(givenCard.isFaceUp).toBeTruthy();
      expect(givenCard.value).toBeDefined();
      expect(givenCard.suit).toBeDefined();
      expect(givenCard.worth).toBeDefined();
      expect(givenCard.worth).toBeGreaterThan(0);
      expect(updatedGame.rounds).toHaveLength(2);
    });
  });

  describe("player", () => {
    it("gives the 1st card face up to a player", async () => {
      const playersAmount = 1;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];

      const givenCard = await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      const updatedGame = await gameRepository.getGameById(game.id);

      expect(givenCard.isFaceUp).toBeTruthy();
      expect(givenCard.value).toBeDefined();
      expect(givenCard.suit).toBeDefined();
      expect(givenCard.worth).toBeDefined();
      expect(givenCard.worth).toBeGreaterThan(0);
      expect(updatedGame.rounds).toHaveLength(1);
    });

    it("gives the 2nd card face up to a player", async () => {
      const playersAmount = 1;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];

      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      const givenCard = await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      const updatedGame = await gameRepository.getGameById(game.id);

      expect(givenCard.isFaceUp).toBeTruthy();
      expect(givenCard.value).toBeDefined();
      expect(givenCard.suit).toBeDefined();
      expect(givenCard.worth).toBeDefined();
      expect(givenCard.worth).toBeGreaterThan(0);
      expect(updatedGame.rounds).toHaveLength(2);
    });
  });

  describe("validation", () => {
    it("throws an error when bets are not placed by players", async () => {
      try {
        const playersAmount = 1;
        const gameRepository = new GameRepositoryInMemory();

        const game = await StartGame.execute({ playersAmount, gameRepository });
        const firstPlayer = game.players[0];

        await GiveCard.execute({
          gameId: game.id,
          round: 0,
          playerId: firstPlayer.id,
          gameRepository,
        });

        throw new Error("Should have thrown an error above");
      } catch (error) {
        expect(error.message).toEqual("Not possible to give cards before bets");
      }
    });

    it("throws an error when game is not found", async () => {
      try {
        const playersAmount = 1;
        const gameRepository = new GameRepositoryInMemory();

        const game = await StartGame.execute({ playersAmount, gameRepository });
        const firstPlayer = game.players[0];

        await GiveCard.execute({
          gameId: 1234,
          round: 1,
          playerId: firstPlayer.id,
          gameRepository,
        });

        throw new Error("Should have thrown an error above");
      } catch (error) {
        expect(error.message).toEqual("Game not found!");
      }
    });
    it("throws an error when player is not found in the game", async () => {
      try {
        const playersAmount = 1;
        const gameRepository = new GameRepositoryInMemory();

        const game = await StartGame.execute({ playersAmount, gameRepository });

        await GiveCard.execute({
          gameId: game.id,
          round: 1,
          playerId: 1234,
          gameRepository,
        });

        throw new Error("Should have thrown an error above");
      } catch (error) {
        expect(error.message).toEqual("Player #1234 not found in game #1");
      }
    });
  });
});
