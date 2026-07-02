let currentEyeColor = "brown";
let currentHairColor = "black";
let currentBrowColor = "black";
let currentLipColor = "brown";
let currentBlushColor = "dark";
let currentHairId = "basehair";
let currentBrowId = "browshape2";
let currentNoseId = "noseshape3";
let currentLipId = "lipshape1";
let currentEyeId = "shape-doe";
let currentBlushId = "blush1";
let currentTopId = "tubetop";
let currentTopColor = "white";
let currentLipHue = 0;
let currentTopHue = 0;
let currentHairHue = 0;
let currentBrowHue = 0;
let currentSectionIndex = 0;
let slideIndex = 1;
let activeColorCategory = null;
let activeSkinDetails = new Set();
let skinDetailOpacity = {};

const undoStack = [];
const darkSkinIndices = [1, 2, 3];
const eyeColorMap = {purple: 0, blue: 1, green: 2, brown: 3};
const hairColorMap = { black: 0, brown: 1, blonde: 2, orange: 3 };
const browColorMap = { black: 0, brown: 1, blonde: 2, orange: 3 };
const lipColorMap = { brown: 0, plum: 1, pink: 2, coral: 3 };
const blushColorMap = { dark: 0, medium: 1, light: 2 };
const topColorMap = { pink: 0, red: 1, yellow: 2, green: 3, blue: 4, purple: 5, magenta: 6, brown: 7, white: 8, black: 9 };
const sections = ["skin", "eyes", "brows", "nose", "lips", "hairs", "makeup", "tops", "jewelry", "bg"];



// ─── INFO BOX ───────────────────────────────────────────────

function openInfo() {
  document.getElementById('infooverlay').style.display = 'block';
}

function closeInfo() {
  document.getElementById('infooverlay').style.display = 'none';
}




// ─── SAVE / UNDO ───────────────────────────────────────────────

function saveState() {
  undoStack.push({
    slideIndex: slideIndex,
    currentEyeId: currentEyeId,
    currentEyeColor: currentEyeColor,
    currentHairId: currentHairId,
    currentHairColor: currentHairColor,
    currentBrowId: currentBrowId,
    currentBrowColor: currentBrowColor,
    currentLipId: currentLipId,
    currentLipColor: currentLipColor,
    currentBlushId: currentBlushId,
    currentBlushColor: currentBlushColor,
    currentNoseId: currentNoseId,
    currentTopId: currentTopId,
    currentTopColor: currentTopColor,
    bgImage: document.getElementById("beautyparlour").style.backgroundImage,
    bgColor: document.getElementById("beautyparlour").style.backgroundColor,
    blushVisible: document.getElementById(currentBlushId).style.display === "block",
  });
}

function undo() {
  if (undoStack.length === 0) return;
  const prev = undoStack.pop();

  skinSlides(prev.slideIndex);

  document.querySelectorAll(".eyeshape").forEach(s => s.style.display = "none");
  currentEyeId = prev.currentEyeId;
  document.getElementById(currentEyeId).style.display = "block";
  currentEyeColor = prev.currentEyeColor;
  updateEyesForSkin(prev.slideIndex);

  document.querySelectorAll(".hairshape").forEach(s => s.style.display = "none");
  currentHairId = prev.currentHairId;
  currentHairColor = prev.currentHairColor;
  document.getElementById(currentHairId).style.display = "block";
  document.getElementById(currentHairId).querySelectorAll("img").forEach(img => {
    img.style.display = img.src.includes(currentHairColor) ? "block" : "none";
  });

  document.querySelectorAll(".browshape").forEach(s => s.style.display = "none");
  currentBrowId = prev.currentBrowId;
  document.getElementById(currentBrowId).style.display = "block";
  updateBrowColor(prev.currentBrowColor);

  document.querySelectorAll(".lipshape").forEach(s => s.style.display = "none");
  currentLipId = prev.currentLipId;
  document.getElementById(currentLipId).style.display = "block";
  updateLipColor(prev.currentLipColor);

  document.querySelectorAll(".blushshape").forEach(s => s.style.display = "none");
  currentBlushId = prev.currentBlushId;
  document.getElementById(currentBlushId).style.display = prev.blushVisible ? "block" : "none";
  if (prev.blushVisible) updateBlushColor(prev.currentBlushColor);

  document.querySelectorAll(".noseshape").forEach(s => s.style.display = "none");
  currentNoseId = prev.currentNoseId;
  document.getElementById(currentNoseId).style.display = "block";
  updateNosesForSkin(prev.slideIndex);

  document.querySelectorAll(".topstyle").forEach(s => s.style.display = "none");
  currentTopId = prev.currentTopId;
  currentTopColor = prev.currentTopColor;
  document.getElementById(currentTopId).style.display = "block";
  updateTopColor(prev.currentTopColor);

  document.getElementById("beautyparlour").style.backgroundImage = prev.bgImage;
  document.getElementById("beautyparlour").style.backgroundColor = prev.bgColor;

  goToSection(currentSectionIndex);
}

// ─── SKIN ──────────────────────────────────────────────────────

function changeSkin(n) {

  saveState();
  skinSlides(n);
  showColorOptions("skin");
  setOutline("skin", n - 1);

activeSkinDetails.forEach(detailId => {
    const target = document.querySelector(`.skindetails img[src*="${detailId}"]`);
    if (target) {
        target.style.display = 'block';
        target.style.opacity = skinDetailOpacity[detailId] ?? 1;
    }
});
}

function skinSlides(n) {
  let skin = document.getElementsByClassName("skins");
  let dots = document.getElementsByClassName("beautyoptionsskin");
  let skincolorsDisplay = document.getElementsByClassName("skincolorsdisplay");

  if (n > skin.length) { slideIndex = 1; }
  else if (n < 1) { slideIndex = skin.length; }
  else { slideIndex = n; }

  for (let i = 0; i < skin.length; i++) skin[i].style.display = "none";
  for (let i = 0; i < skincolorsDisplay.length; i++) skincolorsDisplay[i].style.display = "none";
  for (let i = 0; i < dots.length; i++) dots[i].classList.remove("active");

  skin[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].classList.add("active");
  skincolorsDisplay[slideIndex - 1].style.display = "block";

  updateEyesForSkin(slideIndex);
  updateNosesForSkin(slideIndex);
}

// ─── EYES ──────────────────────────────────────────────────────

function updateEyesForSkin(slideIndex) {
  const isDark = darkSkinIndices.includes(slideIndex);
  const activeShape = document.querySelector(".eyeshape[style*='display:block'], .eyeshape[style*='display: block']")
                   || document.getElementById("shape-doe");
  if (!activeShape) return;

  activeShape.querySelectorAll(".darkeyes").forEach(img => img.style.display = "none");
  activeShape.querySelectorAll(".lighteyes").forEach(img => img.style.display = "none");

  if (isDark) {
    activeShape.querySelectorAll(".darkeyes").forEach(img => {
      if (img.src.includes(currentEyeColor)) img.style.display = "block";
    });
  } else {
    activeShape.querySelectorAll(".lighteyes").forEach(img => {
      if (img.src.includes(currentEyeColor)) img.style.display = "block";
    });
  }
}

function changeEyeShape(shapeId, el) {

  saveState();
  currentEyeId = shapeId;
  document.querySelectorAll(".eyeshape").forEach(s => s.style.display = "none");
  document.getElementById(shapeId).style.display = "block";
  updateEyesForSkin(slideIndex);
  showColorOptions("eyes");
  showEyeColorDisplay(currentEyeColor);
  setOutline("eyes", eyeColorMap[currentEyeColor] ?? 2);
  document.querySelectorAll(".beautyoptionseyes").forEach(dot => dot.classList.remove("active"));
  el.classList.add("active");
}

function changeEyeColor(color, el) {

  saveState();
  currentEyeColor = color;
  showEyeColorDisplay(color);
  document.querySelectorAll('.coloroption[data-category="eyes"]').forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  const activeShape = document.querySelector(".eyeshape[style*='display:block'], .eyeshape[style*='display: block']")
                   || document.getElementById("shape-doe");
  if (!activeShape) return;
  const isDark = darkSkinIndices.includes(slideIndex);
  activeShape.querySelectorAll(".darkeyes, .lighteyes").forEach(img => {
    const rightColor = img.src.includes(color);
    const rightShade = isDark ? img.classList.contains("darkeyes") : img.classList.contains("lighteyes");
    img.style.display = (rightColor && rightShade) ? "block" : "none";
  });
}

function showEyeColorDisplay(color) {
  const displays = document.getElementsByClassName("eyecolorsdisplay");
  for (let i = 0; i < displays.length; i++) displays[i].style.display = "none";
  const index = eyeColorMap[color];
  if (index !== undefined) displays[index].style.display = "block";
}

// ─── BROWS ─────────────────────────────────────────────────────

function changeBrowShape(shapeId, el) {

  saveState();
  document.querySelectorAll(".browshape").forEach(s => s.style.display = "none");
  currentBrowId = shapeId;
  document.getElementById(shapeId).style.display = "block";
  updateBrowColor(currentBrowColor);
  showColorOptions("brows");
  showBrowColorDisplay(currentBrowColor);
  setOutline("brows", browColorMap[currentBrowColor] ?? 0);
  document.querySelectorAll(".beautyoptionsbrows").forEach(dot => dot.classList.remove("active"));
  el.classList.add("active");
}

function changeBrowColor(color, el) {

  saveState();
  currentBrowColor = color;
  showBrowColorDisplay(color);
  document.querySelectorAll('.coloroption[data-category="brows"]').forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  // clear any color filter
  const activeBrow = document.getElementById(currentBrowId);
  activeBrow?.querySelectorAll("img").forEach(img => img.style.filter = "");
  updateBrowColor(color);
}

function updateBrowColor(color) {
  currentBrowColor = color;
  const activeBrow = document.getElementById(currentBrowId);
  if (!activeBrow) return;
  activeBrow.querySelectorAll(".eyebrows").forEach(img => {
    img.style.display = img.src.includes(color + ".") ? "block" : "none";
  });
}

function showBrowColorDisplay(color) {
  const displays = document.getElementsByClassName("browcolorsdisplay");
  for (let i = 0; i < displays.length; i++) displays[i].style.display = "none";
  const index = browColorMap[color];
  if (index !== undefined) displays[index].style.display = "block";
}

// ─── NOSE ──────────────────────────────────────────────────────

function changeNoseShape(shapeId, el) {

  saveState();
  document.querySelectorAll(".noseshape").forEach(s => s.style.display = "none");
  currentNoseId = shapeId;
  document.getElementById(shapeId).style.display = "block";
  updateNosesForSkin(slideIndex);
  document.querySelectorAll(".beautyoptionsnose").forEach(dot => dot.classList.remove("active"));
  el.classList.add("active");
}

function updateNosesForSkin(slideIndex) {
  const isDark = darkSkinIndices.includes(slideIndex);
  const activeNose = document.getElementById(currentNoseId);
  if (!activeNose) return;
  activeNose.querySelectorAll(".nosedark").forEach(img => img.style.display = isDark ? "block" : "none");
  activeNose.querySelectorAll(".noselight").forEach(img => img.style.display = isDark ? "none" : "block");
}

// ─── LIPS ──────────────────────────────────────────────────────

function changeLipShape(shapeId, el) {

  saveState();
  document.querySelectorAll(".lipshape").forEach(s => s.style.display = "none");
  currentLipId = shapeId;
  document.getElementById(shapeId).style.display = "block";
  updateLipColor(currentLipColor);
  showColorOptions("lips");
  showLipColorDisplay(currentLipColor);
  setOutline("lips", lipColorMap[currentLipColor] ?? 0);
  document.querySelectorAll(".beautyoptionslips").forEach(dot => dot.classList.remove("active"));
  el.classList.add("active");
}

function changeLipColor(color, el) {

  saveState();
  currentLipColor = color;
  showLipColorDisplay(color);
  document.querySelectorAll('.coloroption[data-category="lips"]').forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  const activeLip = document.getElementById(currentLipId);
  activeLip?.querySelectorAll("img").forEach(img => img.style.filter = "");
  activeLip?.querySelectorAll("img").forEach(img => img.style.brightness = 1);
  updateLipColor(color);
  currentLipHue = 0;
}

function updateLipColor(color) {
  currentLipColor = color;
  const activeLip = document.getElementById(currentLipId);
  if (!activeLip) return;
  activeLip.querySelectorAll(".lips").forEach(img => {
    img.style.display = img.src.includes(color + ".") ? "block" : "none";
  });
}

function showLipColorDisplay(color) {
  const displays = document.getElementsByClassName("lipcolorsdisplay");
  for (let i = 0; i < displays.length; i++) displays[i].style.display = "none";
  const index = lipColorMap[color];
  if (index !== undefined) displays[index].style.display = "block";
}

// ─── HAIR ──────────────────────────────────────────────────────

function changeHairShape(shapeId, el) {

  saveState();
  document.querySelectorAll(".hairshape").forEach(s => s.style.display = "none");
  currentHairId = shapeId;
  document.getElementById(shapeId).style.display = "block";
  document.getElementById(shapeId).querySelectorAll("img").forEach(img => {
    img.style.display = img.src.includes(currentHairColor + ".") ? "block" : "none";
  });
  showColorOptions("hairs");
  showHairColorDisplay(currentHairColor);
  setOutline("hairs", hairColorMap[currentHairColor] ?? 0);
  document.querySelectorAll(".beautyoptionshair").forEach(dot => dot.classList.remove("active"));
  el.classList.add("active");
}

function changeHairColor(color, el) {

  saveState();
  currentHairColor = color;
  showHairColorDisplay(color);
  document.querySelectorAll('.coloroption[data-category="hairs"]').forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  // clear any color filter
  const activeShape = document.getElementById(currentHairId);
  activeShape?.querySelectorAll("img").forEach(img => img.style.filter = "");
  if (!activeShape) return;
  activeShape.querySelectorAll("img").forEach(img => {
    img.style.display = img.src.includes(color + ".") ? "block" : "none";
  });
}

function showHairColorDisplay(color) {
  const displays = document.getElementsByClassName("haircolorsdisplay");
  for (let i = 0; i < displays.length; i++) displays[i].style.display = "none";
  const index = hairColorMap[color];
  if (index !== undefined) displays[index].style.display = "block";
}

// ─── BLUSH ─────────────────────────────────────────────────────

function changeBlushShape(shapeId, el) {

  saveState();
  const shape = document.getElementById(shapeId);
  const isVisible = shape.style.display === "block";

  if (isVisible) {
    shape.querySelectorAll(".blushes").forEach(img => img.style.display = "none");
    shape.style.display = "none";
    el.classList.remove("active");
  } else {
    shape.style.display = "block";
    currentBlushId = shapeId;
    updateBlushColor(currentBlushColor);
    showColorOptions("blush");
    showBlushColorDisplay(currentBlushColor);
    setOutline("blush", blushColorMap[currentBlushColor] ?? 0);
    el.classList.add("active");
  }
}

function changeBlushColor(color, el) {

  saveState();
  currentBlushColor = color;
  showBlushColorDisplay(color);
  document.querySelectorAll('.coloroption[data-category="blush"]').forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  // clear any color filter
  const activeBlush = document.getElementById(currentBlushId);
  activeBlush?.querySelectorAll("img").forEach(img => img.style.filter = "");
  document.getElementById("opacitypicker").value = 1;
  activeBlush?.querySelectorAll("img").forEach(img => img.style.opacity = 1);
  updateBlushColor(color);
}

function updateBlushColor(color) {
  currentBlushColor = color;
  const activeBlush = document.getElementById(currentBlushId);
  if (!activeBlush) return;
  activeBlush.querySelectorAll(".blushes").forEach(img => {
    img.style.display = img.src.includes(color + ".") ? "block" : "none";
  });
}

function showBlushColorDisplay(color) {
  const displays = document.getElementsByClassName("blushcolorsdisplay");
  for (let i = 0; i < displays.length; i++) displays[i].style.display = "none";
  const index = blushColorMap[color];
  if (index !== undefined) displays[index].style.display = "block";
}

// ─── SKIN DETAILS ─────────────────────────────────────────────────────


function changeSkinDetail(detailId, el) {

  saveState();
    const target = document.querySelector(`.skindetails img[src*="${detailId}"]`);
    if (!target) return;

    if (activeSkinDetails.has(detailId)) {
        target.style.display = 'none';
        activeSkinDetails.delete(detailId);
        if (el) el.classList.remove('active');
    } else {
        target.style.display = 'block';
        target.style.opacity = skinDetailOpacity[detailId] ?? 1;
        activeSkinDetails.add(detailId);
        if (el) el.classList.add('active');
        document.getElementById("opacitypicker").value = skinDetailOpacity[detailId] ?? 1;
    }
}


// ─── TOPS ──────────────────────────────────────────────────────

function changeTopShape(shapeId, el) {

  saveState();
  const shape = document.getElementById(shapeId);
  const isVisible = shape.style.display === "block";
  if (isVisible) {
    shape.style.display = "none";
    el.classList.remove("active");

    if (currentTopId === shapeId) {
      currentTopId = null;
      currentTopColor = "white";
    }
  } else {
    shape.style.display = "block";
    currentTopId = shapeId;
    updateTopColor(currentTopColor);
    el.classList.add("active");
    showColorOptions("tops");
    showTopsColorDisplay(currentTopColor);
    setOutline("tops", topColorMap[currentTopColor] ?? 8);
  }
}

function changeTopColor(color, el) {

  saveState();
  const activeTop = document.getElementById(currentTopId);
  activeTop?.querySelectorAll("img").forEach(img => img.style.filter = "");
  document.querySelectorAll('.coloroption[data-category="tops"]').forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  updateTopColor(color);
  currentTopHue = 0;
}

function updateTopColor(color) {
  const activeTop = document.getElementById(currentTopId);
  if (!activeTop) return;

  const imgs = activeTop.querySelectorAll("img");
  let matched = false;
  imgs.forEach(img => {
    const fits = img.src.includes(color + ".") || img.src.includes(color + "cardigan") || img.src.includes(color + "buttonup");
    img.style.display = fits ? "block" : "none";
    if (fits) matched = true;
  });

  if (!matched) {
    const fallback = activeTop.querySelector("img[src*='white']")
                  || activeTop.querySelector("img");
    if (fallback) {
      fallback.style.display = "block";
      currentTopColor = fallback.src.includes("white") ? "white" : "black";
    }
  } else {
    currentTopColor = color;
  }
  showTopsColorDisplay(currentTopColor);
}

function showTopsColorDisplay(color) {
  const displays = document.getElementsByClassName("topscolorsdisplay");
  for (let i = 0; i < displays.length; i++) displays[i].style.display = "none";
  const index = topColorMap[color];
  if (index !== undefined) displays[index].style.display = "block";
}

// ─── BACKGROUND ────────────────────────────────────────────────

function changeBackground(imageUrl, el) {
  saveState();
  document.getElementById("beautyparlour").style.backgroundImage = `url(${imageUrl})`;
  document.getElementById("beautyparlour").style.backgroundColor = "";
  document.querySelectorAll(".beautyoptionsbg").forEach(dot => dot.classList.remove("active"));
  document.querySelectorAll(".coloroption[data-category='bg']").forEach(dot => dot.classList.remove("outline"));
  document.querySelectorAll(".bgcolorsdisplay").forEach(el => el.style.display = "none");
  el.classList.add("active");
}

function changeBackgroundColor(color, el) {

  saveState();
  document.getElementById("beautyparlour").style.backgroundImage = "none";
  document.getElementById("beautyparlour").style.backgroundColor = color;
  document.querySelectorAll(".beautyoptionsbg").forEach(dot => dot.classList.remove("active"));
  document.querySelectorAll(".coloroption[data-category='bg']").forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  const bgDots = document.querySelectorAll(".coloroption[data-category='bg']");
  const bgDisplays = document.getElementsByClassName("bgcolorsdisplay");
  for (let i = 0; i < bgDisplays.length; i++) bgDisplays[i].style.display = "none";
  bgDots.forEach((dot, i) => {
    if (dot === el && bgDisplays[i]) bgDisplays[i].style.display = "block";
  });
}

// ─── COLOR PANEL ───────────────────────────────────────────────

function setOutline(category, index) {
  const dots = document.querySelectorAll(`.coloroption[data-category="${category}"]`);
  dots.forEach(dot => dot.classList.remove("outline"));
  if (dots[index]) dots[index].classList.add("outline");
}

function showColorOptions(category) {
  document.getElementById("huelabel").style.display = 
  (category === "hairs" || category === "brows" || category === "tops" || category === "lips") ? "block" : "none";
  document.getElementById("opacitylabel").style.display = 
  (category === "blush" || category === "skin") ? "block" : "none";
  
  const anySliderVisible = 
  (category === "hairs" || category === "brows" || category === "lips" || category === "tops" || category === "blush" || category === "skin")
  document.querySelector(".inputcontainer").style.display = anySliderVisible ? "flex" : "none";

  document.getElementById("colorpicker").value = 0; 
  document.getElementById("colorpicker").style.display = 
  (category === "hairs" || category === "brows" || category === "tops" || category === "lips") ? "block" : "none";  
  document.getElementById("opacitypicker").value = 1;
  document.getElementById("opacitypicker").style.display = 
  (category === "blush" || category === "skin") ? "block" : "none";
  document.querySelectorAll(".coloroption").forEach(el => el.style.display = "none");
  document.querySelectorAll(`.coloroption[data-category="${category}"]`).forEach(el => el.style.display = "block");
  document.querySelectorAll(".skincolorsdisplay").forEach(el => el.style.display = "none");
  document.querySelectorAll(".eyecolorsdisplay").forEach(el => el.style.display = "none");
  document.querySelectorAll(".haircolorsdisplay").forEach(el => el.style.display = "none");
  document.querySelectorAll(".browcolorsdisplay").forEach(el => el.style.display = "none");
  document.querySelectorAll(".lipcolorsdisplay").forEach(el => el.style.display = "none");
  document.querySelectorAll(".blushcolorsdisplay").forEach(el => el.style.display = "none");
  document.querySelectorAll(".bgcolorsdisplay").forEach(el => el.style.display = "none");
  document.querySelectorAll(".topscolorsdisplay").forEach(el => el.style.display = "none");

  if (category === "skin") {
    const skinDisplays = document.getElementsByClassName("skincolorsdisplay");
    if (skinDisplays[slideIndex - 1]) skinDisplays[slideIndex - 1].style.display = "block";
  }
  if (category === "eyes")  showEyeColorDisplay(currentEyeColor);
  if (category === "blush") showBlushColorDisplay(currentBlushColor);
  if (category === "hairs") document.getElementById("colorpicker").value = currentHairHue;
  if (category === "brows") document.getElementById("colorpicker").value = currentBrowHue;
  if (category === "lips")  document.getElementById("colorpicker").value = currentLipHue;
  if (category === "tops")  document.getElementById("colorpicker").value = currentTopHue;

  activeColorCategory = category;
}

// ─── NAVIGATION ────────────────────────────────────────────────

function goToSection(index) {

  currentSectionIndex = index;
  const category = sections[index];

  const containers = document.querySelectorAll(".itemcontainer");
  containers.forEach((c, i) => {
    c.style.display = i === index ? "block" : "none";
  });

  document.querySelectorAll(".navbutton").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
    if (i === index) {
      btn.src = btn.dataset.active;
    } else {
      btn.src = btn.dataset.inactive;
    }
  });

  showColorOptions(category);

  if (category === "skin") {
    setOutline("skin", slideIndex - 1);
    document.querySelectorAll(".beautyoptionsskin").forEach((el, i) => {
      el.classList.toggle("active", i === slideIndex - 1);
    });
  }
  if (category === "eyes") {
    setOutline("eyes", eyeColorMap[currentEyeColor] ?? 2);
    document.querySelectorAll(".beautyoptionseyes").forEach(el => {
      el.classList.toggle("active", el.getAttribute("onclick")?.includes(currentEyeId));
    });
  }
  if (category === "hairs") {
    setOutline("hairs", hairColorMap[currentHairColor] ?? 0);
    document.querySelectorAll(".beautyoptionshair").forEach(el => {
      el.classList.toggle("active", el.getAttribute("onclick")?.includes(currentHairId));
    });
  }
  if (category === "brows") {
    setOutline("brows", browColorMap[currentBrowColor] ?? 0);
    document.querySelectorAll(".beautyoptionsbrows").forEach(el => {
      el.classList.toggle("active", el.getAttribute("onclick")?.includes(currentBrowId));
    });
  }
  if (category === "lips") {
    setOutline("lips", lipColorMap[currentLipColor] ?? 0);
    document.querySelectorAll(".beautyoptionslips").forEach(el => {
      el.classList.toggle("active", el.getAttribute("onclick")?.includes(currentLipId));
    });
  }
  if (category === "nose") {
    document.querySelectorAll(".beautyoptionsnose").forEach(el => {
      el.classList.toggle("active", el.getAttribute("onclick")?.includes(currentNoseId));
    });
  }
  if (category === "makeup") {
    setOutline("blush", blushColorMap[currentBlushColor] ?? 0);
    document.querySelectorAll(".beautyoptionsmakeup").forEach(el => {
      const shapeId = el.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
      if (shapeId) {
        const shape = document.getElementById(shapeId);
        el.classList.toggle("active", shape?.style.display === "block");
      }
    });
  }
  if (category === "tops") {
    setOutline("tops", topColorMap[currentTopColor] ?? 8);
    document.querySelectorAll(".beautyoptionstops").forEach(el => {
      const shapeId = el.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
      if (shapeId) {
        const shape = document.getElementById(shapeId);
        el.classList.toggle("active", shape?.style.display === "block");
      }
    });
  }
}

// ─── SAVE IMAGE ────────────────────────────────────────────────

function saveImage() {
  window.print();
}

// ─── ON LOAD ───────────────────────────────────────────────────

window.onload = function () {


  ["eyecolorsdisplay", "haircolorsdisplay", "browcolorsdisplay",
   "lipcolorsdisplay", "blushcolorsdisplay", "topscolorsdisplay", "bgcolorsdisplay"].forEach(cls => {
    Array.from(document.getElementsByClassName(cls)).forEach(el => el.style.display = "none");
  });
  document.querySelectorAll(".itemcontainer").forEach((c, i) => {
    c.style.display = i === 0 ? "block" : "none";
  });

  document.querySelectorAll(".hairshape").forEach(s => s.style.display = "none");
  document.getElementById(currentHairId).style.display = "block";

  document.querySelectorAll(".browshape").forEach(s => s.style.display = "none");
  document.getElementById(currentBrowId).style.display = "block";

  document.querySelectorAll(".lipshape").forEach(s => s.style.display = "none");
  document.getElementById(currentLipId).style.display = "block";

  document.querySelectorAll(".blushshape").forEach(s => s.style.display = "none");
  document.getElementById(currentBlushId).style.display = "none";
  document.getElementById(currentBlushId).querySelectorAll(".blushes").forEach(img => img.style.display = "none");

  document.querySelectorAll(".topstyle").forEach(s => s.style.display = "none");
  document.getElementById(currentTopId).style.display = "block";

  const hairEl = document.getElementById(currentHairId);
  hairEl.querySelectorAll("img").forEach(img => {
    img.style.display = img.src.includes(currentHairColor + ".") ? "block" : "none";
    img.style.filter = "";
  });

  updateBrowColor(currentBrowColor);
  updateLipColor(currentLipColor);
  updateTopColor(currentTopColor);
  updateEyesForSkin(slideIndex);
  updateNosesForSkin(slideIndex);

  document.querySelectorAll(".beautyoptionsskin").forEach((el, i) => {
    el.classList.toggle("active", i === slideIndex - 1);
  });
  document.querySelectorAll(".beautyoptionsbg")[0]?.classList.add("active");
  document.querySelectorAll(".navbutton")[0].classList.add("active");

  showColorOptions("skin");
  setOutline("skin", 0);

  const overlay = document.getElementById('loadingoverlay');
  overlay.style.transition = 'opacity 0.5s ease';
setTimeout(function() {
  overlay.style.opacity = '0';
  setTimeout(function() {
    overlay.style.display = 'none';
  }, 400);
}, 2500); 

updateDollDropdown();
}; 

/*function playClick() {
    const click = document.getElementById("clicksound");
    click.currentTime = 0;
    click.play();
} */

    

// ─── SAVED DOLLS ───────────────────────────────────────────────

function saveCurrentDoll() {
    const saved = JSON.parse(localStorage.getItem('savedDolls') || '[]');
    if (saved.length >= 5) {
        alert('You can only save up to 5 Dolls. Please delete one first.');
        return;
    }

    const name = prompt('Name your Doll:');
    if (!name) return;

    const state = {
        name: name,
        id: Date.now(),
        slideIndex: slideIndex,
        currentEyeId: currentEyeId,
        currentEyeColor: currentEyeColor,
        currentHairId: currentHairId,
        currentHairColor: currentHairColor,
        currentHairHue: currentHairHue,
        currentBrowId: currentBrowId,
        currentBrowColor: currentBrowColor,
        currentBrowHue: currentBrowHue,
        currentLipId: currentLipId,
        currentLipColor: currentLipColor,
        currentLipHue: currentLipHue,
        currentNoseId: currentNoseId,
        currentBlushId: currentBlushId,
        currentBlushColor: currentBlushColor,
        blushVisible: document.getElementById(currentBlushId)?.style.display === "block",
        currentTopId: currentTopId,
        currentTopColor: currentTopColor,
        currentTopHue: currentTopHue,
        topVisible: currentTopId ? document.getElementById(currentTopId)?.style.display === "block" : false,
        bgImage: document.getElementById("beautyparlour").style.backgroundImage,
        bgColor: document.getElementById("beautyparlour").style.backgroundColor,
        activeSkinDetails: [...activeSkinDetails],
        skinDetailOpacity: { ...skinDetailOpacity }
    };

    saved.push(state);
    localStorage.setItem('savedDolls', JSON.stringify(saved));
    updateDollDropdown();
    alert(`"${name}" saved!`);
}

function loadDoll(id) {
    const saved = JSON.parse(localStorage.getItem('savedDolls') || '[]');
    const state = saved.find(d => d.id === parseInt(id));
    if (!state) return;

    // restore everything the same way undo() does
    skinSlides(state.slideIndex);

    document.querySelectorAll(".eyeshape").forEach(s => s.style.display = "none");
    currentEyeId = state.currentEyeId;
    document.getElementById(currentEyeId).style.display = "block";
    currentEyeColor = state.currentEyeColor;
    updateEyesForSkin(state.slideIndex);

    document.querySelectorAll(".hairshape").forEach(s => s.style.display = "none");
    currentHairId = state.currentHairId;
    currentHairColor = state.currentHairColor;
    currentHairHue = state.currentHairHue;
    document.getElementById(currentHairId).style.display = "block";
    document.getElementById(currentHairId).querySelectorAll("img").forEach(img => {
        img.style.display = img.src.includes(currentHairColor) ? "block" : "none";
    });

    document.querySelectorAll(".browshape").forEach(s => s.style.display = "none");
    currentBrowId = state.currentBrowId;
    document.getElementById(currentBrowId).style.display = "block";
    updateBrowColor(state.currentBrowColor);

    document.querySelectorAll(".lipshape").forEach(s => s.style.display = "none");
    currentLipId = state.currentLipId;
    document.getElementById(currentLipId).style.display = "block";
    updateLipColor(state.currentLipColor);
    currentLipHue = state.currentLipHue;

    document.querySelectorAll(".noseshape").forEach(s => s.style.display = "none");
    currentNoseId = state.currentNoseId;
    document.getElementById(currentNoseId).style.display = "block";
    updateNosesForSkin(state.slideIndex);

    document.querySelectorAll(".blushshape").forEach(s => s.style.display = "none");
    currentBlushId = state.currentBlushId;
    document.getElementById(currentBlushId).style.display = state.blushVisible ? "block" : "none";
    if (state.blushVisible) updateBlushColor(state.currentBlushColor);

    document.querySelectorAll(".topstyle").forEach(s => s.style.display = "none");
    if (state.currentTopId && state.topVisible) {
        currentTopId = state.currentTopId;
        currentTopColor = state.currentTopColor;
        document.getElementById(currentTopId).style.display = "block";
        updateTopColor(state.currentTopColor);
    }

    // restore skin details
    activeSkinDetails = new Set(state.activeSkinDetails || []);
    skinDetailOpacity = state.skinDetailOpacity || {};
    document.querySelectorAll('.skindetails img').forEach(img => img.style.display = 'none');
    activeSkinDetails.forEach(detailId => {
        const target = document.querySelector(`.skindetails img[src*="${detailId}"]`);
        if (target) {
            target.style.display = 'block';
            target.style.opacity = skinDetailOpacity[detailId] ?? 1;
        }
    });

    document.getElementById("beautyparlour").style.backgroundImage = state.bgImage;
    document.getElementById("beautyparlour").style.backgroundColor = state.bgColor;

    goToSection(currentSectionIndex);
}

function deleteDoll(id) {
    if (!confirm('Delete this Doll?')) return;
    let saved = JSON.parse(localStorage.getItem('savedDolls') || '[]');
    saved = saved.filter(d => d.id !== parseInt(id));
    localStorage.setItem('savedDolls', JSON.stringify(saved));
    updateDollDropdown();
}

function updateDollDropdown() {
    const saved = JSON.parse(localStorage.getItem('savedDolls') || '[]');
    const overlay = document.getElementById('dollsoverlay');
    overlay.innerHTML = '';
    if (saved.length === 0) {
        overlay.innerHTML = '<div class="menusongs" style="color:#888;font-style:italic;">No saved Dolls</div>';
        return;
    }
    saved.forEach(doll => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        const nameBtn = document.createElement('div');
        nameBtn.className = 'menusongs';
        nameBtn.textContent = doll.name;
        nameBtn.style.flex = '1';
        nameBtn.onclick = () => loadDoll(doll.id);
        const delBtn = document.createElement('div');
        delBtn.className = 'menusongs';
        delBtn.textContent = '✕';
        delBtn.style.padding = '0 8px';
        delBtn.onclick = (e) => { e.stopPropagation(); deleteDoll(doll.id); };
        row.appendChild(nameBtn);
        row.appendChild(delBtn);
        overlay.appendChild(row);
    });
}

function saveAsImage() {
    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = 370 * scale;
    canvas.height = 455 * scale;
    const ctx = canvas.getContext('2d');

    // draw background
    const parlour = document.getElementById('beautyparlour');
    const bgColor = parlour.style.backgroundColor;
    const bgImage = parlour.style.backgroundImage;

    if (bgColor && bgColor !== 'initial' && bgColor !== '') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (bgImage && bgImage !== 'none' && bgImage !== '') {
        const bgUrl = bgImage.replace(/url\(["']?/, '').replace(/["']?\)/, '');
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        bgImg.onload = () => drawLayers(ctx, canvas, bgImg, scale);
        bgImg.src = bgUrl;
    } else {
        drawLayers(ctx, canvas, null, scale);
    }
}

function drawLayers(ctx, canvas, bgImg, scale) {
    if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    }

    // collect all visible game images in DOM order
    const selectors = [
        '.skins', '.blushes', '.nosedark', '.noselight',
        '.darkeyes', '.lighteyes', '.eyebrows', '.lips',
        '.hairstyles', '.tops'
    ];

    const visibleImgs = [];
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(img => {
            if (img.style.display === 'block') visibleImgs.push(img);
        });
    });

    // also grab visible skin details
    document.querySelectorAll('.skindetails img').forEach(img => {
        if (img.style.display === 'block') visibleImgs.push(img);
    });

    let loaded = 0;
    if (visibleImgs.length === 0) exportCanvas(canvas);

    visibleImgs.forEach(img => {
        const newImg = new Image();
        newImg.crossOrigin = 'anonymous';
        newImg.onload = () => {
            // your images are 1000x410 centered on a 370x455 canvas
            const drawW = 1000 * scale;
            const drawH = 410 * scale;
            const drawX = (canvas.width - drawW) / 2;
            const drawY = (canvas.height * 0.55) - (drawH / 2);

            ctx.save();
            ctx.globalAlpha = parseFloat(img.style.opacity || 1);
            if (img.style.filter && img.style.filter.includes('hue-rotate')) {
                // apply filter via canvas filter if supported
                ctx.filter = img.style.filter;
            }
            ctx.drawImage(newImg, drawX, drawY, drawW, drawH);
            ctx.restore();
            ctx.filter = 'none';

            loaded++;
            if (loaded === visibleImgs.length) exportCanvas(canvas);
        };
        newImg.src = img.src;
    });
}

function exportCanvas(canvas) {
    const link = document.createElement('a');
    link.download = 'my-dolli.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}