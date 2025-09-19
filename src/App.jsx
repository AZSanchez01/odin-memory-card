import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header.jsx";
import Card from "./components/Card.jsx";

function App() {
  //List of starter pokemon names
  const pokemonList = [
    "bulbasaur",
    "charmander",
    "squirtle",
    "pikachu",
    "chikorita",
    "cyndaquil",
    "totodile",
    "treecko",
    "torchic",
    "mudkip",
    "turtwig",
    "chimchar",
    "piplup",
    "snivy",
    "tepig",
    "oshawott",
    "chespin",
    "fennekin",
    "froakie",
    "rowlet",
    "litten",
    "popplio",
    "grookey",
    "scorbunny",
    "sobble",
    "sprigatito",
    "fuecoco",
    "quaxly",
  ];

  //SCORE USESTATES AND FUNCTIONS
  const [currScore, setCurrScore] = useState(0);
  const incrementScore = function () {
    setCurrScore((prevScore) => prevScore + 1);
  };
  const resetCurrScore = function () {
    setCurrScore((prevScore) => 0);
  };

  const [bestScore, setBestScore] = useState(0);
  const updateBestScore = function (score) {
    setBestScore(score);
  };

  //CARD LIST FUNCTIONS
  const [cardsList, setCardsList] = useState([]);
  const addCard = function (id, name, image) {
    setCardsList((prevCards) => [
      ...prevCards,
      { id, name, flipped: false, image },
    ]);
  };
  const resetCardsList = function () {
    setCardsList((prevCardsList) =>
      prevCardsList.map((card) => ({ ...card, flipped: false }))
    );
  };
  const shuffleCardsList = function () {
    setCardsList((prevCardsList) => shuffleList(prevCardsList));
  };
  const flipCard = function (id) {
    setCardsList((prevCardsList) =>
      prevCardsList.map((card) =>
        card.id === id ? { ...card, flipped: true } : card
      )
    );
  };

  //CLICK HANDLER
  const clickHandler = function (id) {
    const selectedCard = cardsList.find((card) => card.id === id);
    if (!selectedCard.flipped) {
      incrementScore();
      flipCard(id);
    } else {
      resetCurrScore();
      resetCardsList();
    }
  };

  //Creation of cardsList data with PokeAPI
  useEffect(() => {
    // Create Cards List
    const controller = new AbortController();
    async function createCardsList(pokemonList) {
      const fetchPromises = pokemonList.map(async (pokemon) => {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon}/`,
          { mode: "cors", signal: controller.signal }
        );
        const pokeData = await response.json();
        return {
          id: pokeData.id,
          name: pokeData.name,
          image: pokeData.sprites.front_default,
        };
      });

      try {
        const pokeDataResults = await Promise.all(fetchPromises);
        setCardsList(
          pokeDataResults.map(({ id, name, image }) => ({
            id,
            name,
            image,
            flipped: false,
          }))
        );
      } catch (error) {
        if (error.name !== "AbortError")
          console.error(
            "Apologies Trainer! We're unable to fetch pokemon data at this time..."
          );
      }
    }
    createCardsList(pokemonList);

    //Cleaner function
    return () => {
      controller.abort();
    };
  }, []);

  // TRACK/RENDER SCORE ONLY ON CURRSCORE CHANGE
  useEffect(() => {
    if (currScore > bestScore) updateBestScore(currScore);
  }, [currScore]);

  // SHUFFLE CARDS ON EACH RENDER
  useEffect(() => {
    shuffleCardsList();
  }, [currScore]);
  return (
    <>
      <Header currScore={currScore} bestScore={bestScore} />
      <main>
        <p>Get points by clicking a pokemon card not more than once!</p>
        <ul className="cards-list">
          {cardsList.map((card) => {
            return (
              <Card
                key={card.id}
                card={card}
                clickHandler={() => clickHandler(card.id)}
              />
            );
          })}
        </ul>
      </main>
    </>
  );
}

export default App;

// HELPER FUNCTIONS
function shuffleList(list) {
  let copyList = [...list]; // Clone list to avoid mutating directly
  let currIndex = copyList.length;
  let randIndex;
  while (currIndex !== 0) {
    randIndex = Math.floor(Math.random() * currIndex);
    currIndex--;
    let temp = copyList[currIndex];
    copyList[currIndex] = copyList[randIndex];
    copyList[randIndex] = temp;
  }
  return copyList;
}
