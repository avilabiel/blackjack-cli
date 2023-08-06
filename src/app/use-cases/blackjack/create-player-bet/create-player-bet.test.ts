import CreatePlayerBet from ".";
import GameRepositoryInMemory from "../../../../externals/database/game-repository-in-memory";
import StartGame from "../start-game";

describe("CreatePlayerBet", () => {
  it("creates a bet for the given player", async () => {
    const playersAmount = 4;
    const gameRepository = new GameRepositoryInMemory();

    const game = await StartGame.execute({ playersAmount, gameRepository });

    const betAmount = 500;
    const player = game.players[0];

    const persistedBet = await CreatePlayerBet.execute({
      betAmount,
      playerId: player.id as number,
      gameId: game.id as number,
      gameRepository,
    });

    expect(persistedBet.bet).toEqual(betAmount);
    expect(persistedBet.player).toMatchObject({
      id: player.id,
      balance: 500,
    });
  });

  it("creates a bet for each player", async () => {
    const playersAmount = 4;
    const gameRepository = new GameRepositoryInMemory();

    const game = await StartGame.execute({ playersAmount, gameRepository });
  });

  it("throws an error when player does not have enough balance", async () => {
    expect(1).toBe(1);
  });

  it("throws an error when player is not found", async () => {
    expect(1).toBe(1);
  });

  it("throws an error when game is not found", async () => {
    expect(1).toBe(1);
  });
});
