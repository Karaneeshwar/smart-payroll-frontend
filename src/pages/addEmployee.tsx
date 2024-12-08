import { IonIcon, IonButton, IonPage, IonHeader, IonTitle, IonContent, IonToolbar, IonCard, IonCardTitle, IonCardContent, IonCardHeader, IonButtons, IonMenuButton, IonInput, IonLabel, IonText, IonList, IonItem, IonToast } from "@ionic/react";
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
import React, { useState } from "react";

interface f {
    empid:string,
    name: string,
    locid: string,
    pwd: string,
    file: File|null
}

const EmployeeForm: React.FC = () => {
    const [form, setForm] = useState<f>({ empid:"", name:"", locid:"", pwd:"", file:null });

    const handleFileChange:React.ChangeEventHandler<HTMLInputElement> = (event:React.ChangeEvent<HTMLInputElement>) => {
        console.log(typeof event.target.files[0]);
        setForm({...form, file:event.target.files[0]});
    };

    const submitForm:React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        console.log(form);
        const formData = new FormData();
        formData.append("empid", form.empid);
        formData.append("name", form.name);
        formData.append("locid", form.locid);
        formData.append("pwd", form.pwd);
        console.log(form.empid+'.'+form.file.name.split('.')[1]);
        formData.append("photo", form.file, form.empid+'.'+form.file.name.split('.')[1]);
        try {
            const res = await axios.post("http://localhost:3000/addusers", formData, {
                headers: {
                    "Content-Type":"multipart/form-data"
                }
            });
            console.log("Results:"+res.data);
            if (res.data==="Yes"){
                console.log("Works!!!!");
            } else {
                console.log("Go to node log");
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
            <IonContent >
                <form onSubmit={submitForm} method="POST">
                    <IonList>
                    <IonItem className="input">
                            <IonInput 
                                label="Branch ID" 
                                labelPlacement="floating" 
                                placeholder="3-Digit Branch ID" 
                                type="text"
                                name="locid" 
                                itemID="locid"
                                onIonChange={(event)=>{
                                    if (typeof event.target.value==='string'){
                                        setForm({...form, locid:event.target.value});
                                        console.log(form);    
                                    } else {
                                        console.log("Locid field wrong");
                                    }
                                }}
                                required
                            />
                        </IonItem>
                        <IonItem className="input">
                            <IonInput 
                                label="Employee ID" 
                                labelPlacement="floating" 
                                placeholder="3-Digit Emp-ID" 
                                type="text" 
                                name="empid" 
                                itemID="id"
                                onIonChange={(event)=>{
                                    if (typeof event.target.value==='string'){
                                        setForm({...form, empid:event.target.value});
                                        console.log(form);    
                                    } else {
                                        console.log("name field wrong");
                                    }
                                }}
                                required
                            />
                        </IonItem>
                        <IonItem className="input">
                            <IonInput 
                                label="Employee Name" 
                                labelPlacement="floating" 
                                placeholder="Employee Name" 
                                type="text" 
                                name="name" 
                                itemID="id"
                                onIonChange={(event)=>{
                                    if (typeof event.target.value==='string'){
                                        setForm({...form, name:event.target.value});
                                        console.log(form);    
                                    } else {
                                        console.log("name field wrong");
                                    }
                                }}
                                required
                            />
                        </IonItem>
                        <IonItem className="input">
                            <IonInput 
                                label="Password" 
                                labelPlacement="floating" 
                                placeholder="Password" 
                                type="password" 
                                name="pwd" 
                                itemID="pwd" 
                                onIonChange={(event)=>{
                                    if (typeof event.target.value==='string'){
                                        setForm({...form, pwd:event.target.value});
                                        console.log(form);
                                    } else {
                                        console.log("pwd field wrong");
                                    }
                                }}
                                required
                            />
                        </IonItem>
                        <IonItem>
                            <input type="file" name="profile" onChange={handleFileChange}  required />
                        </IonItem>
                    </IonList>
                    <IonButton type="submit"> Submit </IonButton>
                </form>
            </IonContent>
        </IonPage>      
    );
};

export default EmployeeForm;