$(document).ready(function() {

    var htmlGiorno = $('#calendar-template').html();
    var templateGiorno = Handlebars.compile(htmlGiorno);

    // stampare il mese di Gennaio 2018
    // tramite il click stampare il mese successivo
    var dataIniziale = moment('2018-01-01');
    var limiteInziale = moment('2018-01-01');
    var limiteFinale = moment('2018-12-01');
    var meseApi = parseInt(dataIniziale.month());
    var primoGiorno = dataIniziale.isoWeekday();
    console.log(primoGiorno);

    shiftGiorni(primoGiorno);
    stampaGiorniMese(dataIniziale);     // inizializzazione del calendario
    stampaFestivi(meseApi);


    $('.mese-succ').click(function () {
        $('.mese-prec').prop('disabled', false);
        if (dataIniziale.isSameOrAfter(limiteFinale)) {
            alert('Hack');
        } else {
            dataIniziale.add(1, 'month');
            var meseApi = parseInt(dataIniziale.month());
            stampaGiorniMese(dataIniziale);
            stampaFestivi(meseApi);
            if (dataIniziale.isSameOrAfter(limiteFinale)) {
                $('.mese-succ').prop('disabled', true);
            }
        }
    });

    $('.mese-prec').click(function () {
        if (dataIniziale.isSameOrBefore(limiteInziale)) {
            alert('Hack');
        } else {
            dataIniziale.subtract(1, 'month');
            var meseApi = parseInt(dataIniziale.month());
            stampaGiorniMese(dataIniziale);
            stampaFestivi(meseApi);
            if (dataIniziale.isSameOrBefore(limiteInziale)) {
                $('.mese-prec').prop('disabled', true);
            }
        }
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
        var standardDay = meseDaStampare.clone(); // cloniamo il mese da stampare per inserirlo nell attributo dataDay
        var giorniMese = meseDaStampare.daysInMonth(); // quanti giorni ci sono nel mese corrente
        var nomeMese = meseDaStampare.format('MMMM'); // prendiamo il mese da affiancare al giorno
        console.log(nomeMese);
        $('#nome-mese').text(nomeMese); //aggiornare nome mese della testata
        var primoGiorno = dataIniziale.isoWeekday();
        shiftGiorni(primoGiorno);
        console.log(primoGiorno);
        for (var i = 1; i <= giorniMese; i++) {
            // $('#calendar').append('<li>' + i + ' ' + nomeMese + '</li>');
            var giornoDaInserire = {  // oggetto
                day: i + ' ' + nomeMese, // numero giorno + nome del mese
                dataDay: standardDay.format('YYYY-MM-DD') // formato del giorno
            }
            var templateFinale = templateGiorno(giornoDaInserire); // popoliamo il template con i dati dell oggetto
            $('#calendar').append(templateFinale); // appendiamo il template popolato a #calendar html
            standardDay.add(1, 'day'); // aggiungiamo 1 per passare al prossimo giorno
        }
    }
});

function shiftGiorni(primoGiorno) {
    for (var i = 1; i < primoGiorno; i++) {
        $('#calendar').append('<li></li>');
    }
}
// https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0
