import GameRepositoryInMemory from "@/externals/database/game-repository-in-memory";
import StartGame from "@/app/use-cases/blackjack/start-game";
import CreatePlayerBet from "@/app/use-cases/blackjack/create-player-bet";
import GiveCard from "@/app/use-cases/blackjack/give-card";
import CreatePlayerSplitAction from "@/app/use-cases/blackjack/create-player-split-action";
import FinishGame from ".";

describe("FinishGame", () => {
  describe("single player", () => {
    it("returns the game with player #1 losing the game with a score lower than dealer's score", async () => {
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

      // Gives K to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives 2 to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives 2 to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
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

      expect(finishedGame.reports).toHaveLength(1);
      expect(finishedGame.reports[0].isWinner).toBeFalsy();
      expect(finishedGame.reports[0].player.id).toEqual(firstPlayer.id);
      expect(game.players[0].balance).toEqual(1000);
      expect(finishedGame.players[0].balance).toEqual(900);
      expect(finishedGame.reports[0].prize).toEqual(-100);
    });

    it("returns the game with player #1 losing the game with a score higher than 21", async () => {
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

      // Gives K to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives 2 to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives 2 to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Dealer as 3rd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      const finishedGame = await FinishGame.execute({
        gameId: game.id,
        gameRepository,
      });

      expect(finishedGame.reports).toHaveLength(1);
      expect(finishedGame.reports[0].isWinner).toBeFalsy();
      expect(finishedGame.reports[0].player.id).toEqual(firstPlayer.id);
      expect(game.players[0].balance).toEqual(1000);
      expect(finishedGame.players[0].balance).toEqual(900);
      expect(finishedGame.reports[0].prize).toEqual(-100);
    });

    it("returns the game with player #1 pushing the game", async () => {
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

      // Gives K to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives K to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives K to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
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

      expect(finishedGame.reports).toHaveLength(1);
      expect(finishedGame.reports[0].isWinner).toBeFalsy();
      expect(finishedGame.reports[0].player.id).toEqual(firstPlayer.id);
      expect(game.players[0].balance).toEqual(1000);
      expect(finishedGame.players[0].balance).toEqual(1000);
      expect(finishedGame.reports[0].prize).toEqual(0);
    });

    it("returns the game with player #1 winning the game", async () => {
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
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives K to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives K to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
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

      expect(finishedGame.reports).toHaveLength(1);
      expect(finishedGame.reports[0].isWinner).toBeTruthy();
      expect(finishedGame.reports[0].player.id).toEqual(firstPlayer.id);
      expect(game.players[0].balance).toEqual(1000);
      expect(finishedGame.players[0].balance).toEqual(1100);
      expect(finishedGame.reports[0].prize).toEqual(100);
    });

    it("returns the game with player #1 winning the game with Blackjack", async () => {
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
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives K to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives A to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(0);
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

      expect(finishedGame.reports).toHaveLength(1);
      expect(finishedGame.reports[0].isWinner).toBeTruthy();
      expect(finishedGame.reports[0].player.id).toEqual(firstPlayer.id);
      expect(game.players[0].balance).toEqual(1000);
      expect(finishedGame.players[0].balance).toEqual(1150);
      expect(finishedGame.reports[0].prize).toEqual(150);
    });
  });

  describe("multiplayer", () => {
    it("returns the game with player #1 losing the game", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];
      const secondPlayer = game.players[1];

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: secondPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      // Gives K to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives 2 to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Player #2 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Gives K to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives 2 to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Player #2 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: secondPlayer.id,
        gameRepository,
      });

      const finishedGame = await FinishGame.execute({
        gameId: game.id,
        gameRepository,
      });

      expect(finishedGame.reports).toHaveLength(2);
      expect(finishedGame.reports[0].isWinner).toBeFalsy();
      expect(finishedGame.reports[0].player.id).toEqual(firstPlayer.id);
      expect(game.players[0].balance).toEqual(1000);
      expect(finishedGame.players[0].balance).toEqual(900);
      expect(finishedGame.reports[0].prize).toEqual(-100);
    });

    it("returns the game with player #1 pushing the game", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];
      const secondPlayer = game.players[1];

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: secondPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives 2 to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Player #2 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives 2 to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Player #2 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: secondPlayer.id,
        gameRepository,
      });

      const finishedGame = await FinishGame.execute({
        gameId: game.id,
        gameRepository,
      });

      expect(finishedGame.reports).toHaveLength(2);
      expect(finishedGame.reports[0].isWinner).toBeFalsy();
      expect(finishedGame.reports[0].player.id).toEqual(firstPlayer.id);
      expect(game.players[0].balance).toEqual(1000);
      expect(finishedGame.players[0].balance).toEqual(1000);
      expect(finishedGame.reports[0].prize).toEqual(0);
    });

    it("returns the game with player #1 winning the game", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];
      const secondPlayer = game.players[1];

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: secondPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives K to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Player #2 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives K to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Player #2 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: secondPlayer.id,
        gameRepository,
      });

      const finishedGame = await FinishGame.execute({
        gameId: game.id,
        gameRepository,
      });

      expect(finishedGame.reports).toHaveLength(2);
      expect(finishedGame.reports[0].isWinner).toBeTruthy();
      expect(finishedGame.reports[0].player.id).toEqual(firstPlayer.id);
      expect(game.players[0].balance).toEqual(1000);
      expect(finishedGame.players[0].balance).toEqual(1100);
      expect(finishedGame.reports[0].prize).toEqual(100);
    });

    it("returns the game with player #1 winning the game with Blackjack", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];
      const secondPlayer = game.players[1];

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: secondPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives K to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Player #2 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives ACE to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(0);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Player #2 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: secondPlayer.id,
        gameRepository,
      });

      const finishedGame = await FinishGame.execute({
        gameId: game.id,
        gameRepository,
      });

      expect(finishedGame.reports).toHaveLength(2);
      expect(finishedGame.reports[0].isWinner).toBeTruthy();
      expect(finishedGame.reports[0].player.id).toEqual(firstPlayer.id);
      expect(game.players[0].balance).toEqual(1000);
      expect(finishedGame.players[0].balance).toEqual(1150);
      expect(finishedGame.reports[0].prize).toEqual(150);
    });

    it("returns the game with player #2 losing the game", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];
      const secondPlayer = game.players[1];

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: secondPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      // Gives 3 to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(2);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives K to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Player #2 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Gives 3 to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(2);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives K to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Player #2 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: secondPlayer.id,
        gameRepository,
      });

      const finishedGame = await FinishGame.execute({
        gameId: game.id,
        gameRepository,
      });

      expect(finishedGame.reports).toHaveLength(2);
      expect(finishedGame.reports[1].isWinner).toBeFalsy();
      expect(finishedGame.reports[1].player.id).toEqual(secondPlayer.id);
      expect(game.players[1].balance).toEqual(1000);
      expect(finishedGame.players[1].balance).toEqual(900);
      expect(finishedGame.reports[1].prize).toEqual(-100);
    });

    it("returns the game with player #2 pushing the game", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];
      const secondPlayer = game.players[1];

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: secondPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives 2 to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Player #2 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives 2 to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Player #2 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: secondPlayer.id,
        gameRepository,
      });

      const finishedGame = await FinishGame.execute({
        gameId: game.id,
        gameRepository,
      });

      expect(finishedGame.reports).toHaveLength(2);
      expect(finishedGame.reports[1].isWinner).toBeFalsy();
      expect(finishedGame.reports[1].player.id).toEqual(secondPlayer.id);
      expect(game.players[1].balance).toEqual(1000);
      expect(finishedGame.players[1].balance).toEqual(1000);
      expect(finishedGame.reports[1].prize).toEqual(0);
    });

    it("returns the game with player #2 winning the game", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];
      const secondPlayer = game.players[1];

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: secondPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives 2 to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #2 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives 2 to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #2 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: secondPlayer.id,
        gameRepository,
      });

      const finishedGame = await FinishGame.execute({
        gameId: game.id,
        gameRepository,
      });

      expect(finishedGame.reports).toHaveLength(2);
      expect(finishedGame.reports[1].isWinner).toBeTruthy();
      expect(finishedGame.reports[1].player.id).toEqual(secondPlayer.id);
      expect(game.players[1].balance).toEqual(1000);
      expect(finishedGame.players[1].balance).toEqual(1100);
      expect(finishedGame.reports[1].prize).toEqual(100);
    });

    it("returns the game with player #2 winning the game with Blackjack", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];
      const secondPlayer = game.players[1];

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: secondPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives 2 to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #2 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives 2 to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives ACE to Player #2 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(0);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: secondPlayer.id,
        gameRepository,
      });

      const finishedGame = await FinishGame.execute({
        gameId: game.id,
        gameRepository,
      });

      expect(finishedGame.reports).toHaveLength(2);
      expect(finishedGame.reports[1].isWinner).toBeTruthy();
      expect(finishedGame.reports[1].player.id).toEqual(secondPlayer.id);
      expect(game.players[1].balance).toEqual(1000);
      expect(finishedGame.players[1].balance).toEqual(1150);
      expect(finishedGame.reports[1].prize).toEqual(150);
    });

    it("returns the game with player #1 and #2 winning the game", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];
      const secondPlayer = game.players[1];

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: secondPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives K to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #2 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives K to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #2 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: secondPlayer.id,
        gameRepository,
      });

      const finishedGame = await FinishGame.execute({
        gameId: game.id,
        gameRepository,
      });

      expect(finishedGame.reports).toHaveLength(2);
      expect(finishedGame.reports[0].isWinner).toBeTruthy();
      expect(finishedGame.reports[0].player.id).toEqual(firstPlayer.id);
      expect(game.players[0].balance).toEqual(1000);
      expect(finishedGame.players[0].balance).toEqual(1100);
      expect(finishedGame.reports[0].prize).toEqual(100);
      expect(finishedGame.reports[1].isWinner).toBeTruthy();
      expect(finishedGame.reports[1].player.id).toEqual(secondPlayer.id);
      expect(game.players[1].balance).toEqual(1000);
      expect(finishedGame.players[1].balance).toEqual(1100);
      expect(finishedGame.reports[1].prize).toEqual(100);
    });
  });

  describe("splitting", () => {
    it("calculates as expected splitted games when both hands from the same player win", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];
      const secondPlayer = game.players[1];

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: secondPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives K to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #2 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Gives 2 to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives K to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #2 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Splits hands and create Player #3 pointing to Player #1
      await CreatePlayerSplitAction.execute({
        gameId: game.id,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #1 as 2nd card after split
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 3,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #3 (pointing to Player #1) as 2nd card after split
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 4,
        playerId: 3,
        gameRepository,
      });

      const finishedGame = await FinishGame.execute({
        gameId: game.id,
        gameRepository,
      });

      expect(finishedGame.reports).toHaveLength(3);
      expect(finishedGame.reports[0].isWinner).toBeTruthy();
      expect(finishedGame.reports[0].player.id).toEqual(firstPlayer.id);
      expect(finishedGame.reports[0].player.originalPlayerId).toEqual(
        firstPlayer.id
      );
      expect(game.players[0].balance).toEqual(1000);
      expect(finishedGame.players[0].balance).toEqual(1000);
      expect(finishedGame.reports[0].prize).toEqual(100);
      expect(finishedGame.reports[1].isWinner).toBeTruthy();
      expect(finishedGame.reports[1].player.id).toEqual(secondPlayer.id);
      expect(finishedGame.reports[1].player.originalPlayerId).toEqual(
        secondPlayer.id
      );
      expect(game.players[1].balance).toEqual(1000);
      expect(finishedGame.players[1].balance).toEqual(1100);
      expect(finishedGame.reports[1].prize).toEqual(100);

      expect(finishedGame.reports[2].isWinner).toBeTruthy();
      expect(finishedGame.reports[2].player.id).toEqual(3);
      expect(finishedGame.reports[2].player.originalPlayerId).toEqual(1);
      expect(game.players[2]).toBeUndefined();
      expect(finishedGame.players[2].balance).toEqual(200);
      expect(finishedGame.reports[2].prize).toEqual(100);
    });

    it("calculates as expected splitted games when only 1st hand from the same player win", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];
      const secondPlayer = game.players[1];

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: secondPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      // Gives K to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives K to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #2 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Gives 3 to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(2);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives K to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #2 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Splits hands and create Player #3 pointing to Player #1
      await CreatePlayerSplitAction.execute({
        gameId: game.id,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #1 as 2nd card after split
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 3,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Player #3 (pointing to Player #1) as 2nd card after split
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 4,
        playerId: 3,
        gameRepository,
      });

      const finishedGame = await FinishGame.execute({
        gameId: game.id,
        gameRepository,
      });

      expect(finishedGame.reports).toHaveLength(3);
      expect(finishedGame.reports[0].isWinner).toBeTruthy();
      expect(finishedGame.reports[0].player.id).toEqual(firstPlayer.id);
      expect(finishedGame.reports[0].player.originalPlayerId).toEqual(
        firstPlayer.id
      );
      expect(game.players[0].balance).toEqual(1000);
      expect(finishedGame.players[0].balance).toEqual(1000);
      expect(finishedGame.reports[0].prize).toEqual(100);
      expect(finishedGame.reports[1].isWinner).toBeTruthy();
      expect(finishedGame.reports[1].player.id).toEqual(secondPlayer.id);
      expect(finishedGame.reports[1].player.originalPlayerId).toEqual(
        secondPlayer.id
      );
      expect(game.players[1].balance).toEqual(1000);
      expect(finishedGame.players[1].balance).toEqual(1100);
      expect(finishedGame.reports[1].prize).toEqual(100);

      expect(finishedGame.reports[2].isWinner).toBeFalsy();
      expect(finishedGame.reports[2].player.id).toEqual(3);
      expect(finishedGame.reports[2].player.originalPlayerId).toEqual(1);
      expect(game.players[2]).toBeUndefined();
      expect(finishedGame.players[2].balance).toEqual(0);
      expect(finishedGame.reports[2].prize).toEqual(-100);
    });

    it("calculates as expected splitted games when only 2nd hand from the same player win", async () => {
      const playersAmount = 2;
      const gameRepository = new GameRepositoryInMemory();

      const game = await StartGame.execute({ playersAmount, gameRepository });
      const firstPlayer = game.players[0];
      const secondPlayer = game.players[1];

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: firstPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      await CreatePlayerBet.execute({
        betAmount: 100,
        playerId: secondPlayer.id,
        gameId: game.id,
        gameRepository,
      });

      // Gives K to Dealer as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        gameRepository,
      });

      // Gives K to Player #1 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #2 as 1st card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 1,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Gives 3 to Dealer as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(2);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        gameRepository,
      });

      // Gives K to Player #1 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #2 as 2nd card
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 2,
        playerId: secondPlayer.id,
        gameRepository,
      });

      // Splits hands and create Player #3 pointing to Player #1
      await CreatePlayerSplitAction.execute({
        gameId: game.id,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives 2 to Player #1 as 2nd card after split
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(1);
      await GiveCard.execute({
        gameId: game.id,
        round: 3,
        playerId: firstPlayer.id,
        gameRepository,
      });

      // Gives K to Player #3 (pointing to Player #1) as 2nd card after split
      jest.spyOn(global.Math, "floor").mockReturnValueOnce(12);
      await GiveCard.execute({
        gameId: game.id,
        round: 4,
        playerId: 3,
        gameRepository,
      });

      const finishedGame = await FinishGame.execute({
        gameId: game.id,
        gameRepository,
      });

      expect(finishedGame.reports).toHaveLength(3);
      expect(finishedGame.reports[0].isWinner).toBeFalsy();
      expect(finishedGame.reports[0].player.id).toEqual(firstPlayer.id);
      expect(finishedGame.reports[0].player.originalPlayerId).toEqual(
        firstPlayer.id
      );
      expect(game.players[0].balance).toEqual(1000);
      expect(finishedGame.players[0].balance).toEqual(800);
      expect(finishedGame.reports[0].prize).toEqual(-100);
      expect(finishedGame.reports[1].isWinner).toBeTruthy();
      expect(finishedGame.reports[1].player.id).toEqual(secondPlayer.id);
      expect(finishedGame.reports[1].player.originalPlayerId).toEqual(
        secondPlayer.id
      );
      expect(game.players[1].balance).toEqual(1000);
      expect(finishedGame.players[1].balance).toEqual(1100);
      expect(finishedGame.reports[1].prize).toEqual(100);

      expect(finishedGame.reports[2].isWinner).toBeTruthy();
      expect(finishedGame.reports[2].player.id).toEqual(3);
      expect(finishedGame.reports[2].player.originalPlayerId).toEqual(1);
      expect(game.players[2]).toBeUndefined();
      expect(finishedGame.players[2].balance).toEqual(200);
      expect(finishedGame.reports[2].prize).toEqual(100);
    });
  });

  describe("validations", () => {
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
          gameId: game.id,
          round: 1,
          playerId: firstPlayer.id,
          gameRepository,
        });

        await FinishGame.execute({ gameId: 1234, gameRepository });

        throw new Error("Should have thrown an error above");
      } catch (error) {
        expect(error.message).toEqual("Game not found!");
      }
    });

    it("throws an error when tries to finish a game with players and dealer without 2 cards", async () => {
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
          gameId: game.id,
          round: 1,
          gameRepository,
        });

        await FinishGame.execute({ gameId: game.id, gameRepository });

        throw new Error("Should have thrown an error above");
      } catch (error) {
        expect(error.message).toEqual(
          "Not possible to finish a game without giving all cards"
        );
      }
    });
  });
});
