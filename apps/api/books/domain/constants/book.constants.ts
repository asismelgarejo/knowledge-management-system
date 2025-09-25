export const BookValidationConstants = {
  YEAR: {
    MIN: 1450,
    MAX: 3000,
  },
  TITLE: {
    MAX_LENGTH: 500,
  },
  DESCRIPTION: {
    MIN_LENGTH: 1,
  },
  EDITION: {
    MIN: 1,
  },
} as const;

/**
 * Types of content that can be contained within a book
 */
export enum BookContentTypes {
  /** Individual chapter within a book */
  CHAPTER = "BOOK_CHAPTER",
  /** Section containing multiple chapters */
  SECTION = "BOOK_SECTION",
}

/**
 * Supported file extensions for book sources
 */
export enum BookExtensionsTypes {
  /** PDF document format */
  pdf = "pdf",
  /** EPUB electronic publication format */
  epub = "epub",
}

export enum BookTypes {
  SECTION_CHAPTER = "section-chapter", // seccion-capitulo
  CHAPTER_ONLY = "chapter-only", // solo-capitulo
  UNIT_LESSON = "unit-lesson", // unidad-leccion
  MODULE = "module", // modulo
  TOPIC = "topic", // tema-topico
  ENTRY_ARTICLE = "entry-article", // entrada-articulo
  ACT_ARC = "act-arc", // arco-acto
  CASE_STUDY = "case-study", // pregunta-caso-estudio
  PRACTICE_EXERCISE = "practice-exercise", // practica-ejercicio
  VOLUME = "volume", // volumen
  INDEPENDENT_STORY = "independent-story", // relato-independiente
  TIMELINE = "timeline", // cronologia
  ALPHABETICAL = "alphabetical", // alfabetico
  MANUAL_REFERENCE = "manual-reference", // manual-referencia
  MAP_DIAGRAM = "map-diagram", // mapa-diagrama
}
