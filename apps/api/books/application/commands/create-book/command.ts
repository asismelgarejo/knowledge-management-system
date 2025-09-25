import { BookTypes } from "@/books/domain/constants";
import { CommandDecorator } from "@/shared/utils/cqrs/decorators";

type BaseProps = {
  title: string;
  authors: string[];
};

type BookActArcProps = BaseProps & {
  type: BookTypes.ACT_ARC;
};

type BookAlphabeticalProps = BaseProps & {
  type: BookTypes.ALPHABETICAL;
};

type BookCaseStudyProps = BaseProps & {
  type: BookTypes.CASE_STUDY;
};

type BookChapterOnlyProps = BaseProps & {
  type: BookTypes.CHAPTER_ONLY;
};

type BookEntryArticleProps = BaseProps & {
  type: BookTypes.ENTRY_ARTICLE;
};

type BookIndependentStoryProps = BaseProps & {
  type: BookTypes.INDEPENDENT_STORY;
};

type BookManualReferenceProps = BaseProps & {
  type: BookTypes.MANUAL_REFERENCE;
};

type BookMapDiagramProps = BaseProps & {
  type: BookTypes.MAP_DIAGRAM;
};

type BookModuleProps = BaseProps & {
  type: BookTypes.MODULE;
};

type BookPracticeExerciseProps = BaseProps & {
  type: BookTypes.PRACTICE_EXERCISE;
};

type BookSectionChapterProps = BaseProps & {
  type: BookTypes.SECTION_CHAPTER;
};

type BookTimelineProps = BaseProps & {
  type: BookTypes.TIMELINE;
};

type BookTopicProps = BaseProps & {
  type: BookTypes.TOPIC;
};

type BookUnitLessonProps = BaseProps & {
  type: BookTypes.UNIT_LESSON;
};

type BookVolumeProps = BaseProps & {
  type: BookTypes.VOLUME;
};

type CreateBookCommandProps =
  | BookActArcProps
  | BookAlphabeticalProps
  | BookCaseStudyProps
  | BookChapterOnlyProps
  | BookEntryArticleProps
  | BookIndependentStoryProps
  | BookManualReferenceProps
  | BookMapDiagramProps
  | BookModuleProps
  | BookPracticeExerciseProps
  | BookSectionChapterProps
  | BookTimelineProps
  | BookTopicProps
  | BookUnitLessonProps
  | BookVolumeProps;

@CommandDecorator()
export class CreateBookCommand {
  constructor(public readonly props: CreateBookCommandProps) {}
}
