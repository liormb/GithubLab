
var $timeline = "<div id='timeline-line'></div>"; // the timeline vertical element
var pages = 2;           // number of pages returning from Github API per user
var timelineTopPos = 20; // top start position of the timeline
var marginBottom = 20;   // the margin between each timeline item
var commitsPerEvent = 4; // default number of commits shown in each event
var Months = { Jan:"January", Feb:"February", Mar:"March", Apr:"April", May:"May", Jun:"June", Jul:"July", Aug:"August", Sep:"September", Oct:"October", Nov:"November", Dec:"December" };
var timeRegex = /\w{3} (\w{3}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):[^(]+\(([A-Z]{3})\)/;

/* taking a timestamp and returning a readable date: Ex. "March 03, 2014" */
function timeStampToString(timestamp) {
	var parseISODate = Date.parse(timestamp.slice(0, timestamp.length - 1));
	return String(new Date(parseISODate)).replace(timeRegex,
		function($0, $1, $2, $3) {
      return Months[$1] + " " + $2 + ", " + $3;
    }
	)
}

/* returning an timeline template for building the timeline model */
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
// ------------------- Commits --------------------
// ------------------------------------------------

/* github commit model */
var Commit = Backbone.Model.extend({});

/* list of all user's commits on one day */
var CommitCollection = Backbone.Collection.extend({
	model: Commit
});

/* returning a commit template */
var CommitView = Backbone.View.extend({
	tagName: 'li',
	template: _.template( $('#commit-item').html() ),
	render: function() {
		this.$el.html( this.template(this.model.attributes) );
		return this;
	}
});

/* rendering the ul#commits-container in the PushEvent timeline item */
var CommitListView = Backbone.View.extend({
	initialize: function(options) {
		this.el = $('#commits-container');
		this.collection = options.collection;
		this.render();
	},
	renderCommit: function(commit) {
		var commit_view = new CommitView({ model:commit });
		this.$el.append( commit_view.render().el );
		return this;
	},
	render: function() {
		var self = this;
		this.$el.empty();
		_.each(this.collection.models, function(commit) {
			self.renderCommit(commit);
		});
	}
});

// ------------------------------------------------
// ------------------- Timeline -------------------
// ------------------------------------------------

/* a timeline model: containing a group of events */
var Timeline = Backbone.Model.extend({});

/* set of timeline list */
var TimelineCollection = Backbone.Collection.extend({
	model: Timeline
});

/* setting the specific timeline template */
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

/* assigning the right template to the right event */
var CreateEventView= TimelineView.extend({ templateName: 'create-event' }),
	PushEventView    = TimelineView.extend({ templateName: 'push-event' }),
 	FollowEventView  = TimelineView.extend({ templateName: 'follow-event' }),
 	ForkEventView    = TimelineView.extend({ templateName: 'fork-event' }),
 	GistEventView    = TimelineView.extend({ templateName: 'gist-event' }),
 	GollumEventView  = TimelineView.extend({ templateName: 'gollum-event' }),
 	IssueCommentEventView = TimelineView.extend({ templateName: 'issue-comment-event' }),
 	IssuesEventView  = TimelineView.extend({ templateName: 'issues-event' }),
 	MemberEventView  = TimelineView.extend({ templateName: 'member-event' }),
 	PullRequestEventView  = TimelineView.extend({ templateName: 'pull-request-event' }),
 	WatchEventView   = TimelineView.extend({ templateName: 'watch-event' }),
 	DefaultEventView = TimelineView.extend({ templateName: 'default-event' });

/* rendering the view with all event on a single timeline */
var TimelineListView = Backbone.View.extend({
	el: $('#timeline-container'),
	initialize: function(options) {
		this.collection = options.collection;
		this.render(); /* auto rendering on every call */
	},
	events: {
    'click #more-submit': 'refreshTimeline',
  },
	childrenBottomPosition: function() {
		/* retriving positions of children's items */
		var leftElements = this.$el.find('.left');
		var rightElements = this.$el.find('.right');

		if (leftElements.length > 0) {
			var $lastLeftEl = $(leftElements[leftElements.length - 1]);
			var leftColBottomPos = $lastLeftEl.position().top + $lastLeftEl.outerHeight();
		} else {
			var leftColBottomPos = timelineTopPos;
			var className = 'left';
		}

		if (rightElements.length > 0) {
			var $lastRightEl = $(rightElements[rightElements.length - 1]);
			var rightColBottomPos = $lastRightEl.position().top + $lastRightEl.outerHeight();
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
		/* setting the timeline height according to its content */
		var pos = this.childrenBottomPosition();
		this.$el.css({ height: Math.max(pos.left, pos.right) });
	},
	refreshTimeline: function(e) {
		/* refreshing the timeline by clearing and rebuilding it */
		$(e.target).text(function(i, text){
      return text === "more" ? "less" : "more";
    });

		var self = this;
  	var children = $(e.delegateTarget).find('>li');
  	this.$el.empty().prepend($timeline); /* appending the timeline itself */

  	/* clearing and removing old classes and timeline squares */
  	children.css({top:'', left:'', right:''})
  		.removeClass('left').removeClass('right')
  		.removeClass('tooltip-left').removeClass('tooltip-right');

  	children.find('span.square-left').remove();
  	children.find('span.square-right').remove();

  	/* toggling item's hidden class and making sure that at least few of them visiable */
  	$( $(e.currentTarget.parentElement).find('li') ).toggleClass('hidden');
  	$( $(e.currentTarget.parentElement).find('li:lt('+commitsPerEvent+')') ).removeClass('hidden');

  	_.each(children, function(child) {
  		var specialPos = false;
  		if ($(child).hasClass('create-event')) { /* handling special events */
  			specialPos = true;
  			$(child).removeClass('create-event');
  		}
  		self.$el.append($(child));
  		self.renderChildPosition($(child), specialPos);
  	});
  	this.renderTimelineHeight();	
  },
	renderChildPosition: function($child, specialPos) {
		/* setting every timeline item position */
		var pos = this.childrenBottomPosition();
		var tooltip = (pos.class=='left') ? ' tooltip-right' : ' tooltip-left';
		var properties = {};

		if (specialPos) {
			properties['top'] = Math.max(pos.left, pos.right) + marginBottom;
			$child.addClass('create-event left right');
		} else {
			properties[pos.class] = 0;
			properties['top'] = (pos.left == 0 || pos.right == 0) ? 0 : pos.top + marginBottom;
			$child.addClass(pos.class + tooltip)
				.append("<span class='square-" + pos.class + "'></span>");
		}
		$child.css(properties);
	},
	renderTimeline: function(group) {
		/* setting which template to use for each event */
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
		var timeline_view_class = viewClasses[ group.get("type") ];
		var timeline_view = new timeline_view_class({ model: group });

		var timelineEl = timeline_view.render().el;
		var specialPos = (timeline_view.model.get('type') == 'CreateEvent') ? true : false;

		if (timeline_view.model.get('type') == 'PushEvent') {
			event_collection = new CommitCollection( timeline_view.model.get('events') );
			event_list_view = new CommitListView({ collection: event_collection });
			_.each(event_list_view.$el.find('li'), function(li, index) {
				if (index >= 4) $(li).toggleClass('hidden');
				timeline_view.$el.find('ul').append(li);
			});
		}
		/* append a timeline event to main timeline! */
		this.$el.append( timelineEl );
		this.renderChildPosition($(timeline_view.$el), specialPos);
		return this;
	},
	render: function() {
		var self = this;
		this.$el.empty().prepend($timeline);
		_.each(this.collection.models, function(group) {
			self.renderTimeline(group);
		});
		this.renderTimelineHeight(); /* setting the timeline height */
	}
});

// ------------------------------------------------
// ------------------ Responces -------------------
// ------------------------------------------------

/* responce model */
var Responce = Backbone.Model.extend({});

/* list of all responces from Github API */
var ResponceCollection = Backbone.Collection.extend({
	initialize: function(models, options) {
		this.url = options.events_url;
	},
	model: Responce
});

// ------------------------------------------------
// --------------------- User ---------------------
// ------------------------------------------------

/* user model */
var User = Backbone.Model.extend({
	initialize: function() {
		this.url = "https://api.github.com/users/" + this.get('username');
		this.bind("error", this.errorResponce); /* on error */
	},
	errorResponce: function(user, xhr) {
		/* handle user or server errors */
		console.log(xhr.status + ": " + xhr.responseText);
		console.dir(xhr);
	},
	getUserEvents: function() {
		/* fetching user github's events from Github API */ 
		var self = this;
		var user_events = new ResponceCollection([], { events_url: this.get('events_url').replace(/{(.*)}/, "") });

		var responses = [];
		for (var i=1; i <= pages; i++) {
			var response = user_events.fetch({ add: true, data: {page: i} });	
			responses.push(response);
		}

		/* upon user event's success event orginize events in groups and */
		/* pass it to the TimelineListView for presenting it on screen.  */
		$.when.apply($, responses).done(function() {
			/* pulling all events from responces */
			var events = [];
			_.each(responses, function(response) {
				events = events.concat(response.responseJSON);
			});
			/* making groups */
			var groups = self.createGroupEvents(events);

			/* bulding a list of timeline models from groups  */
			var timelines = [];
			_.each(groups, function(group, index) {
				timelines.push(new Timeline(content(group)));
			});
			/***** passing the action (list) to TimelineListView *****/
			timeline_list_view = new TimelineListView({ collection: new TimelineCollection(timelines) });
		});
	},
	createGroupEvents: function(events) {
		/* groups are created upon different events or by pushing on the same day */
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

/* users list */
var UserCollection = Backbone.Collection.extend({
	model: User
});

/* returning a user template */
var UserView = Backbone.View.extend({
	tagName: 'div',
	template: _.template( $('#user-information').html() ),
	render: function() {
		this.$el.empty();
		this.$el.html( this.template(this.model.attributes) );
		return this;
	}
});

/* showing all users on screen */
/* this vertion currently contain one user per page */
var UserListView = Backbone.View.extend({
	el: $('#user-container'),
	initialize: function(options) {
		this.model = new User({ username: options.username });
		this.model.on('sync', this.render, this); /* on successful fetching goto render */
		this.model.fetch();
	},
	renderUser: function(user) {
		var user_view = new UserView({ model: user });
		this.$el.append( user_view.render().el );
		return this;
	},
	render: function() {
		/* getting all user's events from model (and printing them) */
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
  	// submitting also by [ENTER] keypress
  	if (e.keyCode == 13) this.$('#user-submit').click();
  },
  submitCallBack: function(event) {
  	event.preventDefault();
  	var username = this.getUserInput();

  	/***** passing the action to UserListView *****/
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

/* let's start playing... */
$(function() {
	new UserInputView;
});
