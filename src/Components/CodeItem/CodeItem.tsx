import QRCode from 'react-qr-code';
import { CodeInterface } from '../../Database';
import { getImg } from '../../Tools/StringFormater';
import './CodeItem.css'
import { Host } from '../../Config';


export function CodeItem({ code ,onClick , animal_info = true}: {animal_info?:boolean ,onClick:()=>any, code: CodeInterface }) {


    return (
        <div key={code.id} className="code" onClick={() => onClick()}>
            <div className="notif-new-scane"></div>
            {animal_info && <div className="animal-info">
                <div className="image" style={{ background: code.images[0] && getImg(code.images[0]) }}></div>
                <div className="text _limit-text">
                    <div className="name _limit-text">{code.name}</div>
                    {/* <div className="count">{32}<span></span></div> */}
                </div>
            </div>}
            <div className="qr">
                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={`${Host||location.host}/s_c/${code.code_url}`}
                    viewBox={`0 0 256 256`}
                />
            </div>
            <div className="code_url">{code.code_url}</div>
            <div className="date">{new Date(code.created_at).toDateString()}</div>
        </div>
    )
}