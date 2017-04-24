var { Router,
      Route,
      IndexRoute,
      IndexLink,
      hashHistory,
      browserHistory,
      Link } = ReactRouter;


// component that renders a single post
var PostRow = React.createClass({

	EditPostHandler:function(e){
		changeAppMode('edit',e.target.value)
	},
	DeletePostHandler:function(e){
		changeAppMode('delete',e.target.value)
	},
    render: function() {

    var myStyle={
    		width:100,
    		height:100
   	}	
    return (
   
    	<div className="row">
    		<div className="col-lg-12">
   				<h3>{this.props.post.title}</h3>
				<span>
                    by <a href="#">{this.props.post.author}</a>
                </span>
                <p className="pull-right"><span className="glyphicon glyphicon-time"></span> Posted on {this.props.post.created}</p> 
			   	<hr />
 			   	<div className="row">
    				<div className="col-lg-2 text-center">
						<a className="story-img" href="#"><img src={`uploads/${this.props.post.image}`} style={myStyle} className="img-circle"/></a>
					</div>
					<div className="col-lg-10 text-justify">
				    	<p>{this.props.post.description}</p>
					    <span><Link to={`/posts/${this.props.post.id}`}>Continue reading >>></Link></span>
					</div>

				</div>

				{ this.props.isLogon==1 
					? <div className="row">
						<br />
    					<div className="col-lg-6">							
							<button type="button" className="btn btn-default" value={this.props.post.id} onClick={this.EditPostHandler}>Edit Post</button>
					  	</div>
					  	<div className="col-lg-6 text-right">							
					  		<button type="button" className="btn btn-danger" value={this.props.post.id} onClick={this.DeletePostHandler}>Delete Post</button>
					  	</div>
					  </div>  	
					: ""	
				}

				<hr />
			</div>

		</div>

        );
    }
});

// component for the whole posts table
var PostsTable = React.createClass({
    render: function() {
 
	    var rows = this.props.posts
	        .map(function(post, i) {
	            return (
	                <PostRow
	                    key={i}
	                    post={post}
	                    isLogon={this.props.isLogon}
	                 />
	            );
	    }.bind(this));
 		
 		
        return(
            !rows.length
                ? <div className='alert alert-danger'>No posts found.</div>
                : 
                <div>
                	
                    {rows}
                	
                    
                </div>
        );
    }
});

var ReadPostsComponent = React.createClass({
    getInitialState: function() {
        return {
            posts: [],
        };
    },
 
    // on mount, fetch all posts and stored them as this component's state
    componentDidMount: function() {
    	var me=this;

    	this.serverRequest = $.get("api/read_all_posts.php", function (posts) {

            	this.setState({
                	posts: JSON.parse(posts)
            	});
        }.bind(this));
        
    },
 
    // on unmount, kill post fetching in case the request is still pending
    componentWillUnmount: function() {
        this.serverRequest.abort();
    },
 
    render: function() {
        // list of posts
        var filteredposts = this.state.posts;
        $('.page-header h1').text('Recent Posts:');
        return (
            <div className='overflow-hidden'>
                
                <PostsTable isLogon="0" posts={filteredposts} />
            </div>
        );
    }
});
function showLoginModal()
{
	$('#loginModal .registerBox').fadeOut('fast',function(){
   	 	$('.loginBox').fadeIn('fast');
    	$('.register-footer').fadeOut('fast',function(){
        	$('.login-footer').fadeIn('fast');    
    	});
    
    	$('.modal-title').html('Login with');
	});       
	$('.error').removeClass('alert alert-danger').html(''); 

	setTimeout(function(){
		$('#loginModal').modal('show');    
	}, 230);
}
function showRegisterModal(){
	$('.loginBox').fadeOut('fast',function(){
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast',function(){
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('Register with');
   	}); 
   	$('.error').removeClass('alert alert-danger').html('');

   	setTimeout(function(){
		$('#loginModal').modal('show');    
	}, 230);
}

var LoginComponent = React.createClass({
	getInitialState: function() {
		return {
			rfname: '',
			rlname: '',
			rEmail: '',
			rPass: '',
			rPassConfirm: '',
			lEmail:'',
			lPassword:''
		}
	},
	loginModal:function(e){
			
		showLoginModal();
	    
	},
	
	registerModal: function(e){
		showRegisterModal();
   		
	},
	onrFirstNameChange:function(e){
		this.setState ({
			rfname: e.target.value
		});
	},
	onrLastNameChange:function(e){
		this.setState ({
			rlname: e.target.value
		});
	},
	onrEmailChange:function(e){
		this.setState ({
			rEmail: e.target.value
		});
	},
	onrPasswordChange:function(e){
		this.setState ({
			rPass: e.target.value
		});
	},
	onrPasswordConfirmationChange:function(e){
		this.setState ({
			rPassConfirm: e.target.value
		});
	},
	onrSave:function(e){
		e.preventDefault();

		var fname=this.state.rfname;
		var lname=this.state.rlname;
		var rEmail=this.state.rEmail;
		var rPass=this.state.rPass;
		var rPassConfirm=this.state.rPassConfirm;

		if(fname=="" || lname=="" || rEmail=="" || rPass=="" || rPassConfirm=="")
		{
			$('.error').addClass('alert alert-danger').html('Please fill up the all input fields');
			return;
		}
		if(rPass!=rPassConfirm){
			$('.error').addClass('alert alert-danger').html('Password and confirm password must be same');
			this.setState ({
				rPassConfirm: ''
			});
			return;
		}

		
    	$.post("api/create_user.php", {
	        fname: fname,
            lname: lname,
            email: rEmail,
            password: rPass,
           
        },
        function(res){
        	if(res=="true"){
	            this.setState({rfname: ""});
	            this.setState({rlname: ""});
	            this.setState({rEmail: ""});
	            this.setState({rPass: ""});
	            this.setState({rPassConfirm: ""});

	            $('.error').removeClass('alert alert-danger').html('');
	            showLoginModal();
	            $('.error').addClass('alert alert-success').html('User successfully created');


            } else{
            	$('.error').addClass('alert alert-danger').html('Email address already exists');
				this.setState ({
					rEmail: ''
				});
				this.setState({rPass: ""});
	            this.setState({rPassConfirm: ""});
				return;
            }
            
        }.bind(this)
        );
	},
	onlEmailChange:function(e)
	{
		this.setState({lEmail:e.target.value});
	},

	onlPasswordChange:function(e)
	{
		this.setState({lPassword:e.target.value});
	},
	onlSave:function(e)
	{
		e.preventDefault();
		var lEmail=this.state.lEmail;
		var lPassword=this.state.lPassword;

		if(lEmail=="" || lPassword==""){
			$('.error').addClass('alert alert-danger').html('Please fill up the all input fields');
			return;
		}

		$.post("api/check_user.php", {
	        email: lEmail,
            password: lPassword
           
        },
        function(res){
        	if(res=="true"){
	            this.setState({lEmail: ""});
	            this.setState({lPassword: ""});
	            $('.error').removeClass('alert alert-danger').html('');
         	

	           	setTimeout(function(){
					$('#loginModal').modal('hide');    
				}, 230);

				updateNavbar();
			   	this.context.router.push('/');


            } 
            else 
            {
            	$('.error').addClass('alert alert-danger').html('Incorrect Email or Password');
				this.setState ({
					lEmail: '',
				});
				this.setState({lPassword: ""});
	          	return;
            }
            
        }.bind(this)
        );

	},
	render: function () {
    	var myStyle={
    		display:'none'
    	}
    	return (
       		<div className="modal fade login" id="loginModal">
		      <div className="modal-dialog login animated">
    		      <div className="modal-content">
    		         <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 className="modal-title">Login with</h4>
                    </div>
                    <div className="modal-body">  
                        <div className="box">
                             <div className="content">
                                <div className="social">
                                    <a className="circle github" href="#">
                                        <i className="fa fa-github fa-fw"></i>
                                    </a>
                                    <a id="google_login" className="circle google" href="#">
                                        <i className="fa fa-google-plus fa-fw"></i>
                                    </a>
                                    <a id="facebook_login" className="circle facebook" href="#">
                                        <i className="fa fa-facebook fa-fw"></i>
                                    </a>
                                </div>
                                <div className="division">
                                    <div className="line l"></div>
                                      <span>or</span>
                                    <div className="line r"></div>
                                </div>
                                <div className="error"></div>
                                <div className="form loginBox">
                                    <form onSubmit={this.onlSave}>
                                    <input id="email" className="form-control" type="text" onChange={this.onlEmailChange} value={this.state.lEmail} placeholder="Email" name="email"/>
                                    <input id="password" className="form-control" type="password" onChange={this.onlPasswordChange} value={this.state.lPassword} placeholder="Password" name="password"/>
                                    <button className="btn btn-default btn-login" type="submit">Login</button>
                                    </form>
                                </div>
                             </div>
                        </div>
                        <div className="box">
                            <div className="content registerBox" style={myStyle}>
                             <div className="form">
                                <form onSubmit={this.onrSave} >
                                <input id="fname" className="form-control" type="text" onChange={this.onrFirstNameChange} value={this.state.rfname} placeholder="First Name" name="fname" />
                                <input id="lname" className="form-control" type="text" onChange={this.onrLastNameChange} value={this.state.rlname} placeholder="Last Name" name="lname" />
                                <input id="email" className="form-control" type="email" onChange={this.onrEmailChange} value={this.state.rEmail} placeholder="Email" name="email" />
                                <input id="password" className="form-control" type="password" onChange={this.onrPasswordChange} value={this.state.rPass}  placeholder="Password" name="password" />
                                <input id="password_confirmation" className="form-control" type="password" onChange={this.onrPasswordConfirmationChange} value={this.state.rPassConfirm} placeholder="Repeat Password" name="password_confirmation" />
                                <button className="btn btn-default btn-register" type="submit">Create account</button>
                                </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="forgot login-footer">
                            <span>Looking to <a href="javascript: void(0);" onClick={this.registerModal}>create an account</a>
                            ?</span>
                        </div>
                        <div className="forgot register-footer" style={myStyle}>
                             <span>Already have an account?</span>
                             <a href="javascript: void(0);" onClick={this.loginModal}>Login</a>
                        </div>
                    </div>        
    		      </div>
		      </div>
		  </div>
        
    	);
    }
});  

var TopNavigayionBar = React.createClass({
	loginModal:function(e){
		//ReRenderReadView(null);	
		showLoginModal();
	    
	},
	
	registerModal: function(e){
		//ReRenderReadView(null);
		showRegisterModal();
   		
	},
	onClickHandler: function(e) {
		if(window.location.href.indexOf("dashboard") != -1) 
		{
			changeAppMode('read');
		}
		
	},
    render: function () {
    		    
        return (

        	<nav className="navbar navbar-default">
  				<div className="container-fluid">
    				<div className="navbar-header">
      					<Link to="/" className="navbar-brand">AMRDIARY</Link>
    				</div>
				    <ul className="nav navbar-nav">
				      <li><Link to="/">Home</Link></li>
				      <li><Link to="/posts/create-new-post">Create New Post</Link></li>
				    </ul>
				    
				     	{	this.props.users.length > 0
	       		   		? 	<ul className="nav navbar-nav navbar-right">
	       		   				<li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" href="#"><span className="glyphicon glyphicon-user"></span> Hello, {this.props.users[0].fname} {this.props.users[0].lname}<span className="caret"></span></a>
							        <ul className="dropdown-menu">
							          	<li><Link to="/dashboard" onClick={this.onClickHandler}>My Posts</Link></li>	
							          	<li><Link to="/logout">Logout</Link></li>
							        </ul>
						      	</li>
       		   				</ul>
       		   			: 	
       		   				<ul className="nav navbar-nav navbar-right">	
       		   					<li><a href="javascript:void(0)" data-toggle="modal" onClick={this.registerModal}><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
				     			<li><a href="javascript:void(0)" data-toggle="modal" onClick={this.loginModal}><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
		     				</ul>
		     			}  
				   
				</div>
			</nav>
    	);
    }
});      

var App = React.createClass({

	getInitialState(){
        return {
           users : []
        }
    },
    checkAuth:function(){
        this.serverRequest = $.get("api/is_logon.php", function (user) {
        	if(user.length>0){
				this.setState({
                	users: JSON.parse(user)
            	});
			}
			else
			{
				this.setState({
                	users: []
            	});
	        }   
        }.bind(this));
			
    },
	
	componentDidMount:function(){
		this.checkAuth();
		var me=this;
		window.updateNavbar=function(){
			me.checkAuth();
		}
	},
	componentWillUnmount:function(){
		this.serverRequest.abort();
	},
	
	render: function () {
		var myStyle={
			position:'fixed',
			overflow: 'hidden',
			right: 0
		}
       return (
       		<div>
		      	<TopNavigayionBar users={this.state.users}/>

				<div className="container">
	 				<LoginComponent />
	 				<div className="page-header">
	            		<h1>Loading...</h1>	
	        		</div>
	        
	        		<div className='content'>
	        			<div className="row">
    						<div className="col-lg-8">
	        			 		{this.props.children}
	        			 	</div>
	        			 	<div className="col-lg-4" style={myStyle}>	
	        			 		<SearchComponent />
	        			 	</div>
	        			 </div>
	        		
	        		</div>
	        	</div>
        	</div>

        
    	);
    }
});      

var UpdatePostComponent=React.createClass({
	getInitialState: function() {
	    return {
	        title: '',
	        description: '',
	        author: '',
	        file: '',
	        data_uri:'',
	        fileName:'',
	        fileType:'',
	        successCreation: null,
	        postId:'',
	        imgFileName:'',
	    };
	},

	// handle title change
	onTitleChange: function(e) {
	    this.setState({title: e.target.value});
	},
	 
	// handle description change
	onDescriptionChange: function(e) {
	    this.setState({description: e.target.value});
	},
	 
	// handle author change
	onAuthorChange: function(e) {
	    this.setState({author: e.target.value});
	},
	 
	// handle file change
	onFileChange: function(e) {
		e.preventDefault();

	    let reader = new FileReader();
	    let file = e.target.files[0];
	    reader.onloadend = (upload) => {
	      this.setState({
	      	data_uri: upload.target.result,
        	fileName: file.name,
        	fileType: file.type,
	        file: file
	      });
	    }
	    reader.readAsDataURL(file)
	},

	onSave: function(e) {
		e.preventDefault();
		
		$.post("api/update_post.php", {
			id: this.state.postId,
	        title: this.state.title,
            description: this.state.description,
            author: this.state.author,
            data_uri: this.state.data_uri,
            fileName: this.state.fileName,
            fileType: this.state.fileType,
            image: this.state.imgFileName
        },
        function(res){
        	this.setState({successCreation: res});
            this.refs.file.value = ''

            this.serverRequest = $.get("api/read_single_post.php?postId="+this.props.postId, function (post) {
				var p = JSON.parse(post)[0];
				this.setState({title: p.title});
	            this.setState({description: p.description});
	            this.setState({author: p.author});
	            this.setState({postId: p.id});
	            this.setState({imgFileName: p.image});

	            
	        }.bind(this));

        }.bind(this)
    	);
    	
	},
	BackToListHandler:function(e) {
		changeAppMode('read',undefined);
	},
	componentDidMount:function() {
		this.serverRequest = $.get("api/read_single_post.php?postId="+this.props.postId, function (post) {
			var p = JSON.parse(post)[0];
			this.setState({title: p.title});
            this.setState({description: p.description});
            this.setState({author: p.author});
            this.setState({postId: p.id});
            this.setState({imgFileName: p.image});

            
        }.bind(this));
	},
	componentWillUnmount:function(){
		this.serverRequest.abort();
	},
	
	render: function() {
 	
 	$('.page-header h1').text('Update Post:');
 	var myStyle={
 		height: 100,
 		width: 100
 	};
 	return (
    <div>
        {
 
            this.state.successCreation == "true" ?
                <div className='alert alert-success'>
                    Post was updated.
                </div>
            : null
        }
 
        {
 
            this.state.successCreation == "false" ?
                <div className='alert alert-danger'>
                    Unable to update post. Please try again.
                </div>
            : null
        }
 
       
        <form onSubmit={this.onSave} enctype='multipart/form-data'>
            <table className='table table-bordered table-hover'>
            <tbody>
                <tr>
                    <td>Title</td>
                    <td>
                        <input
                        type='text'
                        className='form-control'
                        value={this.state.title}
                        required
                        onChange={this.onTitleChange} />
                    </td>
                </tr>
 
                <tr>
                    <td>Description</td>
                    <td>
                        <textarea
                        type='text'
                        className='form-control'
                        required
                        value={this.state.description}
                        onChange={this.onDescriptionChange}>
                        </textarea>
                    </td>
                </tr>
 
                <tr>
                    <td>Author</td>
                    <td>
                        <input
                        disabled
                        type='text'
                        className='form-control'
                        value={this.state.author}
                        required
                        onChange={this.onAuthorChange} />
                    </td>
                </tr>
		 		
		 		 <tr>
                    <td>Current Feature Image</td>
                    <td>
                        <img id='cur_img' 
                        src={`uploads/${this.state.imgFileName}`}
                        style={myStyle}
                        />
                    </td>
                </tr>

                <tr>
                    <td>Feature Image</td>
                    <td>
                        <input
                        type='file'
                        ref='file'
                        className='form-control'
                        accept="image/*"
                        onChange={this.onFileChange} />
                    </td>
                </tr>
 
                <tr>
                    <td></td>
                    <td>
                        <button type='submit'
                        className='btn btn-primary'
                        >Save</button>

                        <button type='button' onClick={this.BackToListHandler}
                        className='btn btn-primary pull-right'
                        >Back To List</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    </div>
    );
}

});

var CreatePostComponent=React.createClass({
	getInitialState: function() {
	    return {
	        title: '',
	        description: '',
	        author: '',
	        file: '',
	        data_uri:'',
	        fileName:'',
	        fileType:'',
	        successCreation: null
	    };
	},

	// handle title change
	onTitleChange: function(e) {
	    this.setState({title: e.target.value});
	},
	 
	// handle description change
	onDescriptionChange: function(e) {
	    this.setState({description: e.target.value});
	},
	 
	// handle author change
	onAuthorChange: function(e) {
	    this.setState({author: e.target.value});
	},
	 
	// handle file change
	onFileChange: function(e) {
		e.preventDefault();

	    let reader = new FileReader();
	    let file = e.target.files[0];
	    reader.onloadend = (upload) => {
	      this.setState({
	      	data_uri: upload.target.result,
        	fileName: file.name,
        	fileType: file.type,
	        file: file
	      });
	    }
	    reader.readAsDataURL(file)
	},

	onSave: function(e) {
		e.preventDefault();
		//this.context.router.push('/posts/23')
		$.post("api/create_post.php", {
	        title: this.state.title,
            description: this.state.description,
            author: this.state.author,
            data_uri: this.state.data_uri,
            fileName: this.state.fileName,
            fileType: this.state.fileType
        },
        function(res){
            this.setState({successCreation: res});
            this.setState({title: ""});
            this.setState({description: ""});
            this.setState({author: ""});
            this.refs.file.value = ''
        }.bind(this)
    	);
    	
	},
	componentDidMount:function() {
		this.serverRequest = $.get("api/is_logon.php", function (user) {
			if(!user.length)
			{
				this.context.router.push('/');
				showLoginModal();
				$('.error').addClass('alert alert-danger').html('Please login first');
			}
			else{
				this.setState({
                	author: JSON.parse(user)[0].fname+' '+JSON.parse(user)[0].lname
            	});
			}
			
            
        }.bind(this));
	},
	componentWillUnmount:function(){
		this.serverRequest.abort();
	},
	
	render: function() {
 	
 	$('.page-header h1').text('Create New Post');

 	return (
    <div>
        {
 
            this.state.successCreation == "true" ?
                <div className='alert alert-success'>
                    Post was saved.
                </div>
            : null
        }
 
        {
 
            this.state.successCreation == "false" ?
                <div className='alert alert-danger'>
                    Unable to save post. Please try again.
                </div>
            : null
        }
 
       
        <form onSubmit={this.onSave} enctype='multipart/form-data'>
            <table className='table table-bordered table-hover'>
            <tbody>
                <tr>
                    <td>Title</td>
                    <td>
                        <input
                        type='text'
                        className='form-control'
                        value={this.state.title}
                        required
                        onChange={this.onTitleChange} />
                    </td>
                </tr>
 
                <tr>
                    <td>Description</td>
                    <td>
                        <textarea
                        type='text'
                        className='form-control'
                        required
                        value={this.state.description}
                        onChange={this.onDescriptionChange}>
                        </textarea>
                    </td>
                </tr>
 
                <tr>
                    <td>Author</td>
                    <td>
                        <input
                        disabled
                        type='text'
                        className='form-control'
                        value={this.state.author}
                        required
                        onChange={this.onAuthorChange} />
                    </td>
                </tr>
 
                <tr>
                    <td>Feature Image</td>
                    <td>
                        <input
                        type='file'
                        ref='file'
                        className='form-control'
                        accept="image/*"
                        required
                        onChange={this.onFileChange} />
                    </td>
                </tr>
 
                <tr>
                    <td></td>
                    <td>
                        <button type='submit'
                        className='btn btn-primary'
                        >Save</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    </div>
    );
}

});

var LogoutComponent = React.createClass({

	componentDidMount:function() {
		this.serverRequest = $.get("api/user_logout.php", function (res) {
			if(res=="true")
			{
				updateNavbar();
				this.context.router.push('/');
				
			}
		           
        }.bind(this));
	},
	componentWillUnmount:function(){
		this.serverRequest.abort();
	},
    render: function () {

    	return (
    	<div>

    	</div>
        
    	);
    }
});  
var ReadOneComponent=React.createClass({
	getInitialState: function() {
		return {
			posts:[]
		}
	},

	componentDidMount:function(){
		var postId=this.props.params.postId;

		this.serverRequest = $.get("api/read_single_post.php?postId="+postId, function (posts) {

        	this.setState({
            	posts: JSON.parse(posts)
        	});
        }.bind(this));
	},
	componentWillUnmount:function(){
			this.serverRequest.abort();
	},

	render: function(){
		var myStyle={
			width: 900,
			height: 300
		}
		$('.page-header h1').text('Read single posts');
		return (
			!this.state.posts.length
			?  <div className='col-lg-12 alert alert-danger'>No posts found.</div>
            :
	            <div className="col-lg-12">

	                <h1>{this.state.posts[0].title}</h1>

	                <p className="lead">
	                    by <a href="#">{this.state.posts[0].author}</a>
	                </p>

	                <hr />

	                <p><span className="glyphicon glyphicon-time"></span> Posted on {this.state.posts[0].created}</p>

	                <hr />

	                <img className="img-responsive" style={myStyle} src={`uploads/${this.state.posts[0].image}`} alt="" />

	                <hr />

	                <p>{this.state.posts[0].description}</p>

	                <hr />
	                <br/>
	            </div>



		);
	}
});

var DeletePostComponent=React.createClass({
	componentDidMount: function() {
        $('.page-header h1').text('Delete product');
    },
 
    onDelete: function(e){
        var postId = this.props.postId;
 
        $.post("api/delete_post.php",
            { del_id: postId},
            function(res){
            	changeAppMode('read');
            }.bind(this)
        );
    },
	render: function(){
		return (
			<div className='row'>
                <div className='col-md-3'></div>
                <div className='col-md-6'>
                    <div className='panel panel-default'>
                        <div className='panel-body text-align-center'>Are you sure?</div>
                        <div className='panel-footer clearfix'>
                            <div className='text-align-center'>
                                <button onClick={this.onDelete}
                                    className='btn btn-danger m-r-1em'>Yes</button>
                                <button onClick={() => this.props.changeAppMode('read')}
                                    className='btn btn-primary'>No</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-3'></div>
            </div>
		);
	}
});

var SearchComponent=React.createClass({
	getInitialState:function(){
		return{
			searchText:''
		}
	},
	textChangeHandler: function(e) {
		this.setState({
			searchText:e.target.value
		});
	},
	searchClickHandler: function(e) {
		if(this.state.searchText=="")
		{
			alert("Please type a text");
			return;
		}
		
		if(window.location.href.indexOf("search") != -1) {
			this.context.router.push('/search/'+this.state.searchText);
			ReRenderReadView(this.state.searchText);
		}
		else
		{
			this.context.router.push('/search/'+this.state.searchText);
		}
		
		this.setState({searchText:''});
	},
	render: function(){
		return (
                <div className="well">
                    <h4>Blog Search</h4>
                    <div className="input-group">
                        <input type="text" placeholder="search by title" className="form-control" value={this.state.searchText} onChange={this.textChangeHandler}/>
                        <span className="input-group-btn">
                            <button onClick={this.searchClickHandler} className="btn btn-default" type="button">
                                <span className="glyphicon glyphicon-search"></span>
                        </button>
                        </span>
                    </div>
                   
                </div>

            

		);
	}
});
var SearchResultComponent = React.createClass({

	getInitialState: function() {
        return {
            posts: [],
        };
    },
 
    // on mount, fetch all posts and stored them as this component's state
    componentDidMount: function() {
    	var title=this.props.params.title;
    	this.serverRequest = $.get("api/read_all_posts.php?title="+title, function (posts) {

            	this.setState({
                	posts: JSON.parse(posts)
            	});
        }.bind(this));
        var me=this;
        window.ReRenderReadView=function(searchText){
        	me.serverRequest = $.get("api/read_all_posts.php?title="+searchText, function (posts) {

            	me.setState({
                	posts: JSON.parse(posts)
            	});
        	}.bind(me));
        	
        }

        
    },
 
    // on unmount, kill post fetching in case the request is still pending
    componentWillUnmount: function() {
        this.serverRequest.abort();
    },
 
    render: function() {
        // list of posts
        var filteredposts = this.state.posts;
        $('.page-header h1').text('Your Search Text: '+this.props.params.title);
        return (
            <div className='overflow-hidden'>      
                <PostsTable isLogon="0" posts={filteredposts} />
            </div>
        );
    }
   
});

var PostEdit = React.createClass({

    render: function () {

    	var myStyle={
    		width:100,
    		height:100
    	}
       return (
       		<h1>hello post edit</h1>
        
    	);
    }
});


var DashboardComponent = React.createClass({
	getInitialState:function() {
		return {
			posts: [],
			currentMode:'read',
			postId: null
		}
	},
	getAllPost: function() {
		this.serverRequest = $.get("api/read_all_posts_user.php", function (posts) {
					
					this.setState({posts: JSON.parse(posts)});

		}.bind(this));
	},
    componentDidMount:function() {
		this.serverRequest = $.get("api/is_logon.php", function (user) {
			if(!user.length)
			{
				this.context.router.push('/');
				showLoginModal();
				$('.error').addClass('alert alert-danger').html('Please login first');
			}
			else{
				this.getAllPost();
			}
			
            
        }.bind(this));

        var me=this;
        
        window.changeAppMode = function(newMode, postId){
		    me.setState({currentMode: newMode});

		    if(postId !== undefined){
		        me.setState({postId: postId});
		     
		    }

		    if(newMode=='read'){
		    	me.getAllPost();
		    }
		}
	},
	componentWillUnmount:function(){
		this.serverRequest.abort();
	},
    render: function() {
        // list of posts
        

        var modeComponent ='';

	    switch(this.state.currentMode){
	        case 'read':
	        	var filteredposts = this.state.posts;
       			$('.page-header h1').text('MY Posts:');
       
            	modeComponent =<div className='overflow-hidden'>
                					<PostsTable isLogon="1" posts={filteredposts} />
            					</div>;
	            break;
	        case 'edit':
	            modeComponent = <UpdatePostComponent postId={this.state.postId} />;
	            break;
	        case 'delete':
	        	var filteredposts = this.state.posts;
       			$('.page-header h1').text('MY Posts:');
       
            	modeComponent =<div className='overflow-hidden'>
                					<DeletePostComponent postId={this.state.postId} />
            					</div>;
	            break;
            					
	            break;
	        default:
	        	var filteredposts = this.state.posts;
       			$('.page-header h1').text('MY Posts:');
       
            	modeComponent =<div className='overflow-hidden'>
                					<PostsTable isLogon="1" posts={filteredposts} />
            					</div>;
	            break;
	    }

    	return modeComponent;
    } 

});   

CreatePostComponent.contextTypes = {
  router: React.PropTypes.object.isRequired,
}
LoginComponent.contextTypes = {
  router: React.PropTypes.object.isRequired,
}
LogoutComponent.contextTypes = {
  router: React.PropTypes.object.isRequired,
}
SearchComponent.contextTypes = {
  router: React.PropTypes.object.isRequired,
}
DashboardComponent.contextTypes = {
  router: React.PropTypes.object.isRequired,
}


ReactDOM.render(
    <Router history={hashHistory}>
  		<Route path="/" component={App}>
  			<IndexRoute component={ReadPostsComponent} />
  			<Route path="/home" component={ReadPostsComponent} />
  			<Route path="/dashboard" component={DashboardComponent} />
  			<Route path="/posts/create-new-post" component={CreatePostComponent} />
  			<Route path="/posts/:postId" component={ReadOneComponent} />
  			<Route path="/search/:title" component={SearchResultComponent} />
  			<Route path="/logout" component={LogoutComponent} />
  		</Route>
   </Router>,

    document.getElementById('root')
);

