import AppError from "@/app/errors/app-error";
import CreatePlayerBet from "@/app/use-cases/blackjack/create-player-bet";
import StartGame from "@/app/use-cases/blackjack/start-game";
import config from "@/config";
import express from "express";

import { Router, Request, Response } from "express";

const app = express();

const route = Router();

app.use(express.json());

route.post(
  "/casino/blackjack/start-game",
  async (req: Request, res: Response) => {
    try {
      const { playersAmount } = req.body;

      const newGame = await StartGame.execute({
        playersAmount,
        gameRepository: config.repositories.gameRepository,
      });

      return res.json(newGame);
    } catch (error: any) {
      console.log("Caught error", error);

      if (error instanceof AppError) {
        return res.status(400).send({ message: error.message });
      }

      return res.status(500).send({ message: "Internal server error" });
    }
  }
);

route.post(
  "/casino/blackjack/game/:gameId/players/:playerId/bet",
  async (req: Request, res: Response) => {
    const { gameId, playerId } = req.params;
    const { amount } = req.body;

    try {
      const response = await CreatePlayerBet.execute({
        betAmount: amount,
        playerId: Number(playerId),
        gameId: Number(gameId),
        gameRepository: config.repositories.gameRepository,
      });

      return res.send(response);
    } catch (error: any) {
      console.log("Caught error", error);

      if (error instanceof AppError) {
        return res.status(400).send({ message: error.message });
      }

      return res.status(500).send({ message: "Internal server error" });
    }
  }
);

app.use(route);

app.listen(3333, () => console.log("server running on port 3333"));
