#Rover map generator

1. Access the api documentation

You can consult the API documentation [here](https://mars-map-generator.herokuapp.com/explorer/#/Maps/post_maps).
You can click on `Try it out` and play with the values before clicking `Execute`.
This will output you the map in the Response body.

#Understanding the map output

The map output is a matrix view of the field. Each array inside the matrix represents a layer cut of the map.
Each number greater than 0 represents a tile (lava, sand, ice, black hole, gravel, ...). The 0 value represents the air.
Consequently, there's no 0 value in the first array, as it's plain ground. The 0 value (air) starts to appear in the second array.
Understand that greater is the array index, greater chances you have to encounter 0 values inside it. 