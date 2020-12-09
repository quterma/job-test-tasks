// DOM elements
const startButton = document.querySelector("#startButton");
const selectionSection = document.querySelector("#selectionSection");
const optionsContainer = document.querySelector(".options__container");
const finalSection = document.querySelector("#finalSection");
const questionObject = document.querySelector(".question__object");
const choosen = document.querySelector(".choosen");

function hide(element) {
	element.classList.remove("show");
	element.classList.add("hide");
}

function show(element) {
	element.classList.remove("hide");
	element.classList.add("show");
}

// getting options from JSON
async function getOptions() {
	const result = await fetch("./options.json");
	const data = await result.json();
	return data.options;
}

// creating option element
function createFigure(option) {
	const newElement = document.createElement("figure");
	newElement.innerHTML = `
    <img class="option__image" src="https://picsum.photos/200/300?random=${option.title}" alt="option" />
    <figcaption class="option__caption">${option.title}</figcaption>
  `;
	newElement.addEventListener("click", optionClick);
	newElement.id = option.title;
	return newElement;
}

function defineContainer(parent) {
	if (parent) {
		return function append(element) {
			if (element) {
				parent.append(element);
			}
		};
	}
}

function selectRoot(root) {
	return function selectOption(option) {
		return option.root === root;
	};
}

function mapOptions(arr, root) {
	let filtered = arr.filter(option => {
		const rooted = selectRoot(root);
		return rooted(option);
	});
	const mapped = filtered.map(el => createFigure(el));
	return mapped;
}

function chooseQuestion(root) {
	switch (root) {
		case null:
			return "тип отдыха";
		case "Море и солнце":
			return "на какое море едем";
		case "Снег и горы":
			return "страну, где покататься на лыжах";
		case "История и культура":
			return "культурно-историческое направление";
		case "Средиземное море":
			return "страну для путешествия";
		case "Черное море":
			return "город для отдыха";
		case "Баренцево море":
			return "... что тут выбирать - впереди только лучшие ледовые пляжи. Вперед!..";
		case "Российские горы":
			return "горнолыжный курорт";
		case "Европейские горы":
			return "лыжную страну";
		case "Американские горы":
			return "горнолыжный штат";
		case "Культура России":
			return "ваше направление";
		case "Зарубежная культура":
			return "страну для приобщения к лучшим туристическим местам";
		default:
			return "ваш дом для отдыха";
	}
}

function fillChoosen(choice) {
	const prev = choosen.innerHTML;
	if (choice === null) return;
	choosen.innerHTML = prev + " : " + choice;
}

// on button click - hide button, show selection
async function onClick(root) {
	await new Promise(resolve => setTimeout(resolve, 300));
	fillChoosen(root);
	show(choosen);
	optionsContainer.innerHTML = "";
	const options = await getOptions().then(options => mapOptions(options, root));
	const appentSelectionSection = defineContainer(optionsContainer);
	if (options.length === 0) {
		hide(selectionSection);
		show(finalSection);
		return;
	}
	options.forEach(option => appentSelectionSection(option));
	const question = chooseQuestion(root);
	questionObject.innerHTML = question;
	show(selectionSection);
}

async function optionClick() {
	const root = this.id;
	onClick(root);
}

async function start() {
	hide(startButton);
	const root = null;
	onClick(root);
}

// ready-GO!
startButton.addEventListener("click", start);
