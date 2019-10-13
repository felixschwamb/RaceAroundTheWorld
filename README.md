# RaceAroundTheWorld
In thiis project I built a racing competition based on randomly generated geolocation data. The racers perform a race for a chosen number of laps and a ranking shows which racer covered the longest distance.

The motiviation for this project is to practice the creation of a web application using data which is dynamically generated on the server. 

## Technologies
* JavaScript
* Node.js
* Express

## Generation of data
The data is generated server-side. 

With each page load ten racer objects are created, which contain the following randomly generated data:
* Racer name
* Racer team
* Starting position
* Geolocation data (lat, long), used as the first destination for the racer (buffer)

When the race is started, the web application request a new location for each racer every five seconds. So, the following data is randomly generated for each racer object:
* Geolocation data (lat, long), used as the next destination for the racer

The distance the racer cover is based on the randomly generated geolocation data.  

## Functionalities
### Selection of laps
Before starting the race the number of laps can be selected. The max number of laps is 15 and one lap takes five seconds. During one lap the racers move from their current location to their next destination.
### Start race
After selecting the number of laps the race can be started.
### Reset race
After all laps are over the race can be resetted. So each racer returns to its starting position, the distances covered are set back to zero and the number of laps for the next race can be selected. This function can also be used during the race to cancel it.
### Presentation of race
Each racer is represented by a race car icon and all racers are placed on a world map, which is the race track. During a lap they move on the map to their next destination. The speed of the movement depends on the distance a racer needs to cover during a lap. The locations and the calculation of the coverd distance are based on geolocation data but the placement on the map can slightly differ due to conversion of data.
### Driver ranking
Next to the race track the ranking of the ten racers is shown. The ranking is based on the distance covered by each racer and shows the racer with the longest distance covered on the top. The ranking changes after each lap to show the current ranking and the leading racer.

## Further development ideas
* Higlighting the winner of a race
* Animation of the ranking, so the cards representing each racer move into place, making it more obvious how the ranking changed
* Selection of number of racers

## Node.js environment variables
* PORT
