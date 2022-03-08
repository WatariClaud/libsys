const home_button_ = document.querySelector('#button_');

const sort_by = document.querySelector('#button__');

const userText = document.querySelector('#user');

const v = document.querySelectorAll('.data-sort')[0];

const book_data_text = document.querySelector('#lib-data-intro');

const shelf_data = document.querySelector('#shelf-data');

const f = document.querySelector('#f');

const top_button = document.querySelector('#top');

const button_add_entry = document.querySelectorAll('.button_add_entry')[0];

const sort_form = document.querySelector('#sorter_select');

const sort_form_submit = document.querySelector('#sort-submit');

const sort_form_cancel = document.querySelector('#cancel-sort-submit');

const sort_param = document.querySelectorAll("input[name='sort-param']");

const sort_input = document.querySelector('#sort-input');

const data = JSON.parse(localStorage.getItem('users'));

const books_data = JSON.parse(localStorage.getItem('books'));

let borrowers_data = JSON.parse(localStorage.getItem('borrowers'));

const user = localStorage.getItem('user');

const form_ = document.querySelector('#form_');
const title = document.querySelector('#title');
const author = document.querySelector('#author');
const counter = document.querySelector('#counter');

if(!user) {

    document.body.innerHTML = `<br/><p class = 'purplish'>&emsp;An error occured, redirecting....</p>`;
    
    setTimeout(() => {
        window.location.href = './index.html';
    }, 2000);
}

let position = 4;

const show_data = () => {

    if(!books_data) {

        document.body.innerHTML = `<br/><p class = 'purplish'>&emsp;An error occured, redirecting....</p>`;
    
        setTimeout(() => {
            window.location.href = './dashboard.html';
        }, 2000);
    }  else {
        if(!borrowers_data) {

            document.body.innerHTML = `<br/><p class = 'purplish'>&emsp;An error occured, redirecting....</p>`;
        
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 2000);
        } else {

            borrowers_data = borrowers_data.reverse();

            shelf_data.innerHTML = '';
            book_data_text.textContent = 'Your lendings information';
        
            borrowers_data.forEach((borrower, index) => {
    
                if(position >= index) {
                    shelf_data.innerHTML += `
                        <div id = borrower-${borrower.id} class = 'borrower-item'>
                            <p><strong>Request Id: </strong>${borrower.id}</p>
                            <p><strong>Name: </strong>${borrower.name}</p>
                            <p><strong>Phone: </strong>${borrower.phone}</p>
                            <p><strong>Book: </strong>${borrower.book}</p>
                            <p><strong>Borrowed on: </strong>${borrower.borrowed_date}</p>
                            <p><strong>Due on: </strong>${borrower.due_date }</p>
                            ${borrower.returned ? `<button id = 'returned-${borrower.id}' class = 'act-button returned'>Returned</button>` : `<button id = 'return-${borrower.id}' class = 'act-button return'>Return</button>`}
                        </div>
                    `;
                }
    
                if(borrowers_data.length < position) {
                    f.textContent =`No more data to show`;
                    f.classList.remove('hidden');
                    document.querySelector('#more-b').classList.add('hidden');

                    return;
                }
                else document.querySelector('#more-b').classList.remove('hidden');
            });
    
        }
    }
};

show_data();

const userExists = data.find((user_) => user_.email === user);

if(!userExists) {

    document.body.innerHTML = `<br/><p class = 'purplish'>&emsp;An error occured, redirecting....</p>`;

    setTimeout(() => {
        window.location.href = './index.html';
    }, 2000);
}

userText.textContent = userExists.name;

home_button_.addEventListener('click', (e) => {
    window.location.href = './dashboard.html';
});

const return_button = document.querySelectorAll('.return');

return_button.forEach((button) => {
    button.addEventListener('click', (e) => {
        
        const borrow = borrowers_data.find((borrow) => borrow.id.toString() === e.target.id.split('return-')[1]);
        
        const book = books_data.find((book) => book.title === borrow.book);

        const today = new Date().toString();

        let is_penalty_paid = 'no';

        if(today > borrow.due_date){

            is_penalty_paid =  prompt('Late penalty of Ksh. 20 will be charged');
            
            if(is_penalty_paid !== 'yes') return alert('Penalty must be paid before returning');
        }

        borrow.returned = true;

        book.counter = parseInt(book.counter) + 1;

        localStorage.setItem('books', JSON.stringify(books_data));

        localStorage.setItem('borrowers', JSON.stringify(borrowers_data));

        alert(`${borrow.name} has returned ${book.title}. Updated successfully`);

        window.location.reload();
    });
});


if(document.querySelector('#more-b')) {
    document.querySelector('#more-b').addEventListener('click', () => {
        document.querySelector('#more-b').classList.add('hidden');
        shelf_data.innerHTML += `<section id = 'sd-p'><br/><p class = 'purplish'>Checking your data....</p></div>`;

        setTimeout(() => {
            position += 4;
            show_data();
            top_button.classList.remove('hidden');
        }, 2000);
    });
};

const sort_by_date = (date_from, date_to) => {
    if(!date_from || !date_to) {
        alert('Date range is invalid');
        return shelf_data.innerHTML = `<br/><p class = 'purplish'>An error occured</p>`;
    };
    if(date_from > date_to) {
        alert('Date range is invalid');
        return shelf_data.innerHTML = `<br/><p class = 'purplish'>An error occured</p>`;
    }
    
    borrowers_data.forEach((borrower) => {
        console.log(date_from.toString() && borrower.due_date <= date_to)
        console.log(borrower.borrowed_date >= date_from && borrower.due_date <= date_to)
        if(borrower.borrowed_date >= date_from && borrower.due_date <= date_to) {
            shelf_data.innerHTML += `
                <div id = borrower-${borrower.id} class = 'borrower-item'>
                    <p><strong>Request Id: </strong>${borrower.id}</p>
                    <p><strong>Name: </strong>${borrower.name}</p>
                    <p><strong>Phone: </strong>${borrower.phone}</p>
                    <p><strong>Book: </strong>${borrower.book}</p>
                    <p><strong>Borrowed on: </strong>${borrower.borrowed_date}</p>
                    <p><strong>Due on: </strong>${borrower.due_date }</p>
                    ${borrower.returned ? `<button id = 'returned-${borrower.id}' class = 'act-button returned'>Returned</button>` : `<button id = 'return-${borrower.id}' class = 'act-button return'>Return</button>`}
                </div>
            `;
        }
    });
};

const sort_by_borrower = (name_or_phone) => {
    shelf_data.innerHTML = '';
    if(!name_or_phone) {
        alert('Invalid request');

        return shelf_data.innerHTML = `<br/><p class = 'purplish'>An error occured</p>`;
    }

    name_or_phone = name_or_phone.toLowerCase();

    borrowers_data.forEach((is_borrower) =>{

        if(is_borrower.name.toLowerCase().includes(name_or_phone) || is_borrower.phone === name_or_phone) {
            
            shelf_data.innerHTML += `
                <div id = borrower-${is_borrower.id} class = 'borrower-item'>
                    <p><strong>Request Id: </strong>${is_borrower.id}</p>
                    <p><strong>Name: </strong>${is_borrower.name}</p>
                    <p><strong>Phone: </strong>${is_borrower.phone}</p>
                    <p><strong>Book: </strong>${is_borrower.book}</p>
                    <p><strong>Borrowed on: </strong>${is_borrower.borrowed_date}</p>
                    <p><strong>Due on: </strong>${is_borrower.due_date }</p>
                    ${is_borrower.returned ? `<button id = 'returned-${is_borrower.id}' class = 'act-button returned'>Returned</button>` : `<button id = 'return-${is_borrower.id}' class = 'act-button return'>Return</button>`}
                </div>
            `;
        }
    });

};

const sort_by_book = (id_or_title) => {
    shelf_data.innerHTML = '';
    if(!id_or_title) {
        alert('Invalid request');

        return shelf_data.innerHTML = `<br/><p class = 'purplish'>An error occured</p>`;
    }
        
    const is_book = books_data.find((book) => book.id === id_or_title || book.title === id_or_title);

    if(!is_book) {
        
        const is_book = borrowers_data.find((borrower) => borrower.book === id_or_title);

        if(!is_book) return shelf_data.innerHTML = `<br/><p class = 'purplish'>No records found</p>`;
        else return shelf_data.innerHTML = `<br/><p class = 'purplish'>Book does not exist in current catalogue but has been retrieved in lending logs</p>`;
    } else {

        borrowers_data.forEach((is_borrower) =>{
            if(is_book.title === is_borrower.book) {
                    
                shelf_data.innerHTML += `
                    <div id = borrower-${is_borrower.id} class = 'is_borrower-item'>
                        <p><strong>Request Id: </strong>${is_borrower.id}</p>
                        <p><strong>Name: </strong>${is_borrower.name}</p>
                        <p><strong>Phone: </strong>${is_borrower.phone}</p>
                        <p><strong>Book: </strong>${is_borrower.book}</p>
                        <p><strong>Borrowed on: </strong>${is_borrower.borrowed_date}</p>
                        <p><strong>Due on: </strong>${is_borrower.due_date }</p>
                        ${is_borrower.returned ? `<button id = 'returned-${is_borrower.id}' class = 'act-button returned'>Returned</button>` : `<button id = 'return-${is_borrower.id}' class = 'act-button return'>Return</button>`}
                    </div>
                `;
            } else {
                alert('An error occured');
                return shelf_data.innerHTML = `<br/><p class = 'purplish'>No records found</p>`;
            }
        });
        
    }

};

const penalize = (request_id) => {
    if(!request_id) return alert('Invalid request id');
    return alert('Checking penalties....');
};

sort_by.addEventListener('click', () => {
    if(v.classList.contains('v') && sort_form.classList.contains('hidden')) {
        v.classList.remove('v');
        sort_form.classList.remove('hidden');
        return;
    }
    if(v.classList.contains('v') && !sort_form.classList.contains('hidden')) {
        v.classList.remove('v');
        sort_form.classList.remove('hidden');
        return;
    }
    if(!v.classList.contains('v') && !sort_form.classList.contains('hidden')) {
        v.classList.add('v');
        return;
    }
    if(!v.classList.contains('v') && sort_form.classList.contains('hidden')) {
        v.classList.remove('v');
        sort_form.classList.remove('hidden');
        return;
    }
});

sort_form_cancel.addEventListener('click', (e) => {
    e.preventDefault();
    sort_form.classList.add('hidden');
});

let is_sort_param;

sort_param.forEach((param) => {
    param.addEventListener('change', (e) => {
        return is_sort_param =e.target.value;
    });
});

sort_form_submit.addEventListener('click', (e) => {
    e.preventDefault();
    if(!is_sort_param) return alert('Invalid sort parameter');

    if(is_sort_param !== 'date' && is_sort_param !== 'borrower' && is_sort_param !== 'book') {

        alert('Invalid sort parameter');
        return shelf_data.innerHTML = `<br/><p class = 'purplish'>An error occured</p>`;
    }

    if(is_sort_param === 'date') {
            
         sort_input.innerHTML = `
            <label for="date_from">From</label>
            <input type="date" name="date_from" id="date_from">
            <label for="date_to">To</label>
            <input type="date" name="date_to" id="date_to">
            <input type="submit" value="Check" id = "check_sort">
        `;

        v.classList.add('sort-by-date');

        v.classList.remove('sort-by-borrower');
        v.classList.remove('sort-by-book');
        sort_form.classList.add('hidden');
        return sort_input.classList.remove('v');
    }

    if(is_sort_param === 'borrower') {
            
         sort_input.innerHTML = `
         <label for="date_from">Borrower name or phone</label>
         <input type="text" name="is_borrower" id="is_borrower">
         <input type="submit" value="Check" id = "check_sort">
        `;

        v.classList.add('sort-by-borrower');

        v.classList.remove('sort-by-date');
        v.classList.remove('sort-by-book');
        sort_form.classList.add('hidden');
        return sort_input.classList.remove('v');
    }

    if(is_sort_param === 'book') {
            
         sort_input.innerHTML = `
            <label for="date_from">Book id or title</label>
            <input type="text" name="is_book" id="is_book">
            <input type="submit" value="Check" id = "check_sort">
        `;

        v.classList.add('sort-by-book');

        v.classList.remove('sort-by-date');
        v.classList.remove('sort-by-borrower');
        sort_form.classList.add('hidden');
        return sort_input.classList.remove('v');
    }

});

v.addEventListener('submit', (e) => {

    e.preventDefault();
    
    if(v.classList.contains('sort-by-date')) {

        const date_from_input = document.querySelector('#date_from');
        const date_to_input = document.querySelector('#date_to');
        
        shelf_data.innerHTML = `<br/><p class = 'purplish'>Checking...</p>`;

        setTimeout(() => {
        
            return sort_by_date(date_from_input.value, date_to_input.value);
        }, 2000);
    }
    else if(v.classList.contains('sort-by-borrower')) {

        const is_borrower_input = document.querySelector('#is_borrower');

        const is_borrower = is_borrower_input.value;
        
        shelf_data.innerHTML = `<br/><p class = 'purplish'>Checking...</p>`;

        setTimeout(() => {
        
            return sort_by_borrower(is_borrower);
        }, 2000);
    }
    else if(v.classList.contains('sort-by-book')) {

        const is_book_input = document.querySelector('#is_book');

        const is_book = is_book_input.value;
        
        shelf_data.innerHTML = `<br/><p class = 'purplish'>Checking...</p>`;

        setTimeout(() => {
        
            return alert('building....');
        }, 2000);
    } else {
        alert('sorting error');

        return window.location.reload();
    }
});