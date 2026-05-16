import { useState } from "react";
import MealDetails from "./MealDetails.jsx";

export default function Favorites({ favorites, removeFavorite }) {

  const [mealID, setMealID] = useState(null);
  

  if (favorites.length === 0) {
    return (
      <div className="mt-5">
        <h3>No favorite meals yet ⭐</h3>
      </div>
    );
  }

  return (
    <div className="mt-5">

      <h2 className="mb-4 text-center">
        My Favorite Meals ⭐
      </h2>

      <div className="row">

        {favorites.map((meal) => (
          <div
            key={meal.id}
            className="col-md-4 col-lg-3 mb-4"
          >
            <div className="card shadow h-100">

              <img
                src={meal.image}
                className="card-img-top"
                style={{
                  objectFit: "cover",
                  height: "250px",
                }}
                alt={meal.name}
              />

              <div className="card-body d-flex flex-column">

                <h5 className="card-title">
                  {meal.name}
                </h5>

                <div className="card-text mb-3 justify-content-between d-flex">
                <button
                className="btn btn-info"
                onClick={() => setMealID(meal.id)}
                >
                  Details
                </button>

                <button
                  className="btn btn-danger mt-auto"
                  onClick={() => removeFavorite(meal.id)}
                >
                  Remove
                </button>

                </div>

              </div>
            </div>
          </div>
        ))}

        {mealID && <MealDetails mealid={mealID} close={() => setMealID(null)} />}
        

      </div>
    </div>
  );
}