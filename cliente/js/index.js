import { Check } from './check.js';
import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

const useSocketIO = 1; // Cambia a 0 para usar fetch


// vemos si se va a usar socket.io o fetch
let socket;
if (useSocketIO===1) {
  socket = io('http://localhost:3000');
} else {
  socket = null;
}

const Cliente = {
  // enviamos los datos al servidor
  send: (data) => {
      if (useSocketIO) {
        // en caso de usar socket.io enviamos los datos al servidor a través de un evento que hemos creado
        socket.emit('estadoActualizado', data);
      } else {
          // en caso de usar fetch enviamos los datos al servidor a través de un POST
          fetch('http://localhost:3000/api/estado', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          })
              .then(response => {
                  // controlamos si hay un error en la respuesta, en caso de haberlo se muestra en consola
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
      }
  },
    // obtenemos los estados (por fetch) de los checkbox controlando si hay error en la respuesta
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

// inicializamos los checkboxs
const initializeChecks = async () => {
    const configuracion = await Cliente.fetchConfiguracion();
    const estados = await Cliente.fetchEstados();

    // vamos recorriendo los grupos de riego y creando sus checkboxs
    const checks = Object.keys(configuracion).map(grupo => {
        const parentElement = document.getElementById(grupo);
        if (!parentElement) {
            console.error(`Elemento con ID ${grupo} no encontrado en el DOM`);
            return null;
        }
        // usamos la clase Check para crear los checkboxs ue hemos obtenido de la configuración
        const check = new Check(parentElement, Cliente, grupo);
        configuracion[grupo].forEach(name => {
            const estado = estados.find(e => e.name === `${grupo}-${name}`);
            const initialState = estado ? estado.state : false;
            check.addCheck(name, initialState);
        });
        return check;
    }).filter(check => check !== null);

    estados.forEach(({ name, state }) => {
        const check = checks.find(c => c.states.some(s => s.name === name));
        if (check) {
            check.changeValue(name, state);
        }
    });

    if (useSocketIO) {
        // En caso de usar socket.io, escuchamos el evento que hemos creado para actualizar los estados a tiempo real sin tener que recargar la página
        socket.on('estadoActualizado', ({ name, state }) => {
            const check = checks.find(c => c.states.some(s => s.name === name));
            if (check) {
                check.changeValue(name, state);
            }
        });
    }
};

initializeChecks();