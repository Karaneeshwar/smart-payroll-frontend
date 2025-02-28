import { useState, CSSProperties, ReactEventHandler } from "react";
import { IonIcon, IonButton, IonPage, IonHeader, IonTitle, IonContent, IonToolbar, IonCard, IonCardTitle, IonCardContent, IonCardHeader, IonButtons, IonMenuButton, IonInput, IonLabel, IonText, IonList, IonItem, IonToast } from "@ionic/react";
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
import axios from "axios";
import './login.css';
import { Filesystem, Directory } from "@capacitor/filesystem"
import { saveJson } from "./loc";

interface q {
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
};

const Login: React.FC<q> = ({ setIsLogin }) => {
    const [form, setForm] = useState({userid:"", pwd:""});
    const [toast, setToast] = useState("");

    const submitForm:React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        console.log(form.userid);
        console.log(form.userid.slice(3));
        try {
            const res = await axios.get("http://localhost:3000/users/login", {
                params: {
                    id: form.userid.slice(3), 
                    pwd: form.pwd
                }
            });
            console.log("Works:"+res.data);
            if (res.data==="Yes"){
                console.log("Password correct");
                const imgRes = await axios.get("http://localhost:3000/users/img", { 
                    responseType: 'arraybuffer', 
                    params: {
                        id:form.userid.slice(3)
                    } 
                });
                const data64 = btoa(new Uint8Array(imgRes.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                const fwres = await Filesystem.writeFile({
                    path: "refimg.jpg",
                    directory: Directory.Library,
                    data: data64
                });
                console.log("File write results: "+fwres.uri);
                const locRes = await axios.get("http://localhost:3000/getloc", {
                    params: {
                        loc: form.userid.slice(0,3)
                    }
                });
                const loc = JSON.parse(locRes.data);
                loc['id'] = form.userid.slice(3);
                saveJson(loc);
                setIsLogin(true);
            } else {
                console.log("Password is wrong");
            }

        } catch (err){
            console.log(err);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="title">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <form onSubmit={submitForm} method="POST">
                    <IonList>
                        <IonItem className="input">
                            <IonInput 
                                label="Username" 
                                labelPlacement="floating" 
                                placeholder="Branch ID + Emp ID" 
                                type="text" 
                                name="userid" 
                                itemID="id"
                                onIonChange={(event)=>{
                                    setForm({...form, [event.target.name]:event.target.value});
                                    console.log(form);
                                }}
                                required
                            />
                        </IonItem>
                        <IonItem className="input">
                            <IonInput 
                                label="Password" 
                                labelPlacement="floating" 
                                placeholder="Enter Password" 
                                type="password" 
                                name="pwd" 
                                itemID="pwd" 
                                onIonChange={(event)=>{
                                    setForm({...form, [event.target.name]:event.target.value});
                                    console.log(form);
                                }}
                                required
                            />
                        </IonItem>
                    </IonList>
                    <IonButton type="submit"> Submit </IonButton>
                </form>
                <IonToast duration={3000} message={toast} isOpen={!!toast} onDidDismiss={()=>{setToast("")}} />
            </IonContent>
        </IonPage>
            
    );
};

export default Login;