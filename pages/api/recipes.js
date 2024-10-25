// pages/api/recipes.js
import axios from "axios";

const SPOONACULAR_API_KEY = "8ebba17d819f471ca2139d963798bf16";

export default async function handler(req, res) {
  const { ingredients } = req.query;

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${SPOONACULAR_API_KEY}&number=10`,
    );

    const recipes = response.data.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      ingredients: recipe.missedIngredients.map((item) => item.name),
      cookingTime: 30, // Assuming 30 minutes for now
      instructions: "", // Fetch instructions separately if needed
    }));

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Error fetching recipes" });
  }
}
