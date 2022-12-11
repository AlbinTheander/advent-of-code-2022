let ctx, width, height

document.getElementById('go').addEventListener('click', () => {
    const canvas = document.getElementById("canvas")
    width = canvas.width
    height = canvas.height
    ctx = canvas.getContext("2d");
    run()
})


async function run() {
    const moves = await getMoves()
    const chain = Array(10).fill({x: 0, y: 0})
    runStep(chain, moves)
}

async function runStep(chain, moves) {
    while(moves.length > 0) {
        let [dir, length] = moves.shift()
        // console.log('Drawing', dir, length)
        for (let i = 0; i < length; i++) {
            chain = updateChain(chain, dir)
            drawChain(chain);
            await wait()
        }
    }
}

function updateChain(chain, dir) {
    const newChain = [];
    const {x, y} = chain[0]
    switch(dir) {
        case 'U': newChain.push({x, y: y-1}); break;
        case 'R': newChain.push({x: x+1, y}); break;
        case 'D': newChain.push({x, y: y+1}); break;
        case 'L': newChain.push({x: x-1, y}); break;
    }
    for(let i = 1; i < chain.length; i++) {
        newChain.push(updateLink(chain[i], newChain[i-1]))
    }
    return newChain;
}

function updateLink(link, target) {
    const newLink = {...link};
    if (Math.abs(link.x - target.x) > 1 || Math.abs(link.y - target.y) > 1) {
        if (link.x < target.x) newLink.x++;
        if (link.x > target.x) newLink.x--;
        if (link.y < target.y) newLink.y++;
        if (link.y > target.y) newLink.y--;
    }
    return newLink;
}

function drawChain(chain) {
    ctx.clearRect(0, 0, width, height)
    for(let i = 0; i < chain.length; i++) {
        ctx.fillStyle = '#00f'
        ctx.strokeStyle = '#0f0'
        let x = chain[i].x*2 + 800
        let y = chain[i].y*2 + 400
        ctx.beginPath()
        ctx.ellipse(x, y, 2, 2, 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fill()
    }
}

async function wait() {
    return new Promise((resolve) => {
        setTimeout(resolve, 0)
    })
}

async function getMoves() {
    const response = await fetch('day09.txt')
    const txt = await response.text()
    return txt.split('\n').map(line => line.split(' ')).map(([dir, n])=> [dir, +n])
}