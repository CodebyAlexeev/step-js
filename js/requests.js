import { Visit } from './visits.js';

export class Requests extends Visit {
    constructor(doctor, token, form) {
        super(doctor);
        this.token = token;
        this.form = form;
    }

    async postVisit() {
        try {
            const response = await fetch('https://ajax.test-danit.com/api/v2/cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    "doctor": this.doctor,
                    "form": {
                        "goal": this.form.elements.goal.value,
                        "description": this.form.elements.description.value,
                        "priority": this.form.elements.priority.value,
                        "fullName": this.form.elements.fullName.value,
                        "preassure": this.form.elements.preassure.value,
                        "bodyWeight": this.form.elements.bodyWeight.value,
                        "cvd": this.form.elements.cvd.checked,
                        "lastDate": this.form.elements.lastDate.value,
                        "age": this.form.elements.age.value,
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.error('Помилка HTTP: ' + response.status);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
