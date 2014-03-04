
var timeline = "<div id='timeline-line'></div>";
var timelineTopPos = 20; // top start position of the timeline
var marginBottom = 20;   // the margin between each timeline item
var commitsPerEvent = 4; // default number of commits shown in each event
var Months = { Jan:"January", Feb:"February", Mar:"March", Apr:"April", May:"May", Jun:"June", Jul:"July", Aug:"August", Sep:"September", Oct:"October", Nov:"November", Dec:"December" };
var timeRegex = /\w{3} (\w{3}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):[^(]+\(([A-Z]{3})\)/;

function timeStampToString(timestamp) {
	var parseISODate = Date.parse(timestamp.slice(0, timestamp.length - 1));
	return String(new Date(parseISODate)).replace(timeRegex,
		function($0, $1, $2, $3) {
      return Months[$1] + " " + $2 + ", " + $3 // hh:mm EST => "+$4%12+":"+$5+(+$4>12?"PM":"AM")+" "+$6
    }
	)
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
				target_name: group[0].payload.target.name,
				target_login: group[0].payload.target.login,
				target_avatar_url: group[0].payload.target.avatar_url,
				target_url: group[0].payload.target.html_url,
				repo: group[0].repo.name,
				repo_url: "https://github.com/" + group[0].repo.name,
				created_at: timeStampToString(group[0].created_at)										
			};
		case "ForkEvent":
			return {
				type: event_type,
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
				description: group[0].payload.gist.description, // can be empty (Ex: "")
				gist_url: "https://gist.github.com/" + group[0].payload.gist.id,
				created_at: timeStampToString(group[0].created_at)										
			};
		case "GollumEvent":
			return {
				type: event_type,
				page_count: group[0].payload.pages.length,
				page_name: group[0].payload.pages[0].page_name,
				repo: group[0].repo.name,
				repo_url: "https://github.com/" + group[0].repo.name,
				created_at: timeStampToString(group[0].created_at)										
			};
		case "IssueCommentEvent":
			return {
				type: event_type,
				issue: group[0].payload.comment.body,
				issue_url: group[0].payload.issue.html_url,
				repo: group[0].repo.name,
				repo_url: "https://github.com/" + group[0].repo.name,
				created_at: timeStampToString(group[0].created_at)										
			};
		case "IssuesEvent":
			return {
				type: event_type,
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
				event_type_url: group[0].payload.pull_request.html_url,
				repo: group[0].repo.name,
				repo_url: "https://github.com/" + group[0].repo.name,
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
				count: group.length,
				repo: group[0].repo.name,
				repo_url: "https://github.com/" + group[0].repo.name,
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
				avatar_url: group[0].actor.avatar_url,
				login: group[0].actor.login,
				repo: group[0].repo.name,
				repo_url: "https://github.com/" + group[0].repo.name,
				created_at: timeStampToString(group[0].created_at)										
			};
		default: 
			return {
				type: "DefaultEvent",
			};
	}
};

// ------------------------------------------------
// ------------------- Timeline -------------------
// ------------------------------------------------
var Timeline = Backbone.Model.extend({});

var TimelineCollection = Backbone.Collection.extend({
	model: Timeline
});

var TimelineView = Backbone.View.extend({
	tagName: 'li',
	template: function() {
		return _.template( $("#" + this.templateName).html() );
	},
	render: function() {
		this.$el.html( this.template()(this.model.attributes) );
		return this;
	}
});

var CreateEventView  = TimelineView.extend({ templateName: 'create-event' });
var PushEventView    = TimelineView.extend({ templateName: 'push-event' });
var FollowEventView  = TimelineView.extend({ templateName: 'follow-event' });
var ForkEventView    = TimelineView.extend({ templateName: 'fork-event' });
var GistEventView    = TimelineView.extend({ templateName: 'gist-event' });
var GollumEventView  = TimelineView.extend({ templateName: 'gollum-event' });
var IssueCommentEventView = TimelineView.extend({ templateName: 'issue-comment-event' });
var IssuesEventView  = TimelineView.extend({ templateName: 'issues-event' });
var MemberEventView  = TimelineView.extend({ templateName: 'member-event' });
var PullRequestEventView  = TimelineView.extend({ templateName: 'pull-request-event' });
var WatchEventView   = TimelineView.extend({ templateName: 'watch-event' });
var DefaultEventView = TimelineView.extend({ templateName: 'default-event' });

var TimelineListView = Backbone.View.extend({
	el: $('#timeline-container'),
	initialize: function(options) {
		this.collection = options.collection;
		this.render();
	},
	events: {
    'click #more-submit': 'refreshTimeline',
  },
	childrenBottomPosition: function() {
		var leftElements = this.$el.find('.left');
		var rightElements = this.$el.find('.right');

		if (leftElements.length > 0) {
			var lastLeftEl = $(leftElements[leftElements.length - 1]);
			var leftColBottomPos = lastLeftEl.position().top + lastLeftEl.outerHeight();
		} else {
			var leftColBottomPos = timelineTopPos;
			var className = 'left';
		}

		if (rightElements.length > 0) {
			var lastRightEl = $(rightElements[rightElements.length - 1]);
			var rightColBottomPos = lastRightEl.position().top + lastRightEl.outerHeight();
		} else {
			var rightColBottomPos = timelineTopPos;
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
			top:topPos,              // next item starts from here
			left:leftColBottomPos,   // lower left cordinate
			right:rightColBottomPos, // lower right cordinate
			class:className          // left or right
		};
	},
	renderTimelineHeight: function() {
		var pos = this.childrenBottomPosition();
		this.$el.css({ height: Math.max(pos.left, pos.right) });
	},
	refreshTimeline: function(e) {
		$(e.target).text(function(i, text){
      return text === "more" ? "less" : "more";
    });

		var self = this;
  	var children = $(e.delegateTarget).find('>li');
  	this.$el.empty().prepend(timeline);

  	children.css({top:'', left:'', right:''})
  		.removeClass('left').removeClass('right')
  		.removeClass('tooltip-left').removeClass('tooltip-right');

  	children.find('span.square-left').remove();
  	children.find('span.square-right').remove();

  	$($(e.currentTarget.parentElement).find('li')).toggleClass('hidden');
  	$($(e.currentTarget.parentElement).find('li:lt('+commitsPerEvent+')')).removeClass('hidden');

  	_.each(children, function(child) {
  		var specialPos = false;
  		if ($(child).hasClass('create-event')) {
  			specialPos = true;
  			$(child).removeClass('create-event');
  		}
  		self.$el.append($(child));
  		self.renderChildPosition($(child), specialPos);
  	});
  	this.renderTimelineHeight();	
  },
	renderChildPosition: function(child, specialPos) {
		var pos = this.childrenBottomPosition();
		var tooltip = (pos.class=='left') ? ' tooltip-right' : ' tooltip-left';
		var properties = {};

		if (specialPos) {
			properties['top'] = Math.max(pos.left, pos.right) + marginBottom;
			child.addClass('create-event left right');
		} else {
			properties[pos.class] = 0;
			properties['top'] = (pos.left == 0 || pos.right == 0) ? 0 : pos.top + marginBottom;
			child.addClass(pos.class + tooltip)
				.append("<span class='square-" + pos.class + "'></span>");
		}
		child.css(properties);
	},
	renderTimeline: function(group) {
		var viewClasses = {
      "CreateEvent" : CreateEventView,
      "PushEvent"   : PushEventView,
      "FollowEvent" : FollowEventView,
      "ForkEvent"   : ForkEventView,
      "GistEvent"   : GistEventView,
      "GollumEvent" : GollumEventView,
      "IssueCommentEvent": IssueCommentEventView,
      "IssuesEvent" : IssuesEventView,
      "MemberEvent" : MemberEventView,
      "PullRequestEvent" : PullRequestEventView,
      "WatchEvent"  : WatchEventView,
      "DefaultEvent": DefaultEventView
		};
		var timeline_view_class = viewClasses[group.get("type")];
		var timeline_view = new timeline_view_class({ model: group });

		var timelineEl = timeline_view.render().el;
		var specialPos = (timeline_view.model.get('type') == 'CreateEvent') ? true : false;

		if (timeline_view.model.get('type') == 'PushEvent') {
			event_collection = new EventCollection(timeline_view.model.get('events'));
			event_list_view = new EventListView({ collection: event_collection });
			_.each(event_list_view.$el.find('li'), function(li, index) {
				if (index >= 4) $(li).toggleClass('hidden');
				timeline_view.$el.find('ul').append(li);
			});
		}

		this.$el.append( timelineEl );
		this.renderChildPosition($(timeline_view.$el), specialPos);
		return this;
	},
	render: function() {
		var self = this;
		this.$el.empty().prepend(timeline);
		_.each(this.collection.models, function(group) {
			self.renderTimeline(group);
		});
		this.renderTimelineHeight();
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
	initialize: function(options) {
		this.el = $('#events-container');
		this.collection = options.collection;
		this.render();
	},
	renderEvent: function(event) {
		var event_view = new EventView({ model:event });
		this.$el.append( event_view.render().el );
		return this;
	},
	render: function() {
		var self = this;
		this.$el.empty();
		_.each(this.collection.models, function(event) {
			self.renderEvent(event);
		});
	}
});

// ------------------------------------------------
// ----------------- User Events ------------------
// ------------------------------------------------
var UserEvent = Backbone.Model.extend({});

var UserEventCollection = Backbone.Collection.extend({
	initialize: function(models, options) {
		this.url = options.events_url;
	},
	model: UserEvent
});

// ------------------------------------------------
// --------------------- User ---------------------
// ------------------------------------------------
var User = Backbone.Model.extend({
	initialize: function() {
		this.bind("error", this.errorResponce);
		this.url = "https://api.github.com/users/" + this.get('username');
	},
	errorResponce: function(user, xhr) {
		console.log(xhr.status + ": " + xhr.responseText);
		console.dir(xhr);
	},
	getUserEvents: function() {
		var self = this;
		var user_events = new UserEventCollection([], { events_url: this.get('events_url').replace(/{(.*)}/, "") });

		var responses = [];
		for (var i=1; i <= pages; i++) {
			var response = user_events.fetch({ add: true, data: {page: i} });	
			responses.push(response);
		}

		$.when.apply($, responses).done(function() {
			var events = [];
			_.each(responses, function(response) {
				events = events.concat(response.responseJSON);
			});

			var groups = self.createGroupEvents(events);

			var timelines = [];
			_.each(groups, function(group, index) {
				timelines.push(new Timeline(content(group)));
			});
			
			timeline_list_view = new TimelineListView({ collection: new TimelineCollection(timelines) });
		});
	},
	createGroupEvents: function(events) {
		var groups = [[]];
		var index = 0;
		for (var i=1; i < events.length; i++) {
			groups[index].push(events[i-1]);
			if (!(events[i-1].type == 'PushEvent' && events[i].type == 'PushEvent' && 
					timeStampToString(events[i].created_at) == timeStampToString(events[i-1].created_at))) {
				groups.push([]);
				index++;
			}
		}
		groups.pop();
		return groups;
	}
});

var UserCollection = Backbone.Collection.extend({
	model: User
});

var UserView = Backbone.View.extend({
	tagName: 'div',
	template: _.template( $('#user-information').html() ),
	render: function() {
		this.$el.empty();
		this.$el.html( this.template(this.model.attributes) );
		return this;
	}
});

var UserListView = Backbone.View.extend({
	el: $('#user-container'),
	initialize: function(options) {
		this.model = new User({ username: options.username });
		this.model.on('sync', this.render, this);
		this.model.fetch();
	},
	renderUser: function(user) {
		var user_view = new UserView({ model: user });
		this.$el.append( user_view.render().el );
		return this;
	},
	render: function() {
		this.model.getUserEvents();
		this.$el.empty();
		this.renderUser(this.model);
	}
});

// ------------------------------------------------
// ---------------- User Input Form ---------------
// ------------------------------------------------
var UserInputView = Backbone.View.extend({
	initialize: function() {
		this.$el = $('#input-container');
	},
  events: {
    'click #user-submit': 'submitCallBack',
    "keyup #user-name" : "keyPressEventHandler"
  },
  keyPressEventHandler: function(e) {
  	if (e.keyCode == 13) this.$('#user-submit').click();
  },
  submitCallBack: function(event) {
  	event.preventDefault();
  	var username = this.getUserInput();
  	var users_list_view = new UserListView({ username: username });
    this.clearUserInput();
  },
  getUserInput: function() {
    return this.$('#user-name').val();
  },
  clearUserInput: function() {
    this.$('input').val('');
  }
});

var pages = 2;

$(function() {
	new UserInputView;
});

// window.views = {};
// views['PushEvent'] = "<h4>Pushed <%= count %> commit(s) to <a href=\"<%= repo_url %>\"><%= repo %></a></h4>\n<ul id=\"events-container\">\n<% _.each(events, function(event){ %>\n<li><%= event.payload.commits[0].message %></li>\n<% }) %>\n</ul>\n<div><a href=\"#\">more</a></div>\n<span class=\"date\"><%= created_at %></span>";
