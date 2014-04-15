window.SeriesResultListView = Backbone.View.extend({
    template: _.template($('#tpl-seriesResult-table').html()),
     events:{
        "click #bySeriesID":"bySeriesID",
	 "click #bySeriesTitle":"bySeriesTitle",
	 "click #byKSp":"byKSp",
	 "click #byKSq":"byKSq",
	 "click #byFisherp":"byFisherp",
	 "click #byFisherq":"byFisherq"
    },
    bySeriesID:function(){
	this.model.sortByField("Series ID");
	return this.render();
    },
    bySeriesTitle:function(){
	this.model.sortByField("Series Title");
	return this.render();
    },
    byKSp:function(){
	this.model.sortByField("KS p");
	return this.render();
    },
    byKSq:function(){
	this.model.sortByField("KS q");
	return this.render();
    },
    byFisherp:function(){
	this.model.sortByField("Fisher p");
	return this.render();
    },
    byFisherq:function(){
	this.model.sortByField("Fisher q");
	return this.render();
    },
    render:function (eventName) {
	
	var mjson = this.model.toJSON();
	var thtml = this.template({resArray : mjson,title:this.model.title})
	$(this.el).html(thtml);
	return this;
    }
});

window.JobRunListView = Backbone.View.extend({
    self:this,
    template: _.template($('#tpl-jobRun-table').html()),
    events:{
        "click #deleteJobs":"bulkDelete",
	"click .deleteJob" : "deleteJobRun"
    },
    initialize:function () {
        this.model.bind("reset", this.render, this);
    },
    render:function (eventName) {
	$(this.el).html(this.template());
        _.each(this.model.models, function (jobRun) {
	    
	    lv = new JobRunListItemView({model:jobRun}).render().el;
	    $(this.el).find('tbody').append(lv);
        },this);
        return this;
    },
    deleteJobRun:function(event){
		var self = this;
		var buttonId = event.target.id;
		if (confirm("Are You Sure") == false){
	    	return false;
		};
		// get the ID from the right part of the button ID
		var jrId = buttonId.split("_")[1];
		var jr = this.model.get(jrId);
		this.model.remove(jr);
		jr.set('trashed',true);
		var saveSuccess = function(){
	    	var row_id = '#job_run_row_' + jrId;  
	    	$(row_id).toggle('highlight');
            	return self;
		}
		jr.save({},{success:saveSuccess,headers:{'Authorization':'HiveBasic ' + btoa(app.userToken) }});
	
    },
    bulkDelete:function (){
	_.each(this.model.models, function(jobRun){
	    var cbId = '#jobRun_' + jobRun.get('id');
	    // check the DOM for selected for delete
	    var cb = $(cbId);
	    var isChecked = cb.is(":checked");
	    if(isChecked){
		jobRun.set('trashed',true);
		jobRun.save({},{headers:{'Authorization':'HiveBasic ' + btoa(app.userToken) }});
		var fff = 43;
		//delete
	    }
	},this);
    },
   
    
});
window.JobRunListItemView = Backbone.View.extend({
    // not sure how much i like forcing this to be wrapped 
    // in 'tr' inside the view code .. but othewise
    // it will wrap it in a 'div' tag - cant have that!
    tagName:'tr',
    className: function(){
	var status = this.model.get('status'); 
	if(  status == 'COMPLETE'){
	    return 'success';
	}
	if( status  == 'PENDING'){
	    return 'warning';
	}
	if( status == 'RUNNING'){
	    return 'info';
	}
	if( status == 'ABORTED' || status == 'FAILED' ){
	    return 'error';
	}
	
    },
    id: function(){
	return 'job_run_row_' + this.model.get('id');
    },
    template: _.template($('#tpl-jobRun-row').html()),
    render:function (eventName) {
	
	
	mjson = this.model.toJSON();
	thtml = this.template(mjson)
	$(this.el).html(thtml);
	return this;
    }



});

window.LoginView = Backbone.View.extend({
    template: _.template($('#tpl-login').html()),
    error_template: _.template($('#tpl-login-error').html()),
    events:{
	"submit": "login",
        "click #login":"login",
	'click #close': 'close',
	'click #closeUp': 'close',
    },// render the pop up for the login
    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    // get rid of show and rely on render
    show: function(){
	$(document.body).append(this.render().el); 
    },
    // 
    close: function() {
	// since this is a modal - we are going to need to reset
	// the url in the browser
	app.navigate("", {trigger: false, replace: true});
        this.remove();
	return true;
    },
    login: function(){
	var self = this;
	// move this to the main app 
	var fetchSuccess = function(){
	    // user is logged in
	    // set the token in the cookie to expire in a day
	    $.cookie("userToken",app.userToken,{expires : 1});
	    $.cookie("user",JSON.stringify(app.user),{expires : 1});
	    //$('#navbar').html(self.navbar_template(app.user.toJSON()));
	    //$('#sidebar').show();
	    app.showHomePrivate();
	    // naviate to home incase the user refreshes
	    app.navigate("showHome", {trigger: false, replace: true});
	    self.remove();
	    return false;
	    // render the logged in nav bar
	    
	};
	var fetchError = function(){
	    // bad username password combo
	    $(document.body).append( $(self.el).html(self.error_template()));
	    // also reset the browser url
	    app.navigate("", {trigger: false, replace: true});
	    return false;
	};
	app.user = new User();
	app.user.set('username',$('#username').val());
	app.user.set('password',$('#password').val());
	app.userToken = app.user.get('username').concat(":", app.user.get('password'));
	app.user.fetch({success:fetchSuccess,error:fetchError,headers:{'Authorization':'HiveBasic ' + btoa(app.userToken) }});
    }
    
});


// for users signing up

window.UserView = Backbone.View.extend({
    
    template: _.template($('#tpl-signup').html()),
    error_template: _.template($('#tpl-signup-error').html()),
    success_template: _.template($('#tpl-signup-success').html()),
    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },events:{
        "click #saveNewUser":"saveNewUser",
		'click #close': 'close',
		'click #closeUp': 'close',
		'newUser':'newUser'
	
    },
    newUser:function(){
    },
    resetPassword:function(){
		this.model.set('email',$('#email').val());
		this.model.resetPassword();
    },
    show: function(){
		$(document.body).append(this.render().el); 
    },
    saveNewUser:function(){
		// check right away for matching password
		if( $('#newPassword').val() != $('#newPasswordRetype').val()){
	    	$("#sign-up-message").html("<div class='alert alert-error'>Passwords do not match.</div>");
	    	return false;
		};
		this.model = new User();
		var user = this.model;
		var self = this;
		var saveError =  function(model,xhr,opts){
	    	var errorMsg = new Object();
	    	errorMsg.error_message = xhr.responseText;
	    	$(document.body).append( $(self.el).html(self.error_template(errorMsg)));
	   
		};
		var saveSuccess = function(model,resp,opts){
	    	model.set('myNewFlag',false);
	    	$(document.body).append( $(self.el).html(self.success_template(user.toJSON())));
		};
		this.model.set('username',$('#newUserName').val());
		this.model.set('email',$('#newEmail').val());
		this.model.set('password',$('#newPassword').val());
		// make sure that the newFlag is set to true
		// we can set it to false after saving
		this.model.set('myNewFlag',true);
		// no need for a token on a new user save
		this.model.save({},{success:saveSuccess,error:saveError});
		// TODO - set the top bar to the current username and make sure its sent with the
		// subsequent parameters
    },
    close: function() {
        this.remove();
    }
}
)
window.SendResetView = Backbone.View.extend({
    template: _.template($('#tpl-send-reset').html())
    ,events:{
        "click #sendReset":"sendReset",
	'click #close': 'close',
	'click #closeUp': 'close'
	
    },
    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    },
    show: function(){
	$(document.body).append(this.render().el); 
    },
    close: function(){
	this.remove();
    },
    sendReset: function(){
	
	var self = this
	var resetSuccess = function(){
	    
	    $('#pw-reset-body').html('Thank you, an email has been sent.');
	};
	var resetFailure = function(){
	    
	    $('#pw-reset-body').html('Please try again later.');
	};
	
	// set the user's email
	this.model.set('email',$('#email').val());
	// may have to wait for the email server so 
	// show waiting image
	$('#pw-reset-body').html(app.progressTemplate);
	this.model.resetPassword(resetSuccess,resetFailure);
    }
});

window.JobRunView = Backbone.View.extend({
   
    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
    
});

window.WorkFileView = Backbone.View.extend({
   
   
    
});
// gene sig view
window.GeneSigView = Backbone.View.extend({
   
    template: _.template($('#tpl-gene-sig').html()),
    
    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    events:{
        "click .saveGeneSig2":"saveGeneSig"
    },
    saveGeneSig:function (successFunction) {

	var geneSig = this.model;
	
	var showJobList = function(){};
	var showErrors = function(){};
	var runSesameJob = function(){
	    // set the job params before we sync or trigger the job
	    // get the upReg Genes ID
	    // get the downReg Genes ID
	    var upId = geneSig.get('upGenes').get('id');
	    var downId = geneSig.get('downGenes').get('id');
	    var openSesameRun = new JobRun();
	    openSesameRun.set("inputs",{"upgenes":[upId],"downgenes":[downId],"name":[geneSig.get('name')]})
	    openSesameRun.save({},{success:successFunction,headers:{'Authorization':'HiveBasic ' + btoa(app.userToken) }});
	    return false;
	};
	var saveDownGenes=function(){
	    var dg = geneSig.get('downGenes');
	    dg.save({},{success:runSesameJob,headers:{'Authorization':'HiveBasic ' + btoa(app.userToken) }});
	    return false;
	};
	var saveUpGenes=function(){
	    var up = geneSig.get('upGenes');
	    up.save({},{success:saveDownGenes,headers:{'Authorization':'HiveBasic ' + btoa(app.userToken) }});
	    return false;
	};
	var self = this;
	// set the name
    this.model.set({name:$('#run_name').val()});
	var ug = this.model.get('upGenes');
	ug.set('fileData',$('#upGenes').val());
	var dg = this.model.get('downGenes');
	dg.set('fileData',$('#downGenes').val());
	
	var s = saveUpGenes();
	return false;
    }
    
});