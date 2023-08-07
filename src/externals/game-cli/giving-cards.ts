import GiveCard from "@/app/use-cases/blackjack/give-card";
import config from "@/config";
import Game from "@/entities/game";

const givingCards = async (game: Game, round: number) => {
  console.log(
    `\n===================== GIVING CARD #${round} =====================`
  );
  for (let i = 0; i <= game.players.length; i++) {
    const isDealer = i === 0;
    const playerDescription = isDealer ? "Dealer" : `Player #${i}`;

    console.log(`Giving the card #${round} to the ${playerDescription}...`);

    const givenCard = await GiveCard.execute({
      gameId: game.id,
      round,
      playerId: !isDealer ? i : undefined,
      gameRepository: config.repositories.gameRepository,
    });

    if (!givenCard.isFaceUp) {
      console.log(`${playerDescription}: Your card is <FACE DOWN>`);
      console.log(`${playerDescription}: Your total score is <HIDDEN>`);
      console.log(`\n`);

      continue;
    }

    if (isDealer && round === 2) {
      console.log(`${playerDescription}: Your card is ${givenCard.value}`);
      console.log(`${playerDescription}: Your total score is <HIDDEN>`);
      console.log(`\n`);

      continue;
    }

    console.log(`${playerDescription}: Your card is ${givenCard.value}`);
    console.log(
      `${playerDescription}: Your total score is ${givenCard.handSum}`
    );
    console.log(`\n`);
  }
};

export default givingCards;
