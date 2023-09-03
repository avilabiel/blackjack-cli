import { type Bet } from '@/entities/blackjack-game';
import type IGameRepository from '@/app/contracts/i-game-repository';
import type IUseCase from '@/app/contracts/i-use-case';
import AppError from '@/app/errors/app-error';

/*
  TODO: implement other use cases
  (gives a card, stands, hits, checks if the gamer is finished, player balance, doubles, splits)
*/
// TODO: finish CLI
// TODO: implement the start game on REST
// TODO: Apply linter
class CreatePlayerBet implements IUseCase {
  async execute({
    betAmount,
    playerId,
    gameId,
    gameRepository,
  }: {
    betAmount: number
    playerId: number
    gameId: number
    gameRepository: IGameRepository
  }): Promise<Bet> {
    const persistedGame = await gameRepository.getGameById(gameId);

    if (!persistedGame) {
      throw new AppError('Game not found!');
    }

    const persistedPlayer = persistedGame.players.find(
      (player) => player.id === playerId,
    );

    if (!persistedPlayer) {
      throw new AppError('Player not found in this game!');
    }

    if (persistedPlayer.balance < betAmount) {
      throw new AppError('Player does not have enough balance!');
    }

    if (persistedGame.bets.length === persistedGame.players.length) {
      throw new AppError('All players already placed their bets');
    }

    persistedPlayer.balance -= betAmount;

    const bet = { amount: betAmount, player: persistedPlayer };
    persistedGame.bets.push(bet);

    await gameRepository.save(persistedGame);
    return bet;
  }
}

export default new CreatePlayerBet();
