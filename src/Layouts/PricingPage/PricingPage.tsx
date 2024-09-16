import { useAppRouter } from '../../AppStore';
import { _L } from '../../Tools/_L';
import './PricingPage.css'



export function PricingPage() {
    const { navBack } = useAppRouter();
    return <div className='pricing-page'>
        <div className="pricing-ctn">

            <h3>
                <span className='return' onClick={() => navBack()}></span>
                {_L('subscription_page')}
            </h3>
            <h2>{_L('hoose_plan')}</h2>
            <p className='message'>{_L('plan_message')}</p>

            <div className="plan">
                <h4 className="name">{_L('basic_plan')}</h4>
                <h2 className="price">499rub/m</h2>
                <div className="feature"><span></span>{_L('track_pet')}</div>
                <div className="feature"><span></span>{_L('health_monitoring')}</div>
                <div className="feature"><span></span>{_L('track_pet_max2')}</div>
            </div>
            <div className="plan">
                <h4 className="name">{_L('prem_plan')}</h4>
                <h2 className="price">999rub/m</h2>
                <div className="feature"><span></span>{_L('all_basic')}</div>
                <div className="feature"><span></span>{_L('support_24_7')}</div>
                <div className="feature"><span></span>{_L('heath_report')}</div>
                <div className="feature"><span></span>{_L('track_pet_max5')}</div>
            </div>
            <div className="plan">
                <h4 className="name">{_L('familly_plan')}</h4>
                <h2 className="price">1499rub/m</h2>
                <div className="feature"><span></span>{_L('all_prem')}</div>
                <div className="feature"><span></span>{_L('familly_share')}</div>
                <div className="feature"><span></span>{_L('track_pet_max10')}</div>
            </div>
            <h2>{_L('pay_detail')}</h2>
            <div className="payment">
            {_L('enter_pay_info')} 
            </div>
        </div>
    </div>
}