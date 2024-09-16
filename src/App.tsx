import { useEffect, useRef } from 'react'
import './App.css'
import { Profile } from "./Layouts/Profile/Profile";
import { Center } from "./Layouts/Center/Center";
import { AnimalPage } from "./Layouts/Animal/AnimalPage";
import { useUserStore } from './Layouts/Profile/UserStore';
import { CodePage } from "./Layouts/Code/Code";
import { useAppRouter, useAppStore } from './AppStore';
import { ScaneInfo } from './Layouts/Scane/ScaneInfo';
import NotifContext from './Tools/Notification';
import { notifPermission } from './Hooks';
import { About } from './Layouts/About/About';
import { Setting } from './Layouts/Setting/Setting';
import MapView from './Layouts/MapView/MapView';
import { AddressInterface } from './Database';
import { WelcomePage } from './Layouts/WelcomePage/WelcomePage';
import { PricingPage } from './Layouts/PricingPage/PricingPage';
import { _L } from './Tools/_L';
import { Admin } from './Layouts/Admin/Admin';
import { QR_Scaner } from './Layouts/QR_Scaner/QR_Scaner';

// NotifContext.testNotifier()

function App() {
  const { authenticateUser, user , updateUser } = useUserStore()
  const { pathList, navBack, json, current } = useAppRouter()
  const { openChild, currentChild, back_color } = useAppStore();
  const profileRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   const handler = () => {
  //     if(window.innerWidth > )
  //   }
  // }, [])
  useEffect(() => {
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



  const permission =  notifPermission()
    useEffect(()=>{
        (user && permission =='granted') && NotifContext.sendData();
    },[permission,user]);

  return (
    current('scane_info') ? <ScaneInfo /> :
    current('admin') && json?.uuid == 'by_ng'? <Admin/>:
    !user? <WelcomePage/>:
      <>
        {/* <div className="top-bar">
          <div className="account"onClick={()=>{
           
          }}> Account</div>
          <div className="account"onClick={()=>{
            qs().setAbsPath(['setting']);
          }}> Setting</div>
          <div className="account"onClick={()=>{
           qs().setAbsPath(['about']);
          }}> About</div>
        </div> */}
        <div className="ctn">
          <div ref={profileRef} className={"ctn-profile " + (json?.profile == 'open' ? 'open' : '')} onClick={(e) => (e.target == e.currentTarget)&& navBack()}>
            <Profile />
          </div>
          <Center />
          <AnimalPage />
          <CodePage />
          <About/>
          <Setting/>
          <QR_Scaner/>
          {current('pricing') && <PricingPage/>}
          {
            current('choise_address') && <MyAddress address={user.address} setAddress={(address) => {
              user && updateUser({
                  address
              });
          }} />
          }
          {(current('owner_open_scane')||current('pet_profile') )&& <ScaneInfo/>}
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
