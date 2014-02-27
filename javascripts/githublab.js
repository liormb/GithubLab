
// ---------------- Events ----------------
var Event = Backbone.Model.extend({
	initialize: function() {
		console.log("User Event has been created");
	}
});

var EventCollection = Backbone.Model.extend({
	initialize: function() {
		console.log("Events are added to collection");
		this.url = this.get('url');
		this.fetch({
			success: this.addEvents
		});
	},
	addEvents: function() {
		console.log(this);
	},
	model: Event
});

var EventView = Backbone.View.extend({

});

var EventListView = Backbone.View.extend({
	initialize: function() {
		this.collection = new EventCollection(params);
		this.collection.fetch();
		this.render();
	},
	render: function() {
	}
});


// -------------- Repository --------------
var Repo = Backbone.Model.extend({
	initialize: function() {
		console.log("User Event has been created");
	}
});

// ----------------- User -----------------
var User = Backbone.Model.extend({
	initialize: function() {
		var self = this;
		this.url = "https://api.github.com/users/" + this.get('username');
		this.fetch({
			success: function() {
				events = new EventCollection({ url: self.get('events_url').replace(/{(.*)}/, "/public") });
				//var events_list_view = new EventListView({collection: events, el: $('#timeline-container')});
			}
		});
	}
});

var UserCollection = Backbone.Collection.extend({
	initialize: function() {
		console.log("user is added to collection");
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

// ------------- User Input Form -------------
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

var user, users, events;

$(function() {
	users = new UserCollection;
	var users_list_view = new UserListView({collection: users, el: $('#user-container')});
	var user_form = new UserFormView({collection: users, el: $('#user-form')});
});