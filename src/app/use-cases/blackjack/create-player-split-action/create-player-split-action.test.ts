import GameRepositoryInMemory from '@/externals/database/game-repository-in-memory';
import StartGame from '@/app/use-cases/blackjack/start-game';
import CreatePlayerBet from '@/app/use-cases/blackjack/create-player-bet';
import GiveCard from '@/app/use-cases/blackjack/give-card';
import CreatePlayerSplitAction from '.';

describe('CreatePlayerSplitAction', () => {
  it('splits the game into two different players', async () => {
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
    jest.spyOn(global.Math, 'floor').mockReturnValueOnce(1);
    await GiveCard.execute({
      gameId: game.id,
      round: 1,
      gameRepository,
    });

    // Gives K to Player #1 as 1st card
    jest.spyOn(global.Math, 'floor').mockReturnValueOnce(12);
    const firstCardToPlayer = await GiveCard.execute({
      gameId: game.id,
      round: 1,
      playerId: firstPlayer.id,
      gameRepository,
    });

    // Gives 2 to Dealer as 2nd card
    jest.spyOn(global.Math, 'floor').mockReturnValueOnce(1);
    await GiveCard.execute({
      gameId: game.id,
      round: 2,
      gameRepository,
    });

    // Gives K to Player #1 as 2nd card
    jest.spyOn(global.Math, 'floor').mockReturnValueOnce(12);
    const secondCardToPlayer = await GiveCard.execute({
      gameId: game.id,
      round: 2,
      playerId: firstPlayer.id,
      gameRepository,
    });

    await CreatePlayerSplitAction.execute({
      playerId: firstPlayer.id,
      gameId: game.id,
      gameRepository,
    });

    const updatedGame = await gameRepository.getGameById(game.id);
    const lastRound = updatedGame.rounds[updatedGame.rounds.length - 1];

    expect(updatedGame.players).toHaveLength(2);
    expect(updatedGame.bets).toHaveLength(2);
    expect(updatedGame.players[0].id).toEqual(1);
    expect(updatedGame.players[0].balance).toEqual(800);
    expect(updatedGame.players[1].id).toEqual(2);
    expect(updatedGame.players[1].balance).toEqual(0);

    expect(updatedGame.bets[0].amount).toEqual(100);
    expect(updatedGame.bets[0].player.id).toEqual(1);
    expect(updatedGame.bets[1].amount).toEqual(100);
    expect(updatedGame.bets[1].player.id).toEqual(2);

    expect(lastRound.players[0].cards).toHaveLength(1);
    expect(lastRound.players[0].cards[0].value).toEqual(
      firstCardToPlayer.value,
    );
    expect(lastRound.players[1].cards).toHaveLength(1);
    expect(lastRound.players[1].cards[0].value).toEqual(
      secondCardToPlayer.value,
    );
    expect(updatedGame.players[0].id).toEqual(1);
    expect(updatedGame.players[0].originalPlayerId).toEqual(1);
    expect(updatedGame.players[1].id).toEqual(2);
    expect(updatedGame.players[1].originalPlayerId).toBeDefined();
    expect(updatedGame.players[1].originalPlayerId).toEqual(1);
  });
});
