import { useEffect, useRef, useState } from 'react';
import { useAppRouter } from '../../AppStore';
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
            setQr_code(result.data)
            onQrFound?.(result.data)
        }, {
            onDecodeError: (_error) => {
                // console.warn(error);
            },
            highlightScanRegion: true,
            highlightCodeOutline: true,
        });

        s.scanner = scanner
        s.flash = activeFlash
        const updateFlashAvailability = () => {
            scanner.hasFlash().then(hasFlash => {
                console.log('qr flash : ', hasFlash);

            });
        };

        scanner.start().then(() => {
            updateFlashAvailability();
            QrScanner.listCameras(true).then(cameras => cameras.forEach(({ id, label }) => {
                setCamList([...(s.camList||[]), { id, label }])
            }));
        });

        // QrScanner.hasCamera().then((hasCamera) => {
        //     console.log('qr hasCamera ', hasCamera);

        // });
        mode_view.current?.addEventListener('change', (e) => {
            videoContainer.current && (videoContainer.current.className = (e.target as any)?.value);
            (scanner as any)._updateOverlay();
        });

        // document.getElementById('show-scan-region').addEventListener('change', (e) => {
        //     const input = e.target;
        //     const label = input.parentNode;
        //     label.parentNode.insertBefore(scanner.$canvas, label.nextSibling);
        //     scanner.$canvas.style.display = input.checked ? 'block' : 'none';
        // });

        // document.getElementById('inversion-mode-select').addEventListener('change', event => {
        //     scanner.setInversionMode(event.target.value);
        // });

        // flashToggle.addEventListener('click', () => {
        //     scanner.toggleFlash().then(() => flashState.textContent = scanner.isFlashOn() ? 'on' : 'off');
        // });

        // document.getElementById('start-button').addEventListener('click', () => {
        //     scanner.start();
        // });

        // document.getElementById('stop-button').addEventListener('click', () => {
        //     scanner.stop();
        // });
        setCamList([...(s.camList||[])])
        return ()=>{
            s.scanner?.stop();
            if(s.flash){
                s.scanner?.toggleFlash();
            }
        }
    }, [video])

    const { current } = useAppRouter()

    return current('qr_scaner') && <div className="qr-scanner">
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
        <div className="allow-camera">
            Allow Use Camera
        </div>
            <span className='qr_code'>{qr_code}</span>
    </div>
}