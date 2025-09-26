import QrScanner from "qr-scanner";
import { useEffect, useRef } from "react";

export default function Scn(){
    const videoRef = useRef();
    const qrscannRef = useRef();

    const startScann = () => {
            if(videoRef.current){
                qrscannRef.current = new QrScanner(
                    videoRef.current,
                    (result)=>{
                        console.log(result.data)
                    },
                    {
                        highlightScanRegion: true,
                        highlightCodeOutline: true,
                    }
                )

                qrscannRef.current.start();
            }
        }

    const stopScann = ()=>{
        qrscannRef.current.stop();
    }

    const startBtnX = ()=>{
        document.querySelector('#startBtn').click()
    }
    const stopBtnX = ()=>{
        document.querySelector('#stopBtn').click()
    }

    setTimeout(
        ()=>{
            startBtnX();
        }, 3000
    )
    setTimeout(
        ()=>{
            stopBtnX();
        }, 5000
    )

    return <div>
        <h1>scann app</h1>
        <button onClick={()=>startScann()} id="startBtn" > open </button>
        <button onClick={()=>stopScann()} id="stopBtn" > close </button>
        <video style={{height: "300px ", width:"300px"}} ref={videoRef} />
    </div>
}