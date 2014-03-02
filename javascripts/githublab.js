
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

var content = function(group) {
	var event_type = (group != []) ? group[0].type : "";
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
				template: "Updated 1 page(s) for aaronwolfe/Big-A-Miner-Thing",
				page_count: group[0].payload.pages.length,
				page_name: group[0].payload.pages[0].page_name,
				repo: group[0].repo.name,
				repo_url: "https://github.com/" + group[0].repo.name,
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
				issue_url: group[0].payload.issue.html_url,
				body: group[0].payload.issue.body,
				title: group[0].payload.issue.title,
				repo: group[0].repo.name,
				repo_url: "https://github.com/" + group[0].repo.name,
				created_at: timeStampToString(group[0].created_at)										
			};
		case "MemberEvent":
			return {
				type: event_type,
				template: "Added as a collaborator to ppcoin/ppcoin",
				repo: group[0].repo.name,
				repo_url: "https://github.com/" + group[0].repo.name,
				created_at: timeStampToString(group[0].created_at)										
			};
		case "PublicEvent":
			return {
				type: event_type,

				created_at: timeStampToString(group[0].created_at)										
			};
		case "PullRequestEvent":
			return {
				type: event_type,
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
};

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
	el: $('#timeline-container'),
	initialize: function(options) {
		this.collection = options.collection;
	},
	childrenBottomPosition: function() {
		var leftElements = this.$el.find('.left');
		var rightElements = this.$el.find('.right');

		if (leftElements.length > 0) {
			var lastLeftEl = $(leftElements[leftElements.length - 1]);
			var leftColBottomPos = lastLeftEl.position().top + lastLeftEl.outerHeight();
		} else {
			var leftColBottomPos = 0;
			var className = 'left';
		}

		if (rightElements.length > 0) {
			var lastRightEl = $(rightElements[rightElements.length - 1]);
			var rightColBottomPos = lastRightEl.position().top + lastRightEl.outerHeight();
		} else {
			var rightColBottomPos = 0;
			var className = 'right';
		}

		if (leftColBottomPos <= rightColBottomPos) {
			var topPos = leftColBottomPos;
			if (className == undefined) var className = 'left';
		} else {
			var topPos = rightColBottomPos;
			if (className == undefined) var className = 'right';
		}

		return {
			top:topPos,
			left:leftColBottomPos,
			right:rightColBottomPos,
			class:className
		};
	},
	renderTimelineHeight: function() {
		var pos = this.childrenBottomPosition();
		this.$el.css({ height: Math.max(pos.left, pos.right) });
	},
	renderChildPosition: function(child) {
		var pos = this.childrenBottomPosition();
		var marginBottom = 20;
		var properties = {};

		properties[pos.class] = 0;
		properties['top'] = (pos.left == 0 || pos.right == 0) ? 0 : pos.top + marginBottom;

		child.css(properties);
		child.attr({'class': pos.class});
	},
	renderTimeline: function(group) {
		var timeline_view = new TimelineView({ model:group });
		this.$el.append( timeline_view.render().el );
		this.renderChildPosition($(timeline_view.$el));
		return this;
	},
	render: function() {
		var self = this;
		_.each(this.collection.models, function(group) {
			self.renderTimeline(group);
		});
		this.renderTimelineHeight();
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
		var self = this;
		this.url = "https://api.github.com/users/" + this.get('username');
		this.fetch({
			success: function(data) {
				var responseArray = [];
				user_events = new UserEventCollection([], { events_url: data.get('events_url').replace(/{(.*)}/, "") }); // public
				for (var i=1; i <= 2; i++) {
					var response = user_events.fetch({ add: true, data: {page: i} });	
					responseArray.push(response);
				}
				$.when.apply($, responseArray).done(function() { self.getUserEvents(responseArray); });
			}
		});
	},
	getUserEvents: function(responseArray) {
		tempArray = [];
		_.each(responseArray, function(response) {
			tempArray = tempArray.concat(response.responseJSON);
		});

		user_groups = groupEvents(tempArray);
		user_groups.pop();

		timelines = [];
		_.each(user_groups, function(group, index) {
			timelines.push(new Timeline(content(group)));
		});
		
		timeline_list_view = new TimelineListView({ collection: new TimelineCollection(timelines) });
		timeline_list_view.render();
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
		if (this.model.get('name')) 
			this.$el.html( this.template(this.model.attributes) );
		return this;
	}
});

var UserListView = Backbone.View.extend({
	el: $('#user-container'),
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
	el: $('#user-form'),
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
	var users_list_view = new UserListView({ collection: users });
	var user_form = new UserFormView({ collection: users });
});

// window.views = {};
// views['PushEvent'] = "<h4>Pushed <%= count %> commit(s) to <a href=\"<%= repo_url %>\"><%= repo %></a></h4>\n<ul id=\"events-container\">\n<% _.each(events, function(event){ %>\n<li><%= event.payload.commits[0].message %></li>\n<% }) %>\n</ul>\n<div><a href=\"#\">more</a></div>\n<span class=\"date\"><%= created_at %></span>";

