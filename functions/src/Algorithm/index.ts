import PerformanceRating from "../Card/PerformanceRating";
import CardUserData from "../Card/UserData";

export default class Algorithm {
  static INITIAL_INTERVAL = 1000 * 60 * 60 * 24;

  static DEFAULT_E = 2.5;
  static MINIMUM_E = 1.3;
  static MASTERED_STREAK = 6;

  static nextDueDate = (
    rating: PerformanceRating,
    card: CardUserData,
    now: Date
  ) => {
    const e = Algorithm.e(rating, card.e);

    return {
      e,
      next: new Date(now.getTime() + Algorithm.interval(card, e, now)),
    };
  };

  /** Get the quality of response multiplier */
  private static q = (rating: PerformanceRating) => {
    switch (rating) {
      case PerformanceRating.Easy:
        return 5;
      case PerformanceRating.Struggled:
        return 3;
      case PerformanceRating.Forgot:
        return 0;
    }
  };

  /** Get the new easiness factor */
  private static e = (rating: PerformanceRating, e: number) => {
    const q = Algorithm.q(rating);

    return Math.max(
      Algorithm.MINIMUM_E,
      e + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
    );
  };

  /** Get the interval without the easiness multiplier */
  private static rawInterval = ({ last }: CardUserData, now: Date) =>
    last ? now.getTime() - last.date.getTime() : Algorithm.INITIAL_INTERVAL;

  private static interval = (card: CardUserData, e: number, now: Date) =>
    Algorithm.rawInterval(card, now) *
    (e - (card.totalNumberOfRecallAttempts < 2 ? 1 : 0));

  static isPerformanceRatingCorrect = (rating: PerformanceRating) => {
    switch (rating) {
      case PerformanceRating.Easy:
        return true;
      case PerformanceRating.Struggled:
        return true;
      case PerformanceRating.Forgot:
        return false;
    }
  };
}
