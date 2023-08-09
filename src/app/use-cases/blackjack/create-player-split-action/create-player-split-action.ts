import IGameRepository from "@/app/contracts/i-game-repository";
import IUseCase from "@/app/contracts/i-use-case";
import { PlayerInRound, Round } from "@/entities/blackjack-game";
import Player from "@/entities/player";

class CreatePlayerSplitAction implements IUseCase {
  async execute({
    gameId,
    playerId,
    gameRepository,
  }: {
    gameId: number;
    playerId?: number;
    gameRepository: IGameRepository;
  }): Promise<void> {
    const persistedGame = await gameRepository.getGameById(gameId);

    if (!persistedGame) {
      throw new Error("Game not found!");
    }

    if (persistedGame.bets.length === 0) {
      throw new Error("Not possible to give cards before bets");
    }

    const originalAmountOfPlayers = persistedGame.rounds[0].players.length;
    const isPlayerGeneratedFromSplit = playerId > originalAmountOfPlayers;

    if (isPlayerGeneratedFromSplit) {
      throw new Error(
        "Players generated from a previous split cannot split again"
      );
    }

    const lastRound = persistedGame.rounds[persistedGame.rounds.length - 1];
    const player = lastRound.players.find(
      (player) => player.player.id === playerId
    );

    if (!player) {
      throw new Error(
        `Player #${playerId} not found in game #${persistedGame.id}`
      );
    }

    if (player.cards.length !== 2) {
      throw new Error("Players can split only when they have two cards");
    }

    let isPlayerHandAllowedToSplit =
      player.cards[0].worth === player.cards[1].worth;

    if (!isPlayerHandAllowedToSplit) {
      throw new Error(
        "Players can split only with two cards with the same worth"
      );
    }

    const playerBet = persistedGame.bets[playerId - 1].amount;
    const lastBalance = player.player.balance;
    const newBalance = lastBalance - playerBet;

    if (newBalance < 0) {
      throw new Error("You don't have enough balance to split");
    }

    console.log({ player, playerBet, lastBalance });

    const newPlayer: Player = {
      id: persistedGame.players.length + 1,
      balance: 0,
      originalPlayerId: player.player.id,
    };

    const copyOfLastRound = JSON.parse(JSON.stringify(lastRound)) as Round;
    const playersHandsUpdated: PlayerInRound[] = copyOfLastRound.players.map(
      (playerInRound) => {
        if (playerInRound.player.id !== player.player.id) {
          return playerInRound;
        }

        return {
          ...playerInRound,
          player: { ...player.player, balance: newBalance },
          cards: [
            {
              ...playerInRound.cards[0],
              handSum: playerInRound.cards[0].worth,
            },
          ],
          score: playerInRound.cards[0].worth,
        };
      }
    );

    // remove cards
    const newRound: Round = {
      ...copyOfLastRound,
      players: [
        ...playersHandsUpdated,
        {
          player: newPlayer,
          cards: [{ ...player.cards[1], handSum: player.cards[1].worth }],
          score: player.cards[1].worth,
          isBlackjack: false,
        },
      ],
    };

    const newBet = { amount: playerBet, player: newPlayer };

    persistedGame.bets.push(newBet);
    persistedGame.bets[playerId - 1].player.balance = newBalance;
    persistedGame.players[playerId - 1].balance = newBalance;
    persistedGame.players.push(newPlayer);
    persistedGame.rounds.push(newRound);

    console.log("UPDATED VALUE");
    console.dir({ persistedGame }, { depth: null });
    console.dir({ newBet, newPlayer, newRound }, { depth: null });

    await gameRepository.save(persistedGame);
    // CLI: Display that a new player was created
    // FINISH GAME: Consider the balance as the same on finishing game
  }
}

export default new CreatePlayerSplitAction();
