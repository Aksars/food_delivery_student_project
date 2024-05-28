

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
                showMsg(response.message)

                //в случае успешной регистрации перенаправляем на страницу входа
                if (response.message === "Регистрация успешна")
                    setTimeout(() => {
                        window.location = "/index.html"
                    }, 1000)

                console.log(response)
            }
        });
    })

    function showMsg(msg, error = false) {
        feedback.text(msg)
    
        error ? feedback.addClass("red") : null;
    
        feedback.removeClass("hidden")
        setTimeout(() => {
            feedback.addClass("hidden")
            feedback.removeClass("red")
        }, 3000)
    }
})

