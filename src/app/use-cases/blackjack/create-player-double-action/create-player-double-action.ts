import IGameRepository from '@/app/contracts/i-game-repository';
import IUseCase from '@/app/contracts/i-use-case';
import GiveCard from '@/app/use-cases/blackjack/give-card';
import { Card } from '@/entities/blackjack-game';

class CreatePlayerDoubleAction implements IUseCase {
  async execute({
    gameId,
    round,
    playerId,
    gameRepository,
  }: {
    gameId: number;
    round: number;
    playerId?: number;
    gameRepository: IGameRepository;
  }): Promise<Card> {
    const persistedGame = await gameRepository.getGameById(gameId);

    if (!persistedGame) {
      throw new Error('Game not found!');
    }

    if (persistedGame.rounds.length < 2) {
      throw new Error('Not possible to double without having all cards');
    }

    const persistedPlayer = persistedGame.players.find(
      (player) => player.id === playerId,
    );

    const persistedPlayerIndex = persistedGame.players.findIndex(
      (player) => player.id === playerId,
    );

    if (!persistedPlayer) {
      throw new Error('Player not found in this game!');
    }

    const givenCard = await GiveCard.execute({
      gameId,
      round,
      playerId,
      gameRepository,
    });

    const betAmountFromPlayer = persistedGame.bets[persistedPlayerIndex].amount;

    const updatedGameAfterNewCard = await gameRepository.getGameById(gameId);

    updatedGameAfterNewCard.bets[persistedPlayerIndex].amount
      += betAmountFromPlayer;
    updatedGameAfterNewCard.players[persistedPlayerIndex].balance
      -= betAmountFromPlayer;

    await gameRepository.save(updatedGameAfterNewCard);

    return givenCard;
  }
}

export default new CreatePlayerDoubleAction();
