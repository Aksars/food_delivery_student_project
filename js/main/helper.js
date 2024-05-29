
// функция ограничения ввода на input-ах 
function restrictInput(field_id, regex) {
	let input = document.getElementById(field_id);

	// //очистка всех событий инпута
	// var el = input,
	// 	elClone = el.cloneNode(true);
	// el.parentNode.replaceChild(elClone, el);
    // input = elClone
	
    // убираем квадратные скобки из допустимых символов, потому что они считаються разрешенными по умолчанию по какой то причине
    squareBrakets = /[\]\[]/;;

    // установка ограничения ввода на инпут по регулярному выражению
    regex = new RegExp(regex);
	input.addEventListener("beforeinput", (event) => {
		if (event.data != null && ( !regex.test(event.data) || squareBrakets.test(event.data) ))
			event.preventDefault();
	})
}

// чтоб убрать подергивание при открытии модального окна -- фиксируем ширину body
function setBodyWidthFix(body) {
	const width = body.outerWidth();
	const fixedBlocks = $(".fixed-block")

	// применяем фиксацию ширины всем блокам которые "прыгают" при открытии модального окна
	fixedBlocks.css("width", width + "px")
	body.css("width", width + "px")
}

// функция открытия модального окна
function openModal(modal_class) {
	const modal = $(`.modal-window.${modal_class}`)
	const body = $("body")

	// фикс на ширину боди
	setBodyWidthFix(body)

	//запрещаем прокрутку тела страницы
	body.addClass("stop-scroll")
	// показываем модальное окно
	modal.removeClass("hidden")
}

// функция закрытия модального окна
function closeModal() {
	//закрываем окно
	const modal = $(".modal-window")
	modal.addClass("hidden")
	console.log(modal)

	const modalTransitionTime = toMS(modal.css("transition-duration"))
	// разрешаем боди прокручиваться после окончания анимации модального окна
	setTimeout(() => {
		$("body").removeClass("stop-scroll")
	}, modalTransitionTime)

}
// функция конвертации записей формата 0.5s/500ms в число 500
function toMS(s) {
	return parseFloat(s) * (/\ds$/.test(s) ? 1000 : 1);
}

