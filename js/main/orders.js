// $.ajaxSetup({
// xhrFields: {
//     withCredentials: true
//   },
//   });

// при загрузке страницы 
$(document).ready(() => {
	const managerHiddenMark = $("#username_2")

	//запрос на авторизацию 
	$.ajax({
		url: 'php/auth/controllers/checkUser.php',

		success: function (data) {
			const response = JSON.parse(data)

			// в случае успешной авторизации или того что пользователь уже авторизован перенаправляем на "заказы"
			if (response.username !== null) {
				loadOrders(response.username)
			}
			else {
				loadError(response.message)
			}

			managerHiddenMark.val(response.username)
			console.log(response)
		}
	});

	// при клике на добавить заказ открываем модальное окно
	$(".add-order").on('click', () => {
		openModal("order-modal")
	})

	//при клике на крест закрываем модальное окно
	$(".close").on('click', () => {
		closeModal()
	})

	// при клике на модальное окно 
	$(".modal-window").on('click', (e) => {
		// если цель клика -- пустота вокруг окна -- закрываем его
		if ($(e.target).is(".modal-window-wrap"))
			closeModal()
	})

	// при вводе в любое поле на форме заказа -- снимаем финальную ошибку
	$("#order input, #order select, #order textarea").on("propertychange input", () => {
		clearFinalError()
	})
	// при сдаче формы
	$("#order").on("submit", function (e) {

		// предотвращаем перезагрузку страницы вследствие сдачи формы
		e.preventDefault();

		// Даем время прогрузиться ошибкам с валидатора
		setTimeout(() => {
			if (checkErrors($("#order")) === 0) {
				var formData = new FormData($("#order")[0]);



				// отправляем запрос на создание заказа
				$.ajax({
					url: 'php/orders/controllers/createOrder.php',
					data: formData,
					processData: false,
					contentType: false,
					type: 'POST',
					success: function (data) {

						const result = JSON.parse(data)
						if (result.message === "Created") {
							// получаем заказы и отрисовываем таблицу с заказами
							const orders = result.orders
							drawTable(orders)

							// закрываем модальное окно
							closeModal()
						}
						if (result.message === "Already exist") {
							setFinalError(`Такой заказ уже существует под номером ${result.conflictOrderID}, созданный менеджером ${result.conflictOrderManager}`)
						}
					}
				});
			}
			else {
				setFinalError("Пожалуйста, заполните поля корректно")
			}
		}, 100)




	})
	$(".logout").on('click', () => {

		showLoading()

		$.ajax({
			url: 'php/auth/controllers/logout.php',
			success: function (data) {
				//console.log(data)
				const response = JSON.parse(data)
				console.log(response)
				document.location = "index.html"
			}
		});
	})


	/* ОГРАНИЧЕНИЯ ВВОДА */

	// имена содержат русские или английский буквы любого регистра , пробел, дефис, апостроф
	restrictInput("name_2", "^[А-яA-z -'`]");

	// имейл содержит русские или английский буквы любого регистра, цифры, дефис, нижнее подчеркивание, !, @, точку
	restrictInput("email_2", "^[0-9А-яA-z-_!@.]");
	
	// телефон содержит только цыфры
	restrictInput("phone_2", "^[0-9]");

	// адрес содержит русские или английский буквы любого регистра, цифры, дефис, нижнее подчеркивание,
	// !, @, точку, запятую, точку с запятой, пробел
	restrictInput("address_2", "^[0-9А-яA-z./№, -;]");

	// заказ без ограничений
	
	/* ОГРАНИЧЕНИЯ ВВОДА */


	[].forEach.call(document.querySelectorAll('#phone_2'), function (input) {
		var keyCode;
		function mask(event) {
			event.keyCode && (keyCode = event.keyCode);
			var pos = this.selectionStart;
			if (pos < 3) event.preventDefault();
			var matrix = "+7 (___)-___-__-__",
				i = 0,
				def = matrix.replace(/\D/g, ""),
				val = this.value.replace(/\D/g, ""),
				new_value = matrix.replace(/[_\d]/g, function (a) {
					return i < val.length ? val.charAt(i++) || def.charAt(i) : a
				});
			i = new_value.indexOf("_");
			if (i != -1) {
				i < 5 && (i = 3);
				new_value = new_value.slice(0, i)
			}
			var reg = matrix.substr(0, this.value.length).replace(/_+/g,
				function (a) {
					return "\\d{1," + a.length + "}"
				}).replace(/[+()]/g, "\\$&");
			reg = new RegExp("^" + reg + "$");
			if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
			if (event.type == "blur" && this.value.length < 5) this.value = ""
		}

		input.addEventListener("input", mask, false);
		input.addEventListener("focus", mask, false);
		input.addEventListener("blur", mask, false);
		input.addEventListener("keydown", mask, false)
	})

	jQuery.validator.addMethod("checkMask", function (value, element) {
		return /\+\d{1} \(\d{3}\)-\d{3}-\d{2}-\d{2}/g.test(value);
	});

	$("#order").validate({
		rules: {
			name: {
				required: true,
				minlength: 3,
				digit: false
			},
			email: {
				required: true,
				email: true,
				minlength: 5
			},
			phone: {
				checkMask: "Введите полный номер телефона"
			},
			address: {
				required: true,
				minlength: 12
			},
			city: {
				required: true,
			},
			food: {
				required: true,
				minlength: 4
			},
		},
		messages: {
			name: "Пожалуйста, введите имя клиента",
			email: "Пожалуйста, введите корректный email-адрес",
			phone: "Пожалуйста, введите номер телефона",
			address: "Пожалуйста, введите корректный адрес (минимум 12 символов)",
			city: "Пожалуйста, выберите город",
			food: "Укажите что именно заказал клиент"
		}
	});

	//$('#phone_2').mask("8(999)-999-99-99", {autoclear: false});

})

function checkErrors(parentDiv) {

	let numErrors = 0
	parentDiv.find(".error").each((i, item) => {
		if ($(item).css("display") !== "none")
			numErrors++
	})

	return numErrors
}
function clearFinalError() {
	$(".final-errors").text("")
}

function setFinalError(text) {
	$(".final-errors").text(text)
}


// появление заказов при успешной авторизации
function loadOrders(username) {
	setTimeout(() => {
		const orders = $(".orders")

		$(".loading").addClass("hidden")
		orders.removeClass("hidden")
		orders.find(".user-name").text(username)
		// получаем заказы
		$.ajax({
			url: 'php/orders/controllers/loadOrders.php',
			success: function (data) {
				const orders = JSON.parse(data)
				console.log("Заказы", orders)
				drawTable(orders)

			}
		});
	}, 500)
}
// ошибки авторизации
function loadError(errorMsg) {
	setTimeout(() => {
		$(".loading").addClass("hidden")
		const errorBlock = $(".errors");
		errorBlock.removeClass("hidden")
		errorBlock.text(errorMsg)
	}, 500)
	setTimeout(() => {
		document.location = "index.html"
	}, 2000)
}


// получаем детали заказа из loadOrder.php
async function getOrderDetails(orderID) {
	return await $.post(
		'php/orders/controllers/loadOrder.php',
		{
			order_id:
				orderID
		},
		function (data) {
			const food = JSON.parse(data)
		}
	);
}


// показываем окно с деталями заказа
function showOrderDetails(orderID) {
	// текстареа, куда будем записывать список еды
	const textarea = $(".order-details-modal #food_edit")
	const title = $(".order-details-modal .order > h1")

	// вызов асинхронной функции которая получает данные с сервера, ждем ее готовность с помощью .then
	getOrderDetails(orderID).then(order => {
		order = JSON.parse(order)
		console.log(order);
		textarea.text(order.food)
		title.text(`Еда из заказа № ` + order.id)
		openModal("order-details-modal")
	})

}

function showLoading() {
	$(".loading").addClass("visible")
	$(".orders").removeClass("visible")
	$(".errors").removeClass("visible")
}


function drawTable(items) {

	// собираем заголовочные ячейки таблицы
	// let headers = ""	
	// for (const [key, value] of Object.entries(items[0])) {
	// 	headers+= `<div class="header__item"><a id="${key}" class="filter__link" href="#">${key}</a></div>`
	// }
	let headers = `
			<div class="header__item"><a id="order_id_t" class="filter__link filter__link--number" >№ заказа</a></div>
			<div class="header__item"><a id="name_t" class="filter__link" >Имя</a></div>
			<div class="header__item"><a id="email_t" class="filter__link" >Email</a></div>
			<div class="header__item"><a id="phone_t" class="filter__link" >Телефон</a></div>
			<div class="header__item"><a id="address_t" class="filter__link" >Адрес</a></div>
			<div class="header__item"><a id="city_t" class="filter__link" >Город</a></div>
			<div class="header__item"><a id="manager_t" class="filter__link" >Менеджер</a></div>
			<div class="header__item"><a id="details_t" class="filter__link" >Заказ</a></div>	
	`

	// собираем тело таблицы -- ряды
	let rows = ""
	items.forEach(item => {

		let row = ''
		for (const [key, value] of Object.entries(item)) {
			if (!(key === "food"))
				row += `<div class="table-data" row-name="${key}">${value}</div>`
			else
				row += `<div class="table-data" row-name="${key}"><button class='order_details default-btn'>Детали заказа</button></div>`
		}

		row = `
			   <div class="table-row">
				   ${row}
			   </div>
		   `
		rows += row

	});

	// собираем итоговую таблицу
	let table = `
		<div class="table-header">
			${headers}
		</div>
		<div class="table-content">
			${rows}
		</div>
	`
	const tableBlock = $(".table")
	tableBlock.html(table)
	//console.log(table)

	enableTableSort()

	// при клике на "детали заказа" открываем модальное окно с подробностями
	$(".order_details").on('click', function () {
		const orderID = Number($(this).parent().parent().find("[row-name='id']").text())
		showOrderDetails(orderID)
	})

}



function enableTableSort() {

	// свойства таблицы которые мы хотим сортировать
	var properties = [
		'order_id_t',
		'name_t',
		'email_t',
		'phone_t',
		'address_t',
		'city_t',
	];


	// сортировка таблицы по клику
	$.each(properties, function (i, val) {

		var orderClass = '';

		$("#" + val).click(function (e) {
			e.preventDefault();
			$('.filter__link.filter__link--active').not(this).removeClass('filter__link--active');
			$(this).toggleClass('filter__link--active');
			$('.filter__link').removeClass('asc desc');

			if (orderClass == 'desc' || orderClass == '') {
				$(this).addClass('asc');
				orderClass = 'asc';
			} else {
				$(this).addClass('desc');
				orderClass = 'desc';
			}

			var parent = $(this).closest('.header__item');
			var index = $(".header__item").index(parent);
			var $table = $('.table-content');
			var rows = $table.find('.table-row').get();
			var isSelected = $(this).hasClass('filter__link--active');
			var isNumber = $(this).hasClass('filter__link--number');

			rows.sort(function (a, b) {

				var x = $(a).find('.table-data').eq(index).text();
				var y = $(b).find('.table-data').eq(index).text();

				if (isNumber == true) {

					if (isSelected) {
						return x - y;
					} else {
						return y - x;
					}

				} else {

					if (isSelected) {
						if (x < y) return -1;
						if (x > y) return 1;
						return 0;
					} else {
						if (x > y) return -1;
						if (x < y) return 1;
						return 0;
					}
				}
			});

			$.each(rows, function (index, row) {
				$table.append(row);
			});

			return false;
		});

	});

}

