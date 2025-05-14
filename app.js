
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
const SVG_NS = 'http://www.w3.org/2000/svg';
const queryString = window.location.search;
const el = (sel, par) => (par || document).querySelector(sel);
let product = ""
if (queryString != "") {
   const urlParams = new URLSearchParams(queryString);
   product = urlParams.get('product').split(',')
}
let productnames = []
let NEWproductnames = []

const fuseOptions = {
    shouldSort: true,
    useExtendedSearch: true,
   keys: [
      "product",
      "productshortcode"
   ]
};



function initonclickrect() {
   let rects = document.querySelectorAll('[id*="rect"]')
   rects.forEach(e => {
      e.addEventListener('click', function (ev) {
         createpopup(e, ev)
         removename(e.id)
         showname(e.id)
      })
   })
}


function createBox(texts,id) {
   var box = document.createElement('div');
   box.className = 'box';
   box.style.left = `${window.scrollX + event.clientX}px`;
   box.style.top = `${window.scrollY + event.clientY}px`;
   let map = document.querySelector('body')
   let ul = document.createElement('ul')

    let rect = document.getElementById(id)
    let g = rect.parentElement
    let keyword = g.getAttribute("inkscape:label")

    let search_results = texts
    .filter(prof => {
        // Filter results by doing case insensitive match on name here
        return prof.product.toLowerCase().includes(keyword.toLowerCase());
    })
    .sort((a, b) => {
        // Sort results by matching name with keyword position in name
        if(a.product.toLowerCase().indexOf(keyword.toLowerCase()) > b.product.toLowerCase().indexOf(keyword.toLowerCase())) {
            return 1;
        } else if (a.product.toLowerCase().indexOf(keyword.toLowerCase()) < b.product.toLowerCase().indexOf(keyword.toLowerCase())) {
            return -1;
        } else {
            if(a.product > b.product)
                return 1;
            else
                return -1;
        }
    });
    texts.sort(function(a, b){  
        return search_results.indexOf(a) - search_results.indexOf(b);
    });
    texts.reverse()
   texts.forEach(c => {
      let li = document.createElement('li')
      let a = document.createElement('a')
      a.innerHTML = c['product']
      a.setAttribute('href', `https://standardbuildingsupplies.ca/catalogsearch/result/?q=${encodeURIComponent(c['product'])}`)
      li.appendChild(a)
      ul.appendChild(li)
   })
   box.appendChild(ul)
   map.appendChild(box);
}

function removepopup() {
   let txt = document.querySelectorAll('text').forEach(e => e.remove())
   let b = document.querySelectorAll('.textbacking').forEach(e => e.remove())
   let box = document.querySelectorAll('.box').forEach(e => e.remove())
}

function createpopup(e, ev) {
   removepopup()
   let element = document.getElementById(e.id)
   let parent = document.querySelector('svg')
   let list = []
   searchdata.forEach(f => {
      if (f['location'].includes(element.querySelector('title').innerHTML)) {
         list.push(f)
      }
   })
   createBox(list,e.id)
   let svg1 = document.querySelector(`#${e.id}`)
   let svg = svg1.closest('g[id]')
   let rects = Array.from(svg.querySelectorAll(`[id='${e.id}']`));
   let arr = Array(rects.length).fill(true);
}

function initcurrentlocation() {
   let initlocation = document.querySelector(`g[id="layer15"] > path`)
   initlocation.classList.add('location')
}


function createwarning(){
   let parent = document.querySelector('.map')
   let warningbox = document.createElement('div')
   let warningtext = document.createElement('p')
   warningtext.innerHTML = 'This product is out of bounds,  ask the <span style="font-weight:bold;">Yard Service desk </span> for more information'
   warningbox.classList.add('warningbox')
   warningtext.classList.add('warningtext')
   warningbox.appendChild(warningtext)
   parent.appendChild(warningbox)

}
function removewarning(){
   document.querySelectorAll('.warningbox').forEach(e => e.remove())
}


function highlightgroup(groupname, classname) {
   
   let searchbar = document.querySelector('input')
   searchbar.value = ''
   myFunction()
   removepathstoproduct()
   removepopup()
   removewarning()
   let allli = document.getElementsByClassName('clicked')
   let li = document.getElementsByClassName(classname)
   let allelementsh = document.querySelectorAll('[id*="rect"]:not(.textbacking)')
   let elements = document.getElementById(groupname).children
   let subproducts = []
   removename(groupname)
   let hasdesc = false
   let ranonce = false
   if (document.querySelector(`g[id='${groupname}'] > title`) && document.querySelector(`g[id='${groupname}'] > title`).innerHTML == 'offlimits') {
      createwarning()
   }
   if (document.querySelector(`g[id='${groupname}'] > desc`)) {
      subproducts = document.querySelector(`g[id='${groupname}'] > desc`).innerHTML.split(',')
      hasdesc = true
   }
   for (let i = 0; i < allelementsh.length; i++) {
      allelementsh[i].classList.remove('highlightgroup')
   }
   if (allli.length == 0) {
      for (let i = 0; i < elements.length; i++) {
         elements[i].classList.add('highlightgroup');
         
         if (elements.length <= 4 && elements[i].id != '' && hasdesc == false && elements[i].matches('[id*="rect"]')) {
            if (ranonce == false){
               console.log(elements[i])
               drawpathtoproduct(elements[i])
               ranonce = true
            }
            showname(elements[i].id)

         }
      }
      pan(elements[elements.length - 1])
      for (let i = 0; i < allli.length; i++) {
         allli[i].classList.remove('clicked')
      }

      li[0].classList.toggle('clicked')
      showsubproducts(groupname, subproducts)
   }

   else {
      if (!li[0].classList.contains('clicked')) {
         clearsubproducts()
         for (let i = 0; i < elements.length; i++) {
            elements[i].classList.add('highlightgroup');
            
            if (elements.length <= 4 && elements[i].id != '' && hasdesc == false && elements[i].matches('[id*="rect"]')) {
               showname(elements[i].id)
            }
         }
         pan(elements[elements.length - 1])
         for (let i = 0; i < allli.length; i++) {
            allli[i].classList.remove('clicked')
         }
         li[0].classList.toggle('clicked')
         showsubproducts(groupname, subproducts)
      }
      else {
         for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove('highlightgroup');
         }
         for (let i = 0; i < allli.length; i++) {
            allli[i].classList.remove('clicked')
         }
         clearsubproducts()
      }

   }
}
function clearselected() {
   document.querySelectorAll('ul > li').forEach(e => e.classList.remove('clicked'));
   document.querySelector('.productdropdown').classList.remove('appearmenu')
   document.querySelectorAll('.handlediv').forEach(e => e.remove())
   document.querySelectorAll('.productdropdown > span').forEach(e => e.remove())
   document.querySelectorAll('.productdropdown > ul > li').forEach(e => e.remove('clicked'))
   document.querySelectorAll('rect[class="highlightgroup"]').forEach(e => e.classList.remove('highlightgroup'));
}
function showsubproducts(groupname, subproduct) {
   let ul = document.querySelector('.productdropdown > ul')
   ul.style = ''
   let div = document.querySelector('.productdropdown')
   ul.classList.remove('hideul')
   div.classList.remove('hidemenu')
   if (subproduct.length != 0) {
      removepathstoproduct()
      let handlediv = document.createElement('div')
      handlediv.classList.add('handlediv')
      handlediv.addEventListener('click',(e =>{
        if(!div.classList.contains('hidemenu')){
            let h = document.querySelector('.productdropdown > ul')
            let r = document.querySelector(':root');
            r.style.setProperty('--change',h.offsetHeight + 'px');
            div.classList.add('hidemenu')
            ul.classList.add('hideul')
        }
        else{
            div.classList.remove('hidemenu')
            ul.classList.remove('hideul')
        }
      }))


      let span = document.createElement('span')
      handlediv.appendChild(span)
      span.classList.add('handle')
      div.appendChild(handlediv);
      div.classList.add('appearmenu')
      let allsubheadings = []
      for (let i = 0; i < subproduct.length; i++) {
         if (subproduct[i].indexOf(':') > -1 ){
            let subproductsitems = subproduct[i].split(':')
            allsubheadings.push(subproductsitems[0])
         }
      }
      allsubheadings =[... new Set(allsubheadings)]
      if (allsubheadings.length > 0 ){
         //subproduct.sort((a, b) => allsubheadings.indexOf(a) - allsubheadings.indexOf(b))
         ul.style.width = '100%'
         let subheadingHEND = document.createElement('li')
         subheadingHEND.classList.add('subheading')
         subheadingHEND.innerText = ''
         ul.appendChild(subheadingHEND)
         for (let i = 0; i < subproduct.length; i++) {
            let subproductsitems = subproduct[i].split(':')

            if(!subproductsitems[1]){
               let li = document.createElement("li");
               li.classList.add('w3-button')
               li.classList.add(`w3-ripple`)
               li.innerText = subproduct[i];
               li.style.animation = 'fade-in  0.5s';
               li.setAttribute('onclick', `showonlysubproduct(${groupname},"${subproduct[i]}")`)
               li.classList.toggle('slide-top')
               ul.appendChild(li)
            }
         }

         for (let k = 0; k < allsubheadings.length; k++) {
            let subheadingH = document.createElement('li')
            subheadingH.classList.add('subheading')
            subheadingH.innerText = allsubheadings[k]
            ul.appendChild(subheadingH)
            for (let i = 0; i < subproduct.length; i++) {
               let subproductsitems = subproduct[i].split(':')
               if(subproductsitems[0] == allsubheadings[k]){
                  let li = document.createElement("li");
                  li.classList.add('w3-button')
                  li.classList.add(`w3-ripple`)
                  li.innerText = subproductsitems[1];
                  li.style.animation = 'fade-in  0.5s';
                  li.setAttribute('onclick', `showonlysubproduct(${groupname},"${subproduct[i]}")`)
                  li.classList.toggle('slide-top')
                  ul.appendChild(li)
               }

            }
         }
      }
      else{
         for (let i = 0; i < subproduct.length; i++) {
            let subproductsitems = subproduct[i].split(':')
            let li = document.createElement("li");
   
            li.classList.add('w3-button')
            li.classList.add(`w3-ripple`)
            li.innerText = subproduct[i];
            li.style.animation = 'fade-in  0.5s';
            li.setAttribute('onclick', `showonlysubproduct(${groupname},"${subproduct[i]}")`)
            li.classList.toggle('slide-top')
            ul.appendChild(li);
         }
      }

   }
   else {

   }
}

function pan(element) {
   if (isSafari) {
      seamless.scrollIntoView(element, {
         behavior: "smooth",
         block: "nearest",
         inline: "nearest"
      });
   }
   else {
      element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
   }

}

function panCenter(element) {
   if (isSafari) {
      seamless.scrollIntoView(element, {
         behavior: "smooth",
         block: "center",
         inline: "center"
      });
   }
   else {
      element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
   }

}


function randomIntFromInterval(min, max) { // min and max included 
   return Math.floor(Math.random() * (max - min + 1) + min)
}


function showonlysubproduct(groupname, product) {
   removepathstoproduct()
   removepopup()
   let allelementsh = document.querySelectorAll(`g[id='${groupname.getAttribute('id')}'] > [id*="rect"]`)
   let div = document.querySelector('.productdropdown')
   let h = document.querySelector('.productdropdown > ul')
   let r = document.querySelector(':root');
   r.style.setProperty('--change',h.offsetHeight + 'px');
   h.classList.add('hideul')
   div.classList.add('hidemenu')
   allelementsh.forEach((e) => {
      e.classList.add('highlightgroup')
      removename(e.id)
   })
   let ranonce = false
   for (let i = 0; i < allelementsh.length; i++) {
      if (!allelementsh[i].getAttribute('inkscape:label').toUpperCase().includes(product.toUpperCase())) {
         allelementsh[i].classList.toggle('highlightgroup')

      }
      if (allelementsh[i].getAttribute('inkscape:label').toUpperCase().includes(product.toUpperCase())) {
         pan(allelementsh[i])
         if (ranonce == false){
            drawpathtoproduct(allelementsh[i])
            ranonce = true
         }
         showname(allelementsh[i].id)

      }
   }
}

function drawpathtoproduct(product){
   const ns = "http://www.w3.org/2000/svg";
   let container = document.querySelector('svg')
   let location1 = document.querySelector('.location')
   let location = location1.getBBox()
   let destination = product.getBBox()
   

   let svg1 = document.querySelector(`#${product.id}`)
   let svg = svg1.closest('g[id]')
   let sbb = svg.getBBox()
   console.log(svg)
   console.log(location)
   var xforms = svg.getAttribute('transform');
   if (xforms == null){
      var firstX = 0,firstY = 0;
   }
   else{
      var parts  = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(xforms);
      var firstX = parts[1],
       firstY = parts[2];
   }
   console.log(firstX,firstY)
   let x1 = location.x + location.width /2
   let y1 = location.y + location.height /2
   x1 = x1 - (firstX)
   y1 = y1 - (firstY)

   let x2 = destination.x + destination.width/2
   let y2 = destination.y + destination.height /2

   if(product.tagName.toLowerCase() == 'path'){
      console.log(product)
      x1 = location.x + location.width /2
      y1 = location.y + location.height /2
   
      x2 = destination.x + destination.width/2
      y2 = destination.y+ destination.height/2

      x2 = x2 - ((destination.x + destination.width) - (sbb.width + sbb.x))
      y2 = y2 - ((destination.y + destination.height) - (sbb.height + sbb.y))

   }




   let svgPath = document.createElementNS(ns, "path");
   svgPath.setAttribute(
     "d",
     `M ${x1},${y1} L ${x2},${y2}`
   );
   svgPath.setAttribute("stroke", "black");
   svgPath.setAttribute("stroke-width", "2");
   svgPath.setAttribute("fill", "none");
   svgPath.classList.add('pathtoproduct')
   console.log(svgPath)

   // append to container div
   if(product.tagName.toLowerCase() == 'path'){
   let base = document.querySelector('svg')
   base.append(svgPath)
   }
   else{
      svg.append(svgPath);
   }

   //container.insertBefore(svg, container);

   let svgPath2 = document.createElementNS(ns, "path");
   svgPath2.setAttribute(
     "d",
     `M ${x1},${y1} L ${x2},${y2}`
   );
   svgPath2.setAttribute("stroke", "black");
   svgPath2.setAttribute("stroke-width", "2");
   svgPath2.setAttribute("fill", "none");
   svgPath2.classList.add('dashed')
   console.log(svgPath2)

   // append to container div
   if(product.tagName.toLowerCase() == 'path'){
      let base = document.querySelector('svg')
      base.append(svgPath2)
      }
      else{
         svg.append(svgPath2);
      }
}

function removepathstoproduct(){
   let paths = document.querySelectorAll('.pathtoproduct')
   paths.forEach(e=>{
      e.remove()
   })
   let paths2 = document.querySelectorAll('.dashed')
   paths2.forEach(e=>{
      e.remove()
   })
}



function showsearchproduct(location) {
   removepathstoproduct()
   let allelementsh = document.querySelectorAll('[id*="rect"]:not(.textbacking)')
   allelementsh.forEach((e) => {
      e.classList.add('highlightgroup')
      removename(e.id)
   })
   for (let i = 0; i < allelementsh.length; i++) {
      let title = allelementsh[i].querySelector('title')
      try {
         if (title.innerHTML != location) {
            allelementsh[i].classList.toggle('highlightgroup')
         }
         if (title.innerHTML == location) {
            pan(allelementsh[i])
            showname(allelementsh[i].id)

         }
      }
      catch (e) {
         console.log(e)
      }

   }
}

function clearsubproducts() {
   if (document.querySelectorAll('div[class="productdropdown"] > ul > li') != undefined) {
      document.querySelectorAll('div[class="productdropdown"] > ul > li').forEach(e => e.remove());
   }

}
function showname(id) {
   let element = document.getElementById(id)
   let svg1 = document.querySelector(`#${id}`)
   let svg = svg1.closest('g[id]')
   let rects = Array.from(svg.querySelectorAll(`[id='${id}']`));
   let arr = Array(rects.length).fill(true);
   document.querySelectorAll('text').forEach(e => e.remove());
   rects.forEach((r, i) => {
      let bb = r.getBBox();
      let sbb = svg.getBBox()
      let x = bb.x + bb.width / 2;
      let y = bb.y + bb.height / 2;
      if (r.tagName == 'path') {
         x = x - ((bb.x + bb.width) - (sbb.width + sbb.x))
         y = y - ((bb.y + bb.height) - (sbb.height + sbb.y))
      }
      if (arr[i]) {
         let txt3 = drawSVGelmt({ cx: x * 1.00, cy: y * 1.0, r: '8' }, "circle", svg)
         txt3.classList.add('pulse')
         let txt2 = drawSVGelmt({ cx: x * 1.00, cy: y * 1.0, r: '6' }, "circle", svg)
         txt2.classList.add('pulse2')
         let txt = drawSVGelmt({ cx: x * 1.0, cy: y * 1.0, r: '8' }, "circle", svg)
         txt.classList.add('dot')
         arr[i] = false;
      }
   })
}
function removename(id) {
   let svg1 = document.querySelector(`#${id}`)
   document.querySelectorAll('circle').forEach(e => {
      if (!e.classList.contains('location') && !e.classList.contains('locationP2') && !e.classList.contains('locationP3')) {
         e.remove()
      }
   }
   )
}


// a function to create a new svg element
function drawSVGelmt(o, tag, parent) {
   let elmt = document.createElementNS(SVG_NS, tag);
   elmt.classList.add("nametext")
   for (var name in o) {
      if (o.hasOwnProperty(name)) {
         try {
            elmt.setAttributeNS(null, name, o[name]);
            //code that causes an error
         } catch (e) {
            console.log(e)
         }
      }
   }
   parent.appendChild(elmt);
   return elmt;
}
function myFunction() {
   removewarning()
   clearselected()
   removepathstoproduct()
   var input, filter, ul, li, a, i, txtValue;
   input = document.getElementById('myInput');
   filter = input.value.toUpperCase().trim();
   allg = document.querySelectorAll('[id*="layer"] > [id*="rect"]')
   rect = allg
   allg.forEach(e => {
      removename(e.id)
   })
   allresults = document.querySelectorAll('.searchlist > li')
   allresults.forEach(e => {
      e.remove()
   })
   filter2 = filter.split(' ').reduce((previousValue, currentValue) => previousValue + ` '${currentValue}`, '');

   if(filter2 == " '"){
      results = fuse.search(filter, { limit: 6 })
   }
   else{
      results = fuse.search(filter2, { limit: 6 })
   }
   let searchlist = document.querySelector('.searchlist')
   for (i = 0; i < results.length; i++) {
      let newitem = document.createElement('li')
      newitem.innerHTML = results[i].item.product
      newitem.style.animation = `fade-in-top 0.${i + 3}s,  fade-in 0.8s`
      let test = results[i].item.location
      newitem.addEventListener("click", (e) => {

         showsearchproduct(test) // logs `false`
      });
      searchlist.appendChild(newitem)
   }
   // Loop through all list items, and hide those who don't match the search query
   for (i = 0; i < rect.length; i++) {
      txtValue = rect[i].getAttribute('inkscape:label') || "";
      if ((txtValue.toUpperCase().indexOf(filter) > -1 && filter != '')) {

         rect[i].classList.add('highlightgroup');
         if (i == rect.length - 1){
            pan(rect[rect.length - 1])
         }

      }
      else {
         rect[i].classList.remove('highlightgroup');
      }
   }
}
