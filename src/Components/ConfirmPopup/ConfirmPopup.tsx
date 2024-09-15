import { _L } from '../../Tools/_L';
import './ConfirmPopup.css'

export function ConfirmPopup({confirmText, message, title, onConfirm, onCancel, miniText, type}:{type?:'warning'|'confirm'|'alert'|'success',miniText?:string, message?:string, onConfirm?:()=>any, onCancel?:()=>any,confirmText?:string, title:string}) {
    return <div className={"confirm-popup "+(type||'confirm')}>
        <div className="ctn-popup" onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
        }}>
            <div className="close" onClick={onCancel}></div>
            <h2>{title}</h2>
            <p className='message'>{message}</p>
            <div className="btn">
                <div className="cancel" onClick={()=>onCancel?.()}>{confirmText?_L('cancel'):_L('ok')}</div>
                {confirmText && <div className="ok-btn" onClick={()=>onConfirm?.()}>{confirmText}</div>}
            </div>
            <p className='min-text'>{miniText}</p>
        </div>
    </div>
}