import { BookActArc } from "./act-art";
import { BookAlphabetical } from "./alphabetical";
import { BookCaseStudy } from "./case-study";
import { BookChapterOnly } from "./chapter-only";
import { BookEntryArticle } from "./entry-article";
import { BookIndependentStory } from "./independent-story";
import { BookManualReference } from "./manual-reference";
import { BookMapDiagram } from "./map-diagram";
import { BookModule } from "./module";
import { BookPracticeExercise } from "./practice-exercise";
import { BookSectionChapter } from "./section-chapter";
import { BookTimeline } from "./timeline";
import { BookTopic } from "./topic";
import { BookUnitLesson } from "./unit-lesson";
import { BookVolume } from "./volume";

type Book =
  | BookActArc
  | BookAlphabetical
  | BookCaseStudy
  | BookChapterOnly
  | BookEntryArticle
  | BookIndependentStory
  | BookManualReference
  | BookMapDiagram
  | BookModule
  | BookPracticeExercise
  | BookSectionChapter
  | BookTimeline
  | BookTopic
  | BookUnitLesson
  | BookVolume;

export {
  Book,
  BookActArc,
  BookAlphabetical,
  BookCaseStudy,
  BookChapterOnly,
  BookEntryArticle,
  BookIndependentStory,
  BookManualReference,
  BookMapDiagram,
  BookModule,
  BookPracticeExercise,
  BookSectionChapter,
  BookTimeline,
  BookTopic,
  BookUnitLesson,
  BookVolume,
};
