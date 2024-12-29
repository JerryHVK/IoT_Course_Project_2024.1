import React from "react";
import Sensor from '../sensor.jpg';

const AboutSystem = () => {
  return (
    <div style={styles.container}>
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

// Header Component
function Header() {
  return (
    <header style={styles.header}>
      <h1>Health Monitoring System</h1>
    </header>
  );
}

// Main Content Component
function MainContent() {
  return (
    <section style={styles.section}>
      <h2>Overview</h2>
      
      <p>
        This system enable continuous monitoring, real-time data collection, and integration with cloud-based services to
        provide actionable insights.
      </p>
      <h2>Project Objective</h2>
      <p>
        This project, titled <strong>“Health Monitoring System”</strong>, aims to develop a web-based application that
        facilitates user health management by integrating IoT devices with modern web technologies.
      </p>
      <h2>Key Features</h2>
      <ul>
        <li>Use of the ESP32 sensor to collect and transmit health-related data.</li>
        <li>Web application for viewing health statistics and managing devices.</li>
        <li>Real-time notifications for a seamless and user-friendly experience.</li>
      </ul>
      <h2>Sensor</h2>
      <img src={Sensor}  />
      <p>
        The ESP32 sensor is a versatile and powerful device used in this system to collect essential health-related data such
        as heart rate, temperature, and oxygen levels. It transmits this data in real-time to ensure accurate monitoring and
        analysis.
      </p>
      <h2>Web Application</h2>
      <div>Requirement
        <p>
          Users need to log in their account before using this app. If not then please create a new account and then log in 
        </p>
      </div>
      <div>My info
        <p>
          This component will show the user latest heart rate data in the form of a line graph
        </p>
      </div>
     
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer style={styles.footer}>
      <p>Contact us: <a href="mailto:support@healthmonitoring.com">support@healthmonitoring.com</a></p>
    </footer>
  );
}

// Styles (Inline CSS)
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    margin: 0,
    padding: 20,
    backgroundColor: '#f4f4f9',
  },
  header: {
    backgroundColor: '#6200ea',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center',
  },
  section: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
  footer: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#6200ea',
    color: 'white',
    textAlign: 'center',
    borderRadius: '8px',
  },
};
export default AboutSystem;