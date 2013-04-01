window.User = Backbone.Model.extend({
    urlRoot: "api/v2/Users",
    // Cant set the ID attribute to username without over riding the isNew function because backbone will perform a 'put'
    // for new users becuase the username/id will not be null - this is how it 
    // decides to do a PUT or POST
    idAttribute: "username",
    defaults:{
	"group":"testgroup",
	"username":null
    },
    myNewFlag: false,
    // have to override
    isNew: function() {
	var ggg = 1;
	return this.get("myNewFlag");
	//return this.get("username") == null;
    },
    resetPassword: function(success_function, failure_function) {
	var self = this;
	var ssss = JSON.stringify({ email: this.get('email') });
	$.ajax({
	    type: "POST",
	    contentType:  "application/json; charset=utf-8",
	    url: 'api/v2/PasswordTokens',
	    data: JSON.stringify({ email: this.get('email') }),
	    success: success_function,
	    error: failure_function,
	    dataType: 'json'
	});
	
    }
});
window.SeriesResult = Backbone.Model.extend({
    
});
window.SeriesResultCollection = Backbone.Collection.extend({
    model: SeriesResult,
    title: 'Title',
    sort_key: 'KS p',
    // CAN WE GET RID OF THIS AND JUST USE AN ID FIELD ?
    setFileID: function(wFileID){
	this.url = "api/v2/WorkFileContents/" + wFileID ;
    },
    comparator: function(item) {
        return item.get(this.sort_key);
    },
    sortByField: function(fieldName) {
        this.sort_key = fieldName;
        this.sort();
    }
});

window.JobRun = Backbone.Model.extend({
    
    urlRoot: "api/v2/JobRuns",

    defaults: {
        id: null,
	creator: "",
        creationDatetime: "",
        status: "",
	jobType:"sesame-0.4"
    }
});
window.JobRunCollection = Backbone.Collection.extend({
    model: JobRun,
    url: function(){
	// filter on server side for job type and specific user
	return "api/v2/JobRuns?jobType=" + app.JOB_TYPE + "&creator=" + app.user.get('username');  
    },
    byJobType: function(jobType) {
	filtered = this.filter(function(jobRun) {
	    return jobRun.get("jobType") === jobType;
	});
	return new JobRunCollection(filtered);
    }
});

window.WorkFile = Backbone.Model.extend({
    
    urlRoot: "api/v2/WorkFiles",

    defaults: {
        id: null,
	name: "",
	ghFileID:"",
	fileData:""
    },
    "sync" : workFileSync
});
/**
 * A GeneSig is the input to our Job Run
 * Has a name and two workfiles: one for the up-regulated genes and 
 * one for down regulated genes.
 * Perhaps should not extend Backbone model because its not backed 
 * by any REST calls and is never retrieved or saved to the server.
 * But allows to use it as Model in the View .. Bad Idea? 
 * Maybe and should change in future releases
 **/
window.GeneSig = Backbone.Model.extend({
    
    defaults: {
	name: '',
	upGenes: new WorkFile(),
	downGenes: new WorkFile(),
	upGeneLoaded: false,
	downGeneLoaded: false
    }	
})
