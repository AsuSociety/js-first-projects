const mealsEl = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals");
const mealPopup = document.getElementById("meal-popup");
const mealInfoEl = document.getElementById("meal-info");
const popupCloseBtn = document.getElementById("close-popup");

const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");

/* immediate async func for initial the page, 
 to show a random meal and the favorit meals the user select */
(async function init() {
  fetchFavMeals();
  const randomMeal = await getRandomMeal();
  addMeal(randomMeal, true);
})();

/*async function that fetches a random recipe from the  recipes API,
parse the json response , and return one random meal,
 its in array because thats what the API returns  */
async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const respData = await resp.json();

  return respData.meals[0];
}

/*another async function that use API and get only the json,
but now its not randomly its by id*/
async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );

  const respData = await resp.json();
  return respData.meals[0];
}

/*another async function that use API and get only the json,
but now its not randomly its by name search,
return all the recipes with this name */
async function getMealsBySearch(term) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );

  const respData = await resp.json();
  return respData.meals;
}

/* appends a div with the new meal,
if the meal showed randomaly, its also print "random Recipe",
else, (showed by any search) show the recipe without the text "random..." */
function addMeal(mealData, random = false) {
  console.log(mealData);

  const meal = document.createElement("div");
  meal.classList.add("meal");

  meal.innerHTML = `
        <div class="meal-header">
            ${
              random
                ? `
            <span class="random"> Random Recipe </span>`
                : ""
            }
            <img
                src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"
            />
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `;

  // favorite button
  const btn = meal.querySelector(".meal-body .fav-btn");

  /* toggle a favorite meal , 
  by click on the favorite button  */
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeMealLS(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealLS(mealData.idMeal);
      btn.classList.add("active");
    }

    fetchFavMeals();
  });

  // by click on the meal its show the recipe
  meal.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  mealsEl.appendChild(meal);
}

/* This function adds the meal to the local storage */
function addMealLS(mealId) {
  const mealIds = getMealsLS();

  setMealsLS(JSON.stringify([...mealIds, mealId]));
}

/* This function removes the meal from the local storage */
function removeMealLS(mealId) {
  const mealIds = getMealsLS();

  setMealsLS(JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

const favoriteMealsLSKey = "mealIds";

// set the favorite meals array from the local storage
function setMealsLS(value) {
  localStorage.setItem(favoriteMealsLSKey, !value ? [] : value);
}

// get the favorite meals array from the local storage
function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem(favoriteMealsLSKey));

  return !mealIds ? [] : mealIds;
}

/* this function added all the favorite meals in a array */
async function fetchFavMeals() {
  // clean the container
  favoriteContainer.innerHTML = "";

  const mealIds = getMealsLS();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);

    addMealFav(meal);
  }
}

/* append a new HTML li to the list of the favorite meals */
function addMealFav(mealData) {
  const favMeal = document.createElement("li");

  favMeal.innerHTML = `
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        /><span>${mealData.strMeal}</span>
        <button class="clear"><i class="fas fa-window-close"></i></button>
    `;

  const btn = favMeal.querySelector(".clear");

  btn.addEventListener("click", () => {
    removeMealLS(mealData.idMeal);

    fetchFavMeals();
  });

  favMeal.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  favoriteContainer.appendChild(favMeal);
}

/* function to display the recipes of the meal the user click on */
function showMealInfo(mealData) {
  // clean it up
  mealInfoEl.innerHTML = "";

  // update the Meal info
  const mealEl = document.createElement("div");

  const ingredients = [];

  // get ingredients and measures
  for (let i = 1; i <= 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }

  // append new HTML div that show the info of the meal and the ingredients
  mealEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        />
        <p>
        ${mealData.strInstructions}
        </p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients
              .map(
                (ing) => `
            <li>${ing}</li>
            `
              )
              .join("")}
        </ul>
    `;

  mealInfoEl.appendChild(mealEl);

  // show the popup
  mealPopup.classList.remove("hidden");
}

searchBtn.addEventListener("click", async () => {
  // clean container
  mealsEl.innerHTML = "";

  const search = searchTerm.value;
  const meals = await getMealsBySearch(search);

  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal);
    });
  }
});

popupCloseBtn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});
