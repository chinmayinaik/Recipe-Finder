document.getElementById('recipe-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const ingredient = document.getElementById('ingredient-input').value;
    fetchRecipes(ingredient);
});

function fetchRecipes(ingredient) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data.meals);
            create3DScene(data.meals);
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
        });
}

function displayRecipes(recipes) {
    const recipeContainer = document.getElementById('recipe-container');
    recipeContainer.innerHTML = '';

    if (recipes) {
        recipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'recipe';
            recipeDiv.innerHTML = `
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
            `;
            recipeContainer.appendChild(recipeDiv);
        });
    } else {
        recipeContainer.innerHTML = '<p>No recipes found.</p>';
    }
}

function create3DScene(recipes) {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    recipes.forEach((recipe, index) => {
        const box = BABYLON.MeshBuilder.CreateBox(`box${index}`, { size: 1 }, scene);
        box.position = new BABYLON.Vector3(index * 2 - (recipes.length - 1), 0, 0);

        const material = new BABYLON.StandardMaterial(`material${index}`, scene);
        const texture = new BABYLON.Texture(recipe.strMealThumb, scene);
        material.diffuseTexture = texture;

        box.material = material;
    });

    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener('resize', () => {
        engine.resize();
    });
}
