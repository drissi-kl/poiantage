import { useState, useRef, useEffect, use } from "react";
import QrScanner from "qr-scanner";
import { useSelector } from "react-redux";
import { checkAbsenceApi, createScanApi } from "../../services/scan";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import '../../scanner.css';


export default function Scanner() {
  const queryClient= useQueryClient();
  const [scanning, setScanning] = useState(false); // scannig work now on not, it takes boolean value
  const [selectedUser, setSelectedUser] = useState(null); // The user who conducted the scannf
  const [scanHistory, setScanHistory] = useState([]); // A list of the last 10 scann.
  
  const videoRef = useRef(); // for link between qrscanner and react by video element
  const qrScannerRef = useRef(); // it is an instance to qrscann
  

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // useEffect(
  //   ()=>setScanning(true)
  //   ,[]
  // )


  // this function is created by drissi
  // this functio return all scans create today with employee information
  const todayScans = () => {
    const employees = queryClient.getQueryData(["employees"]);
    let todayscans = [];
    const today =`${new Date(Date.now()).getFullYear()}-${String(new Date(Date.now()).getMonth()+1).padStart(2, '0')}-${String(new Date(Date.now()).getDate()).padStart(2, '0')}`;
    employees.forEach((emp) => {
      emp.employee.scans.forEach((scan)=>{
        if(today == scan.created_at.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g)[0]){
          todayscans.push({
            scanInfo: scan,
            empInfo: {name: emp.name, email: emp.email}
          })
        }
      })
    })
    return todayscans.sort((a, b)=> new Date(b.scanInfo.created_at) - new Date(a.scanInfo.created_at) );
  }

  const handleScanClick = ()=>{
    setScanning(true)
  }
 
  const handleCancelScan = ()=>{
    if(qrScannerRef.current && scanning){
      setScanning(false);
      qrScannerRef.current.stop()
      qrScannerRef.current.destroy()
    }
  }

  const createScanMutation = useMutation({
    mutationFn: (body)=>createScanApi(body),
    onSuccess: (data, variable, context)=>{
      const message = data.message;
      
      if(message === "created scan successfully"){
        const user = data.user
        const scanData = data.scan
        queryClient.invalidateQueries(["employees"]);
        setSuccessMessage("le scan est success");
        const scanInfo = {
          name: user.name,
          email: user.email,
          scanTime: new Date(scanData.created_at).toLocaleTimeString(),
          status: scanData.state || "Scan recorded",
        };
        setSelectedUser(scanInfo);
      }else{
        if(message == "ce scan n'est pas autorisé, car vous n'avez que 4 scans par jour")
        setErrorMessage(message);
      }
    }
  })
  
  useEffect(
    ()=> {
      setErrorMessage(null);
      setSuccessMessage(null);
      console.log(videoRef);
      if(videoRef.current && scanning ){
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          async (result) => {
            try{
              
              qrScannerRef.current.stop(); // stop scan for not scan more than one in the once
              const data = JSON.parse(result.data); // convert get what get the QRcode
      
              if(data.email){
                const body = {email: data.email}
                setScanning(false);
                await createScanMutation.mutateAsync(body);
              } else {
                setErrorMessage('this QRcode not valide');
              }
              
              setTimeout(
                ()=>{
                  qrScannerRef.current.start();
                  setSuccessMessage(null);
                  setErrorMessage(null);
                  setSelectedUser(null);
                  setScanning(true);
                }, 2000
              )

            } catch(error) {
              console.log(error.message);
              setErrorMessage(error.message);
            }         
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );      
        qrScannerRef.current.start();
      }
      // this line for if you close this component, automaticlly stop scan (close camera)
      return ()=>handleCancelScan();
      
    },[scanning]
  )
  
  useEffect(
    ()=>{
      setScanning(true);
    },[]
  )


  // check absence
  const checkAbsenceMutation = useMutation({
    mutationFn: checkAbsenceApi,
    onSuccess: (data, variable, context)=>{
      console.log(data)
      queryClient.invalidateQueries(["employees"]);
    }
  })
  
  const checkAbsence = ()=>{
    checkAbsenceMutation.mutate()
  }
  
  // check absence

  return (<div>
    <div className="scanner-container">
      <h1>Employee Attendance Scanner</h1>
      
      {/* {!scanning && (
        <div className="scan-start">
          <button
            onClick={()=>handleScanClick()}
            className="scan-button"
          >
            Start Scanning
          </button>
        </div>
      )} */}

    {
      !scanning && <button className="checkAbsence" onClick={()=>checkAbsence()}>check absence</button>
    }
      

      {selectedUser && (
        <div className="scan-result">
          <h3>✅ Scan Réussi !</h3>
          <div className="scan-info">
            <p>
              <strong>Nom:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Statut:</strong> {selectedUser.status}
            </p>
            <p>
              <strong>Heure du Scan:</strong> {selectedUser.scanTime}
            </p>
          </div>
        </div>
      )}

      {
        scanning && <div className="scanning-section">
          <div className="video-container">
            <video
              ref={videoRef}
              className="scanner-video"
              playsInline
            
            />
          </div>
          <button
            onClick={handleCancelScan}
            className="cancel-button"
          >
            Cancel Scan
          </button>
          <br />
        </div>
      }

      {errorMessage && (
        <div className={`alert alert-error`} >
          <p>{errorMessage}</p>
          <button
          className="close"
            onClick={() => {
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {todayScans()?.length > 0 && (
        <div className="scan-history">
          <h3>Historique des Scans (10 derniers scans)</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Statut</th>
                  <th>Heure</th>
                  {/* <th>Date</th> */}
                </tr>
              </thead>
              <tbody>
                {todayScans()?.slice(0, 10).map((record, index) => (
                  <tr key={index}>
                    <td>{record.empInfo.name}</td>
                    <td>{record.scanInfo.state}</td>
                    <td>{record.scanInfo.created_at.match(/[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}/)}</td>
                    {/* <td>{record.scanDate}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>

  </div>
  );
}
