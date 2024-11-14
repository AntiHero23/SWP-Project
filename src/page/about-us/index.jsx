import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCode, 
  faDatabase, 
  faLaptop, 
  faPaintBrush, 
  faDesktop 
} from "@fortawesome/free-solid-svg-icons";
import "./index.scss";

const AboutUs = () => {
  return (
    <div className="about-section">
        <div className="about-us-container">
      <h2>About Our Team</h2>
      <div className="team-container">
        <div className="team-member">
          <FontAwesomeIcon icon={faCode} className="profile-img simple-icon" />
          <h3>Hao</h3>
          <p>Team Lead and Backend Developer</p>
        </div>
        <div className="team-member">
          <FontAwesomeIcon icon={faDatabase} className="profile-img simple-icon" />
          <h3>Thien</h3>
          <p>Backend Developer</p>
        </div>
        <div className="team-member">
          <FontAwesomeIcon icon={faLaptop} className="profile-img simple-icon" />
          <h3>Hung</h3>
          <p>Main Front end Dev</p>
        </div>
        <div className="team-member">
          <FontAwesomeIcon icon={faPaintBrush} className="profile-img simple-icon" />
          <h3>Minh</h3>
          <p>Front End and UI design</p>
        </div>
        <div className="team-member">
          <FontAwesomeIcon icon={faDesktop} className="profile-img simple-icon" />
          <h3>An</h3>
          <p>Front End development</p>
        </div>
      </div>

      <div className="about-text">
        <p>
          Having seen the need for a well rounded koi management app, we came up with the idea of developing an app to make fish keeping easier. Our goal is to keep the app up-to-date and provide assistance for every pond owner. A rating in the App Store or sharing the app would make us very happy and motivate us to continue developing additional features.
        </p>
        <p>
          If you have any questions or suggestions for improvement, please send an e-mail to{" "}
          <a href="mailto:contact@pondcompany.com">contact@pondcompany.com</a>.
        </p>
        <p>- The PondControl Team</p>
      </div>

      <p className="footer-text">
        Follow us on social media where we keep you posted about exciting new features!
      </p>
      </div>
    </div>
  );
};

export default AboutUs;
