// Write the swg tag to the variable
// Write a variable to display degrees
const angleSvg = document.getElementById("angleSvgID")
const angleViewer = document.getElementById("angleViewer")

// The task is implemented in one class.
class Angle {

    // In the class parameters, we pass the variable inside which the svg tag is located
    // and we find all the necessary elements inside this variable by id
    constructor(angleSvg) {
        this.angleSvg = angleSvg;
        this.verticalLine = angleSvg.getElementById("verticalID");
        this.horizontalLine = angleSvg.getElementById("horizontalID");
        this.origin = angleSvg.getElementById("originID");
        this.arc = angleSvg.getElementById("arc");
        this.rectangle = angleSvg.getElementById("rectangle");
        this.angleViewer = angleViewer
        this.dragMode = false;

        // To find the length of the segment (vertical line) at the coordinates of its vertices
        // i used the formula  d=√(x2 - x1)^2 + (y2 - y1)^2
        this.verticalLineLength = Math.sqrt(
            Math.pow(this.x1() - this.x2(), 2) +
            Math.pow(this.y1() - this.y2(), 2)
        );

    }   
    // The next method is for creating an svg arch
    drawArc(cx, cy, r, angle) {
        const startAngle = Math.PI * (180 - angle) / 180;

        const matrixTimes = ([[a, b], [c, d]], [x, y]) => [a * x + b * y, c * x + d * y];
        const addVectors = ([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2];

        const rotMatrix = [[-1, 0], [0, -1]];
        const [sX, sY] = (addVectors(matrixTimes(rotMatrix, [r * Math.cos(startAngle), r * Math.sin(startAngle)]), [cx, cy]));
        const [eX, eY] = (addVectors(matrixTimes(rotMatrix, [-r, 0]), [cx, cy]));
        this.arc.setAttribute("d", "M " + sX + " " + sY + " A " + [r, r, 180, 0, 1, eX, eY].join(" "));
    }

    // The init method is used to initialize events
    init() {
        // The handler is intended for the controller scale during mouseover
        this.origin.addEventListener("mouseover", event => {
            let r = 5;
            let interval = setInterval( () => {
                this.origin.setAttribute("r", ++r);
                if(r === 10) {
                    clearInterval(interval);
                }
            }, 20);
        });

        // The handler is intended for the controller scale during mouseout
        this.origin.addEventListener("mouseout", event => {
            let r = 10;
            let interval = setInterval( () => {
                this.origin.setAttribute("r", --r);
                if(r === 5) {
                    clearInterval(interval);
                }
            }, 20);
            this.origin.setAttribute("r", "5")
        });

        // When clicked, switch the dragMode flag (true / false)
        this.origin.addEventListener("mousedown", event => {
            this.dragMode = true;
        });       
       
        window.addEventListener("mousemove", event => {
            if (this.dragMode === true) {
                this.origin.setAttribute("r", "10");

                // Abbreviation for the squaring function
                const pow2 = x => Math.pow(x, 2);

                // Write the coordinates of the mouse into a variable
                let mouseX = event.x;
                let mouseY = event.y;

                // Write the constant values of the controller's starting coordinates into variables
                const startX = 300;
                const startY = 300;

                // The condition is necessary to fix the controller in the lower position
                if (mouseY > startY) {
                    mouseY = startY;
                }

                // into the variable distanceCenterToMouse we get the length of the segment from the mouse to the center of the angle
                // In the divider variable we get the ratio of distanceCenterToMouse to the length of the vertical line 
                const distanceCenterToMouse = Math.sqrt(pow2(startX - mouseX) + pow2(startY - mouseY));
                const divider = distanceCenterToMouse / this.verticalLineLength;

                // The variables originPosX and originPosY get the coordinates of the points 
                // where the controller and the end of the vertical line will be
                const originPosX = startX + (mouseX - startX) / divider;
                const originPosY = startY + (mouseY - startY) / divider;

                // Set the controller coordinates cx and cy
                // We call the functions that return the coordinates x1 and y1 and pass to the parameters the variables 
                // that were received above
                this.origin.setAttribute("cx", originPosX.toString());
                this.origin.setAttribute("cy", originPosY.toString());
                this.x1(originPosX);
                this.y1(originPosY);
                
                // To find a dynamically changing angle, I used the angle tangent formula tg(A) = a/b                 
                let dynamicAngle = Math.atan((this.y2() - this.y1()) / (this.x1() - this.x2())) * 180 / Math.PI;

                // The next 2 lines are needed to fix arc bugs
                if (dynamicAngle < 0) dynamicAngle += 180;
                if (mouseX < startX && mouseY === startY) dynamicAngle = 180;

                // On the next line, round the number to the nearest integer
                // and write to the tag inside the variable angleViewer
                this.angleViewer.innerHTML = Math.round(dynamicAngle).toString();

                // The check below is for rendering a square at an angle of 90
                if (Math.round(dynamicAngle) === 90) {
                    this.arc.style.display = "none";
                    this.rectangle.style.display = "inline";
                } else {
                    this.arc.style.display = "inline";
                    this.rectangle.style.display = "none";
                }

                // We call the function-generator of the svg arc and transfer the dynamic angle to the parameters
                // This way it will dynamically change
                this.drawArc(300, 300, 20, dynamicAngle);
            }
        });

        // The next handler is needed to switch the dragMode flag and controller scale
         window.addEventListener("mouseup", event => {
            this.dragMode = false;
            this.origin.setAttribute("r", "5");
        });
    }

    // The next code block is for changing the coordinates of the points of the vertical line
    // In case of calling these functions without parameters, they will return current values of the coordinates
    // If the parameter is passed during the call, they change the coordinates
    x1(val) {
        if (val) {
            this.verticalLine.setAttribute("x1", val);
        } else {
            return Number.parseInt(this.verticalLine.getAttribute("x1"));
        }
    }

    x2(val) {
        if (val) {
            this.verticalLine.setAttribute("x2", val);
        } else {
            return Number.parseInt(this.verticalLine.getAttribute("x2"));
        }
    }

    y1(val) {
        if (val) {
            this.verticalLine.setAttribute("y1", val);
        } else {
            return Number.parseInt(this.verticalLine.getAttribute("y1"));
        }
    }

    y2(val) {
        if (val) {
            this.verticalLine.setAttribute("y2", val);
        } else {
            return Number.parseInt(this.verticalLine.getAttribute("y2"));
        }
    }
}

const angle = new Angle(angleSvg);
angle.init();





