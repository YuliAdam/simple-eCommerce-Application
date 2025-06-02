import GitHubLogo from '@/assets/img/github-logo';
import RSSchoolLogo from '@/assets/img/rsSchool-logo';
import styles from '@components/footer/footer.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a className={styles.link_basic} href="https://github.com/">
        <GitHubLogo className={styles.link_git_hub} />
      </a>
      <a className={styles.footer_title} href="https://github.com/madsok">
        {`@madsok/`}
      </a>
      <a className={styles.footer_title} href="https://github.com/YuliAdam">
        {`@YuliAdam/`}
      </a>
      <a className={styles.footer_title} href="https://github.com/wingedseraph">
        {`@wingedseraph`}
      </a>
      <p className={styles.footer_title}>{`/2025/RSchool`}</p>
      <a className={styles.link_basic} href="https://rs.school/courses/javascript-ru">
        <RSSchoolLogo className={styles.link_rs_school} />
      </a>
    </footer>
  );
}
