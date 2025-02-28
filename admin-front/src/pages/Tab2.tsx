import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonList, IonItem, IonButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import axios from 'axios';
import { useState } from 'react';

interface f {
  empid:string,
  locid:string
}

const Tab2: React.FC = () => {
    const [form, setForm] = useState<f>({ empid:"", locid:"" });
    
    const submitForm:React.FormEventHandler<HTMLFormElement> = async (event) => {
      event.preventDefault();
      console.log(form);
      try {
          const res = await axios.get("http://localhost:3000/reloc", {
              params: {
                  id:form.empid,
                  locid:form.locid
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
            <IonTitle>Transfer Employee</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent >
                <form onSubmit={submitForm} >
                    <IonList>
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
                                label="New Branch ID" 
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
                    </IonList>
                    <IonButton type="submit"> Submit </IonButton>
                </form>
            </IonContent>
    </IonPage>
  );
};

export default Tab2;
