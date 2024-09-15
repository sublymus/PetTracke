import { useAppRouter } from '../../AppStore'
import { _L } from '../../Tools/_L';
import './About.css'


export function About() {
    const { current, navBack } = useAppRouter();
    return current('about') && (
        <div className="about">
            <div className="ctn">
                <h3 className="title">
                    <span onClick={() => navBack()}></span>
                    {_L('about_title')}</h3>
                <h2>{_L('about_app')}</h2>
                <p>
                    {_L('about_description')}
                </p>
                <h2>{_L('our_mission')}</h2>
                <p>{_L('our_mission_2')}</p>
                <h2>{_L('developer_contact')}</h2>
                <div className="info">
                    <div className="text">
                        <h3>{_L('development_team')}</h3>
                        <p>{_L('development_team_2')}</p>
                    </div>
                    <div className="img m-1"></div>
                </div>
                <div className="info">
                    <div className="text">
                        <h3>{_L('contact_us')}</h3>
                        <p>support@pettrack.com</p>
                    </div>
                    <div className="img m-2"></div>
                </div>
                <h2>{_L('follows_us')}</h2>
                <div className="social">
                    <div className="facebook"><span></span>facebook </div>
                    <div className="twitter"><span></span>twitter </div>
                    <div className="instagram"><span></span>instagram </div>
                </div>
                <h2>{_L('app_version')}</h2>
                <p>{_L('version')} 1.0.0 - {_L('updated_on')} September 1, 2024</p>
            </div>
        </div>
    )
}



