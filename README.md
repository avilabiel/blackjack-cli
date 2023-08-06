# Blackjack CLI

This repository aims to bring a playable Blackjack on CLI using Node.JS, Typescript, and Clean Architecture following SOLID principles.

## Rules

The rules are:

1. The app asks for how many players are at the table
2. Each player starts with $1000
3. Each player can set any integer number to bet
4. Whenever the player

## The game

### Objective of the game

Each participant attempts to beat the dealer by getting a count as close to 21 as possible, without going over 21.

### Cards scoring

- Ace cards worth one or eleven (1 or 11)
- Face cards are ten (10)
- Any other card is its pip value

### Game flow

1. Players place their bets
2. Players and the dealer receive 1 card face up
3. Players receive another card face up, but the dealer takes the second card face down
4. If the player has a blackjack (21) and the dealer doesn't, the player wins
5. If the player and dealer have a blackjack (21), it's a push
6. If neither side has a blackjack, then each player plays out his hand, one at a time

### Prizes

- Push: Dealer and Player have the same score, no one gets a prize
- Player win: Player has a closer hand to 21 or 21. Player gets bet amount + bet amount (1x)
- Dealer win: Dealer has a closer hand to 21 or 21

- Blackjack: Whenever the player starts with a blackjack (21) and the dealer doesn't have a blackjack, the player's prize is 1.5x

### Splitting

Whenever you have cards that worth the same value, the player can split them into two separate games.

### Doubling down

Whenever the two cards are distributed, the player can double their bet. The player will receive another card after doubling it.

Some constraints:

- Players that hit cannot double their bets
- Players that doubled their bets cannot hit again, i.e. they will receive just one more card

## Next versions

These are the improvements that we will implement in the next versions of this CLI game:

1. Persist games and ranks by player names instead of just in memory. Since we are following SOLID principles and using Clean Architecture, this is easy to implement, we just need to create the new repository and change the config.repositories
2. Finish the REST implementation. With SOLID and Clean Archicture, this is easy. We just need to implement the use cases in REST paradigm
3. Support different colors of cards
4. Support Side Bets
5. Support Perfect Pairs
6. Support Insurance
7. Players can login and set their nickname
8. Players have a balance outside of the game like deposited money in the house
9. There is a rank with the top nicknames

## Hours spent

So far, it was spent:

1. An hour understanding the requirements and playing a lot of Blackjack online 😄
2. More 2 hours coding the game
3. One hour throughout the development phase to write and update this README

## How to contribute

### SOLID

### Clean Architecture

We are using
