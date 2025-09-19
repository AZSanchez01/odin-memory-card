import styles from "./styles/Card.module.css";

export default function Card({ card, clickHandler }) {
  return (
    <li onClick={clickHandler}>
      <div className={styles.card}>
        <img src={card.image} alt={card.name} />
        {card.name}
      </div>
    </li>
  );
}
