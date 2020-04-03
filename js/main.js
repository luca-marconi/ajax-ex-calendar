$(document).ready(function() {

    var htmlGiorno = $('#calendar-template').html();
    var templateGiorno = Handlebars.compile(htmlGiorno);

    // stampare il mese di Gennaio 2018
    // tramite il click stampare il mese successivo
    var dataIniziale = moment('2018-01-01');
    var meseApi = parseInt(dataIniziale.month());
    stampaGiorniMese(dataIniziale);     // inizializzazione del calendario
    stampaFestivi();

    $('.mese-succ').click(function () {
        dataIniziale.add(1, 'month');
        var meseApi = parseInt(dataIniziale.month());
        console.log(meseApi);
        stampaGiorniMese(dataIniziale);
        stampaFestivi(meseApi);
    });

    $('.mese-prec').click(function () {
        dataIniziale.subtract(1, 'month');
        var meseApi = parseInt(dataIniziale.month());
        console.log(meseApi);
        stampaGiorniMese(dataIniziale);
        stampaFestivi(meseApi);
    });

    function stampaFestivi(meseApi) {
        $.ajax ({
            url: 'https://flynn.boolean.careers/exercises/api/holidays?year=2018',
            method: 'GET',
            data: {
                month: meseApi
            },
            success: function (data) {
                var giorniFestivi = data.response;
                for (var i = 0; i < giorniFestivi.length; i++) {
                    var giornoFestivo = giorniFestivi[i];
                    var nomeFestivo = giornoFestivo.name;
                    var dataFestivo = giornoFestivo.date;
                    console.log(dataFestivo);
                    $('#calendar li[data-day="' + dataFestivo + '"]').addClass('festivo').append(' - ' + nomeFestivo);
                }
            }
        });
    }

    function stampaGiorniMese(meseDaStampare) {
        $('#calendar').empty();
        var standardDay = meseDaStampare.clone();
        var giorniMese = meseDaStampare.daysInMonth();
        var nomeMese = meseDaStampare.format('MMMM');
        console.log(nomeMese);
        $('#nome-mese').text(nomeMese); //aggiornare nome mese della testata
        for (var i = 1; i <= giorniMese; i++) {
            // $('#calendar').append('<li>' + i + ' ' + nomeMese + '</li>');
            var giornoDaInserire = {
                day: i + ' ' + nomeMese,
                dataDay: standardDay.format('YYYY-MM-DD')
            }
            var templateFinale = templateGiorno(giornoDaInserire); // popoliamo il template con i dati dell oggetto
            $('#calendar').append(templateFinale);
            standardDay.add(1, 'day');
        }
    }
});


// https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0
