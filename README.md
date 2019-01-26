# LA Traffic Visualization

## PROJECT SUMMARY
Traffic Safety is always a highly concerned topic in Los Angeles.
Freeway is part of daily traveling of most LA people.
To help LA citizens knows highway traffic better. We collect traffic
incidents happened in 2017 reported by California Highway Patrol.
We've done several data research and analysis and we wish to share this
knowledge to help people have safety driving.

## PROJECT INFORMATION
- Project title: Los Angeles Accident Analysis and Highway Safety
- Group name: Datum
- Team names: Wei-Chung Wang (weichunw), RouleXia(rouleixi), Lu Zhang(zhan634)

### PROJECT ARTIFACTS
- [Demonstration](http://www-scf.usc.edu/~weichunw/final/)
- [Presentation](https://github.com/INF554Fall18/project-datum/blob/master/INF554\_pre\_final.pdf)
- [Transcript](https://github.com/INF554Fall18/project-datum/blob/master/transcript.md)
- [Report](https://github.com/INF554Fall18/project-datum/blob/master/Datum\_Final\_Report.pdf)
- [Overleaf](https://www.overleaf.com/read/fcfmmmcqkfzd)
- [Youtube](https://youtu.be/WkuMyM9T2YE) 

## Data Source
- Thanks to help of USC Information Laboratory(InfoLab), We have access to dataset of California Highway Patrol's daily report.
- The dataset is hostby [InfoLab](https://infolab.usc.edu/) as postgres within USC
- The dataset include informations of daily danger situations happened on LA Freeway.
- Each row includes datetime, lat/lng location, street name, and injured level.

## SetUp
### Build Angular and Library
- Install angular2 CLI tool
- Exec "ng new final" to generate new angular project

### Install Librarys
- Exe 'npm install jquery --save'
- Exe 'npm install popper.js --save'
- Exe 'npm install d3 @type/d3 --save'
- Exe 'npm install bootstrap --save'
- Exe 'npm install d3-tile --save'

## System Structure 

### Structure
- The main page includes two parts, navgation bar and router outlet.
- Navgation bar includes our log, links to each component, Team info and link to our github.
- Clicking links in the navagation bar will rerender the router outlet and shows corresponding page.
- Links to each page are defined in app-routing.ts file.
- We use bootstrap to organize the web page.
- We use [angular material](https://material.angular.io/) theme and predefined elements and compose our web page.

### Clustered Map
- Declare d3 margin convention
- Create d3-projection and scales to position elements.
- Create tooltip div.
- We use d3-tile to render roads and terrains.
- Render circles corresponding filter options.
- Add circle show/hide transition.
- Add tooltip show/hide transition.

### Daily Risk Line Chart
- Declare d3 margin convention
- Create  scales to position elements.
- Create axis, lines, and legends. 
- Add vertical pop-out line and pop-out values.
- Add line and legend pop-out transition effects.
- Add line and legend show/hide interaction.
- Create line type selection button.
- Implement reponsive rendering function when when window resize.

### Danger Ratio Pie Chart
- Declare d3 margin convention
- Create  scales to position elements.
- Create color scale.
- Create hierarchy bubble chart.
- Create default pie chart.
- Create tooltips div.
- Add pop-out effect on bubbles.
- Add bubble and pie chart interaction when bubble is cliccked.
- Add tooltip transition when hovering on bubbles.

### Team Information
- We put on our selfies and identity information to reduce grader's visual query back to student list.

## Deployment
- We build the whole project with command "ng build --prod"
- We uplaod compiled project to usc scf service.

<a name="ref"></a>
## Reference
* [Angularjs](https://angularjs.org/)
* [Angular material](https://material.angular.io/)
* [Bootstrap](https://getbootstrap.com/)
* [CHP code](https://lostcoastoutpost.com/chpwatch/codes/)



