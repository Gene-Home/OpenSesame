// Router
var AppRouter = Backbone.Router.extend({
    JOB_TYPE: 'sesame-0.4',
    user: new User(),
    userToken :'',
    progressTemplate: _.template($('#tpl-progress').html()),
    routes:{
	"showHome":"showHome",
        "jobRuns":"listJobRuns",
	"seriesResults/:wFileID/:resultName":"listSeriesResults",
	"newGeneSig":"newGeneSig",
	"saveGeneSig":"saveGeneSig",
	"newUser":"newUser",
	"login":"login",
	"logout":"logout",
	"sendReset":"sendResetEmail",
	"resetPassword/:username/:token":"resetPassword"
    },
    showHome:function(){
	$.get("overview.html", function(content){
            var html = content;
	    var ma =  $('#main-area'); 
            $('#main-area').html(html);
	});
    },
    listSeriesResults:function (wFileID,resultName) {
        this.seriesResultList = new SeriesResultCollection();
	this.seriesResultList.setFileID(wFileID);
	this.seriesResultList.title = resultName;
	var self = this;
	$('#main-area').html(app.progressTemplate);
        this.seriesResultList.fetch({headers:{'Authorization':'HiveBasic ' + btoa(app.userToken) }}).complete(function() {
	    self.seriesResultListView = new SeriesResultListView({model:self.seriesResultList});
	    var srel = self.seriesResultListView.render().el;
            $('#main-area').html(srel);
	    $('#main-area').show();
	});
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
    },
    newGeneSig:function () {
        if (app.workFileView) app.geneSigView.close();
	// the app only has one gene sig at a time
	app.geneSig = new GeneSig();
        app.geneSigView = new GeneSigView({model:app.geneSig});
        $('#main-area').html(app.geneSigView.render().el);
	$('#main-area').show();
    },
    saveGeneSig:function(){
	app.geneSigView.saveGeneSig(this.listJobRuns);
    },
    newUser:function(){
	app.user = new User();
	app.newUserView = new UserView({model:app.user});
	app.newUserView.show();
    },
    login:function(){
	app.user = new User();
	app.loginView = new LoginView({model:app.user});
	app.loginView.show();
	$('#logos').hide();
	return false;
    }, 
    logout:function(){
	app.user = new User();
	var eeee = 21;
	window.location = 'index.html'
    },
    sendResetEmail:function(){
	app.sendResetView = new SendResetView({model:app.user});
	app.sendResetView.show();
    },
    resetPassword:function(username,token){
	var self = this;
	app.user = new User();
	app.user.set("username",username);
	app.user.set("token",token);
	app.resetPasswordView = new ResetPasswordView({model:app.user});
	$('#logos').hide();
	$('#main-area').html(self.resetPasswordView.render().el);

    }
    

   
});
var app = new AppRouter();
// bootstrap nav
$(".nav li").click(function(e) {
    $(".nav li").removeClass("active");
    $(this).addClass("active");
    
});
Backbone.history.start();