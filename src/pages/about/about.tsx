import GitHubLogo from '@/assets/img/github-logo';
import styles from './about.module.scss';
function About() {
  const teamMembers = [
    {
      name: 'Konstantin Tarasov',
      role: 'Team Lead',
      description:
        'Konstantin leads the team with a clear vision and strong organizational skills.',
      image: 'https://cdn.cosmos.so/e66aa4ae-7f4b-43e2-a359-dcaa7b7caec7?format=jpeg',
      github: 'madsok',
    },
    {
      name: 'Yuliya Adamovich',
      role: 'Frontend Developer',
      description:
        'Yuliya builds and maintains the core functionality of our platform — handling everything from product inventory systems to API interactions.',
      image: 'https://cdn.cosmos.so/e66aa4ae-7f4b-43e2-a359-dcaa7b7caec7?format=jpeg',
      github: 'YuliAdam',
    },
    {
      name: 'Nikolai Tabunov',
      role: 'UI/UX Designer & Frontend Developer',
      description:
        'Nikolai is responsible for crafting the look, feel, and usability of our website.',
      image: 'https://cdn.cosmos.so/e66aa4ae-7f4b-43e2-a359-dcaa7b7caec7?format=jpeg',
      github: 'wingedseraph',
    },
  ];

  return (
    <div className={styles.aboutContainer}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          About
          <br />
          Our Shop
        </h1>
        <p className={styles.heroSubtitle}>
          At Simple, we believe that style doesn’t have to be complicated. Our mission is to bring
          minimalistic, high-quality, and affordable clothing to those who appreciate clean designs
          and comfort without sacrificing individuality.
        </p>
      </div>

      <div className={styles.mainContent}>
        <section className={styles.mainSection}>
          <h2 className={styles.sectionTitle}>Who's Working</h2>

          <div className={styles.teamList}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.teamMember}>
                <img
                  src={member.image || '/placeholder.svg'}
                  alt={member.name}
                  className={styles.memberImage}
                />
                <div className={styles.memberContainer}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://github.com/${member.github}`}
                  >
                    <GitHubLogo className={styles.memberGithubLink} />
                  </a>
                </div>
                <p className={styles.memberRole}>{member.role}</p>
                <p className={styles.memberDescription}>{member.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className={styles.schoolSection}>
        <div className={styles.schoolContent}>
          <div>
            <h2 className={styles.schoolTitle}>Our School</h2>
            <p className={styles.schoolText}>
              All three of us met while attending RS School, where we were enrolled in a
              JavaScript/Front-end 2024Q4.
            </p>
          </div>
          <img src="/RSSchoolLogo.png" alt="our school logo" className={styles.schoolImage} />
        </div>
      </section>
    </div>
  );
}

export default About;
