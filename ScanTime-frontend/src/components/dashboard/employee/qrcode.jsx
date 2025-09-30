import { QRCodeCanvas } from 'qrcode.react';
import '../../../qrcode.css';

export default function QRCodeEmp({ employee }) {

    
    const downloadBtn = () => {
        const canvas = document.getElementById("drissi");
        const qrcodeUrl = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);
        downloadLink.href = qrcodeUrl;
        downloadLink.download = `${employee.name.match(/[A-Za-z]+/)[0]}-QRcode.png`
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    return (
        <div className="qrcode">
            <div className="container">
                <QRCodeCanvas
                    id="drissi"
                    value={employee.employee.QRcode}
                    size={400}
                    level="H"
                    includeMargin={true}
                    marginSize={10}
                    bgColor='#eee'
                />
                <button className="downloadBtn" onClick={() => downloadBtn()}>
                    Download
                </button>
            </div>  
        </div>
    );
}
