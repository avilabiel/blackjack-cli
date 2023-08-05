import GameRepositoryInMemory from "./externals/database/game-repository-in-memory";

export default {
  repositories: {
    gameRepository: new GameRepositoryInMemory(),
  },
};
