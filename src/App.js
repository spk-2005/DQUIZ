import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import React from 'react';
import Admin from './admin';
import Source2 from './source2';
import Testpage from './testpage';
import Instruction from './instructions';
import Quiz from './quiz';
import Submittedusers from './submittedusers';
import Admintest from './admintest';
import Instruction2 from './instruction2';
import Question from './question';
import Quizf from './quizf';
import Registernew from './registernew';
import Registeredusers from './registeredusers';
import Middle from './middle';
import Test2 from './test2';
import Groupadding from './groupadding';
import Adminmenu from './adminmenu';
import Addingtests from './addingtests';
import Response from './response';
import Res from './res';
import Contact from './contact';
import { AuthProvider } from './authprovider';
import Privaterouter from './privaterouter';
import AddingQuestions from './addingquestions';

function App() {
  return (
    <>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/admin' element={<Admin />} />
          <Route path='/' element={<Source2 />} />
          <Route path='/admintest' element={<Admintest />} />
          <Route path='/testpage/:testId' element={<Testpage />} />
          <Route path='/instructions/:testId/:name/:email' element={<Instruction />} />
          <Route path='/quiz/:testId/:name/:email' element={<Quiz />} />
          <Route path="/quizf/:score/:selectedOptions/:questions/:name/:email/:time1/:time2/:testId/:marked/:ansmarked/:notvis" element={<Quizf />} />
          <Route path="/submittedusers/:testId" element={<Submittedusers />} />
          <Route path="/instruction2/:name" element={<Instruction2 />} />
          <Route path="/question/:name" element={<Question />} />
          <Route path="/registernew" element={<Privaterouter><Registernew/></Privaterouter>}/>
          <Route path="/middle/:status" element={<Middle/>}/>
          <Route path="/registeredusers" element={<Privaterouter><Registeredusers/></Privaterouter>}/>
          <Route path="/test2/:test/:name/:email" element={<Test2/>}/>
          <Route path="/groupadding" element={<Groupadding/>}/>
          <Route path='/adminmenu' element={<Privaterouter><Adminmenu/></Privaterouter>}/>
          <Route path='/addingtests' element={<Addingtests/>}/>
          <Route path="/res/:name/:email/:testId/:answered/:score/:timetaken/:finalresult/:questions/:perc" element={<Res/>} />
          <Route path="/response/:name/:email/:testId" element={<Response />} />
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/addingquestions' element={<Privaterouter><AddingQuestions/></Privaterouter>}/>
        </Routes>
      </Router>
      </AuthProvider>
    </>
  );
}

export default App;
