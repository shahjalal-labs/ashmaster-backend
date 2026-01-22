import { Request, Response } from "express";

//
export const entryMessage = (req: Request, res: Response) => {
  res.send({
    message: "Bridge Connections server!!!",
  });
};
