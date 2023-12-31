var startButton;
var stepButton;	
var speedMeter;	

var running;	//Boolean for if the simulation is running
var interval;

var dead;	//Color for dead cell
var living; //Color for living cell

var array = []; //Array of living cells.

/**
* Initializes variables and sets buttons as global variable 
*/
function init(){
    startButton = get("startButton"); //Set startButton as the start button
    stepButton = get("stepButton");	  //Set stepButton as the step button
    speedMeter = get("speedMeter");	  //Set speedMeter as the speed dropdown
    
    speedMeter.selectedIndex = 2;	//Set the initial index of the speed dropdown to "Normal"
    
    running = false;
    dead = "#eeeeee";
    living = "#000000";
}
/**
* Creates the 50x50 table of cells
* Each cell is given an id in the form of its x coordinate, an a, and its y coordinate.
* Each cell is also given the ability to be clicked which will toggle whether or not it is alive,
*  and a boolean attribute which dictates life or death.
* All cells are dead by default.
*/
function createGrid(){
    document.writeln("<table>");
    for(var r = 0; r < 50; r++){
        document.writeln("<tr>");
            for(var c = 0; c < 50; c++){
                document.writeln("<td life=false id=" + getIdForm(r,c) + " onclick=\"swap(this.id);\" style=\"background-color:" + dead + "\">&nbsp;</td>");
            }
        document.writeln("</tr>");
    }				
    document.writeln("</table>");
}

/**
* This function takes a cell id and toggles whether or not it is alive.
* If the cell is already alive, it will change its color and remove its ID from the
*  global array of living cells.
* Otherwise, it will mark the cell as alive, change its color, and append its ID to the end
*  of the global array.
*/
function swap(xy){
    
    if(get(xy).life){
        get(xy).life = false;
        get(xy).style.backgroundColor = dead;
        for(var i = 0; i < array.length; i++) {
            if(array[i] == xy){
                array.splice(i,1);	//If cell is toggled to dead, remove it from the global array of living cells.
                break;
            }
        }
    } else {
        get(xy).life = true;
        get(xy).style.backgroundColor = living;
        array.push(xy);
    }
}

/**
* Begins the simulation and checks the speed dropdown for the time interval.
*/
function live() {
    interval = setInterval(step, speedMeter.value); 
}

/**
* Called by the step button and toggles the global "running" boolean for one step of the simulation.
*/
function stepButt(){
    running = true;
    step();
    running = false;
}
/**
* This function is called when the start button is clicked.
* It toggles whether or not the simulation is running as well as the text of the button using the
*  global "running" variable.
* If the simulation is not already running, it will run the live() function.
*/
function begin(){
    if(running){
        running = false;
        startButton.innerHTML="Start";
    } else {
        startButton.innerHTML="Stop";
        running = true;
        live();
    }				
}

/**
* This function creates a temporary array of the cells to swap and then proceeds to iterate through 
*  the global array of living cells if the "running" variable is true.
* If the "running" boolean is false, it will stop the interval, pausing the simulation.
* Once the function has checked all cells in the global array, it iterates through the created list of
*  of cells that need to be swapped, swapping them.
*/
function step(){
    var tempArr = [];
    if(!running) {
        clearInterval(interval);
    } else {
        for(var i = 0; i < array.length; i++){
            checkLive(array[i], tempArr)	
        }
        for(var j = 0; j < tempArr.length; j++){
            swap(tempArr[j]);
        }
    }		
}

/**
* This function takes the ID of a cell and the temporary array used by step() to determine if a cell needs to be toggled.
* It first iterates through all eight positions surrounding the cell, adding to a count if its neighbors are alive.
* If there is a dead neighbor cell, the function checks to see if that cell should be alive by checking all surrounding cells
*  with a count in the same way that the initial cell is checked. If there are exactly three living neighbors, the cell is added
*  to the temporary array to be brought to life, as per the rules of the Game of Life.
* Once all neighboring cells are checked, the cell is tested to see if it needs to die according to the rules of the Game of Life:
*  1) if a cell has less than two neighbors, it will die
*  2) if a cell has more than three neighbors, it will die
*  3) if a cell has 2 or three neighbors, it will survive.
* If the cell needs to die, it will be added to the temporary array to be toggled. Otherwise it is left alone.
* If the program hits the edge or otherwise encounters an error, that erranous cell is treated as dead.
*/
function checkLive(xy, tempArr){
    var count = 0;
    var x = parseInt(getX(xy));
    var y = parseInt(getY(xy));
    
    for(var r = -1; r<2; r++){
        for(var c = -1; c<2; c++){
            if(!(r==0&&c==0)){  //Exclude the cell itself
                try{
                    if(get(getIdForm((x+r),(y+c))).life) {
                        count++; //If a neighbor cell is alive, increase the count.
                    } else { //If neighbor cell is dead, check to make sure if it could be toggled.
                        var secCount = 0;
                        for(var i = -1; i<2; i++){
                            for(var j = -1; j<2; j++){
                                if(!(r==0&&c==0)){ //Exclude neighbor cell itself.
                                    try{		
                                        if(get(getIdForm((x +i+r),(y +j+c))).life) {
                                            secCount++; //If a neighbor cell is alive, increase the count.
                                        }
                                    } catch(TypeError) {
                                        continue; //Ignore edges.		
                                    }
                                }	
                            }
                        }
                        if(secCount == 3)
                            tempArr.push(getIdForm(r+x,c+y)); //If dead neighbor cell to xy has exactly three neighbors, bring it to life.
                    }
                } catch(TypeError) {
                    continue; //Ignore edges.
                }
            }
        }
    }
    if(count< 2 || count > 3 ) {
        tempArr.push(xy); //If target cell xy does not have 2 or 3 neighbors, it will die.
    }
}

/**
* Helper function to get x-coordinate of ID.
*/
function getX(xy){
    return xy.substr(0,xy.indexOf("a"));
}
/**
* Helper function to get y-coordinate of ID.
*/
function getY(xy){
    return xy.substr(xy.indexOf("a")+1);
}
/**
* Helper function to get ID from x-coordinate and y-coordinate.
*/
function getIdForm(x,y){
    return x + "a" + y;
}
/**
* Helper function to avoid typing "document.getElementById"
*/
function get(id){
    return document.getElementById(id);
}