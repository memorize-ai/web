import { Express } from "express";

import User from "../User";
import { setContentType } from "../utils";

const PREFIX = "/badges";

const XP_PATH = `${PREFIX}/xp/:uid`;

export default (app: Express) => {
  app.get(XP_PATH, async ({ params: { uid } }, res) => {
    try {
      const user = await User.fromId(uid);

      setContentType(res, "image/svg+xml").send(`<svg>${user.name}</svg>`);
    } catch (error) {
      console.error(error);
      res.status(404).send(error.message);
    }
  });
};
