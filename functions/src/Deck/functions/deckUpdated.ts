import * as functions from "firebase-functions";

import Deck from "..";
import { cauterize } from "../../utils";

export default functions.firestore.document("decks/{deckId}").onUpdate(
  cauterize(({ before, after }) => {
    const oldDeck = new Deck(before);
    const newDeck = new Deck(after);

    const promises: Promise<any>[] = [];

    if (oldDeck.wasUpdatedByUser(newDeck))
      promises.push(newDeck.updateLastUpdated());

    if (oldDeck.shouldIndex(newDeck)) promises.push(newDeck.index());

    if (oldDeck.shouldCache(newDeck)) promises.push(newDeck.cache());

    if (oldDeck.shouldUpdateCanPostCard(newDeck))
      promises.push(newDeck.updateCanPostCard());

    return Promise.all(promises);
  })
);
