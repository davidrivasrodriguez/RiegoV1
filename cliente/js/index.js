import { Check } from './check.js';

const Cliente = {
    send: (data)=>{
        fetch('http://localhost:3000/api/items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log('Ítem creado:', data);
            })
            .catch(error => {
              console.error('Error al crear el ítem:', error);
            });
          
    }
}

const check1 = new Check(document.getElementById("grupo1"),Cliente);
check1.addCheck("riego1");
check1.addCheck("riego2");

const check2 = new Check(document.getElementById("grupo2"),Cliente);
check2.addCheck("riego1");
check2.addCheck("riego2");
check2.addCheck("riego3");
check2.addCheck("riego4");

const check3 = new Check(document.getElementById("grupo3"),Cliente);
check3.addCheck("riego1");
check3.addCheck("riego2");

const check4 = new Check(document.getElementById("grupo4"),Cliente);
check4.addCheck("riego1");
check4.addCheck("riego2");
check4.addCheck("riego3");