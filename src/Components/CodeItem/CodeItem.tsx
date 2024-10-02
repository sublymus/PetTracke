import QRCode from 'react-qr-code';
import { CodeInterface } from '../../Database';
import { getImg } from '../../Tools/StringFormater';
import './CodeItem.css'
import { Host } from '../../Config';
import { _L } from '../../Tools/_L';


export function CodeItem({ code ,onClick , animal_info = true}: {animal_info?:boolean ,onClick:()=>any, code: CodeInterface }) {


    return (
        <div key={code.id} className="code" onClick={() => onClick()}>
            <div className="notif-new-scane"></div>
            {animal_info && <div className="animal-info">
                <div className="image" style={{ background: code.images[0] && getImg(code.images[0]) }}></div>
                <div className="text">
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
            <div className="code_url _limit-text">{code.code_url}</div>
            <div className="date _limit-text">{new Date(code.created_at).toLocaleDateString(_L.lang, {
                day:'numeric',
                year:'numeric',
                month:'long'
            })}</div>
        </div>
    )
}