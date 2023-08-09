import GameRepositoryInMemory from "@/externals/database/game-repository-in-memory";
import StartGame from "@/app/use-cases/blackjack/start-game";
import CreatePlayerBet from "@/app/use-cases/blackjack/create-player-bet";
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

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

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

    it("considers ACE as 11 when score is less or equal to 21", async () => {
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

      const aceIndex = 0;
      jest.spyOn(global.Math, "random").mockReturnValue(aceIndex);

      const givenCard = await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      jest.clearAllMocks();

      expect(givenCard.value).toEqual("A");
      expect(givenCard.worth).toEqual(11);
    });

    it("considers ACE as 1 when score is greater to 21", async () => {
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

      const aceIndex = 0;
      jest.spyOn(global.Math, "random").mockReturnValue(aceIndex);

      const firstGivenAceCard = await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      const secondGivenAceCard = await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      jest.clearAllMocks();

      expect(firstGivenAceCard.value).toEqual("A");
      expect(firstGivenAceCard.worth).toEqual(11);
      expect(secondGivenAceCard.value).toEqual("A");
      expect(secondGivenAceCard.worth).toEqual(1);
    });
  });

  describe("dealer", () => {
    it("gives the 1st card face down to a dealer", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: game.players[0].id,
        gameId: game.id,
        gameRepository,
      });

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

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: game.players[0].id,
        gameId: game.id,
        gameRepository,
      });

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

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: game.players[0].id,
        gameId: game.id,
        gameRepository,
      });

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

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

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

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

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

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

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

        // NB: Not calling CreatePlayerBet before giving cards

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

        await CreatePlayerBet.execute({
          betAmount: 100,
          playerId: firstPlayer.id,
          gameId: game.id,
          gameRepository,
        });

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

        await CreatePlayerBet.execute({
          betAmount: 100,
          playerId: game.players[0].id,
          gameId: game.id,
          gameRepository,
        });

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
