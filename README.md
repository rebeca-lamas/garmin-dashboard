# Garmin Fitness Tracker Dashboard

Data was downloaded from a fitness watch through the Garmin website. The data was then transformed to create different visualizations that Garmin is missing. Garmin along with many other fitness trackers lack data that show trends on a more macro level. Three charts were created to fill this gap. They include a day/hour heat map, a bar chart and a bubble map.

The day/hour heat map shows trends in workouts times. The greater the number of workouts at a given time and day of the week the darker the tile will be.  This can be useful to users as an accountability in planning their workouts and if they are scheduling a workout at a realistic time.

Garmin does have bar charts, but it lacks charts that show trends in the number of workouts per month and over several years. This can show trends in if a user is less likely to work out in a specific month. 

The bubble map shows all the workouts on a map. The size of the bubble is determined by the length of the workout in minutes. The color of the bubble is determined by the type of workout. There is also a popup that shows when you click on te buble that provides summary information. This graph can provide insight into what workouts you spend the most of your time on.

A table is displayed at the bottom on the webpage so that you can further examine the data if you desire. 

The JavaScript library called Anime was used to create the header. D3 and leaflet were used to create the different visualizations. A flask app is serving up the webpage and the visualizations pull their data from the following API endpoints: 

/api/weekly

/api/barchart

/api/map

/api/activities
