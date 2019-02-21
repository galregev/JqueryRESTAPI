const reports = [];
let index = 0;

function coinsObj(id, symbol, name, index) {
    var coins = {
        id: id,
        symbol: symbol,
        name: name,
        index: index,
    };
    return coins;
}

$(document).ready(function () {

    showCoins();
    search();
    $(window).scroll(function() {
    if ($(document).scrollTop() > 150) {
        $(".col-lg-3.col-sm-4").addClass("animated slow flipInX");
      } else {
        $(".col-lg-3.col-sm-4").removeClass("animated slow flipInX");
      }
    });

    $('.nav-link').on('click', (event) => {
        let menuId = event.target.id;
        if (menuId != 'index') {
            $.ajax({
                type: 'GET',
                dataType: "html",
                url: `${menuId}.html`,
                beforeSend: function () {
                    $(".loader").show();
                },
                success: function (result) {
                    $(".loader").hide();
                    let newPage = $(result);                  
                    $('#x').html(newPage);
                    $('#x').removeClass('card-group');
                }
            });
        } else if (menuId = 'index') {
            $('#x').addClass('card-group');
            $('#x').html(showCoins());
        }
    });


    function showCoins() {
        // Get 100 Coins.
        $.ajax({
            type: 'GET',
            url: 'https://api.coingecko.com/api/v3/coins/list/',
            beforeSend: function () {
                $(".loader").show();
            },
            success: function (results) {
                $('#x').empty();
                for (var i = 0; i < 100; i++) {
                    index += 1;
                    appendCoin(results[i]);
                    $(".loader").hide();
                }
            },
            error: (error) => {
                console.log(`Failed: ${error}`);
            }
        });
    }

    function search() {

        //var reciveStorage = localStorage.getItem("coins");
        //var getCoins = JSON.parse(reciveStorage);

        $('input#search').keyup(function (event) {

            let searchValue = $(this).val().trim().toLowerCase();
            
            $('h4.card-title').each( function () {
                let cardText = $(this).text().toLowerCase();
                if (cardText === searchValue) {
                    $(this).parent().parent().parent().show();
                } else {
                    $(this).parent().parent().parent().hide();
                }
            });

            if (event.keyCode === 13) {
                $('#searchModal').removeClass('flipInX').addClass('animated bounceOutDown').delay(2000);
            }

        });

    } // search

    // Append Coin Function
    function appendCoin(coin) {

        $('.card-group')
            .append(
                `
                    <div class="col-lg-3 col-sm-4 ${coin.symbol}">
                    <div class="card text-white bg-primary mb-3">
                        <img id="${coin.id}" class="cardImg" src="http://gdeveloper.tech/jquery-project/bc.png" alt="Coin">
                        <div class="card-body">
                            <h4 class="card-title">${coin.symbol.toUpperCase()}</h4>
                            <label class="switch mt-3">
                                <input class="toggle" onclick="toggle(this)" type="checkbox">
                                <span class="slider round"></span>
                            </label>
                            <div class="collapse pt-4" id="moreInfo-${coin.id}">

                                <ul class="list-group prices-${coin.id} text-left mb-2 mt-2">
                                    <li id="dollar" class="list-group-item list-group-item-light"> </li>
                                    <li class="list-group-item list-group-item-light"> <div class="loader"> <i class="fab fa-bitcoin bitIco"></i> </div> </li>
                                    <li class="list-group-item list-group-item-light">  </li>
                                </ul>
                            </div>
                            <button href="#moreInfo-${coin.id}" onclick="getButton(this)" id="more" data-toggle="collapse" class="btn more w-100 mt-2 btn-outline-light d-block">More
                                Info</button>
                        </div>
                    </div>
                </div>
                `
            );

    }

});

function getMore(coin) {

    // Get the data from localStorage.
    const nowTime = Date.now();
    const coinBackUp = JSON.parse(localStorage.getItem(`${coin}`));
    if (coinBackUp != null && (nowTime - coinBackUp.time) < 120000) {

        // Display the current coin rate.
        $(`ul.prices-${coin}`)
            .html(`
                    <li class="list-group-item list-group-item-light"> <i class="fas fa-dollar-sign"></i> ${coinBackUp.market_data.current_price.usd.toFixed(5)} </li>
                    <li class="list-group-item list-group-item-light"> <i class="fas fa-shekel-sign"></i> ${coinBackUp.market_data.current_price.ils.toFixed(5)} </li>
                    <li class="list-group-item list-group-item-light"> <i class="fas fa-euro-sign"></i> ${coinBackUp.market_data.current_price.eur.toFixed(5)} </li>
                `);

    } else {

        $.ajax({
            type: 'GET',
            url: `https://api.coingecko.com/api/v3/coins/${coin}`,
            beforeSend: function () {
                $(".loader").show();
            },
            success: function (result) {

                let time = new Date();
                let Min = time.getMinutes();
                console.log(time + "min:" + Min);

                $(".loader").hide();
                var currentValue = {
                    usd: `${result.market_data.current_price.usd.toFixed(5)}`,
                    nis: `${result.market_data.current_price.ils.toFixed(5)}`,
                    eur: `${result.market_data.current_price.eur.toFixed(5)}`
                };

                // Display the coin image.
                $(`img#${coin}`).attr('src', `${result.image.large}`);

                // Display the current coin rate.
                $(`ul.prices-${coin}`)
                    .html(`
                        <li class="list-group-item list-group-item-primary"> <i class="fas fa-dollar-sign"></i> ${currentValue.usd} </li>
                        <li class="list-group-item list-group-item-primary"> <i class="fas fa-shekel-sign"></i> ${currentValue.nis} </li>
                        <li class="list-group-item list-group-item-primary"> <i class="fas fa-euro-sign"></i> ${currentValue.eur} </li>
                    `);

                // Save to LocalStorage.
                result.time = Date.now();
                localStorage.setItem(`${result.id}`, JSON.stringify(result));

            }

        }); // End Ajax .
    } // End Else statement.
}

function getButton(elem) {
    let id = $(elem).attr('href');
    let lastId = id.substring(10);
    console.log(lastId);

    getMore(lastId);

}

function replaceCoin(coin){
    $('.modal-body .row').append(`
        <div class="col-sm-4 my-2">
        <div class="card new_card text-white">
        <div class="card-body">
            <h5 class="card-title"> ${coin} </h5>
            <p class="card-text">Click the button below to erase.</p>
            <a href="#" id="${coin}" onclick="removeFromArr(this)" class="btn btn-outline-light">Remove ${coin}</a>
        </div>
        </div>
    </div>
    `);

}

// Toggle Checked or not.
function toggle(elem) {

    // Get the coin name of this card.
    const addToggle = $(elem).parent().parent().children().first().text();

    if ($(elem).prop("checked")) {
        
        if (reports.length > 4) { // Open the modal box.
            reports.splice(5);
            //console.log(reports);
            $($(elem)).prop("checked", false); // Can't checked the toggle.
            $('.modal').show();
            $('.modal-body .row').html('');
            for(let index = 0; index < reports.length; index++) {
                replaceCoin(reports[index]);
            }

            $('.closeModal').on('click', function(){
                $('.modal').hide();
            });
            
        } 
        // Push this coin to Reports array.
        if (reports.indexOf(addToggle) <= 0) {
            if(reports.length > 4) {
                console.log('Open the modal');
            } else {
            reports.push(addToggle);
            console.log(reports);
        }
        }

    } else {
        // Splice unchecked coins from the Reports array.
        const num = reports.indexOf(addToggle);
        reports.splice(num, 1);
        console.log(reports);
    }

}

function removeFromArr(name) {
    const coinName = $(name).parent().children(":first").text().trim().toUpperCase();
    const index = reports.indexOf(coinName);
    if (index != -1) {
        reports.splice(index, 1);
    }
    
    // Hide from modal.
    const divToHide = $(name).parent().parent().parent();
    $(divToHide).addClass('animated slow hinge').fadeOut('slow');

    // Disable the toggle.
    $('h4.card-title').each(function(){
        if ( $(this).text() == coinName ) {
            const toggleToDisable = $(this).next().children(":first");
            $($(toggleToDisable)).prop("checked", false); // Can't checked the toggle.
        }
    });

}

// Open the full screen search box 
function openSearch() {
    $('#searchModal').show().removeClass('animated bounceOutDown').addClass('animated flipInX');
}

// Close the full screen search box 
function closeSearch() {
    $('#searchModal').removeClass('flipInX').addClass('animated bounceOutDown').delay(2000);
}