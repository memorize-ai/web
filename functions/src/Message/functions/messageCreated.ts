import * as functions from "firebase-functions";

import { modifyCounter } from "..";
import { cauterize } from "../../utils";

export default functions.firestore
  .document("messages/{messageId}")
  .onCreate(cauterize(() => modifyCounter(1)));
