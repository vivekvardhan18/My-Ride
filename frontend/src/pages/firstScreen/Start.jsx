import React from "react";
import { useNavigate } from "react-router-dom";
import taxiImage from "../../assets/taxi.png"; // Taxi Image
import bgPattern from "../../assets/Rectangle.png"; // Yellow Hexagonal Pattern
import cityImage from "../../assets/Rectangle2.png"; // City Skyline
import blackImage from "../../assets/Rectangle3.png"; // New black section image
import { lightTheme } from "../../theme";

function Start() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      {/* Top Yellow Section with Pattern */}
      <div style={styles.topSection}>
        <img src={bgPattern} alt="Pattern" style={styles.pattern} />
        <h1 style={styles.title}>MyRide</h1>
        <p style={styles.subtitle}>At your service</p>
      </div>

      {/* Dark City Skyline */}
      <div style={styles.cityContainer}>
        <img src={cityImage} alt="City Skyline" style={styles.cityImage} />
      </div>

      {/* Full Black Section */}
      <div style={styles.blackContainer}>
        <img src={blackImage} alt="Black Section" style={styles.blackImage} />
      </div>

      {/* Taxi on Slanted Road */}
      <div style={styles.taxiContainer}>
        <img src={taxiImage} alt="Taxi" style={styles.taxiImage} />
      </div>

      {/* Bottom Text */}
      <p style={styles.bottomText}>We are here to make your trip memorable.</p>

      {/* Circular Button */}
      <button style={styles.button} onClick={handleGetStarted}>
        →
      </button>
    </div>
  );
}

const styles = {
  container: {
    width: "400px",
    height: "812px",
    backgroundColor: lightTheme.background.dark,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    borderRadius: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  },
  topSection: {
    width: "100%",
    height: "35%",
    backgroundColor: "#FDCB58",
    position: "relative",
    clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)",
    zIndex: 3,
  },
  pattern: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.5,
  },
  title: {
    fontSize: "35px",
    fontWeight: "bold",
    color: "#000",
    position: "absolute",
    top: "20%",
    left: "10%",
    zIndex: 4,
    fontFamily: "'Caveat', cursive",
  },

  subtitle: {
    fontSize: "16px",
    color: "#444",
    position: "absolute",
    top: "36%", // slightly more gap
    left: "10%",
    zIndex: 5,
    fontFamily: "'Caveat', cursive",
  },


  cityContainer: {
    position: "absolute",
    top: "28%",
    width: "100%",
    height: "36%",
    overflow: "hidden",
    // clipPath: "polygon(0 10%, 100% 0%, 100% 100%, 0% 100%)",
    // zIndex: 2,
    clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)",
    zIndex: 3,
  },
  cityImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  blackContainer: {
    position: "absolute",
    top: "40%",
    width: "100%",
    height: "60%",
    backgroundColor: "#000",
    zIndex: 1,
  },
  blackImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  taxiContainer: {
    position: "absolute",
    bottom: "33%",
    right: "10%",
    transform: "rotate(15deg)",
    zIndex: 4,
  },
  taxiImage: {
    width: "120px",
  },
  bottomText: {
    position: "absolute",
    bottom: "18%",
    left: "2%",
    fontSize: "15px",
    color: "#fff",
    zIndex: 4,
    fontFamily: "'Caveat', cursive",
  },
  button: {
    position: "absolute",
    bottom: "6%",
    right: "5%",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#FDCB58",
    border: "none",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },
};

export default Start;