


let test =fetch(svgmap)
    .then(response => response.text())
    .then(svgContent => {
        console.log(document.querySelector('.map'))
        document.querySelector('.map').innerHTML=svgContent;
        console.log(svgContent)
    })
    .catch(error => console.error('Error loading SVG:', error));
