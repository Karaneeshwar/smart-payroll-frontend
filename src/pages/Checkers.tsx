import { Camera, CameraResultType, CameraSource } from "@capacitor/camera"
import { useState, CSSProperties, SetStateAction, MouseEventHandler } from "react";
import { BarLoader } from "react-spinners"; 
import * as faceapi from 'face-api.js'
import "@tensorflow/tfjs"
import { IonIcon, IonButton, IonPage, IonHeader, IonTitle, IonContent, IonToolbar, IonCard, IonCardTitle, IonCardContent, IonCardHeader, IonButtons, IonMenuButton } from "@ionic/react";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import './Checkers.css'
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import CheckLocation from "./loc";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import axios from "axios";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

async function getRefFace(){
    const imgdata = await Filesystem.readFile({path:'refimg.jpg', directory:Directory.Library});
    if (imgdata.data instanceof Blob){
        return URL.createObjectURL(imgdata.data);
    } else {
        const binStr = atob(imgdata.data);
        const binArr = new Uint8Array(binStr.length);
        for (let i=0; i<binStr.length; i++){
            binArr[i] = binStr.charCodeAt(i);
        }
        const blob = new Blob([binArr.buffer], {type: 'image/*'});
        return URL.createObjectURL(blob);
    }
}


async function loadFaceChecker(){
    const img2 = document.createElement('img');
    await Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        img2.src = await getRefFace()
    ]);

    const refdes = await faceapi
        .detectSingleFace(img2)
        .withFaceLandmarks()
        .withFaceDescriptor()
    
    const fm = new faceapi.FaceMatcher(refdes)
    
    return async function checkFace(image:HTMLImageElement) {
        try {
            console.log("facecheck accessed");
            const testdes = await faceapi
                .detectSingleFace(image)
                .withFaceLandmarks()
                .withFaceDescriptor();
            console.log("Face extracted properly");
            if (testdes) {
                const bM = fm.findBestMatch(testdes.descriptor)
                console.log("test: "+bM.distance);
                if (bM.distance<0.5){
                    console.log("true");
                    return true;
                } else {
                    console.log("false");
                    return false;
                }
            } else {
                throw new Error("No face was detected, please try close and reopen the app to try again!!");
            }
        } catch (e) {
            console.log ("Error: "+(e as Error).message);
        }
    };
}




interface p {
    onCap: (i: string) => void;
}

const CaptureFace: React.FC<p> = ({ onCap }) => {
    const getFace = async () => {
        defineCustomElements(window);
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera
        });
        if (!image.dataUrl) throw new Error("Camera Failure!!!");
        onCap(image.dataUrl);
    };
    return (
        <IonButton onClick={getFace}>Take a Selfie</IonButton>
    );
};

interface q {
    onVer: (i: string) => void;
    imgSrc: string
}

const VerifyFace: React.FC<q> =  ({ onVer, imgSrc }) => {
    const img = document.createElement('img');
    const [loading, setLoading] = useState(0);
    const verfiyFace = async () => {
        setLoading(loading + 1);
        const checkFace = await loadFaceChecker();
        setLoading(loading + 1);
        img.src = imgSrc;
        const res = await checkFace(img);
        setLoading(0);
        if (res){
            onVer("/tick.svg");
        } else {
            onVer("/cross.svg");
        }
    };
    if (loading>0) {
        return (
            <BarLoader
                color="white"
                loading={true}
                cssOverride={override}
                aria-setsize={50}
            />

        );
    }
    return (
        <IonButton disabled={!imgSrc} onClick={verfiyFace}>Verify Face</IonButton>
    );
};

interface r {
    onPres:React.Dispatch<SetStateAction<boolean>>
};

const GetAttendance:React.MouseEventHandler<r> = (onPres) => {
    
};


function deFaceChecker(){
    const [isPres, setIsPres] = useState(false);
    const [imgSrc, setImgSrc] = useState<string>("");
    const [res, setRes] = useState<string>("");
    const [res2, setRes2] = useState<string>("");

    const getAttendance = async () => {
        const fr = await Filesystem.readFile({
            path:'Location.json',
            directory: Directory.Data,
            encoding: Encoding.UTF8
        });
        if (typeof fr.data === 'string') {
            const locObj = JSON.parse(JSON.parse(fr.data).location);
            console.log(locObj);
            console.log(locObj.id);
            try {
                const res = await axios.get("http://localhost:3000/putAttendance", {
                    params: {
                        id:locObj.id
                    }
                });
                if ('Yes'===res.data){
                    setIsPres(true);
                } else {
                    setRes("/cross.svg");
                }
                console.log(res.data);
            } catch (err) {
                console.error(err);
            }
        }
    };

    let retry;
    if (!(res=="/tick.svg" && res2==res)&&(res!=""&&res2!="")){
        retry = <IonButton onClick={()=>{setImgSrc("");setRes("");setRes2("");}} >Try again</IonButton>;
    } else {
        retry = <IonButton disabled={!(res=="/tick.svg" && res2==res)} onClick={getAttendance}>Get Attendance</IonButton>;
    }

    return (
        <IonPage itemID="cam">
            <IonHeader>
                <IonToolbar className="title">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Attendance Verification</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {(!isPres)?(
            <div className="container">
                <div className="container">
                    <IonCard className="box">
                        <IonCardHeader><IonCardTitle>Step 1: <br/>Face Capture</IonCardTitle></IonCardHeader>
                        <IonCardContent>
                            <IonToolbar>
                                { (imgSrc)?<IonIcon src="/tick.svg" size="large" />:<CaptureFace onCap = {(s)=>setImgSrc(s)} /> }
                            </IonToolbar>
                        </IonCardContent>
                    </IonCard>
                </div>
                <div className="container">
                    <IonCard className="box">
                        <IonCardHeader><IonCardTitle>Step 2: <br/>Face Verification</IonCardTitle></IonCardHeader>
                        <IonCardContent>
                            <IonToolbar>
                                { (res)?<IonIcon src={res} size="large"></IonIcon>:<VerifyFace onVer = {(s) => setRes(s) } imgSrc = {imgSrc} /> }
                            </IonToolbar>
                        </IonCardContent>
                    </IonCard>
                </div>
                <div className="container">
                    <IonCard className="box">
                        <IonCardHeader><IonCardTitle>Step 3: <br/>Location Verification</IonCardTitle></IonCardHeader>
                        <IonCardContent>
                            <IonToolbar>
                                { (res2)?<IonIcon src={res2} size="large"></IonIcon>:<CheckLocation onVer = {(s) => setRes2(s) } /> }
                            </IonToolbar>
                        </IonCardContent>
                    </IonCard>
                </div>
                {retry}
                
            </div>):(
            <div itemID="res">
                <IonIcon src="/tick.svg" size="large"></IonIcon>
                <h1>Attendance updated</h1>
            </div>            
        )}
            </IonContent>
        </IonPage>
    );
}
export default deFaceChecker;
//