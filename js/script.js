
let currentQuestionIndex = 0;
let selectedOptions = [];
const DURATION_TO_RESET_FORM = 1200; // 20 min in seconds
const QUESTIONS = [
  {
    question: "Uso Siroko desde...",
    options: ["2016", "2017", "2018", "2019", "2020", "2021"]
  },
  {
    question: "Por unas gafas siroko, yo...",
    options: [
      "Segaría a navaja",
      "Rechazaría un cachopo",
      "Renunciaría a mis tierras",
      "Regalaría una ternera"
    ]
  }
];

const questionsContainer = document.getElementById('questions-container');
const questionDescription = document.getElementById('question-description');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const quizStepElement = document.getElementById('quiz-step');
const quizTitleElement = document.getElementById('quiz-title');
const quizDescriptionElement = document.getElementById('quiz-description');
const generatedCodeElement = document.getElementById('generated-code');
const lastStepContainer = document.getElementById('last-step-container');
const timerElement = document.getElementById('timer');
const timerContainer = document.getElementById('timer-container');
const timerExpiredContainer = document.getElementById('timer-expired-container');

/**
 * "This function will generate the question and options using the question object received as a parameter.
 */
function generateQuestionForm(question) {
  questionDescription.textContent = question.question;
  optionsElement.innerHTML = '';

  question.options.forEach((option, index) => {
    const li = document.createElement('li');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'option';
    input.id = `option${index}`;
    input.value = index;

    const label = document.createElement('label');
    label.htmlFor = `option${index}`;
    label.classList.add('icon-label');

    const iconUnselected = document.createElement('span');
    iconUnselected.classList.add('icon-unselected');

    const iconSelected = document.createElement('span');
    iconSelected.classList.add('icon-selected');

    const optionContent = document.createElement('span');
    optionContent.textContent = option;

    label.appendChild(iconUnselected);
    label.appendChild(iconSelected);
    label.appendChild(optionContent);

    input.addEventListener('change', () => {
      nextButton.disabled = false;
      selectedOptions[currentQuestionIndex] = option;
    });

    li.appendChild(input);
    li.appendChild(label);
    
    optionsElement.appendChild(li);
  });

  quizStepElement.textContent = `Paso ${currentQuestionIndex + 1} de ${QUESTIONS.length}`;
}

function showNextQuestion() {
  
  currentQuestionIndex++;

  if (currentQuestionIndex < QUESTIONS.length) {
    generateQuestionForm(QUESTIONS[currentQuestionIndex]);
    nextButton.disabled = true;              
    if (currentQuestionIndex === QUESTIONS.length - 1) {
      quizTitleElement.textContent = "VAMOS, UNA MÁS";
      quizDescriptionElement.style.display = 'none';
    }
  } else {
    quizTitleElement.textContent = "¡ENHORABUENA!";
    quizStepElement.textContent = "Tu premio está listo";
    generateCode();
    showLastStepScreen();
  }
}

function generateCode() {
  const firstAnswer = selectedOptions[0];
  const secondAnswer = selectedOptions[1];

  const yearSum = firstAnswer.slice(-2).split('').reduce((sum, num) => sum + parseInt(num), 0);
  const lastFourLetters = secondAnswer.replace(/ /g, '').replace(/[aA]/g, '').slice(-4).toUpperCase();

  const generatedCode = `${yearSum}${lastFourLetters}`;
  generatedCodeElement.textContent = generatedCode;
  questionsContainer.style.display = 'none';

}

function showLastStepScreen() {
  lastStepContainer.style.display = 'block';
  startTimer();
}

/**
 * Function that shows a timer starting from X minutes before displaying the option to reset the quiz form.
 */
function startTimer() { 
  let timer = DURATION_TO_RESET_FORM, minutes, seconds;
  const interval = setInterval(() => {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElement.textContent = `${minutes}:${seconds}`;

    if (--timer < 0) {
      timerContainer.style.display = 'none';
      timerExpiredContainer.style.display = 'block';
      clearInterval(interval);
    }
  }, 1000);
}

function copyToClipboard() {
  navigator.clipboard.writeText(generatedCodeElement.textContent)
  .then(() => {
    const alertBox = document.getElementById('customAlert');
    alertBox.style.display = 'block';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000); // Hide after 3 seconds
    
    //alert('Texto copiado al portapapeles');
  })
  .catch(err => {
    console.error('Error al copiar el texto: ', err);
  });
}

function resetQuiz() {
  window.location.reload();
}

nextButton.addEventListener('click', showNextQuestion);

// Initialize quiz
generateQuestionForm(QUESTIONS[currentQuestionIndex]);
