

$(document).ready(() => {

    const feedback = $(".feedback")
    const form = $(".register form")
    
    form.validate({
        rules: {
            pass: {
                required: true,
                minlength: 6,
            },            
            pass_verify: {
                equalTo: "#pass"
            }
        },
		messages: {
			pass: 'Не короче 6 символов',
            pass_verify: 'Пароли не совпадают'
		}
    });


    
    
    form.on("submit", function (e) {

        e.preventDefault();

        var formData = new FormData(form[0]);

        $.ajax({
            url: 'php/auth/controllers/createUser.php',
            data: formData,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data) {
                const response = JSON.parse(data)
               

                //в случае успешной регистрации перенаправляем на страницу входа
                if (response.message === "Регистрация успешна"){                    
                    setTimeout(() => {
                        window.location = "/index.html"
                    }, 1000)
                    showMsg(response.message)
                }
                   

                //если пользователь занят красим красным
                if (response.message === "Такой пользователь уже существует"){
                    showMsg(response.message, true)
                }
                   
                    
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
	restrictInput("username", "^[0-9A-z-_]");
    
    // пароль без ограничений по символам
	
    /* ОГРАНИЧЕНИЯ ВВОДА */

})

