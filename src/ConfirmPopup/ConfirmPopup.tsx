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
                <div className="cancel" onClick={()=>onCancel?.()}>{confirmText?'Cancel':'Ok'}</div>
                {confirmText && <div className="ok-btn" onClick={()=>onConfirm?.()}>{confirmText}</div>}
            </div>
            <p className='min-text'>{miniText}</p>
        </div>
    </div>
}