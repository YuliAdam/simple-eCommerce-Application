import GitHubLogo from '@/assets/img/github-logo';
import RSSchoolLogo from '@/assets/img/rsSchool-logo';
import styles from '@components/footer/footer.module.scss';

const GITHUBS_LINKS = [
  { href: 'https://github.com/madsok', text: '@madsok/' },
  { href: 'https://github.com/YuliAdam', text: '@YuliAdam/' },
  { href: 'https://github.com/wingedseraph', text: '@wingedseraph' },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a className={styles.link_basic} href="https://github.com/">
        <GitHubLogo className={styles.link_git_hub} />
      </a>
      {GITHUBS_LINKS.map(item => {
        return (
          <a key={item.text} className={styles.footer_title} href={item.href}>
            {item.text}
          </a>
        );
      })}
      <p className={styles.footer_title}>{`/2025/RSchool`}</p>
      <a className={styles.link_basic} href="https://rs.school/courses/javascript-ru">
        <RSSchoolLogo className={styles.link_rs_school} />
      </a>
    </footer>
  );
}
