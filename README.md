# Blackjack CLI

This repository aims to bring a playable Blackjack on CLI using Node.JS, Typescript, and Clean Architecture following SOLID principles.

## Rules

The rules are:

1. The app asks for how many players are at the table
2. Each player stars with $1000
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

1. All players place their bets
2. Then, all players and the dealer receive 1 card face up
3. Right after, all players receive another card face up, but the dealer takes the second card face down
4. If the player has a blackjack and the dealer doesn't, dealer must pay 1.5x the given bet of this player

WIP: stopping here because it's already late. Getting back later!

### Double

It also supports more complex rules such as doubling-down and splitting.

## Next versions

These are the improvements that we will implement in the next versions of this CLI game:

1. Persist games and ranks by player names instead of just In memory
2. Implement more

## Hours spent

So far, it was spent:

1. An hour understanding the requirements
2. More 2 hours coding the game

## Clean Architecture
