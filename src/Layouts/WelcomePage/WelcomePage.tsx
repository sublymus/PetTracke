import { useEffect, useState } from 'react';
import { useAppRouter, useAppStore } from '../../AppStore';
import { _L } from '../../Tools/_L';
import './WelcomePage.css'
import { useUserStore } from '../Profile/UserStore';
import { PricingPage } from '../PricingPage/PricingPage';

const validateEmail = (email: string) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
};


export function WelcomePage() {

    const { json } = useAppRouter()
    const pages: any = {
        login: <Connexion />,
        signup: <Connexion />,
        pricing: <PricingPage/>
    }
    const page = !json?.welcome_page ? <Welcome /> : pages[json.welcome_page]
    return <div className="welcome-page">
        <div className="ctn">
            {page}
        </div>
    </div>
}

function Welcome() {
    const { setLang } = useAppStore()
    const { qs } = useAppRouter()
    return <>
        <select name="language" id="language" value={localStorage.getItem('setting.lang') || 'en'} onChange={(e) => {
            const lang = e.currentTarget.value;
            setLang(lang as any);
        }}>
            <option value="en">English</option>
            <option value="ru">Русский</option>
            <option value="fr">Français</option>
        </select>
        <h1>WelCome To PetTrack</h1>
        <div className="center-info">
            <div className="app-name"></div>
            <div className="info">
                <h1>PetTrack</h1>
                <p>Ensuring your pet's salety and heath</p>
                <div className="get-start" onClick={() => qs({ welcome_page: 'pricing' }).apply()} >Get Start</div>
            </div>
        </div>
        <div className="description">
            Keep track of your pets' locations and health with our innovative Qr code technology
        </div>
        <div className="login" onClick={() => qs({ welcome_page: 'login' }).apply()} >Login</div>
        <div className="sign-up" onClick={() => qs({ welcome_page: 'signup' }).apply()}>Sign Up</div>
    </>
}

function Connexion() {
    const { json, navBack, qs } = useAppRouter();
    const { getAccess, create_user } = useUserStore();
    const [openEye, setOpenEye] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openEye2, setOpenEye2] = useState(false)
    const [collected, setCollected] = useState({
        email: '',
        password: '',
        conf_password: '',
    })
    const [emailError, setEmailError] = useState('');
    const [passorwordError, setPassorwordError] = useState('');
    const [passorword2Error, setPassorword2Error] = useState('');
    const [authError, setAuthError] = useState('');
    useEffect(() => {
        setCollected({
            email: '',
            password: '',
            conf_password: '',
        })
        setAuthError('');
        setEmailError('');
        setPassorwordError('')
        setPassorword2Error('')
    }, [json])
    return <div className='connexion-page'>
        <h2>
            <span className='return' onClick={() => navBack()}></span>
            Connexion Page
        </h2>
        <h1>Welcom to TetTrack</h1>

        <label htmlFor="welcome-input-email">
            <div className="label">{_L('email')} <span className='error'>{emailError}</span></div>
            <div className="_flex">
                <input id='welcome-input-email' value={collected.email || ''} placeholder={_L('email')} type="text"
                    onChange={e => {
                        setEmailError('')
                        setAuthError('')
                        setCollected({ ...collected, email: e.currentTarget.value })
                    }}
                    onKeyUp={e => {
                        if (e.code == 'Enter') {
                            e.currentTarget.blur();
                        }
                    }}
                />
                <div className="icon email"></div>
            </div>
        </label>
        <label htmlFor="welcome-input-password">
            <div className="label">{_L('password')}<span className='error'>{passorwordError}</span></div>
            <div className="_flex">
                <input id='welcome-input-password' value={collected.password || ''} placeholder={_L('password')} type={openEye ? 'text' : 'password'}
                    onChange={e => {
                        setPassorwordError('');
                        setAuthError('')
                        setCollected({ ...collected, password: e.currentTarget.value });
                    }}
                    onKeyUp={e => {
                        if (e.code == 'Enter') {
                            e.currentTarget.blur();
                        }
                    }}
                />
                <div className={"icon password " + (openEye ? 'open' : '')} onClick={() => setOpenEye(!openEye)}></div>
            </div>
        </label>
        {
            json?.welcome_page == 'signup' &&
            <label htmlFor="welcome-input-confirm-password">
                <div className="label">{_L('confirm_password')}<span className='error'>{passorword2Error}</span></div>
                <div className="_flex">
                    <input id='welcome-input-confirm-password' value={collected.conf_password || ''} placeholder={_L('confirm_password')} type={openEye2 ? 'text' : 'password'}
                        onChange={e => {
                            setPassorword2Error('')
                            setAuthError('')
                            setCollected({ ...collected, conf_password: e.currentTarget.value });
                        }}
                        onKeyUp={e => {
                            if (e.code == 'Enter') {
                                e.currentTarget.blur();
                            }
                        }}
                    />
                    <div className={"icon password " + (openEye2 ? 'open' : '')} onClick={() => setOpenEye2(!openEye2)}></div>
                </div>
            </label>
        }
        {authError && <div className="error auth">{authError}</div>}
        <div className={"submit " + ((json?.welcome_page == 'signup' ? collected.conf_password == collected.password : true) && collected.password.length > 8 && collected.email)} onClick={() => {
            let error = false;
            if (loading) return

            if (!validateEmail(collected.email)) {
                setEmailError('Invalid email');
                error = true;
            }
            if (json?.welcome_page == 'signup' && collected.conf_password != collected.password) {
                setPassorword2Error('the password must be the same');
                error = true;
            }
            if (collected.password.length < 8) {
                setPassorwordError('the minimum length is 8 characters');
                error = true;
            }
            if (!error) {
                setLoading(true)
                create_user({
                    email: collected.email,
                    password: collected.password,
                    mode: json?.welcome_page
                }).then((user) => {
                    setLoading(false);
                    if (user?.id) {
                        ////
                        console.log('zoo user', user);
                    } else {
                        setAuthError((user as any))
                    }
                })
            }
        }}>{json?.welcome_page == 'login' ? 'Login': 'Sign Up'}</div>
        <p className='prompt-account'>{
            json?.welcome_page == 'login'
                ?
                <>you don't have an account yet? <span onClick={() => qs({ welcome_page: 'signup' }).apply()}>Sign Up</span></>
                :
                <>Do you already have an account? <span onClick={() => qs({ welcome_page: 'login' }).apply()}>Login</span></>
        }</p>
        <div className="separator"><span></span> or <span></span></div>
        <div className="google-btn" onClick={() => getAccess()}>
            <span></span>
            Google Connexion
        </div>
    </div>
}
