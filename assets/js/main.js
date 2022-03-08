const home_button = document.querySelector('#button');
const modal = document.querySelector('#modal');
const modal_content = document.querySelectorAll('.modal-content_')[0];
const modal_loader = document.querySelectorAll('.loader')[0];

const form = document.querySelector('#form');
const email = document.querySelector('#email');
const name = document.querySelector('#name');

const _title = document.querySelector('#title');
const _author = document.querySelector('#author');
const _counter = document.querySelector('#counter');

const modal_exit = document.querySelector('#exit');

if(form) form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = JSON.parse(localStorage.getItem('users'));
    const name_ = name.value;
    const email_ = email.value;

    if(!name_ || !email_) return alert('All fields are required');

    const emailExists = data.find((entry) => entry.email === email_);

    const nameExists = data.find((entry) => entry.name === name_);

    if(emailExists) return alert('Duplicate email');

    if(nameExists) return alert('Name already exists in database');

    const entry = {
        name: name_,
        email: email_
    };

    data.push(entry);
    
    localStorage.setItem('users', JSON.stringify(data));
    
    localStorage.setItem('user', email_);

    alert('Added successfully');

    window.location.href = './dashboard.html';
});

if(home_button) home_button.addEventListener('click', (e) => {
    
    modal.classList.remove('hidden');
    modal_loader.classList.remove('hidden');
    modal_loader.classList.add('whitish');
    modal_content.classList.add('hidden');
    
    modal_loader.textContent = `Preparing, please wait....`;

    setTimeout(() => {
        if(localStorage.getItem('user')) window.location.href = './dashboard.html';
        else localStorage.setItem('users', JSON.stringify([{"name": "null", "email": "null"}]));
        modal_loader.classList.add('hidden');
        modal_content.classList.remove('hidden');
    }, 1500);
});

modal_exit.addEventListener('click', (e) => {
    modal.classList.add('hidden');

    localStorage.removeItem('edit');

    localStorage.removeItem('item_id');

    localStorage.removeItem('lendable');

    _title.value = '';
    _author.value = '';
    _counter.value = '';

    const _name_label = document.querySelector("label[for='title']");
    const _phone_label = document.querySelector("label[for='author']");
    const _book_label = document.querySelector("label[for='counter']");

    _name_label.textContent = 'Title';
    _phone_label.textContent = 'Author';
    _book_label.textContent = 'Instances (number of books with this title)';
});