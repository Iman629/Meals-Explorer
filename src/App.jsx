import axios from "axios";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import MealDetails from "./MealDetails.jsx";
import Auth from "./Auth";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";

import { doc, setDoc, getDoc } from "firebase/firestore";

import { Routes, Route, Link } from "react-router-dom";
import FavoritesPage from "./pages/FavoritesPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showAuth, setShowAuth] = useState(false);

  const [meal, setMeal] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [mealID, setMealID] = useState(null);


  useEffect(() => {
    fetchMeals("chicken");
    fetchCategories();
  }, []);

  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) fetchFavorites(u.uid);
      else setFavorites([]);
    });

    return () => unsub();
  }, []);

 
  const fetchMeals = async (query) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`,
      );
      setMeal(res.data.meals || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/list.php?c=list`,
    );
    setCategories(res.data.meals);
  };

  const fetchByCategory = async (category) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
      );
      setMeal(res.data.meals || []);
    } finally {
      setLoading(false);
    }
  };


  const fetchFavorites = async (uid) => {
    const ref = doc(db, "favorites", uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setFavorites(snap.data().items || []);
    } else {
      await setDoc(ref, { items: [] });
      setFavorites([]);
    }
  };

  const addFavorite = async (meal) => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    const ref = doc(db, "favorites", user.uid);

    const newItem = {
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
    };

    const updated = [...favorites, newItem];

    await setDoc(ref, { items: updated });
    setFavorites(updated);
  };

  const removeFavorite = async (mealId) => {
    const ref = doc(db, "favorites", user.uid);

    const updated = favorites.filter((m) => m.id !== mealId);

    await setDoc(ref, { items: updated });
    setFavorites(updated);
  };

  const isFavorite = (id) => {
    return favorites.some((f) => f.id === id);
  };

  const toggleFavorite = (meal) => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    if (isFavorite(meal.idMeal)) {
      removeFavorite(meal.idMeal);
    } else {
      addFavorite(meal);
    }
  };

  return (
    <>
      <div className="container my-4">
        
        <div className="d-flex justify-content-between mb-3">
          <div>
            {user && (
              <>
                <Link className="btn btn-outline-dark me-2" to="/">
                  Meals
                </Link>

                <Link className="btn btn-outline-warning" to="/favorites">
                  Favorites ★ ({favorites.length})
                </Link>
              </>
            )}
          </div>

          <div>
            {!user ? (
              <button
                className="btn btn-primary"
                onClick={() => setShowAuth(true)}
              >
                Login / Signup
              </button>
            ) : (
              <>
                <span className="me-2 fw-bold">Hello {user.displayName}</span>

                <button
                  className="btn btn-danger"
                  onClick={() => signOut(auth)}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        <Routes>

          <Route
            path="/"
            element={
              <>
                <h1 className="text-center mb-4">Meals Explorer</h1>

                <div className="row shadow p-3 mb-5 bg-body rounded">
                  <div className="col-md-6 mb-2">
                    <input
                      className="form-control"
                      placeholder="Search meals..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        fetchMeals(e.target.value);
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        fetchByCategory(e.target.value);
                      }}
                    >
                      <option value="">Filter By Categories</option>
                      {categories.map((c, i) => (
                        <option key={i} value={c.strCategory}>
                          {c.strCategory}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {loading && <h3>Loading...</h3>}

                <div className="row">
                  {meal.map((m) => (
                    <div key={m.idMeal} className="col-md-4 col-lg-3 mb-4">
                      <div className="card shadow h-100">
                        <img
                          src={m.strMealThumb}
                          className="card-img-top"
                          style={{ objectFit: "cover", height: "250px" }}
                          alt={m.strMeal}
                        />

                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{m.strMeal}</h5>

                          <div className="mt-auto d-flex justify-content-between">
                            <button
                              className="btn btn-info"
                              onClick={() => setMealID(m.idMeal)}
                            >
                              Details
                            </button>

                            <button
                              className="btn btn-secondary"
                              onClick={() => toggleFavorite(m)}
                            >
                              {isFavorite(m.idMeal) ? "★" : "☆"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            }
          />

          <Route
            path="/favorites"
            element={
              user ? (
                <FavoritesPage
                  favorites={favorites}
                  removeFavorite={removeFavorite}
                />
              ) : (
                <div className="text-center mt-5">
                  <h3>Please login to view favorites</h3>
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => setShowAuth(true)}
                  >
                    Login / Signup
                  </button>
                </div>
              )
            }
          />
        </Routes>
      </div>

      
      {mealID && <MealDetails mealid={mealID} close={() => setMealID(null)} />}

      {showAuth && <Auth setUser={setUser} close={() => setShowAuth(false)} />}
    </>
  );
}
