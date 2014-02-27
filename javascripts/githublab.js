
// ---------------- Commit ----------------
var Commit = Backbone.Model.extend({
	defaults: {
		message: '',
		sha: '',
		url: '',
		author: '',
		repo_name: '',
		repo_url: ''
	},
	initialize: function() {
		console.log("User Event has been created");
	}
});


// -------------- Repository --------------
var Repo = Backbone.Model.extend({
	defaults: {
		id: '',
		name: '',
		url: ''
	},
	initialize: function() {
		console.log("User Event has been created");
	}
});

// ----------------- User -----------------
var User = Backbone.Model.extend({
	defaults: {
		name: '',
		company: '',
		location: '',
		avatar_url: '',
		events_url: '',
		created_at: ''
	},
	initialize: function() {
		console.log("User has been created");
	}
});

var UserCollection = Backbone.Collection.extend({
	url: "/users",
	initialize: function() {
		//this.fetch();
	},
	model: User
});

var UserView = Backbone.View.extend({
	tagName: 'div',
	template: _.template( $('#user-information').html() ),
	render: function() {
		this.$el.html( this.template(this.model.attributes) );
		return this;
	}
});

var UserListView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.collection, 'add', this.renderUser);
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

// --------------- User Input ---------------
var UserFormView = Backbone.View.extend({
  events: {
    'submit': 'submitCallBack'
  },
  submitCallBack: function(event) {
  	event.preventDefault();
    var username = this.getFormData();
    fetchUserFromGithub(username.name);
    this.clearForm();
  },
  getFormData: function() {
    var user_data = { name: this.$('#user-name').val() };
    return user_data;
  },
  clearForm: function() {
    this.$('input').val('');
  }
});

function fetchUserFromGithub(username) {
	$.ajax({
		url: "https://api.github.com/users/" + username,
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			console.log(data);
			var user = new User({
				name: data.name,
				company: data.company,
				location: data.location,
				avatar_url: data.avatar_url,
				events_url: data.events_url.replace(/{(.*)}/, "/public"),
				created_at: data.created_at
			});

			var users = new UserCollection();
			var users_list_view = new UserListView({collection: users, el: $('#user-container')});
			users.add(user);
		},
		error: function(data) {
			console.log("Can not connect to the server");
		}
	});
}

$(function() {
	var users = new UserCollection();
	var user_form = new UserFormView({collection: users, el: $('#user-form')});
});