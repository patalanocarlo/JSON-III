document.addEventListener("DOMContentLoaded", function () {
  const booksRow = document.getElementById("books-row"); //creo un costante con riferimento div del mio HTML

  const savedCart = localStorage.getItem("cart"); //creo una costante savedCart che va a caricarmi gli elementi del carrello
  if (savedCart) {
    //creo un controllo true
    const cartList = document.getElementById("cart"); //creo prima una lista del carrello dove prendo l'id cart nel mio HTML
    const cartData = JSON.parse(savedCart); //Ora converto il file localStorage da json a un oggetto in una costante cartData
    cartData.forEach((item) => {
      //ora per ogni elemento al interno del cartData creo una funzione
      const cartItem = document.createElement("li"); // creo una costante cartitem che sara un elemento di tipo li per la lista
      cartItem.classList.add("list-group-item"); //do le classi similmente a bootstrap
      cartItem.textContent = item; //do un textcontent come parametro di item

      const removeButton = document.createElement("button"); //Ora inizia la rimozione del tasto button
      removeButton.classList.add("btn", "btn-danger", "ms-2"); //do la classe "estetica al button"
      removeButton.textContent = "Rimuovi dal carrello"; //configuro il nome al bottone
      removeButton.addEventListener("click", function () {
        //creo la funzione al click va a rimuovere gli item al interno del carrello
        cartItem.remove();
        saveCartToLocalStorage(); //una volta rimossi salva le modifiche...
      });
      cartItem.appendChild(removeButton); //appendo il bottone per rimozione

      cartList.appendChild(cartItem);
    });
  }

  fetch("https://striveschool-api.herokuapp.com/books") //fetch per iniziare a lavorare con le cart dove prenderemo le immagini i testi e i prezzi
    .then((response) => {
      // nel caso then cioè quello positivo
      if (!response.ok) {
        //ho creato una condizione in cui la response sia diversa dal segnale ok che possiamo vedere in browser
        throw new Error("Errore durante il recupero dei libri"); // segnalo subito un errore senza procedere oltre
      }
      return response.json(); //altrimento avrò la risposta concordata
    })
    .then((books) => {
      //inizio la creazione delle card
      books.forEach((book) => {
        const cardCol = document.createElement("div");
        cardCol.classList.add("col-lg-3", "col-md-4", "col-sm-6"); //setto la dimensione delle card similmente a bootstrap

        const card = document.createElement("div"); // creo una card div
        card.classList.add("card", "book-card", "h-100"); //setto le classi per tutte le card dandole un altezza uguale fra tutte

        const cardImg = document.createElement("img"); //ora vado a creare le immagini delle card
        cardImg.classList.add("card-img-top");
        cardImg.src = book.img; //Do accesso alla card con src al url dell'immagine
        cardImg.alt = book.title;
        card.appendChild(cardImg); //la rendo visibile

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body", "text-center"); //do le classi al body centrando sia il titolo che il bottone e il prezzo

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title"); //do la classe
        cardTitle.textContent = book.title; //do il titolo di ogni singolo contenuto
        cardBody.appendChild(cardTitle);

        const cardPrice = document.createElement("p");
        cardPrice.classList.add("card-text");
        cardPrice.textContent = `Prezzo: ${book.price} €`; //parte del body dove vado a mettere il price alla costante appena creata cardPrice
        cardBody.appendChild(cardPrice);

        const addToCartButton = document.createElement("button"); //ora aggiungo affianco al bottone scarta un altro bottone per aggiungerlo al carrello cart
        addToCartButton.classList.add("btn", "btn-success", "mt-2");
        addToCartButton.textContent = "Aggiungi al carrello"; //
        addToCartButton.addEventListener("click", function () {
          addToCart(book);
        });
        cardBody.appendChild(addToCartButton);

        const discardButton = document.createElement("button");
        discardButton.classList.add("btn", "btn-danger", "mt-2");
        discardButton.textContent = "Scarta";
        discardButton.addEventListener("click", function () {
          card.remove();
          saveCartToLocalStorage();
        });
        cardBody.appendChild(discardButton);

        card.appendChild(cardBody);

        cardCol.appendChild(card);
        booksRow.appendChild(cardCol);
      });
      function addToCart(book) {
        const cartList = document.getElementById("cart");
        const cartItem = document.createElement("li");
        cartItem.classList.add("list-group-item");
        cartItem.textContent = `${book.title} - ${book.price} €`;

        cartList.appendChild(cartItem);

        saveCartToLocalStorage();
      }
      function saveCartToLocalStorage() {
        const cartList = document.getElementById("cart");
        const cartItems = cartList.querySelectorAll("li");

        const cartData = [];
        cartItems.forEach((item) => {
          cartData.push(item.textContent);
        });

        localStorage.setItem("cart", JSON.stringify(cartData));
      }
    })
    .catch((error) => {
      console.error("Errore durante il recupero dei libri:", error);
    });
});
