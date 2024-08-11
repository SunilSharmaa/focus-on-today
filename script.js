const container = document.querySelector(".container");
const checkboxList = document.querySelectorAll(".checkbox");
const inputList = document.querySelectorAll("input[type='text']");
const errorText = document.getElementById("error-text");
const progressValue = document.querySelector(".progress-value");
const progressValueText = document.querySelector(".progress-value-text");
const motivationQuote = document.querySelector(".motivation-quote");
const quotesCollection = [
  "Raise the bar by completing your goals!",
  "Well begun is half done!",
  "Just a step away, keep going!",
  "Whoa! You just completed all the goals, time for chill :D",
];
const defaultQuote = "Well done!";

let allGoals = JSON.parse(localStorage.getItem("allGoals")) || {};

let allGoalsArray = Object.values(allGoals);
let taskCompletedCount = allGoalsArray.filter(
  (input) => input.isCompleted
).length;

function updateData() {
  allGoalsArray = Object.values(allGoals);
  taskCompletedCount = allGoalsArray.filter(
    (input) => input.isCompleted
  ).length;
}

updateProgress();

function updateProgress() {
  const progressWidth = `${(taskCompletedCount / inputList.length) * 100}%`;
  const visibility = taskCompletedCount === 0 ? "hidden" : "visible";

  document.documentElement.style.setProperty("--progress-width", progressWidth);
  document.documentElement.style.setProperty("--visibility", visibility);

  if (taskCompletedCount === 0) {
    progressValueText.innerText = ``;
    motivationQuote.innerText = quotesCollection[taskCompletedCount];
  } else {
    progressValueText.innerText = `${taskCompletedCount}/${inputList.length} completed`;
    motivationQuote.innerText =
      quotesCollection[taskCompletedCount] || defaultQuote;
  }
}

// Function to check if all inputs have values
function allInputsFilled() {
  return [...inputList].every((input) => input.value.trim() !== "");
}

// Event listener for checkboxes
checkboxList.forEach((checkbox) => {
  checkbox.addEventListener("click", (e) => {
    if (allInputsFilled()) {
      e.target.classList.toggle("tick");
      allGoals[e.target.nextElementSibling.id].isCompleted =
        !allGoals[e.target.nextElementSibling.id].isCompleted;
      updateData();
      updateProgress();
      localStorage.setItem("allGoals", JSON.stringify(allGoals));
    } else {
      errorText.classList.add("error-msg");
      setTimeout(() => {
        errorText.classList.remove("error-msg");
      }, 4000);
    }
  });
});

// Event listener for inputs
inputList.forEach((input) => {
  if (allGoals[input.id]) {
    input.value = allGoals[input.id].task;
  }

  if (allGoals[input.id]?.isCompleted) {
    input.previousElementSibling.classList.add("tick");
  }

  input.addEventListener("focus", () => {
    errorText.classList.remove("error-msg");
  });

  input.addEventListener("input", () => {
    if (allGoals[input.id]?.isCompleted) {
      input.value = allGoals[input.id].task;
      return;
    }

    allGoals[input.id] = {
      task: input.value,
      isCompleted: false,
    };
    updateData();
    localStorage.setItem("allGoals", JSON.stringify(allGoals));
  });
});
