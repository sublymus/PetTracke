import { useEffect, useRef, useState } from 'react';
import './QR_Scaner.css'
import QrScanner from "qr-scanner";
import { _L } from '../../Tools/_L';

export function QR_Scaner({ onCancel, onQrFound }: { onCancel?: () => any, onQrFound?: (qrCode: string) => any }) {

    const video = useRef<HTMLVideoElement>(null);
    const [camList, setCamList] = useState([{
        id: 'environment',
        label: 'Environment Facing (default)'
    }, {
        id: 'user',
        label: 'User Facing'
    }]);

    const mode_view = useRef<HTMLSelectElement>(null);
    const videoContainer = useRef<HTMLDivElement>(null)

    const [activeFlash, setActiveFlash] = useState(false);
    const [qr_code, setQr_code] = useState('');

    const [s] = useState<any>({});

    s.camList = camList;

    useEffect(() => {
        if (!video.current || s.scanner) return;

        // ####### Web Cam Scanning #######

        const scanner = new QrScanner(video.current, result => {
            const parts = result.data.split('/');
            const code = parts[parts.length - 1];
            setQr_code(code)
            onQrFound?.(code)
            localStorage.setItem('code_url', code)
        }, {
            onDecodeError: (_error) => { },
            highlightScanRegion: true,
            highlightCodeOutline: true,
        });

        s.scanner = scanner
        s.flash = activeFlash
        const updateFlashAvailability = () => {
            scanner.hasFlash().then(hasFlash => {
                if (hasFlash) {
                    setActiveFlash(!!s.scanner?.isFlashOn());
                }
            });
        };

        scanner.start().then(() => {
            updateFlashAvailability();
            QrScanner.listCameras(true).then(cameras => cameras.forEach(({ id, label }) => {
                setCamList([...(s.camList || []), { id, label }])
            }));
        });
        mode_view.current?.addEventListener('change', (e) => {
            videoContainer.current && (videoContainer.current.className = (e.target as any)?.value);
            (scanner as any)._updateOverlay();
        });

        setCamList([...(s.camList || [])])
        return () => {
            s.scanner?.stop();
            if (s.flash) {
                s.scanner?.toggleFlash();
            }
            s.scanner = null;
        }
    }, [video])

    return <div className="qr-scanner" onClick={(e)=>{
        e.stopPropagation();
        e.preventDefault();
    }}>
        <div id="video-container" ref={videoContainer}>
            <video id="qr-video" ref={video}></video>
        </div>
        <div className="ctn">
            <h3 className="title"> <div className="return" onClick={() => onCancel?.()}></div> {_L('scanne_section')}</h3>
            <select id="cam-list">
                {
                    camList.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                    ))
                }
            </select>

            <div className={"flash " + (activeFlash ? 'active' : '')} onClick={() => {
                s.scanner?.toggleFlash().then(() => setActiveFlash(!!s.scanner?.isFlashOn()));
            }}></div>
        </div>
        <span className='qr_code'>{qr_code}</span>
    </div>
}