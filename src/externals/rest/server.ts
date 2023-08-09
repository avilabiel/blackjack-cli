import StartGame from "@/app/use-cases/blackjack/start-game";
import config from "@/config";
import express from "express";

import { Router, Request, Response } from "express";

const app = express();

const route = Router();

app.use(express.json());

// NB: just an example of how powerful is to use Clean Architecture
route.post(
  "/casino/blackjack/start-game",
  async (req: Request, res: Response) => {
    const { playersAmount } = req.body;

    const newGame = await StartGame.execute({
      playersAmount,
      gameRepository: config.repositories.gameRepository,
    });

    res.json(newGame);
  }
);

app.use(route);

app.listen(3333, () => console.log("server running on port 3333"));
