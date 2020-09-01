import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Batch from "firestore-batch";

import Deck from "..";
import User from "../../User";
import { cauterize } from "../../utils";

const firestore = admin.firestore();

export default functions
  .runWith({ timeoutSeconds: 540, memory: "2GB" })
  .firestore.document("users/{uid}/decks/{deckId}")
  .onDelete(
    cauterize((snapshot, { params: { uid, deckId } }) => {
      const oldRating: number | undefined = snapshot.get("rating");

      return Promise.all([
        Deck.decrementCurrentUserCount(deckId),
        User.decrementDeckCount(uid),
        oldRating
          ? Deck.updateRating(uid, deckId, oldRating, undefined)
          : Promise.resolve(null),
        Deck.removeUserFromCurrentUsers(deckId, uid),
        removeAllCardsAndHistory(uid, deckId),
      ]);
    })
  );

const removeAllCardsAndHistory = async (uid: string, deckId: string) => {
  const { docs: cards } = await firestore
    .collection(`users/${uid}/decks/${deckId}/cards`)
    .get();

  const batch = new Batch(firestore);

  for (const { ref: card } of cards) {
    batch.delete(card);

    const { docs: historyNodes } = await card.collection("history").get();

    for (const { ref: history } of historyNodes) batch.delete(history);
  }

  return batch.commit();
};
