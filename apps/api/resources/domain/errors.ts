import { DomainError } from "@/shared/utils";

export class InvalidBookTitleError extends DomainError {
  _kind = "error" as const;
  code = "InvalidBookTitle" as const;
}

export class InvalidBookSourceUrlError extends DomainError {
  _kind = "error" as const;
  code = "InvalidBookSourceUrl" as const;
}
export class InvalidBookSourceExtensionError extends DomainError {
  _kind = "error" as const;
  code = "InvalidBookSourceExtension" as const;
}

export class InvalidISBNError extends DomainError {
  _kind = "error" as const;
  code = "InvalidISBN" as const;
}

export class InvalidBookEditionError extends DomainError {
  _kind = "error" as const;
  code = "InvalidBookEdition" as const;
}

export class InvalidBookCoverError extends DomainError {
  _kind = "error" as const;
  code = "InvalidBookCover" as const;
}

export class InvalidBookYearError extends DomainError {
  _kind = "error" as const;
  code = "InvalidBookYear" as const;
}

export class InvalidBookDescriptionError extends DomainError {
  _kind = "error" as const;
  code = "InvalidBookDescription" as const;
}

export class InvalidBookAuthorNameError extends DomainError {
  _kind = "error" as const;
  code = "InvalidBookAuthorName" as const;
}

export type InvalidBookAuthorError = InvalidBookAuthorNameError;

export class InvalidBookCategoryNameError extends DomainError {
  _kind = "error" as const;
  code = "InvalidBookCategoryName" as const;
}

export type InvalidBookCategoryError = InvalidBookCategoryNameError;

export class InvalidBookTagNameError extends DomainError {
  _kind = "error" as const;
  code = "InvalidBookTagName" as const;
}

export type InvalidBookTagError = InvalidBookTagNameError;

export class InvalidBookContentChapterNameError extends DomainError {
  _kind = "error" as const;
  code = "InvalidBookContentChapterName" as const;
}
export class InvalidBookContentSectionNameError extends DomainError {
  _kind = "error" as const;
  code = "InvalidBookContentSectionName" as const;
}

export type InvalidBookContentError = InvalidBookContentChapterNameError | InvalidBookContentSectionNameError;

export class BookNotFoundError extends DomainError {
  _kind = "error" as const;
  code = "BookNotFound" as const;
}

//#region Author
export class InvalidAuthorFirstNameError extends DomainError {
  _kind = "error" as const;
  code = "InvalidAuthorFirstName" as const;
}

export class InvalidAuthorLastNameError extends DomainError {
  _kind = "error" as const;
  code = "InvalidAuthorLastName" as const;
}

export class InvalidAuthorImageError extends DomainError {
  _kind = "error" as const;
  code = "InvalidAuthorImage" as const;
}
//#endregion Author

//#region Learning Path
export class InvalidLearningPathTitleError extends DomainError {
  _kind = "error" as const;
  code = "InvalidLearningPathTitle" as const;
}
export class InvalidLearningPathInitialDateError extends DomainError {
  _kind = "error" as const;
  code = "InvalidLearningPathInitialDate" as const;
}
export class InvalidLearningPathResourceDurationError extends DomainError {
  _kind = "error" as const;
  code = "InvalidLearningPathResourceDuration" as const;
}
export class LearningPathNotFoundError extends DomainError {
  _kind = "error" as const;
  code = "LearningPathNotFound" as const;
}
//#endregion Learning Path

//#region Online Courses
export class InvalidCourseNameError extends DomainError {
  _kind = "error" as const;
  code = "InvalidCourseName" as const;
}
export class InvalidCourseClassNameError extends DomainError {
  _kind = "error" as const;
  code = "InvalidCourseClassName" as const;
}
export class InvalidCourseSectionNameError extends DomainError {
  _kind = "error" as const;
  code = "InvalidCourseSectionName" as const;
}
export type InvalidCourseContent = InvalidCourseSectionNameError | InvalidCourseClassNameError;

//#endregion Online Courses

//#region Online Courses
export class InvalidDocumentationTitleError extends DomainError {
  _kind = "error" as const;
  code = "InvalidDocumentationTitle" as const;
}

//#endregion Online Courses
