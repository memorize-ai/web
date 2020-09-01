import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { cauterize } from "../../utils";

const storage = admin.storage().bucket();

export default functions.firestore
  .document("topics/{topicId}")
  .onDelete(
    cauterize((_snapshot, { params: { topicId } }) =>
      storage.file(`topics/${topicId}`).delete()
    )
  );
