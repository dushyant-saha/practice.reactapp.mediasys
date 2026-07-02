import './../App.css';
import React, { useState, useEffect } from 'react';
import Tooltip from 'bootstrap/js/src/tooltip';

const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // This code runs AFTER the component shows up on the screen
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
  }, []);

  return (
    <button type="button" className="btn btn-warning fs-5 fw-bold px-5" data-bs-toggle="tooltip" title="Tooltip text" onClick={() => setCount(count + 1)}>
      Keep Count: {count}
    </button>
  );
};

const AlertHolder = () => {
  return (
    <div id="liveAlertPlaceholder"></div>
  );
};

const AlertButton = () => {

  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
  const alertTrigger = document.getElementById('liveAlertBtn');
  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
  }

  return (
    <button type="button" className="btn btn-primary" id="liveAlertBtn" onClick={() => {
      if (alertTrigger) {
        appendAlert('Nice, you triggered this alert message!', 'success');
      }
    }}>Show live alert</button>
  );
};

const Alert = () => {
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: "", type: "" })
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  return (
    <div>
      <div id="liveAlertPlaceholder">
        {!alert.show ? null : (
          <div className={`alert alert-${alert.type} alert-dismissible`} role="alert">
            <div>${alert.message}</div>
            <button type="button" className="btn-close" onClick={() => { setAlert({ show: false, message: "", type: "" }) }}></button>
          </div>
        )}
      </div>
      <button type="button" className="btn btn-primary" id="liveAlertBtn" onClick={() => { setAlert({ show: true, message: "New Alert!!!!!", type: "warning" }) }}>Show live alert</button>
    </div>
  );
};


function UserData() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // This code runs AFTER the component shows up on the screen
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUserData(data);
        console.log(data)
      }
      );
  }, []);

  return <div>{userData ? userData[0].name : "Loading..."}</div>;
}



const Clock = () => {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setInterval(()=>{
      const now = new Date();
      setTime(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
    },1000);
    console.log("run")
    setTime()
  }, []);
  return (
    <button type="button" className="btn btn-secondary" data-bs-toggle="tooltip" title="Tooltip text">
      <h1>{time}</h1>
    </button>
  );
};

const NewCounter = () => {
  const [A, updateA] = useState(0);

  return (
    <button className='btn btn-primary' onClick={() => { updateA(A + 1) }}>
      <p className='mb-0'>Count: {A}</p>
    </button>
  );
}


export const HookPractice = () => {
  return (
    <section>
      <div className='custom-row'>
        <h2 className='mt-2'>Counter</h2>
        <Counter />
      </div>
      <div className='custom-row'>
        <h2 className='mt-5'>Alert</h2>
        <AlertHolder />
        <AlertButton />
      </div>
      <div className='custom-row'>
        <h2 className='mt-5'>React Alert</h2>
        <Alert />
      </div>
      <div className='custom-row'>
        <h2 className='mt-5'>User Data</h2>
        <UserData />
      </div>
      <div className='custom-row'>
        <h2 className='mt-5'>Clock</h2>
        <Clock />
      </div>
    </section>
  );

};
