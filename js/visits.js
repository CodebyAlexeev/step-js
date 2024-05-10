export class Visit {
    constructor(doctor) {
        this.doctor = doctor;
    }

    fieldsForRecording() {
        document.getElementById('fieldsRecording').removeAttribute('hidden');
    }
}

export class VisitCardiologist extends Visit {
    fieldsForRecording() {
        super.fieldsForRecording();
        document.getElementById('cardiologistFields').style.display = 'block';
        document.getElementById('dentistFields').style.display = 'none';
        document.getElementById('therapistFields').style.display = 'block';
    }
}

export class VisitDentist extends Visit {
    fieldsForRecording() {
        super.fieldsForRecording();
        document.getElementById('cardiologistFields').style.display = 'none';
        document.getElementById('dentistFields').style.display = 'block';
        document.getElementById('therapistFields').style.display = 'none';
    }
}

export class VisitTherapist extends Visit {
    fieldsForRecording() {
        super.fieldsForRecording();
        document.getElementById('cardiologistFields').style.display = 'none';
        document.getElementById('dentistFields').style.display = 'none';
        document.getElementById('therapistFields').style.display = 'block';
    }
}
