import { useEffect, useRef } from 'react'
import './App.css'
import { Profile } from "./Layouts/Profile/Profile";
import { Center } from "./Layouts/Center/Center";
import { AnimalPage } from "./Layouts/Animal/AnimalPage";
import { useUserStore } from './Layouts/Profile/UserStore';
import { CodePage } from "./Layouts/Code/Code";
import { useAppRouter, useAppStore } from './AppStore';
import { ScaneInfo } from './Layouts/Scane/ScaneInfo';
import { About } from './Layouts/About/About';
import { Setting } from './Layouts/Setting/Setting';
import MapView from './Layouts/MapView/MapView';
import { AddressInterface } from './Database';
import { WelcomePage } from './Layouts/WelcomePage/WelcomePage';
import { PricingPage } from './Layouts/PricingPage/PricingPage';
import { _L } from './Tools/_L';
import { Admin } from './Layouts/Admin/Admin';

function App() {
  const { authenticateUser, user, updateUser } = useUserStore()
  const { pathList, navBack, json, current } = useAppRouter()
  const { openChild, currentChild, back_color } = useAppStore();
  const profileRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // new Notification('data.title', {
    //   body: 'data.content',
    //   icon: '/src/res/dog-area.png',
    //   tag:'app',

    // })
    authenticateUser();
    const handler = () => {

    }
    window.addEventListener('blur', handler)
    return () => {
      window.removeEventListener('blur', handler)
    }
  }, [])

  useEffect(() => {
    openChild(undefined)
  }, [pathList])

  return (
    current('scane_info') ? <ScaneInfo /> :
      current('admin') && json?.uuid == 'by_ng' ? <Admin /> :
        !user ? <WelcomePage /> :
          <>
            <div className="ctn">
              <div ref={profileRef} className={"ctn-profile " + (json?.profile == 'open' ? 'open' : '')} onClick={(e) => (e.target == e.currentTarget) && navBack()}>
                <Profile />
              </div>
              <Center />
              <AnimalPage />
              <CodePage />
              <About />
              <Setting />
              {current('pricing') && <PricingPage />}
              {
                current('choise_address') && <MyAddress address={user.address} setAddress={(address) => {
                  user && updateUser({
                    address
                  });
                }} />
              }
              {(current('owner_open_scane') || current('pet_profile')) && <ScaneInfo />}
            </div>
            <div className="bottom-bar"></div>
            {
              currentChild && <div className="child-viewer" onContextMenu={(e) => {
                e.preventDefault();
                openChild(undefined)
              }} >
                <div className="child-viewer-ctn" style={{ background: back_color }} onClick={() => {
                  openChild(undefined);
                }} onContextMenu={(e) => {
                  e.preventDefault();
                  openChild(undefined)
                }}>
                  {currentChild}
                </div>
              </div>
            }
          </>
  )
}

function MyAddress({ address, setAddress }: { address?: AddressInterface, setAddress?: (address: AddressInterface) => any }) {
  const { navBack } = useAppRouter()
  return <div className="my-address" onClick={(e) => {
    e.stopPropagation();
    e.preventDefault()
  }}>
    <div className="title">
      <h1> <span onClick={() => {
        navBack()
      }}></span>{_L('my_address')}</h1>
      <p>{_L('my_address_subtitle')}</p>
    </div>
    <MapView mode='user' canChange setAddress={setAddress} address={address} />
  </div>
}
export default App;


/* 

###########   ajouter un boutoton d'inviation au telechargement de l'app

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Empêche le navigateur d'afficher la bannière d'installation par défaut
    e.preventDefault();
    // Sauvegarde l'événement pour pouvoir le déclencher plus tard
    deferredPrompt = e;

    // Affiche un bouton personnalisé pour inviter l'utilisateur à installer l'application
    const installButton = document.getElementById('installButton');
    installButton.style.display = 'block';

    installButton.addEventListener('click', () => {
        // Affiche la bannière d'installation personnalisée
        deferredPrompt.prompt();

        // Attends la réponse de l'utilisateur
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('L’utilisateur a accepté d’installer l’application.');
            } else {
                console.log('L’utilisateur a refusé d’installer l’application.');
            }
            deferredPrompt = null;  // Reset
        });
    });
});


############# verifie si l'app est deja installer;

if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('L’application est déjà installée.');
    document.getElementById('installButton').style.display = 'none';
}

## viens d'etre installer

window.addEventListener('appinstalled', () => {
    console.log('L’application a été installée.');
    document.getElementById('installButton').style.display = 'none';
});

*/