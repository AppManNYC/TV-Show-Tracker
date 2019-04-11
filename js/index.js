var router = new VueRouter();
var search_obj = new Vue({
    el: '.search-wrapper',
    data: {
        apiBaseUrlShows: 'http://api.tvmaze.com/search/shows',
        apiBaseUrlPeople: 'http://api.tvmaze.com/search/people',
        hide_searchdata: true,
        hide_nosearchdata: false,
        shows: [],
        people: []
    },
    methods: {
        fetch_shows: function (query) {
            var self = this;
            self.hide_searchdata = true;
            self.hide_nosearchdata = false;
            if (query) {
                axios.get(self.apiBaseUrlShows + '?q=' + query)
                    .then(function (response) {
                        self.hide_searchdata = false;
                        self.hide_nosearchdata = true;
                        self.shows = response.data;
                    })
                    .catch(function (error) {
                        console.log(error.message);
                    });
            }
        },
        fetch_people: function (query) {
            var self = this;
            self.hide_searchdata = true;
            self.hide_nosearchdata = false;
            if (query) {
                axios.get(self.apiBaseUrlPeople + '?q=' + query)
                    .then(function (response) {
                        self.hide_searchdata = false;
                        self.hide_nosearchdata = true;
                        self.people = response.data;
                    })
                    .catch(function (error) {
                        console.error(error.message);
                    });
            }
        },
        open_detail_page: function (show_id) {
            if (show_id != '' && show_id != undefined) {
                window.location.href = 'detail.html?show=' + show_id;
            }
        }
    }
});

new Vue({
    el: '.searchform',
    methods: {
        perform_search: function (e) {
            e.preventDefault();
            var search_query = e.target.elements.search_val.value;
            if (search_query != '') {
                search_obj.fetch_shows(search_query);
                search_obj.fetch_people(search_query);
            }
            else {
                search_obj.hide_searchdata = true;
                search_obj.hide_nosearchdata = false;
                console.error('Please enter something to search');
            }
        }
    }
});