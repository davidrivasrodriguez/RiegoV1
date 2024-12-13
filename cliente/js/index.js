import { Check } from './check.js';

const Cliente = {
    send: (data) => {
        fetch('http://localhost:3000/api/estado', {
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
                console.log('Estado actualizado:', data);
                localStorage.setItem(data.name, data.state);
            })
            .catch(error => {
                console.error('Error al actualizar el estado:', error);
            });
    },
    fetchEstados: () => {
        return fetch('http://localhost:3000/api/estado')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error al obtener los estados:', error);
            });
    }
}

const initializeChecks = async () => {
    const estados = await Cliente.fetchEstados();
    const check1 = new Check(document.getElementById("grupo1"), Cliente, "grupo1");
    check1.addCheck("riego1");
    check1.addCheck("riego2");

    const check2 = new Check(document.getElementById("grupo2"), Cliente, "grupo2");
    check2.addCheck("riego1");
    check2.addCheck("riego2");
    check2.addCheck("riego3");
    check2.addCheck("riego4");

    const check3 = new Check(document.getElementById("grupo3"), Cliente, "grupo3");
    check3.addCheck("riego1");
    check3.addCheck("riego2");

    const check4 = new Check(document.getElementById("grupo4"), Cliente, "grupo4");
    check4.addCheck("riego1");
    check4.addCheck("riego2");
    check4.addCheck("riego3");

    estados.forEach(({ name, state }) => {
        const check = [check1, check2, check3, check4].find(c => c.states.some(s => s.name === name));
        if (check) {
            check.changeValue(name, state);
        }
    });

    [check1, check2, check3, check4].forEach(check => {
        check.states.forEach(({ name }) => {
            const state = localStorage.getItem(name) === 'true';
            check.changeValue(name, state);
        });
    });
};

initializeChecks();