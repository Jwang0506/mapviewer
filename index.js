const canvas = document.getElementById("mapCanvas");
    const ctx = canvas.getContext("2d");

    let mapImage = new Image();
    let scale = 1, minScale = 1, maxScale = 3;
    let offsetX = 0, offsetY = 0;
    let isDragging = false, lastX = 0, lastY = 0;

    function loadMap() {
        mapImage.src = "file.svg"; // Change this to your SVG file
        mapImage.onload = () => {              
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawMap();
        };
    }

    function drawMap() {
        
        //if (offsetX >= 500) offsetX= 500;
        //if (offsetY >= 0) offsetY= 0;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        ctx.drawImage(mapImage, 0, 0);
        ctx.restore();
        drawDebugInfo();
        
    }


    function drawDebugInfo() {
        
    
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Semi-transparent background
        ctx.fillRect(canvas.width - 210, 10, 200, 90);
    
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.fillText(`Scale: ${scale.toFixed(2)}`, canvas.width - 200, 30);
        ctx.fillText(`OffsetX: ${offsetX.toFixed(0)}`, canvas.width - 200, 50);
        ctx.fillText(`OffsetY: ${offsetY.toFixed(0)}`, canvas.width - 200, 70);
        //let viewBox = mapImage.getAttribute("viewBox").split(" ").map(Number);
        //ctx.fillText(`Map: ${viewBox[2]}, ${viewBox[3]}`, canvas.width - 200, 90);
    
        ctx.restore();
    }

    // Zoom in/out
    canvas.addEventListener("wheel", (event) => {
        event.preventDefault();
        const scaleFactor = 1.1;
        let zoom = event.deltaY < 0 ? scaleFactor : 1 / scaleFactor;
        let newScale = scale * zoom;
        //console.log(scale);
        if (newScale >= minScale && newScale <= maxScale) {
            // Adjust offsets to zoom into the cursor position
            let mouseX = event.clientX - offsetX;
            let mouseY = event.clientY - offsetY;
            offsetX -= mouseX * (zoom - 1);
            offsetY -= mouseY * (zoom - 1);
            scale = newScale;
            
            drawMap();
        }
    });

    // Drag to pan
    canvas.addEventListener("mousedown", (event) => {
        isDragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        canvas.style.cursor = "grabbing";
        
    });

    canvas.addEventListener("mousemove", (event) => {
        if (isDragging) {
            offsetX += event.clientX - lastX;
            
            offsetY += event.clientY - lastY;
            
            lastX = event.clientX;
            lastY = event.clientY;
            
            drawMap();
        }
    });

    canvas.addEventListener("mouseup", () => {
        isDragging = false;
        canvas.style.cursor = "grab" ;
    });

    window.addEventListener("resize", () => {
        loadMap();
    });

    loadMap();