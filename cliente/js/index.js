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
    },
    fetchConfiguracion: () => {
        return fetch('http://localhost:3000/api/configuracion')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error al obtener la configuración:', error);
            });
    }
}

const initializeChecks = async () => {
    const configuracion = await Cliente.fetchConfiguracion();
    const estados = await Cliente.fetchEstados();

    const checks = Object.keys(configuracion).map(grupo => {
        const check = new Check(document.getElementById(grupo), Cliente, grupo);
        configuracion[grupo].forEach(name => {
            const estado = estados.find(e => e.name === `${grupo}-${name}`);
            const initialState = estado ? estado.state : false;
            check.addCheck(name, initialState);
        });
        return check;
    });

    estados.forEach(({ name, state }) => {
        const check = checks.find(c => c.states.some(s => s.name === name));
        if (check) {
            check.changeValue(name, state);
        }
    });
};

initializeChecks();