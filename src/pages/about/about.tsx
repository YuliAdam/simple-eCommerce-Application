import GitHubLogo from '@/assets/img/github-logo';
import styles from './about.module.scss';
const teamMembers = [
  {
    name: 'Konstantin Tarasov',
    role: 'Team Lead',
    bio: 'Loves board games, taking pictures.',
    description: 'Konstantin leads the team with a clear vision and strong organizational skills.',
    image: '/madsok.jpg',
    github: 'madsok',
  },
  {
    name: 'Yuliya Adamovich',
    role: 'Frontend Developer',
    bio: 'Loves Italy and engineering.',
    description:
      'Yuliya builds and maintains the core functionality of our platform — handling everything from product inventory systems to API interactions.',
    image: '/yuliadam.webp',
    github: 'YuliAdam',
  },
  {
    name: 'Nikolai Tabunov',
    role: 'UI/UX Designer & Frontend Developer',
    bio: 'Loves to talk a lot and tinker with UI design.',
    description:
      'Nikolai is responsible for crafting the look, feel, and usability of our website.',
    image: '/wingedseraph.JPG',
    github: 'wingedseraph',
  },
];

function About() {
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
                <p className={styles.memberDescription}>{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className={styles.schoolSection}>
        <h2 className={styles.schoolTitle}>Our School</h2>
        <div className={styles.schoolContent}>
          <p className={styles.schoolText}>
            All three of us met while attending RS School, where we were enrolled in a
            JavaScript/Front-end 2024Q4.
            <br /> <br /> Contrary to popular belief, Lorem Ipsum is not simply random text. It has
            roots in a piece of classical Latin literature from 45 BC, making it over 2000 years
            old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked
            up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and
            going through the cites of the word in classical literature, discovered the undoubtable
            source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et
            Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a
            treatise on the theory of ethics, very popular during the Renaissance. The first line of
            Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
          </p>
          <a target="_blank" rel="noopener noreferrer" href={`https://rs.school/`}>
            <img src="/RSSchoolLogo.png" alt="our school logo" className={styles.schoolImage} />
          </a>
        </div>
      </section>
    </div>
  );
}

export default About;
