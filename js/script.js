const searchBtn = document.querySelector('#search-btn');
const mealList = document.querySelector('#meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.querySelector('#recipe-close-btn');

// EVENT LISTENERS
searchBtn.addEventListener('click', getMealList);
document.addEventListener('keyup', e => {
    if (document.querySelector('#search-input').value.trim() !== '') {
        if (e.keyCode === 13) {
            getMealList();
        }
    }
})
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
})
// mealList.addEventListener('click', getMealRecipe);

// GET MEAL LIST THAT MATCHES WITH THE INGREDIENTS
function getMealList() {
    let searchInputTxt = document.querySelector('#search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(res => res.json())
        .then(data => {
            let html = ``;
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.idMeal}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.strMeal}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `
                })
                mealList.classList.remove('notFound');
            } else {
                html = `Sorry, we didn't find any "${searchInputTxt}" meal`;
                mealList.classList.add('notFound');
            }
            mealList.innerHTML = html;
        })
}

// GET MEAL RECIPE 
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(res => res.json())
            .then(data => mealRecipeModel(data.meals));
    }
}

// MEAL RECIPE MODEL
function mealRecipeModel(meal) {
    meal = meal[0];
    let html = `
                <h2 class="recipe-title">${meal.strMeal}</h2>
                        <p class="recipe-category">${meal.strCategory}</p>
                        <div class="recipe-instruct">
                            <h3>Instructions:</h3>
                            <p>${meal.strInstructions}</p>
                        </div>
                        <div class="recipe-meal-img">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        </div>
                        <div class="recipe-link">
                            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
                        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}