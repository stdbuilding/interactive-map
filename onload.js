


let test = fetch(svgmap)
   .then(response => response.text())
   .then(svgContent => {
      console.log(document.querySelector('.map'))
      document.querySelector('.map').innerHTML = svgContent;
      console.log(svgContent)
      allg = document.querySelectorAll('[id*="layer"] > rect')
      rect = allg
      // Loop through all list items, and hide those who don't match the search query
      for (i = 0; i < rect.length; i++) {
         txtValue = rect[i].getAttribute('inkscape:label') || "";
         for (k = 0; k < product.length; k++) {
            if (txtValue.toUpperCase().indexOf(product[k].toUpperCase()) > -1 && product[k].toUpperCase() != '') {
               rect[i].classList.add('highlightgroup');
               pan(rect[rect.length - 1])

            }
         }
      }
      let mouseEv = document.querySelector('svg')
      mouseEv.addEventListener('click', function (e) {
         if (!e.target.matches('[id*="rect"]')) {
            removepopup()
         }
      })
      let location2 = document.querySelector('g > path[id="path1-0"]')
      
panCenter(location2)
initcurrentlocation()
initonclickrect()
   })
   .catch(error => console.error('Error loading SVG:', error));






const fuse = new Fuse(searchdata, fuseOptions);