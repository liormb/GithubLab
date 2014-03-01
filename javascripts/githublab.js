
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

function groupByDate(commits) {
	var groupsArray = [[]];
	var index = 0;
	for (var i=1; i < commits.length; i++) {
		if (commits[i-1].type == "PushEvent")
			groupsArray[index].push(commits[i-1]);
		if (timeStampToString(commits[i].created_at) != timeStampToString(commits[i-1].created_at)) {
			groupsArray.push([]);
			index++;
		}
	}
	return groupsArray;
}

// ------------------------------------------------
// ------------------ Repository ------------------
// ------------------------------------------------
var Repo = Backbone.Model.extend({
	initialize: function() {
		//console.log("User Repository has been created");
	}
});

// ------------------------------------------------
// -------------------- Event ---------------------
// ------------------------------------------------
var Event = Backbone.Model.extend({});

var EventCollection = Backbone.Collection.extend({
	model: Event
});

var EventView = Backbone.View.extend({
	tagName: 'li',
	template: _.template( $('#event-item').html() ),
	render: function() {
		this.$el.html( this.template(this.model.attributes) );
		return this;
	}
});

var EventListView = Backbone.View.extend({
	renderEvent: function(event) {
		var event_view = new EventView({ model:event });
		this.$el.prepend( event_view.render().el );
		return this;
	},
	render: function() {
		var self = this;
		_.each(this.collection.models, function(event) {
			self.renderEvent(event);
		});
	}
});

// ------------------------------------------------
// ------------------- Timeline -------------------
// ------------------------------------------------
var Timeline = Backbone.Model.extend({});

var TimelineCollection = Backbone.Collection.extend({
	model: Timeline
});

var TimelineView = Backbone.View.extend({
	tagName: 'li',
	template: _.template( $('#timeline-item').html() ),
	render: function() {
		this.$el.html( this.template(this.model.attributes) );
		return this;
	}
});

var TimelineListView = Backbone.View.extend({
	initialize: function(options) {
		this.collection = options.collection;
	},
	renderTimeline: function(group) {
		var timeline_view = new TimelineView({ model:group });
		this.$el.append( timeline_view.render().el );
		return this;
	},
	render: function() {
		var self = this;
		_.each(this.collection.models, function(group) {
			self.renderTimeline(group);
		});
	}
});

// ------------------------------------------------
// ----------------- User Events ------------------
// ------------------------------------------------
var UserEvent = Backbone.Model.extend({});

var UserEventCollection = Backbone.Collection.extend({
	initialize: function(models, options) {
		if (options) this.url = options.events_url;
	},
	groupByDate: function(commits) {
		var groupsArray = [[]];
		var index = 0;
		for (var i=1; i < commits.length; i++) {
			groupsArray[index].push(commits[i-1]);
			if (timeStampToString(commits[i].attributes.created_at) != 
				  timeStampToString(commits[i-1].attributes.created_at)) {
				groupsArray.push([]);
				index++;
			}
		}
		return groupsArray;
	},
	model: UserEvent
});

// ------------------------------------------------
// --------------------- User ---------------------
// ------------------------------------------------
var User = Backbone.Model.extend({
	initialize: function() {
		this.url = "https://api.github.com/users/" + this.get('username');
		this.fetch({
			success: function(user) {
				var responseArray = [];
				user_events = new UserEventCollection([], { events_url: user.get('events_url').replace(/{(.*)}/, "/public") });

				console.log('Loading...');
				
				for (var i=1; i <= 2; i++) {
					var response = user_events.fetch({ add: true, data: {page: i} });	
					responseArray.push(response);
				}

				$.when.apply($, responseArray).done(function() {

					tempArray = [];
					_.each(responseArray, function(response) {
						tempArray = tempArray.concat(response.responseJSON);
					});

					user_groups = groupByDate(tempArray);
	
					timelines = [];
					_.each(user_groups, function(group) {
						var timeline_item = new Timeline({
							events_count: group.length,
							repo: group[0].repo.name,
							repo_url: group[0].repo.url,
							events: group,
							date: timeStampToString(group[0].created_at)
						});
						timelines.push(timeline_item);
					});
					
					timeline_list_view = new TimelineListView({ collection: new TimelineCollection(timelines), el: $('#timeline-container') });
					timeline_list_view.render();
				});
			}
		});
	}
});

var UserCollection = Backbone.Collection.extend({
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

// ------------------------------------------------
// ---------------- User Input Form ---------------
// ------------------------------------------------
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
var user_events, user_groups; 
var event_list_view, tempArray;

$(function() {
	users = new UserCollection;
	var users_list_view = new UserListView({ collection: users, el: $('#user-container') });
	var user_form = new UserFormView({collection: users, el: $('#user-form')});
});
