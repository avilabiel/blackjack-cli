# Blackjack CLI

<img width="1436" alt="image" src="https://github.com/avilabiel/blackjack-cli/assets/10943948/1f3ea64a-163f-46aa-bbfd-5b3f058f13f4">

This repository aims to bring a playable Blackjack on CLI using Node.JS, Typescript, and a Clean Architecture following SOLID principles.

## How to run

To run this game on your CLI, please run the following commands:

```shell
yarn
yarn build
yarn start-cli
```

## Rules

The rules are:

1. The app asks for how many players are at the table
2. Each player starts with $1000
3. Each player can set any integer number to place a bet
4. Each player has the option to HIT, STAND, DOUBLE, or SPLIT
5. If the Player has a bigger score than the Dealer, the Player wins. Winners' prizes are 1x their bet
6. If the Player wins with a blackjack (straight 21), the prize is 1.5x their bet

If you are not familiar with Blackjack rules, we highly suggest reading this [article](https://bicyclecards.com/how-to-play/blackjack/) for a better understanding.

### Cards scoring

We will use the following cards scoring:

- Ace cards worth one or eleven (1 or 11)
- Face cards are ten (10)
- Any other card is its pip value

### Splitting

Whenever you have cards that are worth the same value, the player can split them into two separate games.

### Doubling down

Whenever the two cards are distributed, the player can double their bet. The player will receive another card after doubling the bet.

Some constraints:

- Players that hit previously cannot double their bets
- Players that doubled their bets cannot hit again, i.e. they will receive just one more card

## Features

This Blackjack CLI is not on its final version. The supported features are:

- Max of 6 players in the game
- Winning or losing bets
- Actions: HIT, STAND, DOUBLE, SPLIT

## Next features

These are the improvements that we will implement in the next versions of this CLI game:

1. Apply a Linter using ESLint
2. Improve the experience of Splitting games.
3. Leave the table whenever the player wants (LEAVE action)
4. Player can keep playing until the balance is greater than $0
5. Improve the Dealer bot to take some actions like HIT if its score is less or equal than 14
6. Support different card suits and colors
7. Give random and unique cards. I.e. a card picked previously will not appear again
8. Support more advanced rules like Side Bets, Perfect Pairs, and Insurance
9. Use real storage to persist the games (e.g. MySQL or MongoDB)
10. Improve the CLI view with [Ink](https://www.npmjs.com/package/ink)
11. Finish the REST implementation
12. Players can log in and set their nickname
13. Apply Github CICD to ensure our tests are passing on every push (to `main` or PRs)
14. Apply automated tests for the game CLI
15. In the REST API, the given hidden card from dealer should be revelead in a specific request to avoid sneaky peaks on Network Dev Tools

## How to contribute

### PRs

Pick a feature or issue, pull from `main`, and start coding! Please create a PR and we will review it happily 😄. PRs without automated tests won't be approved.

### SOLID

This project follows the SOLID principles. These principles stand for:

1. _*Single Responsibility Principle*_: Classes and functions have only one single responsibility
2. _*Open Closed Principle*_: Classes are open for extensions, but closed for modifications
3. _*Liskov Substitution Principle*_: Using subclasses from the same base class won't break the app
4. _*Interface Segregation Principle*_: Interfaces should be clean contracts with only useful clauses
5. _*Dependency Inversion Principle*_: Depend on abstractions over implementations

If you are not familiar with the SOLID principle, don't worry! It is easier than you think. Keep reading this README and check our code. It may clarify things for you!

### Clean Architecture

Clean Architecture is basically a practical way of following the SOLID principles defined above. Our Clean Architecture has 3 layers only, which are:

1. _*Entities*_: store the Entities in their most abstract level, like: `Player`, `Game`, `Card`;
2. _*Use Cases*_: store the use cases of the system without being coupled to external things. Basically, all the business levels are stored here. Examples: `Start Game`, `Give a Card`, `Hit`, `Stand`, etc.
3. _*Externals*_: store everything that does not impact the business rules like Databases, Libraries, CLI, HTTP frameworks, etc.

#### Benefits from Clean Architecture

There are many benefits of using Clean Architecture and SOLID principles, some of them are:

1. Easy to test
2. Easy to maintain (e.g.: we can easily move from in-memory repositories to a MySQL or MongoDB repository)
3. Easy to serve on other platforms
4. Business rules not coupled to external items like libraries, storages, HTTP, Websocket, etc.

For example, by using Clean Architecture, we can easily serve the same business rules in CLI, REST API, and Websocket. We just need to use the Use Cases!

We are serving this app mainly in the CLI. However, please check the `externals` folder and see one tiny example of starting this game using REST.

To understand more about Clean Architecture, please read [this article from Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

### TDD

We follow TDD to develop any content in this app. We strongly believe that Automated Tests give us the confidence to develop new stuff and refactor the current codebase.

You can run tests by the following commands:

```shell
yarn test

# watch mode
yarn test --watch
```

So far, we have this amount of tests:
<img width="808" alt="image" src="https://github.com/avilabiel/blackjack-cli/assets/10943948/7bf96f63-b672-4b5c-b696-4d5b33641771">
