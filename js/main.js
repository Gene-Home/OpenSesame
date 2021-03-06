// Router
var AppRouter = Backbone.Router.extend({
    JOB_TYPE: 'opensesame-2.1',
    user: new User(),
    userToken :'',
    progressTemplate: _.template($('#tpl-progress').html()),
    routes:{
		"":"showHomePublic",
		"showHome":"showHomePrivate",
       	"jobRuns":"listJobRuns",
		"seriesResults/:wFileID/:resultName":"listSeriesResults",
		"newGeneSig":"newGeneSig",
		"saveGeneSig":"saveGeneSig",
		"newUser":"newUser",
		"login":"login",
		"logout":"logout",
		"sendReset":"sendResetEmail"
    },
    initialize: function () {
		// if user logged on - show side bar
		// and logged in top nav
		var coo = $.cookie("userToken");
		var ucoo = $.cookie("user"); 
		if (coo){
	    	this.userToken = coo;
	    	var tuser = JSON.parse(ucoo);
	    	// since the object stored in the cookie is not 
	    	// a full blown backbone object, we need to create the user
	    	this.user = new User();
	    	this.user.set('username',tuser.username);
	    	this.user.set('password',tuser.password);
	    	// if the user is going to index.html
	    	// show the public view - otherwise show private
	    	var hsh = Backbone.history.location.hash
	    	if(hsh){
				this.setupPagePrivate();
	    	}else{
				this.showHomePublic();
	    	}
		}else {
	    	this.showHomePublic();
		}
		return false;
    },
    showHomePublic:function(){
		this.setupPagePublic();
		$.get("landing.html", function(content){
        	var html = content;
	    	var ma =  $('#main-area');
       	 	ma.html(html);
		});
		return false;
    },
    showHomePrivate:function(){
		this.setupPagePrivate();
		$.get("overview.html", function(content){
            var html = content;
	    	var ma =  $('#main-area');
            $('#main-area').html(html);
		});
		return false;
    },
    setupPagePublic:function(){
		var ma =  $('#main-area');
		// set to 12, this is what a logged out
		// user sees - fill the whole screen
		ma.attr('class','span12');
    },
   setupPagePrivate:function(){
       var ma =  $('#main-area');
       // set to a span of 9, this is what a logged in
       // user sees - to the right of the sidebar
       ma.attr('class','span9');
       var navbar_template =  _.template($('#tpl-navbar-yes-login').html());
       $('#navbar').html(navbar_template(this.user.toJSON()));
       $('#sidebar').show();
   },
    listSeriesResults:function (wFileID,resultName) {
        this.seriesResultList = new SeriesResultCollection();
		// should be able to just make this a workfile contents model -- and set the id
		this.seriesResultList.setFileID(wFileID);
		this.seriesResultList.title = resultName;
		var self = this;
		$('#main-area').html(app.progressTemplate);
        this.seriesResultList.fetch({headers:{'Authorization':'HiveBasic ' + btoa(app.userToken) }}).complete(function() {
	    	self.seriesResultListView = new SeriesResultListView({model:self.seriesResultList});
	    	var srel = self.seriesResultListView.render().el;
        	$('#main-area').html(srel);
	    	$('#main-area').show();
			$("#series-result-table").dataTable({"sScrollY": "500px","bPaginate": false});
		});
		return false;
    },
    listJobRuns:function () {
        this.jobRunList = new JobRunCollection();
		var self = this;
		$('#main-area').html(app.progressTemplate);
        this.jobRunList.fetch({headers:{'Authorization':'HiveBasic ' + btoa(app.userToken) }}).complete(function() {
	    	self.jobRunListView = new JobRunListView({model:self.jobRunList.byJobType('sesame-0.4')});
	    	var jrel = self.jobRunListView.render().el;
        	$('#main-area').html(jrel);
	    	$('#main-area').show();
		});
		return false;
    },
    newGeneSig:function () {
        if (app.workFileView) app.geneSigView.close();
		// the app only has one gene sig at a time
		app.geneSig = new GeneSig();
        app.geneSigView = new GeneSigView({model:app.geneSig});
        $('#main-area').html(app.geneSigView.render().el);
		$('#main-area').show();
		return false;
    },
    saveGeneSig:function(){
		app.geneSigView.saveGeneSig(this.listJobRuns);
		// make sure the url is set to #jobRuns in case the
		// user refreshes the browser
		app.navigate("jobRuns", {trigger: false, replace: true});
		return false;
    },
    newUser:function(){
		// close any other modals
		$(".modal").remove();
		// since this is a modal - we are going to need to reset
		// the url in the browser
		app.navigate("", {trigger: false, replace: true});
		app.user = new User();
		app.newUserView = new UserView({model:app.user});
		app.newUserView.show();
		return false;
    },
    login:function(){
		// close any other modals
		$(".modal").remove();
		app.user = new User();
		app.loginView = new LoginView({model:app.user});
		app.loginView.show();
		return false;
    }, 
    logout:function(){
		$.removeCookie("userToken");
		app.user = new User();
		window.location = 'index.html';
		return false;
    },
    sendResetEmail:function(){
		// close any other modals
		$(".modal").remove();
		// since this is a modal - we are going to need to reset
		// the url in the browser
		app.navigate("", {trigger: false, replace: true});
		// close the other modal
		app.sendResetView = new SendResetView({model:app.user});
		app.sendResetView.show();
		return false;
    }
});

var app = new AppRouter();

// bootstrap nav
$(".nav li").click(function(e) {
    $(".nav li").removeClass("active");
    $(this).addClass("active");
    
});

Backbone.history.start();