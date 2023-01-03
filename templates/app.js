var Engine = Matter.Engine,
Render = Matter.Render,
World = Matter.World,
Bodies = Matter.Bodies

let sh = window.innerHeight,
    sw = window.innerWidth

console.log(Engine)

const scr = document.querySelector('.score')
let score = [0, 0]

const engine = Engine.create()
engine.timing.timeScale = 1
engine.velocityIterations = 20
engine.gravity.y = 2
engine.gravity.x = 0


let topCanvas = 0;
let leftCanvas = 0;

window.addEventListener('resize',()=>{
    setInterval(() => {
        const canvas = document.querySelector('canvas')
        topCanvas = canvas.offsetTop;
        leftCanvas = canvas.offsetLeft;
    }, 500);
})

function getFormElements(url) {
    var queryString = url.substring(url.indexOf('?') + 1);
    var elements = queryString.split('&');
    var formElements = {};
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i].split('=');
        var name = decodeURIComponent(element[0]);
        var value = decodeURIComponent(element[1]);
        formElements[name] = value;
    }
    return formElements;
}

let form = getFormElements(window.location.href)


let nbCol = Number(form.col), 
    nbRow = Number(form.row), 
    largeur, 
    gap, 
    widthplateau, 
    heightplateau,
    startPositionX,
    startPositionY,
    couleur

function setValues(nbCol, nbRow){
    largeur = 5,
    gap = 50,
    widthplateau = (gap + largeur) * nbCol + largeur,
    heightplateau = gap * nbRow,
    startPositionX = sw / 2 - widthplateau / 2,
    startPositionY =  sh / 2 - heightplateau / 2 - 2.5,
    couleur = [form.colorjoueur1, form.colorjoueur2]
}
setValues(nbCol, nbRow)      

let render = Render.create({
    element: document.querySelector('.canvas-container'),
    engine: engine,
    options: {
        width: sw,
        height: sh,
        wireframes: false,
        background: 'transparent' 
    } 
})


let list = []

function addBall(x, y, style) {
    let ballA = Bodies.circle(x, y, 25.2, {
        friction: 0,
        label: style,
        render: {
            fillStyle: couleur[style - 1]
        }
    })
    list.push(ballA)
    World.add(engine.world, ballA)
    let inter = setInterval(() => {
        if (Number(ballA.position.y.toFixed(3)) === Number(pre.toFixed(3))){
            ballA.isStatic = true
            clearInterval(inter)
            collectPosition()
            if (!(startPositionX < ballA.position.x && ballA.position.x < startPositionX + widthplateau && startPositionY < ballA.position.y && ballA.position.y < startPositionY + heightplateau)) {
                tour++
            }
            if (verifEgalité() || verifWin()){
                timer_active = false
                tour = Math.floor(Math.random()*2)
                document.querySelector('.rez').classList.add('active')
            }else {
                document.querySelector('body').addEventListener('click', tourEvent, {once: true})
            }
        }
        pre = ballA.position.y
    }, 100)
    let pre = 0
}



const ground = Bodies.rectangle(sw / 2, sh + 50, sw + 100, 100, { isStatic: true})
const ceiling = Bodies.rectangle(sw / 2, -50, sw, 100, { isStatic: true})
const wallA = Bodies.rectangle(-50, 0, 100, sh * 2, { isStatic: true})
const wallB = Bodies.rectangle(sw + 50, 0, 100, sh * 2, { isStatic: true})


let listeAffiche = []

function setTableau() {
    let AfficheRowPlateau = Matter.Composites.stack(startPositionX, startPositionY, 1, nbRow + 1, 0, gap - largeur, function (x, y) {
        return Matter.Bodies.rectangle(x, y, widthplateau, largeur, {
            isStatic: true,
            collisionFilter: 0x0002,
            render: {
                fillStyle: '#0045AA',
                lineWidth: 0
            }
        })
    })
    
    let AfficheColPlateau = Matter.Composites.stack(startPositionX, startPositionY, nbCol + 1, 1, gap, 0, function (x, y) {
        return Matter.Bodies.rectangle(x, y, largeur, heightplateau, {
            isStatic: true,
            render: {
                fillStyle: '#0045AA',
                lineWidth: 0
            }
        })
    })
    
    let retienPlateau = Matter.Bodies.rectangle(sw / 2, sh / 2 - heightplateau / 2 + largeur * 2 + heightplateau, widthplateau, largeur * 4, {
        isStatic: true,
        render: {
            fillStyle: '#0045AA',
            lineWidth: 0
        }
    })
    listeAffiche = [AfficheRowPlateau, AfficheColPlateau, retienPlateau]
    World.add(engine.world, [AfficheRowPlateau, AfficheColPlateau, retienPlateau])
}

setTableau()


World.add(engine.world, [ground, ceiling, wallA, wallB])

Matter.Runner.run(engine)
Render.run(render)

let tourEvent

let tour = Math.floor(Math.random()*2)

function jouerPartie(joueur1, joueur2) {
    document.querySelector('body').addEventListener('click', tourEvent = (event)=>{
        if(peutclic){
            if (!(timer_active)){
                timer_active= true
            }
            if (tour % 2 === 1) {
                addBall(event.clientX - leftCanvas, event.clientY - topCanvas, joueur1)
            } else {
                addBall(event.clientX - leftCanvas, event.clientY - topCanvas, joueur2)
            }
            tour++
        }else {
            document.querySelector('body').addEventListener('click', tourEvent, {once: true})
        }
    }, {once: true})
  }


let peutclic = true
const container = document.querySelector('.container')
const canvas = document.querySelector('canvas')

canvas.addEventListener('mouseleave', ()=>{
    peutclic = false
})

canvas.addEventListener('mouseenter', ()=>{
    peutclic = true
})

container.addEventListener('mouseenter', ()=>{
    peutclic = false
})


container.addEventListener('mouseleave', ()=>{
    peutclic = true
})
  

const dl = document.getElementById('download')
dl.addEventListener('click', ()=>{
    const dl = document.getElementById('download')
    const canvas = document.querySelector("canvas")
    const img = canvas.toDataURL("image/png")
    dl.href = img
})

let listePlateau = maFonction(nbCol, nbRow)

function collectPosition() {
    for (let i = 0; i < list.length; i++) {
        let element = list[i];
        if (startPositionX < element.position.x && element.position.x < startPositionX + widthplateau && startPositionY < element.position.y && element.position.y < startPositionY + heightplateau) {
            let col = Math.floor((element.position.y - startPositionY) / gap)
            let row = Math.floor((element.position.x - startPositionX) / (gap + largeur) )
            listePlateau[col][row] = list[i].label
        }
    }
}

function maFonction(c, r) {
    let maListe = [];
    for (let i = 0; i < r; i++) {
        maListe.push(new Array(c).fill(0));
    }
    return maListe;
}

function verifWin() {
    for (let i = 0; i < listePlateau.length; i++) {
        for (let j = 0; j < listePlateau[i].length; j++) {
            let k = listePlateau[i][j]
            if (k!==0) {
                if (j < listePlateau[i].length - 3){
                    if (k===listePlateau[i][j+1] &&
                        k===listePlateau[i][j+2] &&
                        k===listePlateau[i][j+3]){
                        alert(`le gagnant est le joueur ${k} en ${document.getElementById("timer").innerHTML} minutes`)
                        score[k-1]++
                        scr.innerHTML = `${score[0]}:${score[1]}`
                        return true
                    }
                }
                if (i < listePlateau.length - 3){
                    if (k===listePlateau[i+1][j] &&
                        k===listePlateau[i+2][j] &&
                        k===listePlateau[i+3][j]){
                        alert(`le gagnant est le joueur ${k} en ${document.getElementById("timer").innerHTML} minutes`)
                        score[k-1]++
                        scr.innerHTML = `${score[0]}:${score[1]}`
                        return true
                    }
                }
                if (i < listePlateau.length - 3 && j < listePlateau[i].length - 3){
                    if (k===listePlateau[i+1][j+1] &&
                        k===listePlateau[i+2][j+2] &&
                        k===listePlateau[i+3][j+3]){
                        alert(`le gagnant est le joueur ${k} en ${document.getElementById("timer").innerHTML} minutes`)
                        score[k-1]++
                        scr.innerHTML = `${score[0]}:${score[1]}`
                        return true
                    }
                }
                if (i < listePlateau.length - 3 && j >= 3){
                    if (k===listePlateau[i+1][j-1] &&
                        k===listePlateau[i+2][j-2] &&
                        k===listePlateau[i+3][j-3]){
                        alert(`le gagnant est le joueur ${k} en ${document.getElementById("timer").innerHTML} minutes`)
                        score[k-1]++
                        scr.innerHTML = `${score[0]}:${score[1]}`
                        return true
                    }
                }
            }
        }
    }
    return false
}



function verifEgalité(){
    for (let i = 0; i < listePlateau.length; i++) {
        for (let j = 0; j < listePlateau[i].length; j++) {
            if (listePlateau[i][j] === 0) {
                return false;
            }
        }
    }
    score[0]++
    score[1]++
    scr.innerHTML = `${score[0]}:${score[1]}`
    alert(`égalité en ${document.getElementById("timer").innerHTML} minutes`)
    return true;
}

collectPosition()

let timer_active=false;
let timer = setInterval(myTimer, 1000)
let stimer = setInterval(settimer, 1000)
let time = 0
function myTimer() {
    if (timer_active){time++}
}

function settimer() {
    if (time%100 < 10){time = `0${time}` }
    document.getElementById("timer").innerHTML = `${Math.floor(time/100)}:${(time%100 < 10)? '0'+time%100: time%100}`
}

function restart(){
    World.remove(engine.world, [listeAffiche[0], listeAffiche[1], listeAffiche[2]])
    setValues(nbCol, nbRow)
    setTableau()
    document.querySelector('.rez').classList.remove('active')
    for(let i = 0; i < list.length; i++){
        let ball = list[i]
        World.remove(engine.world, ball);
    }
    list = []
    timer_active = false
    time = 0
    listePlateau = maFonction(nbCol, nbRow)
    document.querySelector('body').addEventListener('click', tourEvent, {once: true})
}


function label(input){
    if (input.value.length > 0){
        input.classList.add('valide')
    }else{
        input.classList.remove('valide')
    }
}


jouerPartie(1, 2)
