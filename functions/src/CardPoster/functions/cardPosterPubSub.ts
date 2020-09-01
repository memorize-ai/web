import * as functions from "firebase-functions";

import { sendNextFact } from "..";
import { cauterize } from "../../utils";

export default functions.pubsub
  .schedule("every 1 minutes") // 180 tweets in 3 hours (below the rate limit of 300 tweets in 3 hours)
  .onRun(cauterize(sendNextFact));
