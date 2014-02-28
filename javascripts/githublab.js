
Months = { Jan:"January", Feb:"February", Mar:"March", Apr:"April", May:"May", Jun:"June", Jul:"July", Aug:"August", Sep:"September", Oct:"October", Nov:"November", Dec:"December" };
timeRegex = /\w{3} (\w{3}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):[^(]+\(([A-Z]{3})\)/;

function timeStampToString(timestamp) {
	var parseISODate = Date.parse(timestamp.slice(0, timestamp.length - 1));
	return String(new Date(parseISODate)).replace(timeRegex,
		function($0, $1, $2, $3) {
      return Months[$1] + " " + $2 + ", " + $3 // hh:mm EST => "+$4%12+":"+$5+(+$4>12?"PM":"AM")+" "+$6
    }
	)
}

// --------------------------------------------
// ---------------- Repository ----------------
// --------------------------------------------
var Repo = Backbone.Model.extend({
	initialize: function() {
		console.log("User Repository has been created");
	}
});

// --------------------------------------------
// ------------------ Events ------------------
// --------------------------------------------
var Event = Backbone.Model.extend({
	initialize: function() {
		console.log("User Event has been created");
	}
});

var EventCollection = Backbone.Collection.extend({
	initialize: function(models, options) {
		var self = this;
		// for (var i=1; i <= 30; i++) {
		// 	this.url = options.events_url + "?page=" + i;
		// 	this.fetch({
		// 		success: self.groupByDate
		//  });
		// }
		this.url = options.events_url + "?page=1";
		this.fetch({
			success: self.groupByDate
		});
	},
	groupByDate: function(data) {
		groups = [[]];
		var commits = data.models;
		var index = 0;
		for (var i=1; i < commits.length; i++) {
			groups[index].push(commits[i-1]);
			if (timeStampToString(commits[i].attributes.created_at) != 
				  timeStampToString(commits[i-1].attributes.created_at)) {
				groups.push([]);
				index++;
			}
		}
	},
	model: Event
});

var EventView = Backbone.View.extend({
	tagName: 'li',
	template: _.template( $('#timeline-item').html() ),
	render: function() {
		this.$el.empty()

		switch(this.model.attributes.type) {
			case "PushEvent"  : this.$el.html( this.template(this.model.attributes) ); break;
			case "CreateEvent": break;
		}
		return this;
	}
});

var EventListView = Backbone.View.extend({
	initialize: function(options) {
		this.listenTo(this.collection, 'add', this.render);
	},
	renderEvent: function(event_instance) {
		var event_view = new EventView({ model:event_instance });
		this.$el.prepend( event_view.render().el );
		return this;
	},
	render: function() {
		this.$el.empty();
		var self = this;
		_.each(this.collection.models, function(event_instance) {	
			self.renderEvent(event_instance);
		});
	}
});

// --------------------------------------------
// ------------------- User -------------------
// --------------------------------------------
var User = Backbone.Model.extend({
	initialize: function() {
		this.url = "https://api.github.com/users/" + this.get('username');
		this.fetch({
			success: function(user) {
				events = new EventCollection([], { events_url: user.get('events_url').replace(/{(.*)}/, "/public") });
				var event_list_view = new EventListView({ collection: events, el: $('#timeline-container') });
			}
		});
	}
});

var UserCollection = Backbone.Collection.extend({
	initialize: function() {
		console.log("user collection was created");
	},
	model: User
});

var UserView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.model, 'all', this.render);
	},
	tagName: 'div',
	template: _.template( $('#user-information').html() ),
	render: function() {
		this.$el.empty()
		if (this.model.get('name')) this.$el.html( this.template(this.model.attributes) );
		return this;
	}
});

var UserListView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.collection, 'add', this.render);
	},
	renderUser: function(user_instance) {
		var user_view = new UserView({ model:user_instance });
		this.$el.prepend( user_view.render().el );
		return this;
	},
	render: function() {
		this.$el.empty();
		var self = this;
		_.each(this.collection.models, function(user) {	
			self.renderUser(user);
		});
	}
});

// --------------------------------------------
// -------------- User Input Form -------------
// --------------------------------------------
var UserFormView = Backbone.View.extend({
  events: {
    'submit': 'submitCallBack'
  },
  submitCallBack: function(event) {
  	event.preventDefault();
    var username = this.getFormData();
    user = new User({username: username});
    this.collection.add( user );
    this.clearForm();
  },
  getFormData: function() {
    return this.$('#user-name').val();
  },
  clearForm: function() {
    this.$('input').val('');
  }
});

var user, users, events, groups;

$(function() {
	users = new UserCollection;
	var users_list_view = new UserListView({ collection: users, el: $('#user-container') });
	var user_form = new UserFormView({collection: users, el: $('#user-form')});
});