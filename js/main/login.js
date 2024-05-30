$(document).ready(() => {

    const form = $(".login form")
    const feedback = $(".feedback")
    form.on("submit", function (e) {

        e.preventDefault();

        var formData = new FormData(form[0]);

        $.ajax({
            url: 'php/auth/controllers/checkUser.php',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                const response = JSON.parse(data)

                showMsg(response.message)

                //в случае успешной авторизации или того что пользователь уже авторизован перенаправляем на "заказы"
                if (response.username !== null)
                    setTimeout(() => {
                        window.location = "/orders.html"
                    }, 1000)

                console.log(response)
            }
        });
    })

    // показ сообщений при авторизации/регистрации 
    function showMsg(msg, error = false) {
        feedback.text(msg)
    
        error ? feedback.addClass("red") : null;
    
        feedback.removeClass("hidden")
        setTimeout(() => {
            feedback.addClass("hidden")
            feedback.removeClass("red")
        }, 3000)
    }

    /* ОГРАНИЧЕНИЯ ВВОДА */
	
	// логин содержит цифры, буквы английского алфавита в любом регистре, дифис, нижнее подчеркивание
	restrictInput("username", "^[0-9A-z_-]");
	
    /* ОГРАНИЧЕНИЯ ВВОДА */
})



