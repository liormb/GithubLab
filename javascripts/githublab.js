
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

var eventTypes = [
	"CommitCommentEvent",
	"CreateEvent",
	"DeleteEvent",
	"DeploymentEvent",
	"DeploymentStatusEvent",
	"DownloadEvent",
	"FollowEvent",
	"ForkEvent",
	"ForkApplyEvent",
	"GistEvent",
	"GollumEvent",
	"IssueCommentEvent",
	"IssuesEvent",
	"MemberEvent",
	"PublicEvent",
	"PullRequestEvent",
	"PullRequestReviewCommentEvent",
	"PushEvent",
	"ReleaseEvent",
	"StatusEvent",
	"TeamAddEvent",
	"WatchEvent"
];

function groupEvents(events) {
	var groups = [[]];
	var index = 0;
	for (var i=1; i < events.length; i++) {
		groups[index].push(events[i-1]);
		if (events[i-1].type != events[i].type ||
		    timeStampToString(events[i].created_at) != timeStampToString(events[i-1].created_at)) {
			groups.push([]);
			index++;
		}
	}
	return groups;
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

function groupByEventType(events) {
	var groupsArray = [[]];
	var index = 0;
	
	for (var i=1; i < events.length; i++) {
		groupsArray[index].push(events[i-1]);
		if (events[i-1].type != events[i].type) {
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
				user_events = new UserEventCollection([], { events_url: user.get('events_url').replace(/{(.*)}/, "") }); // public

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

					//user_groups = groupByDate(tempArray);
					user_groups = groupEvents(tempArray);

					timelines = [];
					_.each(user_groups, function(group) {
						content = function() {
							var event_type = group[0].type;
							switch (event_type) {
								case "CommitCommentEvent":
									return {
										type: event_type,

										created_at: timeStampToString(group[0].created_at)										
									};
								case "CreateEvent":
									return {
										type: event_type,
										template: "Created: shamoons/try_git",
										repo: group[0].repo.name,
										repo_url: "https://github.com/" + group[0].repo.name,
										created_at: timeStampToString(group[0].created_at)										
									};
								case "DeploymentEvent":
									return {
										type: event_type,

										created_at: timeStampToString(group[0].created_at)										
									};
								case "DeploymentStatusEvent":
									return {
										type: event_type,

										created_at: timeStampToString(group[0].created_at)										
									};
								case "DownloadEvent":
									return {
										type: event_type,

										created_at: timeStampToString(group[0].created_at)										
									};
								case "FollowEvent":
									return {
										type: event_type,

										created_at: timeStampToString(group[0].created_at)										
									};
								case "ForkEvent":
									return {
										type: event_type,
										template: "Forked shamoons/website from emberjs/website",
										full_name: group[0].payload.forkee.full_name,
										full_name_url: group[0].payload.forkee.html_url,
										repo: group[0].repo.name,
										repo_url: "https://github.com/" + group[0].repo.name,
										description: group[0].payload.forkee.description,
										created_at: timeStampToString(group[0].created_at)
									}
								case "ForkApplyEvent":
									return {
										type: event_type,

										created_at: timeStampToString(group[0].created_at)										
									};
								case "GistEvent":
									return {
										type: event_type,
										template: "Created a gist",
										description: group[0].payload.gist.description, // can be empty (Ex: "")
										gist_url: "https://gist.github.com/" + group[0].payload.gist.id,
										created_at: timeStampToString(group[0].created_at)										
									};
								case "GollumEvent":
									return {
										type: event_type,

										created_at: timeStampToString(group[0].created_at)										
									};
								case "IssueCommentEvent":
									return {
										type: event_type,
										template: "Commented on an issue on linnovate/mean",
										issue: group[0].payload.comment.body,
										issue_url: group[0].payload.issue.html_url,
										repo: group[0].repo.name,
										repo_url: "https://github.com/" + group[0].repo.name,
										created_at: timeStampToString(group[0].created_at)										
									};
								case "IssuesEvent":
									return {
										type: event_type,
										template: "Opened an issue on ppcoin/ppcoin",
										body: group[0].payload.issue.body,
										title: group[0].payload.issue.title,
										repo: group[0].repo.name,
										repo_url: "https://github.com/" + group[0].repo.name,
										created_at: timeStampToString(group[0].created_at)										
									};
								case "MemberEvent":
									return {
										type: event_type,

										created_at: timeStampToString(group[0].created_at)										
									};
								case "PublicEvent":
									return {
										type: event_type,

										created_at: timeStampToString(group[0].created_at)										
									};
								case "PullRequestEvent":
									return {
										type: event_type, //group[0].type.split(/(?=[A-Z])/).slice(0,-1).join(" ")
										template: "Opened a pull request for emberjs/website",
										event_type_url: group[0].payload.pull_request.html_url,
										repo: group[0].repo.name,
										repo_url: group[0].repo.url,
										created_at: timeStampToString(group[0].created_at)
									};
								case "PullRequestReviewCommentEvent":
									return {
										type: event_type,

										created_at: timeStampToString(group[0].created_at)										
									};
								case "PushEvent":
									return {
										type: event_type,
										template: "Pushed 1 commit(s) to shamoons/website",
										count: group.length,
										repo: group[0].repo.name,
										repo_url: group[0].repo.url,
										events: group,
										created_at: timeStampToString(group[0].created_at)
									};
								case "ReleaseEvent":
									return {
										type: event_type,

										created_at: timeStampToString(group[0].created_at)										
									};
								case "StatusEvent":
									return {
										type: event_type,

										created_at: timeStampToString(group[0].created_at)										
									};
								case "TeamAddEvent":
									return {
										type: event_type,

										created_at: timeStampToString(group[0].created_at)										
									};
								case "WatchEvent":
									return {
										type: event_type,

										created_at: timeStampToString(group[0].created_at)										
									};
								default: break;
							}
						}();

						timelines.push(new Timeline(content));
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

// window.views = {};
// views['PushEvent'] = "<h4>Pushed <%= count %> commit(s) to <a href=\"<%= repo_url %>\"><%= repo %></a></h4>\n<ul id=\"events-container\">\n<% _.each(events, function(event){ %>\n<li><%= event.payload.commits[0].message %></li>\n<% }) %>\n</ul>\n<div><a href=\"#\">more</a></div>\n<span class=\"date\"><%= created_at %></span>";

