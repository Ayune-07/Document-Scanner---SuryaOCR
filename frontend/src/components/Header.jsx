import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>◈</span>
        <span className={styles.logoText}>DocScan</span>
      </div>
      <span className={styles.tagline}>SuryaOCR · Multi-page document scanner</span>
    </header>
  )
}