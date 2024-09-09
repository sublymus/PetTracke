import './PageAuth.css'
import { useUserStore } from '../Profile/UserStore';

export function PageAuth() {
    
    const {getAccess}  = useUserStore();
    
    return (
        <div className="page-auth" >
            <div className="auth-ctn">
                <div className="image">
                </div>
                <div className="form">
                    <h1 className="auth-title">Animal QR DASHBOARD</h1>
                    <h5 className="auth-prompt">{ 'Read more ?'} <span onClick={() => {
                    //    setOpenAuth(openAuth == 'login' ? 'signup' : 'login')
                    }}>{'Click here'}</span></h5>
                    <div className="google" onClick={()=>{
                        getAccess();
                    }}>
                        <div className="icon"></div>
                        <div className="label">Connexion</div>
                    </div>
                    <p>Google connexion is required to get access to Animal QR Dash</p>
                </div> 
            </div>
        </div>
    );
}