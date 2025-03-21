import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { logOutOutline, logOutSharp, informationCircleOutline, informationCircleSharp, archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp, checkmarkDoneCircleOutline, checkmarkDoneCircleSharp } from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Get Attendance',
    url: '/Checkers',
    iosIcon: checkmarkDoneCircleOutline,
    mdIcon: checkmarkDoneCircleSharp
  }
];

const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

interface q {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>  
};

const Menu: React.FC<q> = ({setIsLogin}) => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Employee Attendance</IonListHeader>
          <IonNote>Geo-Cam Verification</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
      <IonList><IonItem></IonItem></IonList>
      <IonItem onClick={()=>{setIsLogin(false)}}>
        <IonIcon aria-hidden="true" slot="start" md={logOutSharp} ios={logOutOutline} />
        <IonLabel>Logout</IonLabel>
      </IonItem>
    </IonMenu>
  );
};

export default Menu;
