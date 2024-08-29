const board = document.getElementById("board");
const muzik = new Audio("/sounds/yanre.mp3");
muzik.play();
let isPlaying = true;
// let isPlaying = false;
let numbers = [];
let selectedCards = [];
let lockBoard = false;
let newdiv;
let eslesenler = 0;
const kronometre = new Kronometre();
gsap.registerPlugin(Flip);
for (let i = 1; i <= 8; i++) {
  numbers.push(i, i);
}

// Fisher-Yates algoritması
for (let i = numbers.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
}

numbers.forEach((number, index) => {
  const eleman = document.createElement("button");
  eleman.classList.add("game_board_item");

  const frontDiv = document.createElement("div");
  frontDiv.classList.add("front");
  frontDiv.textContent = number;
  frontDiv.classList.add("game_board_item_front");

  // gsap.set(frontDiv, {
  //   rotateY: 180,
  //   force3D: true,
  // });

  const backDiv = document.createElement("div");
  backDiv.classList.add("game_board_item_back");
  backDiv.textContent = "?";

  eleman.append(frontDiv, backDiv);

  eleman.addEventListener("click", () => {
    if (lockBoard || eleman.classList.contains("turn")) return;

    gsap.to(eleman, {
      rotateY: 180,
      // duration: 0.5,
      force3D: true,
    });
    eleman.classList.add("turn");
    selectedCards.push(eleman);

    if (selectedCards.length === 2) {
      checkForMatch();
    }
  });

  board.appendChild(eleman);
});

function checkForMatch() {
  lockBoard = true;
  const [card1, card2] = selectedCards;
  const isMatch =
    card1.querySelector(".game_board_item_front").textContent ===
    card2.querySelector(".game_board_item_front").textContent;
  if (isMatch) {
    disableCards(); // Eşleşen kartları kilitle.
    eslesenler++;

    if (eslesenler === 8) {
      console.log(eslesenler);
      endGame();
    }
  } else {
    unflipCards(); // Eşleşmeyen kartları geri çevir.
  }
}

function disableCards() {
  selectedCards = [];
  lockBoard = false;
}

function unflipCards() {
  setTimeout(() => {
    selectedCards.forEach((card) => card.classList.remove("turn"));
    gsap.to(selectedCards, {
      rotateY: 0,
      duration: 0.5,
    });
    selectedCards = [];
    lockBoard = false;
  }, 1000);
}

function endGameUnFlip() {
  const allCards = document.querySelectorAll(".turn");

  gsap.set(allCards, {
    rotateY: 0,
  });
  // Kartları geri çevirme
  allCards.forEach((card) => card.classList.remove("turn"));

  // Kartları karıştırma
  const parent = allCards[0].parentElement;
  for (let i = parent.children.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    parent.appendChild(parent.children[j]);
  }

  lockBoard = false;
}

function endGame() {
  kronometre.stop();

  const newdiv = document.createElement("div");
  newdiv.classList.add("game_container_oyunBitti");

  const dakika = kronometre.dakika;
  const saniye = kronometre.saniye;

  let message = `Oyun Bitti! <br> Süre: ${dakika} dk ${saniye} sn<br>`;

  if (dakika >= 1 && saniye > 0) {
    message += "At agizli biraz odaklann!!! <br>";
  } else {
    message += "Tebrikler cinimm :) <br>";
  }

  newdiv.innerHTML = message;

  const newButton = document.createElement("button");
  newButton.classList.add("game_container_oyunBitti_button");
  newButton.textContent = "TEKRAR DENE";
  newdiv.appendChild(newButton);
  document.body.appendChild(newdiv);

  newButton.addEventListener("click", () => {
    kronometre.reset();
    kronometre.start();

    if (newdiv) {
      newdiv.classList.toggle("hidden");
    }
    if (newButton) {
      newButton.classList.toggle("hidden");
    }
    endGameUnFlip();
  });
}

const ses = document.querySelector(".ses_button");
const ses_acik = document.getElementById("sesAcik");
const ses_kapali = document.getElementById("sesKapali");

ses.addEventListener("click", function (event) {
  if (!isPlaying) {
    muzik.play();
    isPlaying = true;
  } else {
    muzik.pause();
    isPlaying = false;
  }
  ses_acik.classList.toggle("hidden");
  ses_kapali.classList.toggle("hidden");
});

function makeSound() {
  let muzik = new Audio("/sounds/yanre.mp3");
  muzik.play();
}

// Kronometre fonksiyonu

function Kronometre(Id) {
  this.saniye = 0;
  this.dakika = 0;
  this.interval = null;
  this.dakikaElem = document.getElementById("dakika");
  this.saniyeElem = document.getElementById("saniye");

  this.updateDisplay = () => {
    this.dakikaElem.textContent =
      this.dakika < 10 ? "0" + this.dakika : this.dakika;
    this.saniyeElem.textContent =
      "." + (this.saniye < 10 ? "0" + this.saniye : this.saniye);
  };

  this.start = () => {
    if (this.interval) return;
    this.interval = setInterval(() => {
      this.saniye++;
      if (this.saniye === 60) {
        this.saniye = 0;
        this.dakika++;
      }
      this.updateDisplay();
    }, 1000);
  };

  this.stop = () => {
    clearInterval(this.interval);
    this.interval = null;
  };

  this.devam = () => {
    if (!this.interval) {
      this.start();
    }
  };

  this.reset = () => {
    this.stop();
    this.saniye = 0;
    this.dakika = 0;
    this.updateDisplay();
  };

  this.sureyiGetir = () => {
    return `${this.dakika} dakika ${this.saniye} saniye`;
  };
}

// Sayfa yüklendiğinde kronometreyi başlat
window.onload = function () {
  kronometre.start();

  const menuButton = document.getElementById("menuButton");
  const oyunuBitirButton = document.getElementById("oyunuBitirButton");
  const surdurButton = document.getElementById("surdurButton");
  const durdurButton = document.getElementById("durdurButton");

  menuButton.addEventListener("click", () => {
    kronometre.stop();
  });

  oyunuBitirButton.addEventListener("click", () => {
    kronometre.stop();

    const newdiv = document.createElement("div");
    newdiv.classList.add("game_container_oyunBitti");

    // Tüm kartlar eşleşti mi?
    if (eslesenler === 8) {
      const dakika = kronometre.dakika;
      const saniye = kronometre.saniye;

      let message = `Oyun Bitti! <br> Süre: ${dakika} dk ${saniye} sn<br>`;

      if (dakika >= 1 && saniye > 0) {
        message += "At agizli biraz odaklann!!!";
      } else {
        message += "Tebrikler cinimm :)";
      }

      newdiv.innerHTML = message;
    } else {
      let message = `OYUNUN AMACI<br>BUTUN KARTLARI ACMAK<br>AT AGIZLI <br>`;
      newdiv.innerHTML = message;
      const newButton = document.createElement("button");
      newButton.classList.add("game_container_oyunBitti_button");
      newButton.textContent = "TEKRAR DENE";
      newdiv.appendChild(newButton);

      newButton.addEventListener("click", () => {
        kronometre.reset();
        kronometre.start();

        if (newdiv) {
          newdiv.classList.toggle("hidden");
        }
        if (newButton) {
          newButton.classList.toggle("hidden");
        }
        endGameUnFlip();
      });
    }

    document.body.appendChild(newdiv);
  });

  // newdiv.innerHTML = "Oyun Bitti!";
  // newdiv.innerHTML += `<br/>`;
  // newdiv.innerHTML += `Süre: ${kronometre.sureyiGetir()}`;
  // bu niye olmadiii

  // const timeValue = kronometre.sureyiGetir();
  // console.log("Time value:", timeValue);

  yenidenBaslatButton.addEventListener("click", () => {
    kronometre.reset();
    kronometre.start();
    endGameUnFlip();

    if (newdiv) {
      newdiv.classList.toggle("hidden");
    }
  });

  surdurButton.addEventListener("click", () => {
    kronometre.devam();
  });

  durdurButton.addEventListener("click", () => {
    kronometre.stop();
  });
};

function shuffle(state) {
  for (let i = state.length; i >= 0; i--) {
    board.appendChild(board.children[(Math.random() * i) | 0]);
  }
}
//kartlarin karistirilmasi
const karistirButton = document.getElementById("karistirButton");
karistirButton.addEventListener("click", () => {
  const eleman = gsap.utils.toArray(".game_board_item:not(.turn)");

  const state = Flip.getState(eleman);
  console.log(state);
  // Make DOM or styling changes (swap the squares in our case)

  shuffle(eleman);

  // Animate from the initial state to the end state
  Flip.from(state, {
    duration: 0.5,
  });

  // Given an Array of two siblings, append the one that's first so it's last (swap)
});
