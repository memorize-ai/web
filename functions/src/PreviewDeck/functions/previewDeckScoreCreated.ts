import * as functions from "firebase-functions";

import { modifyCounter } from "..";
import { cauterize } from "../../utils";

export default functions.firestore
  .document("previewDeckScores/{scoreId}")
  .onCreate(cauterize(() => modifyCounter(1)));
