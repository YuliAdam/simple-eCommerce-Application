import Hero from './components/hero/hero';
import styles from './index.module.scss';

function Index() {
  return (
    <div className={styles.container}>
      <Hero />
    </div>
  );
}

export default Index;
