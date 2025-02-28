import { IonIcon, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonList, IonItem, IonButton, IonText, IonAlert } from '@ionic/react';
import axios from 'axios';
import './Tab3.css';
import './login.css'
import { Geolocation, Position } from "@capacitor/geolocation";
import { SetStateAction, useState } from 'react';

interface f {
  name:string
};

interface r {
  loc:string,
  setLoc:React.Dispatch<SetStateAction<string>>
}

const GetLocStr: React.FC<r> = ({loc,setLoc}) => {
    const getLoc = async() => {
      const pos = await Geolocation.getCurrentPosition({
          timeout: 10000
      }); 
      console.log(pos.coords);
      const loci = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      }
      setLoc(JSON.stringify(loci));
    }
    return (
      <div>
        <IonButton onClick={getLoc}>Get Current Location</IonButton>
        <IonText>{loc}</IonText>
      </div>
    );
};

const Tab3: React.FC = () => {
  const [isAdded, setIsAdded] = useState(false);
  const [loc, setLoc] = useState("");
  const [form, setForm] = useState<f>({ name:"" });
  const submitForm:React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    console.log(form);
    try {
        const res = await axios.get("http://localhost:3000/addloc", {
            params: {
                name:form.name,
                loc:loc
            }
        });
        console.log("Results:"+res.data);
        if (res.data==="Yes"){
            console.log("Works!!!!");
            setIsAdded(true);
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
            <IonTitle>Add Branch</IonTitle>
          </IonToolbar>
      </IonHeader>
      <IonContent >
                <form onSubmit={submitForm} >
                    <IonList>
                        <IonItem className="input">
                            <IonInput 
                                label="Branch Name" 
                                labelPlacement="floating" 
                                placeholder="Branch Name" 
                                type="text"
                                name="name" 
                                itemID="locid"
                                onIonChange={(event)=>{
                                    if (typeof event.target.value==='string'){
                                        setForm({...form, name:event.target.value});
                                        console.log(form);    
                                    } else {
                                        console.log("Locid field wrong");
                                    }
                                }}
                                required
                            />
                        </IonItem>
                        <IonItem className='input'>
                            <GetLocStr loc={loc} setLoc={setLoc} />
                        </IonItem>
                    </IonList>
                    <IonButton type="submit"> Submit </IonButton>
                </form>
                <IonAlert message={"Branch registered successfully!!"} isOpen={isAdded} buttons={['ok']}></IonAlert>
                </IonContent>
    </IonPage>
  );
};

export default Tab3;
