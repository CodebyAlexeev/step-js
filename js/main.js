import { Modal } from './modal.js';
import { VisitCardiologist, VisitDentist, VisitTherapist } from './visits.js';
import { Requests } from './requests.js';

const doc = document.getElementById('selectDoctor');
const fieldsRecording = document.getElementById('fieldsRecording');
const token = '9ff0d259-d0b4-436b-8f25-83a559d74127';

// Модальное окно для входа
const loginModal = new Modal('myModal');

document.getElementById('loginBtn').addEventListener('click', () => {
    loginModal.open();
});

document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    
    if (email === 'user@example.com' && password === 'password') {
        const createVisitBtn = document.getElementById('createVisitBtn');
        const loginBtn = document.getElementById('loginBtn');
        
        createVisitBtn.style.display = 'block';
        loginBtn.style.display = 'none';

        loginModal.close();
    } else {
        alert('Неправильний email або пароль');
    }
});

// Модальное окно для создания визита
const visitModal = new Modal('modalVisit');
const visitForm = document.getElementById('visitForm');

document.getElementById('createVisitBtn').addEventListener('click', () => {
    visitModal.open();
});

// Разворачивание полей для записи
document.addEventListener('input', (event) => {
    if (event.target.id === 'selectDoctor' && event.target.value !== 'choose') {
        fieldsRecording.style.display = 'block';
        switch (event.target.value) {
            case 'cardiologist':
                const cardiologist = new VisitCardiologist();
                cardiologist.fieldsForRecording();
                break;
            case 'dentist':
                const dentist = new VisitDentist();
                dentist.fieldsForRecording();
                break;
            case 'therapist':
                const therapist = new VisitTherapist();
                therapist.fieldsForRecording();
                break;
        }
    } else if (event.target.id === 'selectDoctor' && event.target.value === 'choose') {
        fieldsRecording.style.display = 'none';
    }
});

visitForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const goal = document.getElementById('goal').value;
    const description = document.getElementById('description').value;
    const fullName = document.getElementById('fullName').value;
    const preassure = document.getElementById('preassure').value;
    const bodyWeight = document.getElementById('bodyWeight').value;
    const age = document.getElementById('age').value;
    const lastDate = document.getElementById('lastDate').value;

    let validFields = [];
    let sendRequest = false;

    switch (doc.value) {
        case 'cardiologist':
            validFields = [goal, description, fullName, preassure, bodyWeight, age];
            break;
        case 'dentist':
            validFields = [goal, description, fullName, lastDate];
            break;
        case 'therapist':
            validFields = [goal, description, fullName, age];
            break;
    }

    const isValid = validFields.every(field => field.trim() !== '');

    if (!isValid) {
        alert('Будь ласка, заповніть всі поля');
        return;
    } else {
        sendRequest = true;
    }

    if (sendRequest) {
        const sendRequestInstance = new Requests(doc.value, token, visitForm);
        sendRequestInstance.postVisit();
        visitModal.close();

        const formData = {
            goal,
            description,
            fullName,
            preassure,
            bodyWeight,
            age,
            lastDate,
            doc: doc.value
        };

        addVisit(formData);
    }
});

// Функция для обновления состояния сообщения о пустой доске
function updateBoardMessage() {
    const visitContainer = document.getElementById('visitContainer');
    const messageElement = document.getElementById('nameDoctor');

    if (visitContainer.children.length === 0) {
        messageElement.style.display = 'block';
    } else {
        messageElement.style.display = 'none';
    }
}

// Функція збереження карток у локальне сховище
function saveVisitsToLocalStorage(visits) {
    localStorage.setItem('visits', JSON.stringify(visits));
}

// Функція для завантаження карток з локального сховища
function loadVisitsFromLocalStorage() {
    const visitsJSON = localStorage.getItem('visits');
    if (visitsJSON) {
        return JSON.parse(visitsJSON);
    } else {
        return [];
    }
}

// Функція для створення візитної картки
function createVisitCard(data) {
    const visitContainer = document.getElementById('visitContainer');

    const card = document.createElement('div');
    card.className = 'visit-card';
    card.style.border = '1px solid #ccc';
    card.style.padding = '10px';
    card.style.marginBottom = '10px';
    card.style.position = 'relative';

    card.setAttribute('data-status', data.status || '');
    card.setAttribute('data-priority', data.priority || '');
    

    const deleteIcon = document.createElement('span');
    deleteIcon.textContent = '❌';
    deleteIcon.style.position = 'absolute';
    deleteIcon.style.top = '5px';
    deleteIcon.style.right = '5px';
    deleteIcon.style.cursor = 'pointer';

    // видаляємо картку
    deleteIcon.onclick = () => {
        visitContainer.removeChild(card);

        const visits = loadVisitsFromLocalStorage();
        const updatedVisits = visits.filter(v => v.id !== data.id);
        saveVisitsToLocalStorage(updatedVisits);

        updateBoardMessage();
    };
    card.appendChild(deleteIcon);

    const fullNameElement = document.createElement('p');
    fullNameElement.textContent = `Повне ім'я: ${data.fullName}`;
    card.appendChild(fullNameElement);

    const doctorElement = document.createElement('p');
    doctorElement.textContent = `Лікар: ${data.doc}`;
    card.appendChild(doctorElement);

    const additionalInfo = document.createElement('div');
    additionalInfo.style.display = 'none';

    const goalElement = document.createElement('p');
    goalElement.textContent = `Мета візиту: ${data.goal}`;
    additionalInfo.appendChild(goalElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = `Опис: ${data.description}`;
    additionalInfo.appendChild(descriptionElement);

    const priorityElement = document.createElement('p');
    priorityElement.textContent = `Терміновість: ${data.priority}`;
    additionalInfo.appendChild(priorityElement);

    if (data.doc === 'cardiologist') {
        const preassureElement = document.createElement('p');
        preassureElement.textContent = `Тиск: ${data.preassure}`;
        additionalInfo.appendChild(preassureElement);

        const bodyWeightElement = document.createElement('p');
        bodyWeightElement.textContent = `Вага: ${data.bodyWeight}`;
        additionalInfo.appendChild(bodyWeightElement);

        const ageElement = document.createElement('p');
        ageElement.textContent = `Вік: ${data.age}`;
        additionalInfo.appendChild(ageElement);
    } else if (data.doc === 'dentist') {
        const lastDateElement = document.createElement('p');
        lastDateElement.textContent = `Дата останнього візиту: ${data.lastDate}`;
        additionalInfo.appendChild(lastDateElement);
    } else if (data.doc === 'therapist') {
        const ageElement = document.createElement('p');
        ageElement.textContent = `Вік: ${data.age}`;
        additionalInfo.appendChild(ageElement);
    }

    card.appendChild(additionalInfo);

    // // Кнопка "Показати більше"
    const showMoreBtn = document.createElement('button');
    showMoreBtn.textContent = 'Показати більше';
    showMoreBtn.style.padding = '10px 20px';
    showMoreBtn.style.borderRadius = '5px';
    showMoreBtn.style.backgroundColor = 'aquamarine';
    showMoreBtn.style.color = 'black';
    showMoreBtn.addEventListener('mouseover', () => {
        showMoreBtn.style.backgroundColor = '#1dedb2'; 
    });
    
    showMoreBtn.addEventListener('mouseout', () => {
        showMoreBtn.style.backgroundColor = 'aquamarine';
    });
    showMoreBtn.onclick = () => {
        additionalInfo.style.display = additionalInfo.style.display === 'none' ? 'block' : 'none';
        showMoreBtn.textContent = additionalInfo.style.display === 'none' ? 'Показати більше' : 'Сховати';
    };
    card.appendChild(showMoreBtn);

    // Кнопка "Редагувати"
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Редагувати';
    editBtn.style.padding = '10px 20px';
    editBtn.style.borderRadius = '5px';
    editBtn.style.backgroundColor = 'aquamarine';
    editBtn.style.color = 'black';
    editBtn.addEventListener('mouseover', () => {
        editBtn.style.backgroundColor = '#1dedb2'; 
    });
    
    editBtn.addEventListener('mouseout', () => {
        editBtn.style.backgroundColor = 'aquamarine';
    });
    editBtn.onclick = () => editVisitCard(card, data);
    card.appendChild(editBtn);

    visitContainer.appendChild(card);
    updateBoardMessage();
}

// функція додавання візиту
function addVisit(data) {
    const visits = loadVisitsFromLocalStorage();
    data.id = Date.now();
    visits.push(data);
    saveVisitsToLocalStorage(visits);
    createVisitCard(data);
}

updateBoardMessage();

// Завантажити картки з локального сховища
const savedVisits = loadVisitsFromLocalStorage();
savedVisits.forEach(visit => createVisitCard(visit));

// Редагувати візитну картку
function editVisitCard(card, data) {
    card.innerHTML = '';

    const formFields = [
        { label: "Повне ім'я", name: "fullName", value: data.fullName },
        { label: "Мета візиту", name: "goal", value: data.goal },
        { label: "Опис", name: "description", value: data.description },
    ];

    if (data.doc === 'cardiologist') {
        formFields.push({ label: "Тиск", name: "preassure", value: data.preassure });
        formFields.push({ label: "Вага", name: "bodyWeight", value: data.bodyWeight });
        formFields.push({ label: "Вік", name: "age", value: data.age });
    } else if (data.doc === 'dentist') {
        formFields.push({ label: "Дата останнього візиту", name: "lastDate", value: data.lastDate });
    } else if (data.doc === 'therapist') {
        formFields.push({ label: "Вік", name: "age", value: data.age });
    }

    formFields.forEach(field => {
        const label = document.createElement('label');
        label.textContent = field.label;
        card.appendChild(label);

        const input = document.createElement('input');
        input.name = field.name;
        input.value = field.value;
        card.appendChild(input);
    });

    // Кнопка збереження
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Зберегти';
    saveBtn.style.padding = '10px 20px';
    saveBtn.style.borderRadius = '5px';
    saveBtn.style.backgroundColor = 'aquamarine';
    saveBtn.style.color = 'black';
    saveBtn.addEventListener('mouseover', () => {
        saveBtn.style.backgroundColor = '#1dedb2'; 
    });
    
    saveBtn.addEventListener('mouseout', () => {
        saveBtn.style.backgroundColor = 'aquamarine';
    });
    saveBtn.onclick = () => {
        formFields.forEach(field => {
            data[field.name] = card.querySelector(`input[name="${field.name}"]`).value;
        });

        // оновити локальне сховище
        const visits = loadVisitsFromLocalStorage();
        const index = visits.findIndex(v => v.id === data.id);
        visits[index] = data;
        saveVisitsToLocalStorage(visits);

        card.innerHTML = '';
        createVisitCard(data);
    };
    card.appendChild(saveBtn);
}

// Фільтрування карток
function filterCards() {
    const searchTitle = document.getElementById('search').value.toLowerCase();
    const status = document.getElementById('status').value;
    const urgency = document.getElementById('urgency').value;

    const visitContainer = document.getElementById('visitContainer');
    const cards = visitContainer.getElementsByClassName('visit-card');

    Array.from(cards).forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        const cardPriority = card.getAttribute('data-priority');
        const cardTitle = card.querySelector('p').textContent.toLowerCase();
    
        const matchesSearch = cardTitle.includes(searchTitle);
        const matchesStatus = !status || cardStatus === status;
        const matchesPriority = !urgency || cardPriority === urgency;
    
        card.style.display = matchesSearch && matchesStatus && matchesPriority ? '' : 'none';
    });
    
}

document.getElementById('search').addEventListener('input', filterCards);
document.getElementById('status').addEventListener('change', filterCards);
document.getElementById('urgency').addEventListener('change', filterCards);
