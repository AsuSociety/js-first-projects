const quizData = [
  {
    question: "How old is Omer?",
    a: "20",
    b: "27",
    c: "26",
    d: "30",
    correct: "c",
  },
  {
    question: "What is the the most used programming language in 2020?",
    a: "Java",
    b: "Python",
    c: "C",
    d: "JavaScript",
    correct: "b",
  },
  {
    question: "How many engineering colleges in Israel?",
    a: "10",
    b: "7",
    c: "9",
    d: "12",
    correct: "a",
  },
  {
    question: "Who is the Prime Minister of Israel?",
    a: "Benjamin Netanyahu",
    b: "Omer Adam",
    c: "Benny Gantz",
    d: "Naftali Bennett",
    correct: "d",
  },
  {
    question: "How many models does the iPhone have?",
    a: "27",
    b: "32",
    c: "25",
    d: "29",
    correct: "d",
  },
];

const answerEls = document.querySelectorAll(".answer");
const questionEi = document.getElementById("question");
const quiz = document.getElementById("quiz");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitBtn = document.getElementById("submit");

let currentQuiz = 0;
let score = 0;

loadQuiz();

function loadQuiz() {
  deselectAnswers();

  const currentQuizData = quizData[currentQuiz];

  questionEi.innerText = currentQuizData.question;
  a_text.innerText = currentQuizData.a;
  b_text.innerText = currentQuizData.b;
  c_text.innerText = currentQuizData.c;
  d_text.innerText = currentQuizData.d;
}

function getSelected() {
  let answer = undefined;

  answerEls.forEach((answerEl) => {
    if (answerEl.checked) {
      answer = answerEl.id;
    }
  });

  return answer;
}

function deselectAnswers() {
  answerEls.forEach((answerEl) => {
    answerEl.checked = false;
  });
}

submitBtn.addEventListener("click", () => {
  const answer = getSelected();

  if (answer) {
    if (answer === quizData[currentQuiz].correct) {
      score++;
    }

    currentQuiz++;

    if (currentQuiz < quizData.length) {
      loadQuiz();
    } else {
      quiz.innerHTML = `<h2>You answered correctly at ${score}/${quizData.length}
      questions.</h2><button onclick="location.reload()">Reload</button`;
    }
  }
});
