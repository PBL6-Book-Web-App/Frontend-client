import React from "react";
import styles from "./Footer.module.css"; // Import CSS module

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Logo and Information */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerHeading}>BookHub</h3>
          <p className={styles.footerText}>
            Discover the best books from around the world. Read, learn, and grow
            with BookHub!
          </p>
        </div>

        {/* Quick Links */}
        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Quick Links</h4>
          <ul className={styles.footerList}>
            <li>
              <a href="/home-page" className={styles.footerLink}>
                Home
              </a>
            </li>
            <li>
              <a href="/about-us" className={styles.footerLink}>
                About Us
              </a>
            </li>
            <li>
              <a href="/bookshelves" className={styles.footerLink}>
                Bookshelves
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Connect With Us</h4>
          <div className={styles.footerSocialLinks}>
            <a
              href="https://facebook.com"
              target="_blank"
              className={styles.footerSocialLink}>
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              className={styles.footerSocialLink}>
              Instagram
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              className={styles.footerSocialLink}>
              Twitter
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottomText}>
        © 2024 BookGenius. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
