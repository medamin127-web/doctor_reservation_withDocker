import React from 'react';
import '../App.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-links">
                    <a href="/about-us">About Us</a>
                    <a href="/contact-us">Contact Us</a>
                    <a href="/privacy-policy">Privacy Policy</a>
                </div>
                <div className="footer-socials">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        Facebook
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        Twitter
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        Instagram
                    </a>
                </div>
                <p className="footer-copy">© 2024 DoctorReserve. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;