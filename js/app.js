function menu() {

    const bg = document.createElement('div');
    bg.classList.add('bg');

    const menu = document.createElement('div');
    menu.classList.add('menu');
    
    const menuTitle = document.createElement('h1');
    menuTitle.innerText = 'Game Menu';

    const menuDescriprion = document.createElement('p');
    menuDescriprion.innerText = 'Choose your character!';

    const menuList = document.createElement('ul');

    const playerSkins = [
        {
            id: 'boy',
            src: 'images/char-boy.png',
        },
        {
            id: 'cat-girl',
            src: 'images/char-cat-girl.png',
        },
        {
            id: 'horn-girl',
            src: 'images/char-horn-girl.png',
        },
        {
            id: 'pink-girl',
            src: 'images/char-pink-girl.png',
        },
        {
            id: 'princess-girl',
            src: 'images/char-princess-girl.png',
        },
    ];
        
    playerSkins.forEach((item) => {
        const menuItem = document.createElement('li');

        const itemImg = document.createElement('img');
        const imgSrc = item.src;
        const imgId = item.id;
        itemImg.setAttribute('src', imgSrc);
        itemImg.setAttribute('id', imgId);
        const imgDesc = document.createElement('p');
        imgDesc.innerText = imgId;

        menuList.appendChild(menuItem);
        menuItem.appendChild(itemImg);
        menuItem.appendChild(imgDesc);
    });

    document.body.appendChild(bg);
    document.body.appendChild(menu);
    menu.appendChild(menuTitle);
    menu.appendChild(menuDescriprion);
    menu.appendChild(menuList);

    menuList.addEventListener('click', (event) => {
        const listTarget = event.target;
        if (listTarget.tagName == "UL") return;
    
        player.sprite = listTarget.getAttribute("src");

        bg.parentElement.removeChild(bg);
        menu.parentElement.removeChild(menu);

    });
    
}

menu();

let points = 0;
const score = document.createElement('p');
score.classList.add('score');
document.body.appendChild(score);

function updateScore() {
    score.innerHTML = 'Score: ' + points;
}

updateScore();

function animateScoreGreen() {
    score.classList.add('green');
    setTimeout(function() {
        score.classList.remove('green');
    }, 1000)
}

function animateScoreBlue() {
    score.classList.add('blue');
    setTimeout(function() {
        score.classList.remove('blue');
    }, 1000)
}

let health = 3;

const healthBar = document.createElement('div');
document.body.appendChild(healthBar);
healthBar.classList.add("health");


function generateHealthBar() {

    if (health <= 0) {
        death();
    }

    if (healthBar.children.length > 0){
        let imgArr = Array(...healthBar.children);
        imgArr.forEach(item => {
            item.remove();
        });
    }

    for (let i = 1; i <= health; i++) {
        let img = document.createElement('img');
        img.setAttribute('src', 'images/Heart.png')
        healthBar.appendChild(img);
    }
}

generateHealthBar();

function death() {
    alert(`You died! Your score: ${points}`);
    health = 3;
    points = 0;
}

const blockSize = {
    width: 101,
    height: 85
};

const canvasSize = {
    width: 505,
    height: 606
};

const startPosition = {
    x: blockSize.width * 2,
    y: blockSize.width * 4
}

class Entity {
    x;
    y;
    scrite;

    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Enemy extends Entity {
    speed = 100 + Math.floor(Math.random() * 222);

    constructor(x, y, sprite) {
        super(x, y, sprite);
    }

    handleInput(){}

    update(dt) {

        if (this.sprite == "images/enemy-bug.png") {
            this.x += this.speed * dt;

            if (this.x > 500) {
                this.x = -50;
                this.speed = 100 + Math.floor(Math.random() * 222);
            }
        } else if (this.sprite == "images/enemy-bug-revert.png") {
            this.x -= this.speed * dt;

            if (this.x < -150) {
                this.x = canvasSize.width;
                this.speed = 100 + Math.floor(Math.random() * 222);
            };
        }
      
        if (player.x < this.x + 70 &&
            player.x + 70 > this.x &&
            player.y < this.y + 60 &&
            60 + player.y > this.y) {

            player.x = startPosition.x;
            player.y = startPosition.y;

            if (health <= 1) {
                death();
            } else {
                points -= 5;
                health--;
            }

            updateScore();
            animateScoreBlue();
            generateHealthBar();
        };
    }
}

class Player extends Entity {

    constructor(x, y, sprite) {
        super(x, y, sprite);
    }

    handleInput(keyPress) {

        if (keyPress == 'left' && this.x > 0) {
            this.x -= blockSize.width;
        };
    
        if (keyPress == 'right' && this.x < 400) {
            this.x += blockSize.width;
        };
    
        if (keyPress == 'up' && this.y > 0) {
            this.y -= blockSize.height;
        };
    
        if (keyPress == 'down' && this.y < 395) {
            this.y += blockSize.height;
        };

        this.reset();
    }

    update(){}

    reset() {
        if (this.y < 0) {
            alert('You won!');
            this.x = startPosition.x;
            this.y = startPosition.y;

            points += 10;
            updateScore();
            animateScoreGreen();
        }
        
    }
}

const allEnemies = [
    new Enemy( -150, blockSize.height - 30, "images/enemy-bug.png"),
    new Enemy( canvasSize.width, blockSize.height * 2 - 30, "images/enemy-bug-revert.png"),
    new Enemy( -150, blockSize.height * 3 - 30, "images/enemy-bug.png"),
];

const player = new Player(startPosition.x, startPosition.y, "images/char-cat-girl.png");

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
