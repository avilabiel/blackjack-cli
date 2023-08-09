import GameRepositoryInMemory from "@/externals/database/game-repository-in-memory";
import StartGame from "@/app/use-cases/blackjack/start-game";
import CreatePlayerBet from "@/app/use-cases/blackjack/create-player-bet";
import GiveCard from "@/app/use-cases/blackjack/give-card";
import CreatePlayerDoubleAction from ".";

describe("CreatePlayerDoubleAction", () => {
  it("gives a new card to the player", async () => {
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

    await GiveCard.execute({
      gameId: game.id,
      round: 2,
      playerId: firstPlayer.id,
      gameRepository,
    });

    const givenCard = await CreatePlayerDoubleAction.execute({
      gameId: game.id,
      round: 3,
      playerId: firstPlayer.id,
      gameRepository,
    });

    const updatedGame = await gameRepository.getGameById(game.id);

    expect(givenCard.isFaceUp).toBeTruthy();
    expect(givenCard.value).toBeDefined();
    expect(givenCard.worth).toBeDefined();
    expect(givenCard.worth).toBeGreaterThan(0);
    expect(updatedGame.rounds).toHaveLength(3);
  });

  it("doubles the bet from player", async () => {
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

    await GiveCard.execute({
      gameId: game.id,
      round: 2,
      playerId: firstPlayer.id,
      gameRepository,
    });

    const gameBeforeDoublingBet = await gameRepository.getGameById(game.id);

    await CreatePlayerDoubleAction.execute({
      gameId: game.id,
      round: 3,
      playerId: firstPlayer.id,
      gameRepository,
    });

    const gameAfterDoublingBet = await gameRepository.getGameById(game.id);

    expect(game.players[0].balance).toEqual(1000);
    expect(gameBeforeDoublingBet.players[0].balance).toEqual(900);
    expect(gameBeforeDoublingBet.bets[0].amount).toEqual(100);
    expect(gameAfterDoublingBet.players[0].balance).toEqual(800);
    expect(gameAfterDoublingBet.bets[0].amount).toEqual(200);
  });

  describe("validations", () => {
    it("throws an error when game not found", async () => {
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

        await CreatePlayerDoubleAction.execute({
          gameId: 1234,
          round: 3,
          playerId: firstPlayer.id,
          gameRepository,
        });

        throw new Error("Should have thrown an error above");
      } catch (error) {
        expect(error.message).toEqual("Game not found!");
      }
    });

    it("throws an error when cards are not fully given yet", async () => {
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

        await CreatePlayerDoubleAction.execute({
          gameId: game.id,
          round: 2,
          playerId: firstPlayer.id,
          gameRepository,
        });

        throw new Error("Should have thrown an error above");
      } catch (error) {
        expect(error.message).toEqual(
          "Not possible to double without having all cards"
        );
      }
    });

    it("throws an error when player is not found", async () => {
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

        await GiveCard.execute({
          gameId: game.id,
          round: 2,
          gameRepository,
        });

        await CreatePlayerDoubleAction.execute({
          gameId: game.id,
          round: 3,
          playerId: 1234,
          gameRepository,
        });

        throw new Error("Should have thrown an error above");
      } catch (error) {
        expect(error.message).toEqual("Player not found in this game!");
      }
    });
  });
});
