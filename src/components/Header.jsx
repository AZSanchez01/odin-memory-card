import styles from "./styles/Header.module.css";

export default function Header({ currScore, bestScore }) {
  return (
    <header>
      <div className={styles.title}>Poke-Memory Card!</div>
      <div className={styles.scores}>
        Score: {currScore} <br />
        Best Score: {bestScore}
      </div>
    </header>
  );
}
