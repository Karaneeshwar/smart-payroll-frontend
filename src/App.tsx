import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly 
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic 
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out 
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
//import './theme/variables.css';
import FaceChecker from './pages/Checkers';
import Login from './pages/login';
import { useState } from 'react';
//import checkLocation from './pages/loc';
import EmployeeForm from '../../admin-front/src/pages/addEmployee';

setupIonicReact();

const App: React.FC = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  return (
    <IonApp>
      <IonReactRouter>
        {(!isLoggedin)?<Login setIsLogin={setIsLoggedin}/>:
        <IonSplitPane contentId="main">
        <Menu setIsLogin={setIsLoggedin}/>
          <IonRouterOutlet id="main">
             <Route exact path="/Checkers">
             <FaceChecker/>
             </Route>
             <Route exact path='/addEmployee'>
              <EmployeeForm/>
             </Route>
             <Redirect exact from="/" to="/Checkers" />
          </IonRouterOutlet>
        </IonSplitPane>}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
