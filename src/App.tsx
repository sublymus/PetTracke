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
import { PageAuth } from './Layouts/PageAuth/PageAuth';
import { About } from './Layouts/About/About';
import { Setting } from './Layouts/Setting/Setting';
import MapView from './Layouts/MapView/MapView';
import { AddressInterface } from './Database';
import { WelcomePage } from './Layouts/WelcomePage/WelcomePage';
import { PricingPage } from './Layouts/PricingPage/PricingPage';

// NotifContext.testNotifier()

function App() {
  const { authenticateUser, user , updateUser } = useUserStore()
  const { pathList, navBack, json, current, qs } = useAppRouter()
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
        (user && permission =='granted') && NotifContext.sendData(user);
    },[permission,user]);

  return (
    current('scane_info') ? <ScaneInfo /> :
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
          {current('pricing') && <PricingPage/>}
          {
            current('choise_address') && <MyAddress address={user.address} setAddress={(address) => {
              user && updateUser({
                  address
              });
          }} />
          }
          {current('owner_open_scane') && <ScaneInfo/>}
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
          }}></span>Define Your Address</h1>
          <p>This is that addres who will be show as pets home..</p>
      </div>
      <MapView canChange setAddress={setAddress} address={address} />
  </div>
}
export default App;
