# leaflet-challenge

This project is a solution to Module 15 which is an Earthquake Visualization challenge using Leaflet. The earthquake data is fetched from the USGS Earthquake given to us in the module instructions. 

The project includes the following file:

1. `index.html`: The main HTML file which contains links to the CSS and JavaScript fiiles.
2. `config.js`: No API was used as a BCS LA confimred it was not needed.
3. `logic.js`: The mains JavaScript file which contain the solution for the challenge.
4. `style.css`: A CSS file that contains styles for the webpage.
5. Images: This foldercontains screenshots of the final output.

The `logic.js` file fetches earthquake data from 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson' and visualizes it on a map. The size and color of the markers on the map represent the magnitude and depth of the earthquakes, respectively.

