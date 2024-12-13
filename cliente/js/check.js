export class Check {
    constructor(parent, client) {
        this.parent = parent;
        this.client = client;
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
            }
        }
    }

    addCheck(name) {
        this.states.push({
            name: name,
            state: false
        });
        const check = document.createElement("label");
        check.classList.add("form-switch");
        check.setAttribute('data-name', name);
        this.parent.appendChild(check);
        const input = document.createElement("input");
        input.setAttribute('type', 'checkbox');
        check.appendChild(input);
        check.appendChild(document.createElement("i"));
        const span = document.createElement('span');
        const text = document.createTextNode('OFF');
        span.appendChild(text);
        check.appendChild(span);
        input.addEventListener('change', (event) => {
            this.changeValue(name, event.target.checked);
        });
    }
}