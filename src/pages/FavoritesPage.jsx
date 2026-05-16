import Favorites from "../Favorites";

export default function FavoritesPage({
  favorites,
  removeFavorite,
}) {
  return (
    <div className="container mt-4">
      <Favorites
        favorites={favorites}
        removeFavorite={removeFavorite}
      />
    </div>
  );
}