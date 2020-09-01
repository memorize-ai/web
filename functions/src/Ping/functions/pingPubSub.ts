import { pubsub } from "firebase-functions";

import ping from "..";
import { cauterize } from "../../utils";
import { PING_SCHEDULE } from "../../constants";

export default pubsub.schedule(PING_SCHEDULE).onRun(cauterize(ping));
