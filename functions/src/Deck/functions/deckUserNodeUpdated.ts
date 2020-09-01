import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import Deck from "..";
import DeckUserData from "../UserData";
import { cauterize } from "../../utils";

const firestore = admin.firestore();

export default functions.firestore
  .document("users/{uid}/decks/{deckId}")
  .onUpdate(
    cauterize(({ before, after }, { params: { uid, deckId } }) =>
      Promise.all([
        Deck.updateRating(
          uid,
          deckId,
          before.get("rating"),
          after.get("rating")
        ),
        updateFavorites(deckId, before, after),
        addCardsToUserData(
          uid,
          deckId,
          new DeckUserData(before),
          new DeckUserData(after)
        ),
      ])
    )
  );

const updateFavorites = (
  deckId: string,
  before: FirebaseFirestore.DocumentSnapshot,
  after: FirebaseFirestore.DocumentSnapshot
) => {
  const isFavorite = after.get("favorite");

  return before.get("favorite") === isFavorite
    ? Promise.resolve(null)
    : firestore.doc(`decks/${deckId}`).update({
        favoriteCount: admin.firestore.FieldValue.increment(
          isFavorite ? 1 : -1
        ),
      });
};

const addCardsToUserData = (
  uid: string,
  deckId: string,
  oldDeck: DeckUserData,
  newDeck: DeckUserData
) =>
  Promise.all(
    Object.keys(newDeck.sections)
      .filter((sectionId) => oldDeck.sections[sectionId] === undefined)
      .map((sectionId) => Deck.addSectionToUserNode(uid, deckId, sectionId))
  );
