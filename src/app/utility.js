export function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export const getUTCDate = (dateString = Date.now()) => {
  const date = new Date(dateString);

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
};

export const mergeFunctionWithId = (inputArray) => {
  console.log("inputArray", inputArray);

  var mergedArragy = [...inputArray];
  for (var i = 0; i < mergedArragy.length; ++i) {
    for (var j = i + 1; j < mergedArragy.length; ++j) {
      if (mergedArragy[i].id === mergedArragy[j].id)
        mergedArragy.splice(j--, 1);
    }
  }
  console.log("mergedArragy", mergedArragy);
  return mergedArragy;
};

export const getQuestionLink = (category, subCategory, questionId) => {
  var newSubCategory = "";
  switch (subCategory) {
    case "ReadAloud":
      newSubCategory = "read-aloud";
      break;
    case "RepeatSentence":
      newSubCategory = "repeat-sentence";
      break;
    case "DescribeImage":
      newSubCategory = "describe-image";
      break;
    case "RetellLecture":
      newSubCategory = "retell-lecture";
      break;
    case "AnswerShortQuestion":
      newSubCategory = "answer-short-question";
      break;
    case "SummarizeWrittenText":
      newSubCategory = "summarize-written-text";
      break;
    case "WriteEssay":
      newSubCategory = "write-essay";
      break;
    case "ReadingMultipleChoiceSingleAnswer":
      newSubCategory = "multiple-choice-single-answer";
      break;
    case "ReadingMultipleChoiceMultipleAnswer":
      newSubCategory = "multiple-choice-multiple-answer";
      break;
    case "ReorderParagraph":
      newSubCategory = "reorder-paragraph";
      break;
    case "ReadingFillInTheBlanks":
      newSubCategory = "r-fill-in-the-blanks";
      break;
    case "ReadingAndWritingFillInTheBlanks":
      newSubCategory = "rw-fill-in-the-blanks";
      break;
    case "SummarizeSpokenText":
      newSubCategory = "summarize-spoken-text";
      break;
    case "ListeningMultipleChoiceSingleAnswer":
      newSubCategory = "multiple-choice-single-answer";
      break;
    case "ListeningMultipleChoiceMultipleAnswer":
      newSubCategory = "multiple-choice-multiple-answer";
      break;
    case "ListeningFillInTheBlanks":
      newSubCategory = "fill-in-the-blanks";
      break;
    case "HighlightCorrectSummary":
      newSubCategory = "highlight-correct-summary";
      break;
    case "SelectMissingWord":
      newSubCategory = "select-missing-word";
      break;
    case "HighlightIncorrectWords":
      newSubCategory = "highlight-incorrect-words";
      break;
    case "WriteFromDictation":
      newSubCategory = "write-from-dictation";
      break;
    default:
      break;
  }

  const link = `/${category.toLowerCase()}/${newSubCategory}/${questionId}/edit`;

  return link;
};

const getYoutubeVideoId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
};

const getVimeoVideoId = (url) => {
  const regExp = /https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
  const match = url.match(regExp);
  return match ? match[2] : false;
};

export const parseVideoUrlToIframe = (url) => {
  const youtubeVideoId = getYoutubeVideoId(url);
  if (youtubeVideoId) {
    return `https://www.youtube.com/embed/${youtubeVideoId}`;
  }

  const vimeoVideoId = getVimeoVideoId(url);
  if (vimeoVideoId) {
    return `https://player.vimeo.com/video/${vimeoVideoId}?title=0&byline=0&portrait=0`;
  }

  return url;
};
