import { use, useEffect, useState } from "react";
import axios from "axios";

const MealDetails = ({ mealid, close }) => {
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    const fetchOne = async () => {
      const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealid}`);
      setMeal(res.data.meals[0]);
    };
    fetchOne();
  }, [mealid])

  if (!meal) return null

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing=meal[`strIngredient${i}`];
    const measure=meal[`strMeasure${i}`];
    if(ing && ing.trim() !=="") 
     {ingredients.push(`${measure} ${ing}`);}

  }

  return (
    <div className="modal show fade"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}>

        <div className="modal-dialog modal-lg modal-dialog-centered">

            <div className="modal-content">

                <div className="modal-header">
                    <h5 className="modal-title">{meal.strMeal}</h5>
                    <button type="button" className="btn-close" onClick={close}></button>
                </div>
                <div className="modal-body">
                    <img src={meal.strMealThumb} alt={meal.strMeal} className="mx-auto d-block w-50 rounded" />
                    <h4 className="mt-3">Ingredients:</h4>
                    <ul>
                        {ingredients.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    <h4 className="mt-3">Instructions:</h4>
                    <p>{meal.strInstructions}</p>
                    <h5>Youtube Tutorial</h5>
                    <a href={meal.strYoutube} target="_blank">{meal.strYoutube}</a>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={close}>Close</button>
                </div>
            </div>

        </div>

    </div>
  )

}

export default MealDetails;
