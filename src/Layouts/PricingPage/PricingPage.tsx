import { useAppRouter } from '../../AppStore';
import './PricingPage.css'



export function PricingPage() {
    const { navBack } = useAppRouter();
    return <div className='pricing-page'>
        <div className="pricing-ctn">

            <h3>
                <span className='return' onClick={() => navBack()}></span>
                Subscription Page
            </h3>
            <h2>Choose Your Subscription Plan</h2>
            <p className='message'>Select a plan that suits your needs for enhanced pet tracking features. Enjoy peace of mind knowing your pet's location and heath are monitored.</p>

            <div className="plan">
                <h4 className="name">Basic Plan</h4>
                <h2 className="price">499rub/mo</h2>
                <div className="feature"><span></span>Track your pet's location</div>
                <div className="feature"><span></span>Health monitoring</div>
                <div className="feature"><span></span>Track maximun 2 pets</div>
            </div>
            <div className="plan">
                <h4 className="name">Premium Plan</h4>
                <h2 className="price">999rub/mo</h2>
                <div className="feature"><span></span>All basic Features</div>
                <div className="feature"><span></span>24/7 support</div>
                <div className="feature"><span></span>Monthy Heath reports</div>
                <div className="feature"><span></span>Track maximun 5 pets</div>
            </div>
            <div className="plan">
                <h4 className="name">Familly Plan</h4>
                <h2 className="price">1499rub/mo</h2>
                <div className="feature"><span></span>All Premium Features</div>
                <div className="feature"><span></span>Familly Sharing</div>
                <div className="feature"><span></span>Track maximun 10 pets</div>
            </div>
            <h2>Payment Details</h2>
            <div className="payment">
                Enter your Payment informations
            </div>
        </div>
    </div>
}