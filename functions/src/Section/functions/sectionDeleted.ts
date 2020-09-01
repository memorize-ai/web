import * as functions from "firebase-functions";

import Section from "..";
import { cauterize } from "../../utils";

export default functions.firestore
  .document("decks/{deckId}/sections/{sectionId}")
  .onDelete(
    cauterize((snapshot, { params: { deckId } }) =>
      new Section(snapshot).deleteCards(deckId)
    )
  );
