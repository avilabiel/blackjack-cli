import GameRepositoryInMemory from "@/externals/database/game-repository-in-memory";
import StartGame from "@/app/use-cases/blackjack/start-game";
import GiveCard from ".";

describe("GiveCard", () => {
  describe("cards", () => {
    it("gives random unique cards to each player in the same round", async () => {
      const playersAmount = 4;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];
      const secondPlayer = game.players[1];
      const thirdPlayer = game.players[2];
      const fourthPlayer = game.players[3];

      const givenCardToDealer = await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: undefined,
        gameRepository,
      });

      const givenCardToFirstPlayer = await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      const givenCardToSecondPlayer = await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: secondPlayer.id,
        gameRepository,
      });

      const givenCardToThirdPlayer = await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: thirdPlayer.id,
        gameRepository,
      });

      const givenCardToFourthPlayer = await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: fourthPlayer.id,
        gameRepository,
      });

      expect(givenCardToDealer.worth).toBeGreaterThan(0);
      expect(givenCardToFirstPlayer.worth).toBeGreaterThan(0);
      expect(givenCardToSecondPlayer.worth).toBeGreaterThan(0);
      expect(givenCardToThirdPlayer.worth).toBeGreaterThan(0);
      expect(givenCardToFourthPlayer.worth).toBeGreaterThan(0);
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
      expect(givenCard.worth).toBeDefined();
      expect(givenCard.worth).toBeGreaterThan(0);
      expect(updatedGame.rounds).toHaveLength(2);
    });

    it("presents rounds as a timeline log", async () => {
      const playersAmount = 1;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });

      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      const updatedGameRound1 = await gameRepository.getGameById(game.id);

      const givenCard = await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      const updatedGameRound2 = await gameRepository.getGameById(game.id);

      expect(givenCard.isFaceUp).toBeTruthy();
      expect(givenCard.value).toBeDefined();
      expect(givenCard.worth).toBeDefined();
      expect(givenCard.worth).toBeGreaterThan(0);
      expect(updatedGameRound1.rounds).toHaveLength(1);
      expect(updatedGameRound1.rounds[0].dealer.cards).toHaveLength(1);
      expect(updatedGameRound2.rounds).toHaveLength(2);
      expect(updatedGameRound2.rounds[0].dealer.cards).toHaveLength(1);
      expect(updatedGameRound2.rounds[1].dealer.cards).toHaveLength(2);
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
      expect(givenCard.worth).toBeDefined();
      expect(givenCard.worth).toBeGreaterThan(0);
      expect(updatedGame.rounds).toHaveLength(2);
    });

    it("presents rounds as a timeline log", async () => {
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

      const updatedGameRound1 = await gameRepository.getGameById(game.id);

      const givenCard = await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      const updatedGameRound2 = await gameRepository.getGameById(game.id);

      expect(givenCard.isFaceUp).toBeTruthy();
      expect(givenCard.value).toBeDefined();
      expect(givenCard.worth).toBeDefined();
      expect(givenCard.worth).toBeGreaterThan(0);
      expect(updatedGameRound1.rounds).toHaveLength(1);
      expect(updatedGameRound1.rounds[0].players[0].cards).toHaveLength(1);
      expect(updatedGameRound2.rounds).toHaveLength(2);
      expect(updatedGameRound2.rounds[0].players[0].cards).toHaveLength(1);
      expect(updatedGameRound2.rounds[1].players[0].cards).toHaveLength(2);
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
