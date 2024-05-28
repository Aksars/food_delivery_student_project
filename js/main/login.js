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


    function showMsg(msg) {
        //console.log(data);
        feedback.text(msg)
        feedback.removeClass("hidden")
        setTimeout(() => {
            feedback.addClass("hidden")
        }, 3000)
    
    
    
    }
})
