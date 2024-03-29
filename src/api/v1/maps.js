const express = require('express');
const router = express.Router();

// Gets random int, min included max included
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}

/*  Adds ice on the map.
    @width width of the map.
    @height height of the map.
    @seaLevel the rate of ice.
    @map the map.
 */
function addIce(width, height, seaLevel, map) {
    let wTimesH = width * height;
    for (let i = 0; i < wTimesH * seaLevel; i++) {
        let placed = 0;
        do {
            let rndCell = getRandomIntInclusive(0, wTimesH);
            if (!map[1][rndCell] && map[0][rndCell] > 0 && map[0][rndCell] < 9) {
                map[0][rndCell] = getRandomIntInclusive(9, 12);
                placed = 1;
            }
        } while (!placed);
    }
}

/*
    Adds dunes on the map.
    @width width of the map.
    @height height of the map.
    @dunesLevel the rate of dunes.
    @map the map.
    @depth the Z max height of the dunes.
 */
function addDunes(width, height, dunesLevel, map, depth) {
    let wTimesH = width * height;
    for (let i = 0; i < wTimesH * dunesLevel; i++) {
        let placed = 0;
        do {
            let rndCell = getRandomIntInclusive(0, wTimesH);
            let rndHeight = getRandomIntInclusive(2, depth);
            if (map[0][rndCell] < 9 && map[0][rndCell] > 12 || map[0][rndCell] < 13) {
                let centerPos = rndCell;
                rndCell = rndCell - Math.trunc((rndHeight * 2 - 1) / 2) - width *
                    Math.trunc((rndHeight * 2 - 1) / 2);
                for (let l = 1; l < depth; l++) {
                    for (let line = 0; line < rndHeight * 2 - 1; line++) {
                        for (let column = 0; column < rndHeight * 2 - 1; column++) {
                            if (!((column === 0 && line === 0) ||
                                (line === 0 && column === rndHeight * 2 - 1 - 1) ||
                                (line === rndHeight * 2 - 1 - 1 && column === 0) ||
                                (line === rndHeight * 2 - 1 - 1 && column === rndHeight * 2 - 1 - 1))) {
                                if (rndCell + column <= wTimesH) {
                                    let prob = getRandomIntInclusive(1, 10);
                                    if (prob <= 3)
                                        map[l][rndCell + column] = getRandomIntInclusive(5, 8);
                                    else
                                        map[l][rndCell + column] = getRandomIntInclusive(1, 4);
                                    placed++;
                                }
                            }
                        }
                        rndCell += width;
                    }
                    rndHeight--;
                    rndCell = centerPos - Math.trunc((rndHeight * 2 - 1) / 2) - width *
                        Math.trunc((rndHeight * 2 - 1) / 2);
                }
            }
        } while (!placed);
        i += placed;
    }
}

/*
    Adds black holes on the map.
    @width width of the map.
    height height of the map.
    @holesLevel the rate of black holes.
    @map the map.
 */
function addHoles(width, height, holesLevel, map) {
    let wTimesH = width * height;
    for (let i = 0; i < wTimesH * holesLevel; i++) {
        let placed = 0;
        do {
            let rndCell = getRandomIntInclusive(0, wTimesH);
            if (!map[1][rndCell] && map[0][rndCell] > 0 && map[0][rndCell] < 9) {
                map[0][rndCell] = getRandomIntInclusive(13, 16);
                placed = 1;
            }
        } while (!placed);
    }
}

// Generates the map
router.post('/', async (req, res) => {
    req.setTimeout(500000);
    //Map construction
    const {width: width, height: height, maxDepth: maxDepth, seaLevel: seaLevel, dunesLevel: dunesLevel,
        holesLevel: holesLevel} = req.body;
    if (!height || !width) {
        return res.status(400).send({
            message: "Le body ne contient pas les paramètres requis. " + JSON.stringify(req.body)
        });
    }
    let depth = maxDepth ? maxDepth : 2;
    let map = [];
    for (let i = 0; i < depth; i++) {
        let layer = [];
        for (let j = 0; j < width * height; j++) {
            if (i)
                layer[j] = 0;
            else {
                let prob = getRandomIntInclusive(1, 10);
                if (prob <= 3)
                    layer[j] = getRandomIntInclusive(5, 8);
                else
                    layer[j] = getRandomIntInclusive(1, 4)
            }
        }
        map.push(layer);
    }

    // Adds ice on the map
    if (seaLevel)
        addIce(width, height, seaLevel, map);
    else
        addIce(width, height, 0.03, map); //10% ice default

    console.log('ice added.');

    if (holesLevel)
        addHoles(width, height, holesLevel, map);
    else
        addHoles(width, height, 0.01, map); //10% ice default

    console.log('holes added.');

    if (depth > 2)
        if (dunesLevel)
            addDunes(width, height, dunesLevel, map, depth);
        else
            addDunes(width, height, 0.01, map, depth);

    console.log('dunes added.');

    const fs = require('fs');
    fs.writeFile("/tmp/map.txt", JSON.stringify(map), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    return res.status(200).send(JSON.stringify(map));
});

module.exports = router;