import CreatePlayerBet from ".";
import GameRepositoryInMemory from "@/externals/database/game-repository-in-memory";
import StartGame from "@/app/use-cases/blackjack/start-game";

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

    const updatedGame = await gameRepository.getGameById(game.id as number);

    expect(persistedBet.bet).toEqual(betAmount);
    expect(persistedBet.player).toMatchObject({
      id: player.id,
      balance: 500,
    });
    expect(updatedGame?.players[0].balance).toEqual(500);
  });

  it("creates a bet for each player with different amounts", async () => {
    const playersAmount = 3;
    const gameRepository = new GameRepositoryInMemory();

    const game = await StartGame.execute({ playersAmount, gameRepository });

    const firstPlayer = game.players[0];
    const secondPlayer = game.players[1];
    const thirdPlayer = game.players[2];

    const persistedBetFirstPlayer = await CreatePlayerBet.execute({
      betAmount: 100,
      playerId: firstPlayer.id as number,
      gameId: game.id as number,
      gameRepository,
    });

    const persistedBetSecondPlayer = await CreatePlayerBet.execute({
      betAmount: 200,
      playerId: secondPlayer.id as number,
      gameId: game.id as number,
      gameRepository,
    });

    const persistedBetThirdPlayer = await CreatePlayerBet.execute({
      betAmount: 300,
      playerId: thirdPlayer.id as number,
      gameId: game.id as number,
      gameRepository,
    });

    const updatedGame = await gameRepository.getGameById(game.id as number);

    expect(persistedBetFirstPlayer.bet).toEqual(100);
    expect(persistedBetFirstPlayer.player).toMatchObject({
      id: firstPlayer.id,
      balance: 900,
    });
    expect(updatedGame?.players[0].balance).toEqual(900);

    expect(persistedBetSecondPlayer.bet).toEqual(200);
    expect(persistedBetSecondPlayer.player).toMatchObject({
      id: secondPlayer.id,
      balance: 800,
    });
    expect(updatedGame?.players[1].balance).toEqual(800);

    expect(persistedBetThirdPlayer.bet).toEqual(300);
    expect(persistedBetThirdPlayer.player).toMatchObject({
      id: thirdPlayer.id,
      balance: 700,
    });
    expect(updatedGame?.players[2].balance).toEqual(700);
  });

  it("throws an error when player does not have enough balance", async () => {
    const playersAmount = 4;
    const gameRepository = new GameRepositoryInMemory();

    const game = await StartGame.execute({ playersAmount, gameRepository });

    const betAmount = 1200;
    const player = game.players[0];

    try {
      await CreatePlayerBet.execute({
        betAmount,
        playerId: player.id as number,
        gameId: game.id as number,
        gameRepository,
      });
    } catch (error: any) {
      expect(error.message).toEqual("Player does not have enough balance!");
    }
  });

  it("throws an error when game is not found", async () => {
    const playersAmount = 4;
    const gameRepository = new GameRepositoryInMemory();

    const game = await StartGame.execute({ playersAmount, gameRepository });

    const betAmount = 100;
    const player = game.players[0];

    try {
      await CreatePlayerBet.execute({
        betAmount,
        playerId: player.id as number,
        gameId: 12340589,
        gameRepository,
      });
    } catch (error: any) {
      expect(error.message).toEqual("Game not found!");
    }
  });

  it("throws an error when player is not found", async () => {
    const playersAmount = 4;
    const gameRepository = new GameRepositoryInMemory();

    const game = await StartGame.execute({ playersAmount, gameRepository });

    const betAmount = 100;

    try {
      await CreatePlayerBet.execute({
        betAmount,
        playerId: 392103012,
        gameId: game.id as number,
        gameRepository,
      });
    } catch (error: any) {
      expect(error.message).toEqual("Player not found in this game!");
    }
  });

  it("throws an error when the game has more rounds", async () => {
    const playersAmount = 4;
    const gameRepository = new GameRepositoryInMemory();

    const game = await StartGame.execute({ playersAmount, gameRepository });
    game.rounds.push({} as any);

    const betAmount = 100;

    try {
      await CreatePlayerBet.execute({
        betAmount,
        playerId: game.players[0].id,
        gameId: game.id as number,
        gameRepository,
      });
    } catch (error: any) {
      expect(error.message).toEqual("Bets round already passed");
    }
  });
});
