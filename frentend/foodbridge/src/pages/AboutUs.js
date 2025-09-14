import React from 'react';
import { Fade, Slide } from 'react-awesome-reveal';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Meals Delivered', value: 12500, emoji: '🍽️' },
  { label: 'Active Donors', value: 430, emoji: '🤝' },
  { label: 'Verified NGOs', value: 120, emoji: '🏢' },
];

const AboutUs = () => {
  return (
    <section className="about-section" style={styles.section}>
      <div className="container" style={styles.container}>

        <Fade cascade triggerOnce>
          <h1 style={styles.title}>About FoodBridge <span role="img" aria-label="bowl">🍲</span></h1>
          <p style={styles.subtitle}>Connecting Food Donors with the Needy</p>
        </Fade>

        <div style={styles.gridContainer}>

          <Slide direction="left" triggerOnce>
            <div style={styles.imageWrapper}>
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
                alt="Food Donation"
                style={styles.image}
              />
            </div>
          </Slide>

          <Slide direction="right" triggerOnce>
            <div style={styles.content}>

              <h2 style={styles.heading}>Why FoodBridge?</h2>
              <p style={styles.paragraph}>
                Every year, tons of food go to waste while millions sleep hungry. At <strong>FoodBridge</strong>, 
                we strive to close this gap by connecting generous donors with those who need help the most. 
                Our platform ensures food reaches the right hands safely and on time.
              </p>

              <h3 style={{ marginTop: '2rem' }}>What We Do <span role="img" aria-label="rocket">🚀</span></h3>
              <ul>
                <li>Connect food donors with verified NGOs.</li>
                <li>Ensure timely and hygienic food distribution.</li>
                <li>Raise awareness to reduce food wastage.</li>
              </ul>

              <div style={styles.statsContainer}>
                {stats.map(({ label, value, emoji }) => (
                  <div key={label} style={styles.statBox}>
                    <span style={styles.statEmoji}>{emoji}</span>
                    <h3 style={styles.statValue}>
                      <CountUp end={value} duration={3} separator="," />
                    </h3>
                    <p style={styles.statLabel}>{label}</p>
                  </div>
                ))}
              </div>

              <Link to="/register" style={styles.ctaButton}>Become a Donor</Link>

            </div>
          </Slide>

        </div>
      </div>
    </section>
  );
};

const styles = {
  section: {
    background: 'linear-gradient(135deg, #f0f9ff 0%, #a1c4fd 100%)',
    padding: '60px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '3rem',
    color: '#2f855a',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#4a5568',
    marginBottom: '2rem',
  },
  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '40px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    flex: '1 1 400px',
    textAlign: 'center',
  },
  image: {
    maxWidth: '100%',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
  },
  content: {
    flex: '1 1 400px',
  },
  heading: {
    fontSize: '2rem',
    color: '#276749',
    marginBottom: '1rem',
  },
  paragraph: {
    fontSize: '1.125rem',
    lineHeight: '1.6',
    color: '#2d3748',
  },
  statsContainer: {
    marginTop: '2.5rem',
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  statBox: {
    flex: '1 1 150px',
    backgroundColor: '#e6fffa',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(38, 166, 154, 0.3)',
  },
  statEmoji: {
    fontSize: '2.5rem',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    marginTop: '8px',
    color: '#234e52',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#234e52',
    marginTop: '4px',
  },
  ctaButton: {
    marginTop: '3rem',
    display: 'inline-block',
    backgroundColor: '#38a169',
    color: '#fff',
    padding: '12px 30px',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '1.125rem',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease',
  },
};


export default AboutUs;
