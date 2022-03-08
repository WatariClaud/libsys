const home_button_ = document.querySelector('#button_');

const userText = document.querySelector('#user');

const book_data_text = document.querySelector('#lib-data-intro');

const shelf_data = document.querySelector('#shelf-data');

const search_box = document.querySelector('#search-box');

const search_bar = document.querySelector('#search-bar');

const search_hint = document.querySelector('#hint');

const button_add_entry = document.querySelectorAll('.button_add_entry')[0];

const button_view_data = document.querySelectorAll('.button_add_entry')[1];

const data = JSON.parse(localStorage.getItem('users'));

let books_data = JSON.parse(localStorage.getItem('books'));

let borrowers_data = JSON.parse(localStorage.getItem('borrowers'));

const user = localStorage.getItem('user');

const form_ = document.querySelector('#form_');
const title = document.querySelector('#title');
const author = document.querySelector('#author');
const counter = document.querySelector('#counter');

if(books_data) books_data = books_data.sort((a, b) => a.id < b.id);

if(!user) {

    document.body.innerHTML = `<br/><p class = 'purplish'>&emsp;An error occured, redirecting....</p>`;

    setTimeout(() => {
        window.location.href = './index.html';
    }, 2000);
}

const userExists = data.find((user_) => user_.email === user);

if(!userExists) {

    document.body.innerHTML = `<br/><p class = 'purplish'>&emsp;An error occured, redirecting....</p>`;

    setTimeout(() => {
        window.location.href = './index.html';
    }, 2000);
}

const showBooks = (title) => {

    shelf_data.innerHTML = ``;

    if(!title) {

        if(!books_data) {
            book_data_text.textContent = 'Add your inventory information';
            button_add_entry.classList.remove('hidden');

            shelf_data.innerHTML = `<p class = 'purplish'>Your catalogue will appear here in descending order by entry ID.`;
        }  else {
            book_data_text.textContent = 'Your inventory information';
            button_add_entry.classList.remove('hidden');
            button_view_data.classList.remove('hidden');
            search_box.classList.remove('hidden');
        
            books_data.forEach((book) => {
                shelf_data.innerHTML += `
                    <div id = book-${book.id} class = 'book-item'>
                        <p><strong>Id: </strong>${book.id}</p>
                        <p><strong>Title: </strong>${book.title}</p>
                        <p><strong>Author: </strong>${book.author}</p>
                        <p id = 'p-${book.id}'><strong>Instances: </strong>${book.counter}</p>
                        ${ book.counter === '0' ?  `<button id = 'lend-${book.id}' class = 'act-button lend_disable'>Cannot lend</button>` : `<button id = 'lend-${book.id}' class = 'act-button lend'>Lend</button>`}
                        <button id = 'edit-${book.id}' class = 'act-button edit'>Edit</button>
                    </div>
                `;
            });
        }
    } else {
    
        const book = books_data.find((book) => book.title.toLowerCase().includes(title.toLowerCase()));

        if(!book) shelf_data.innerHTML = `<br/><p class = 'purplish'><strong>Error:</strong> No book found</p>`; else {
        
            books_data.forEach((book) => {
                if(book.title.toLowerCase().includes(title.toLowerCase())) {
                    shelf_data.innerHTML += `
                    <div id = book-${book.id} class = 'book-item' style = 'width: 30%;'>
                        <p><strong>Id: </strong>${book.id}</p>
                        <p><strong>Title: </strong>${book.title}</p>
                        <p><strong>Author: </strong>${book.author}</p>
                        <p id = 'p-${book.id}'><strong>Instances: </strong>${book.counter}</p>
                        <button id = 'lend-${book.id}' class = 'act-button lend'>Lend</button>
                        <button id = 'edit-${book.id}' class = 'act-button edit'>Edit</button>
                    </div>
                    `;
                }
            });
        };
    };
};

showBooks();

search_box.addEventListener('submit', (e) => {
    e.preventDefault();

    shelf_data.innerHTML = `<br/><p class = 'purplish'>Checking....</p>`;

    if(!search_bar.value) {
        alert('Item to search is required');

        shelf_data.innerHTML = `<br/><p class = 'purplish'>An error occured, reloading the page....</p>`;

        setTimeout(() => {
            window.location.reload();
        }, 2000);

        return false;
    }

    setTimeout(() => {
        showBooks(search_bar.value);
    }, 1500);
});

userText.textContent = userExists.name;

home_button_.addEventListener('click', (e) => {
    
    modal.classList.remove('hidden');
    modal_loader.classList.remove('hidden');
    modal_loader.classList.add('whitish');
    modal_content.classList.add('hidden');
    
    modal_loader.textContent = `Preparing, please wait....`;

    setTimeout(() => {
        modal_loader.classList.add('hidden');
        modal_content.classList.remove('hidden');
    }, 1500);
});

const edit_button = document.querySelectorAll('.edit');

const lend_button = document.querySelectorAll('.lend');

const edit = () => {
        
    edit_button.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            localStorage.setItem('edit', true);
        
            modal.classList.remove('hidden');
            modal_loader.classList.remove('hidden');
            modal_loader.classList.add('whitish');
            modal_content.classList.add('hidden');
            
            modal_loader.textContent = `Preparing, please wait....`;
        
            setTimeout(() => {
                const isEditable = books_data.find((book) => book.id.toString() === e.target.id.split('-')[1]);

                modal_loader.classList.add('hidden');
                modal_content.classList.remove('hidden');
                
                title.value = isEditable.title;
                author.value = isEditable.author;
                counter.value = isEditable.counter;

                localStorage.setItem('item_id', isEditable.id);
            }, 1500);
        });
    });
};

edit();

const lend = () => {
        
    lend_button.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if(document.querySelector(`#p-${e.target.id.split('-')[1]}`).textContent === 'Instances: 0') {
                return alert('Cannot complete the request. Check if book is available');
            } else {

                localStorage.setItem('lendable', true);
            
                modal.classList.remove('hidden');
                modal_loader.classList.remove('hidden');
                modal_loader.classList.add('whitish');
                modal_content.classList.add('hidden');
                
                modal_loader.textContent = `Preparing, please wait....`;
            
                setTimeout(() => {
                    const isBorrowable = books_data.find((book) => book.id.toString() === e.target.id.split('-')[1]);
    
                    modal_loader.classList.add('hidden');
                    modal_content.classList.remove('hidden');
    
                    const name_label = document.querySelector("label[for='title']");
                    const phone_label = document.querySelector("label[for='author']");
                    const book_label = document.querySelector("label[for='counter']");
    
                    name_label.textContent = 'Borrower\'s name';
                    phone_label.textContent = 'Borrower\'s phone';
                    book_label.textContent = 'Book id';
                    
                    title.value ='';
                    author.value =  '';
                    counter.value = isBorrowable.id;
                    counter.disabled = true;
    
                }, 1500);
            }
        });
    });
};

lend();

form_.addEventListener('submit', (e) => {
    e.preventDefault();

    if(!localStorage.getItem('lendable')) {

        const data = JSON.parse(localStorage.getItem('books'));
        const title_ = title.value;
        const author_ = author.value;
        let counter_ = counter.value;

        if(!title || !author || !counter) return alert('All fields are required');
    
        let bookExists;
        if(data) {
    
            if(!localStorage.getItem('edit')) {
    
                if(counter_<= 0) counter_ = '1';

                bookExists = data.find((entry) => entry.title === title_);
                if(bookExists) return alert('Duplicate book title. Edit your entry to add to inventory');
    
                const entry = {
                    id: data.length +  1,
                    title: title_,
                    author: author_,
                    counter: counter_
                };
    
                data.push(entry);
            } else {
    
                if(counter_< 0) return alert('Instances cannot be less than zero');

                bookExists = data.find((entry) => entry.id.toString() === localStorage.getItem('item_id'));
                if(bookExists){
                    bookExists.title = title_;
                    bookExists.author = author_;
                    bookExists.counter = counter_;
                } else return alert('An error occured');
            }
        
            localStorage.setItem('books', JSON.stringify(data));
        } else {
    
            const data = [{
                id:1,
                title: title_,
                author: author_,
                counter: counter_
            }];
        
            localStorage.setItem('books', JSON.stringify(data));
        }
    
        alert('Added successfully');
    
        localStorage.removeItem('edit');
    
        localStorage.removeItem('item_id');
    
        window.location.reload();

    } else {

        const data = JSON.parse(localStorage.getItem('borrowers'));
        const borrower_name = title.value;
        const borrower_phone = author.value;

        if(!borrower_name || !borrower_phone) return alert('All fields are required');
        
        const isBorrowable = books_data.find((book) => book.id.toString() === counter.value);
            
        if(!isBorrowable) return alert('Invalid book id');
            
        if(parseInt(isBorrowable.counter, 10) <= 0) return alert('Cannot complete the request. Check if book is available');
        
        if(data) {

            let counter = 0;

            data.forEach((borrower) => {
                if(borrower.phone === borrower_phone && !borrower.returned) counter +=1;
                console.log(counter);
            });

            setTimeout(() => {
                
                if(counter > 3)  return alert('Invalid request. Maximum lendable count with no return is 4');
            
                const entry = {
                    id: data.length + 1,
                    name :borrower_name,
                    phone: borrower_phone,
                    book: isBorrowable.title,
                    returned: false,
                    borrowed_date: new Date(),
                    due_date: new Date()
                };
            
                data.push(entry);
                
                localStorage.setItem('borrowers', JSON.stringify(data));
                
                localStorage.removeItem('lendable');
            
                isBorrowable.counter = (parseInt(isBorrowable.counter , 10) - 1).toString();
            
                localStorage.setItem('books', JSON.stringify(books_data));
                
                alert('Saved successfully');
            
                window.location.href = './lends.html';
            }, 1500);
        
        } else {
        
            const data = [{
                id: 1,
                name :borrower_name,
                phone: borrower_phone,
                book: isBorrowable.title,
                returned: false,
                borrowed_date: new Date(),
                due_date: new Date()
            }];
            
            localStorage.setItem('borrowers', JSON.stringify(data));
            
            localStorage.removeItem('lendable');
        
            isBorrowable.counter = (parseInt(isBorrowable.counter , 10) - 1).toString();
        
            localStorage.setItem('books', JSON.stringify(books_data));
            
            alert('Saved successfully');
        
            window.location.href = './lends.html';
        };
       
    };
});

document.querySelector('#exit').addEventListener('click', () => {

    window.location.reload();

});

button_view_data.addEventListener('click', () => {

    window.location.href = './lends.html';

});

const lend_disable = document.querySelectorAll('.lend_disable');

lend_disable.forEach((button) => {
    button.addEventListener('click', () => {
        alert('Invalid request');
    });
});

// search_bar.addEventListener('change', () => {

//     search_hint.classList.remove('hidden');
    
//     search_hint.innerHTML = `
//         <ul>
//             <a href = "./book/1">
//                 <li>
//                     ${search_bar.value}
//                 </li>
//             </a>
//             <a href = "./book/2">
//                 <li>
//                 ${search_bar.value}
//                 </li>
//             </a>
//             <a href = "./book/3">
//                 <li>
//                 ${search_bar.value}
//                 </li>
//             </a>
//         </ul>
//     `
// });
