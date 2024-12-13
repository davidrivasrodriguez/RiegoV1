export class Check {
    constructor(parent, client, group) {
        this.parent = parent;
        this.client = client;
        this.group = group;
        this.states = [];
    }

    changeValue(name, value) {
        const data = this.states.find((item) => item.name == name);
        if (data) {
            data.state = value;
            const check = this.parent.querySelector(`label.form-switch[data-name="${name}"]`);
            if (check) {
                const span = check.querySelector('span');
                if (span) {
                    span.textContent = value ? 'ON' : 'OFF';
                }
                const input = check.querySelector('input');
                if (input) {
                    input.checked = value;
                }
            }
            // Aquí se envía el mensaje al servidor
            this.client.send({ name: name, state: value });
        }
    }

    addCheck(name, initialState = false) {
        const id = `${this.group}-${name}`;
        this.states.push({
            name: id,
            state: initialState
        });
        const check = document.createElement("label");
        check.classList.add("form-switch");
        check.setAttribute('data-name', id);
        this.parent.appendChild(check);
        const input = document.createElement("input");
        input.setAttribute('type', 'checkbox');
        input.checked = initialState;
        check.appendChild(input);
        check.appendChild(document.createElement("i"));
        const span = document.createElement('span');
        const text = document.createTextNode(initialState ? 'ON' : 'OFF');
        span.appendChild(text);
        check.appendChild(span);
        input.addEventListener('change', (event) => {
            this.changeValue(id, event.target.checked);
        });
    }
}