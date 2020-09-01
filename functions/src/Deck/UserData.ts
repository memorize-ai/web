import * as admin from "firebase-admin";

const firestore = admin.firestore();

export default class DeckUserData {
  id: string;
  dateAdded: Date;
  isFavorite: boolean;
  numberOfDueCards: number;
  numberOfUnsectionedDueCards: number;
  numberOfUnlockedCards: number;
  rating: null | 1 | 2 | 3 | 4 | 5;
  sections: Record<string, number>;

  constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
    this.id = snapshot.id;
    this.dateAdded = snapshot.get("added")?.toDate();
    this.isFavorite = snapshot.get("favorite") ?? false;
    this.numberOfDueCards = snapshot.get("dueCardCount") ?? 0;
    this.numberOfUnsectionedDueCards =
      snapshot.get("unsectionedDueCardCount") ?? 0;
    this.numberOfUnlockedCards = snapshot.get("unlockedCardCount") ?? 0;
    this.rating = snapshot.get("rating") ?? null;
    this.sections = snapshot.get("sections") ?? {};
  }

  static fromId = async (uid: string, deckId: string) =>
    new DeckUserData(await firestore.doc(`users/${uid}/decks/${deckId}`).get());

  isSectionUnlocked = (sectionId: string) =>
    this.sections[sectionId] !== undefined;
}
