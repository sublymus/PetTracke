import { useAppRouter } from '../../AppStore'
import './About.css'


export function About() {
    const { current, navBack } = useAppRouter();
    return current('about') && (
        <div className="about">
            <div className="ctn">
                <h3 className="title">
                    <span onClick={() => navBack()}></span>
                    {'Lost Pet Details'}</h3>
                <h2>About PetTrack</h2>
                <p>
                    PetTrack is an app desingned for pet owners to monitor thier pets'health,
                    schedule vet appointments, and connect with other pet lovers.
                </p>
                <h2>Our Mission</h2>
                <p>To help pet owners keep track of their pets health and activities.</p>
                <h2>Developer Contact</h2>
                <div className="info">
                    <div className="text">
                        <h3>Development Team</h3>
                        <p>PeatTrck Development Team</p>
                    </div>
                    <div className="img m-1"></div>
                </div>
                <div className="info">
                    <div className="text">
                        <h3>Contact Us</h3>
                        <p>spport@pettrack.com</p>
                    </div>
                    <div className="img m-2"></div>
                </div>
                <h2>Follows Us</h2>
                <div className="social">
                    <div className="facebook"><span></span>facebook </div>
                    <div className="twitter"><span></span>twitter </div>
                    <div className="instagram"><span></span>instagram </div>
                </div>
                <h2>App Version</h2>
                <p>Version 1.0.0 - Upadated on September 1, 2024</p>
            </div>
        </div>
    )
}


