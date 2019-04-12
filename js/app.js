let slideIndex = 0;
showSlides();

function showSlides() {
	let i;
	let slides = document.getElementsByClassName("mySlides");
	let dots = document.getElementsByClassName("dot");
	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
	}
	slideIndex++;
	if (slideIndex > slides.length) {slideIndex = 1}
	for (i = 0; i < dots.length; i++) {
		dots[i].className = dots[i].className.replace(" active", "");
	}
	slides[slideIndex-1].style.display = "block";
	dots[slideIndex-1].className += " active";
	setTimeout(showSlides, 5000);
}




let app = {};


$('#searchButton').click(function(e){
	e.preventDefault();
	$('#tvMaze').empty();
	let term = $('#searchBox').val();
	app.retrieveShows(term);
});

app.retrieveShows = function(searchTerm){
	$.ajax({
		url: 'https://api.tvmaze.com/search/shows',
		method: 'GET',
		dataType: 'json',
		data: {
			format: 'json',
			q: searchTerm
		},
		success: function(result){
			console.log('Ajax is working.');
			app.renderShows(result);
		},
		error: function(error){
			console.log('Something went wrong.');
			console.log(error);
		}
	});
};

app.renderShows = function(showArray){

	let count; // declare a let to hold the shows number
	if (count == undefined) {
		$('.showResult').text('No show was found. Please do a new search.').css('color', 'red');
	};

	// using jQuery forEach to loop over our array of tv information
	showArray.forEach(function(tvShow){

		// Creating elements for each piece of data
		let name = $('<h2>').text(tvShow.show.name);
		let nameBox = $('<h3>').text(tvShow.show.name).css({"border-bottom": "2px solid red"});
		let language = $('<i>').text(tvShow.show.language);
		let genres = $('<p>').text(tvShow.show.genres[0]);
		let channel = $('<p>').text(tvShow.show.network.name);
		let country = $('<p>').text('( ' + tvShow.show.network.country.name + ' )');
		let image = $('<img>').attr('src', tvShow.show.image.original).css({"height": "300px", "width": "200px"});
		let imageBox = $('<img>').attr('src', tvShow.show.image.original);
		let summary = tvShow.show.summary;

		// make images clickable
		let clkImage = $('<a>').attr('href', tvShow.show.image.original).append(image);

		// appending in divs only name and image for the search
		let shows = $('<div>').addClass('shows').append(name, clkImage);

		// appending all the divs to our webpage
		$('#tvMaze').append(shows);

		// counting every div and displey the result
		count = $('.shows').length;
		$('.showResult').text('You have ' + count + ' result.').css('color', 'green');
		if (count > 12){
			$('#search').css('height', '2000px');
		}else if (count > 8 && count <= 12) {
			$('#search').css('height', '1800px');
		}else if (count > 4 && count <= 8) {
			$('#search').css('height', '1200px');
		}else{
			$('#search').css('height', '900px');
		}
		$('header').hide();
		// appending in divs all data for the lightBox
		let showsInfo = $('<div>').addClass('showsInfo').append(imageBox, nameBox, language, genres, channel, country, summary);

		// creating lightBox by clicking the shows
		$('.shows').click(function(e){
			e.preventDefault();
			//check if lightBox exist and declare let to hold the lightBox
			if ($('#lightBox').length > 0) {          	// .lightbox exists
				$('#lightBox').show();
			} else { 									// .lightbox does not exist
				let lightBox = 	'<div id="lightBox">' +
					'<p title="close" id="lightBoxClose">X</p>' +
					'<div class="showsBox">' + '</div>' +
					'</div>';

				$('body').append(lightBox);	            //insert lightbox into page
				$('.showsBox').append(showsInfo);		//insert divs into lightBox
			};
		});

		// remove lightBox when click "X"
		$('#lightBoxClose').live('click', function() {

			$('#lightBox').remove();
			$('header').show();
		});

	});  // end forEach loop function
}; //end app.renderShows function