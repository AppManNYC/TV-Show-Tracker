
let app = {};


$("button").click(function(e){
	e.preventDefault();
	$('#tvShows').empty();
	let word = $('input').val();
	app.getTVshow(word);
});

app.getTVshow = function(inputWord){
	$.ajax({
		url: 'http://api.tvmaze.com/search/shows',
		method: 'GET',
		dataType: 'json',
		data: {
			format: 'json',
			q: inputWord
		},
		success: function(result){
			console.log('Ajax is working.');
			app.displayTV(result);
		},
		error: function(error){
			console.log('Something went wrong.');
			console.log(error);
		}
	});
};

app.displayTV = function(tvInfoArray){

	let count;
	if (count == undefined) {
		$('.showResult').text('No show was found. Please do a new search.').css('color', '#FF0000');
	};

	tvInfoArray.forEach(function(tvInfo){

		let name = $('<h2>').text(tvInfo.show.name);
		let nameBox = $('<h3>').text(tvInfo.show.name);
		let language = $('<i>').text(tvInfo.show.language);
		// let genres = '';
		// for (let i = 0; i< tvInfo.show.genres.length; i++) {
		// 	genres += $('<p>').text(tvInfo.show.genres[i]);
		// }
		let genres = $('<p>').text(tvInfo.show.genres[0]);
		let genres2 = $('<p>').text(tvInfo.show.genres[2]);
		let genres1 = $('<p>').text(tvInfo.show.genres[1]);

		let channel = $('<p>').text(tvInfo.show.network.name);
		let country = $('<p>').text('( ' + tvInfo.show.network.country.name + ' )');
		let image = $('<img>').attr('src', tvInfo.show.image.original);
		let imageBox = $('<img>').attr('src', tvInfo.show.image.original);
		let summary = tvInfo.show.summary;

		let clkImage = $('<a>').attr('href', tvInfo.show.image.original).append(image);

		let shows = $('<div>').addClass('shows').append(name, clkImage);

		$('#tvShows').append(shows);

		count = $('.shows').length;
		$('.showResult').text('You have ' + count + ' result.').css('color', 'purple');

		let showsInfo = $('<div>').addClass('showsInfo').append(imageBox, nameBox, language, genres, genres1, genres2, channel, country, summary);

		$('.shows').click(function(e){
			e.preventDefault();

			if ($('#lightBox').length > 0) {
				$('#lightBox').show();
			} else {
				let lightBox = 	'<div id="lightBox">' +
					'<p title="close" id="lightBoxClose">X</p>' +
					'<div class="showsBox">' + '</div>' +
					'</div>';

				$('body').append(lightBox);
				$('.showsBox').append(showsInfo);
			};
		});

		$('#lightBoxClose').live('click', function() {
			$('#lightBox').remove();
		});


	});
};

$(() => {
	let currentImgIndex = 0;
	let highestIndex = $('.carousel-images').children().length - 1;
	// next button
	$('.next').click(function() {
		// hide current image
		$('.carousel-images').children().eq(currentImgIndex).css('display', 'none');
		// increment image index
		if (currentImgIndex < highestIndex) {
			currentImgIndex++;
		}
		else {
			currentImgIndex = 0;
		}

		// show current image
		$('.carousel-images').children().eq(currentImgIndex).css('display', 'block');
	});

	$('.previous').click(function() {
		// hide current image
		$('.carousel-images').children().eq(currentImgIndex).css('display', 'none');
		// decrement the image index
		if (currentImgIndex > 0) {
			currentImgIndex--;
		}
		else {
			currentImgIndex = highestIndex;
		}
		// show current image
		$('.carousel-images').children().eq(currentImgIndex).css('display', 'block');

	});
});